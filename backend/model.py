# =====================================
# model.py — Optimized MoodFlix Model
# =====================================

import pandas as pd
import numpy as np
import nltk
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler

# Download tokenizer quietly (used by VADER)
nltk.download("punkt", quiet=True)

# Global analyzer and cache
analyzer = SentimentIntensityAnalyzer()
_cached_df = None   # cache for processed dataset


# =====================================
# Load and preprocess dataset (cached)
# =====================================
def load_data():
    """Load and preprocess IMDB dataset only once."""
    global _cached_df
    if _cached_df is not None:
        # Already loaded
        return _cached_df

    print("🔹 Loading and processing dataset...")

    # --- Load ---
    df = pd.read_csv("imdb_top_1000.csv")

    # --- Basic cleanup ---
    df.dropna(subset=["Overview", "Genre"], inplace=True)
    df["Genre"] = df["Genre"].str.lower()
    df["Overview"] = df["Overview"].astype(str)

    # --- TF-IDF Vectorization (limit features for speed) ---
    tfidf = TfidfVectorizer(stop_words="english", max_features=500)
    genre_tfidf = tfidf.fit_transform(df["Genre"])
    genre_tfidf_df = pd.DataFrame(
        genre_tfidf.toarray(),
        columns=[f"Genre_TFIDF_{c}" for c in tfidf.get_feature_names_out()]
    )

    # --- Merge TF-IDF features ---
    df = pd.concat(
        [df.reset_index(drop=True), genre_tfidf_df.reset_index(drop=True)], axis=1
    )

    # --- Sentiment Analysis ---
    df["Sentiment"] = df["Overview"].apply(
        lambda x: analyzer.polarity_scores(x)["compound"]
    )

    # --- Normalize sentiment ---
    scaler = StandardScaler()
    df["Sentiment_Scaled"] = scaler.fit_transform(df[["Sentiment"]])

    # --- Cache the processed dataset ---
    _cached_df = df
    print(f"✅ Dataset processed and cached — {len(df)} movies ready.")
    return df


# =====================================
# Mood-based recommendation function
# =====================================
def get_mood_recommendations(mood: str, target_genre: str | None = None, top_n: int = 15):
    """
    Generate movie recommendations based on mood and optional genre.
    Returns a DataFrame with top N results.
    """
    df = load_data()  # cached dataset

    if not mood or not isinstance(mood, str):
        raise ValueError("Please provide a valid mood string.")

    # Convert mood into sentiment polarity (-1 to 1)
    mood_sentiment = analyzer.polarity_scores(mood)["compound"]

    # Compute sentiment similarity
    df["Sentiment_Diff"] = abs(df["Sentiment_Scaled"] - mood_sentiment)
    df["Mood_Similarity"] = 1 - df["Sentiment_Diff"]

    # Optional genre filter
    if target_genre and target_genre.lower() != "all":
        filtered_df = df[df["Genre"].str.contains(target_genre.lower(), na=False)]
    else:
        filtered_df = df

    # Combine mood similarity + IMDB rating
    filtered_df["Score"] = (
        0.6 * filtered_df["Mood_Similarity"] + 0.4 * (filtered_df["IMDB_Rating"] / 10)
    )

    # Sort and select top N
    top_movies = (
        filtered_df.sort_values(by="Score", ascending=False)
        .head(top_n)
        .copy()
    )

    # Rename and select relevant columns
    top_movies = top_movies.rename(
        columns={
            "Series_Title": "Title",
            "Genre": "Genre",
            "Released_Year": "Released_Year",
            "IMDB_Rating": "IMDB_Rating",
            "Poster_Link": "Poster_Link",
            "Overview": "Overview",
        }
    )

    # Handle missing poster images
    if "Poster_Link" in top_movies.columns:
        top_movies["Poster_Link"] = top_movies["Poster_Link"].fillna(
            "https://via.placeholder.com/300x450?text=No+Image"
        )

    # Return only needed columns
    return top_movies[
        ["Title", "Genre", "Released_Year", "IMDB_Rating", "Poster_Link", "Overview"]
    ]
