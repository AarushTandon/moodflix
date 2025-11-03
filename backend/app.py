
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from model import get_mood_recommendations
import pandas as pd
import uvicorn
import os

app = FastAPI(title="MoodFlix API")

# ✅ Production-ready CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "https://*.vercel.app",  # All Vercel deployments
        "https://moodflix.vercel.app",  # Your main Vercel URL (update after deployment)
        "*"  # Remove this in production for better security
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===============================
# 🔧 Utility: Fix Poster URL Quality
# ===============================
def fix_poster_url(url: str | None) -> str:
    """
    Cleans and upgrades the poster URL for better image quality.
    Handles IMDb, TMDB, and missing images gracefully.
    """
    if not url or url.strip() == "" or url == "N/A":
        # fallback: consistent dark placeholder
        return "https://placehold.co/400x600/1a1a1a/ffffff?text=No+Poster"

    # IMDb image links (upgrade thumbnail → high-res)
    if "._V1_" in url:
        return url.split("._V1_")[0] + "._V1_UX1000_.jpg"

    # TMDB poster resizing (if your dataset uses TMDB)
    if "w200" in url:
        return url.replace("w200", "w500")
    if "w300" in url:
        return url.replace("w300", "original")

    # Already good quality
    return url


# ===============================
# Health check
# ===============================
@app.get("/")
def home():
    return {
        "message": "✅ MoodFlix API is running!",
        "version": "1.0.0",
        "endpoints": {
            "recommend": "/recommend?mood=happy&genre=Action&top_n=15"
        }
    }


# ===============================
# Recommendation endpoint
# ===============================
@app.get("/recommend")
def recommend(
    mood: str = Query(..., description="User mood"),
    genre: str | None = Query(None, description="Optional genre filter"),
    top_n: int = Query(15, description="Number of results to return")
):
    """
    Returns top movie recommendations for a given mood and genre.
    Enhances poster URLs for frontend display.
    """
    try:
        df = get_mood_recommendations(mood, genre, top_n)
        df = df.rename(
            columns={
                "Title": "title",
                "Genre": "genre",
                "Released_Year": "year",
                "IMDB_Rating": "rating",
                "Poster_Link": "poster",
                "Overview": "overview",
            }
        )

        # ✅ Apply URL cleaning before returning
        df["poster"] = df["poster"].apply(fix_poster_url)

        results = df.to_dict(orient="records")
        return {"results": results, "count": len(results)}

    except Exception as e:
        return {"error": str(e), "message": "Failed to fetch recommendations"}


# ===============================
# Run the server
# ===============================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)