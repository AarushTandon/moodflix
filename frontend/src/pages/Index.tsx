import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/MovieCard";
import { TrendCard } from "@/components/TrendCard";

const genres = ["Action", "Drama", "Comedy", "Thriller", "Adventure", "Crime", "Romance"];

// ✅ Auto-detect API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? "https://moodflix-backend.onrender.com"  // 👈 REPLACE with your Render URL after deployment
  : "http://localhost:8000";

const Index = () => {
  const [mood, setMood] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [apiMovies, setApiMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch movies from backend
  useEffect(() => {
    if (!mood) return;
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/recommend?mood=${mood}&genre=${selectedGenre}&top_n=15`
        );
        const data = await res.json();
        setApiMovies(data.results || []);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [mood, selectedGenre]);

  // Divide into main + sidebar sections
  const filteredMovies = apiMovies.slice(0, 12);
  const trendingMovies = apiMovies.slice(12, 15);

  // Helper: use higher-res IMDb poster
  const getHighResPoster = (url: string) => {
    if (!url) return url;
    return url.replace(/_V1_UX\d+/, "_V1_UX800");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* =============================== */}
      {/* NAVBAR */}
      {/* =============================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient">MoodFlix</h1>
          <a
            href="#"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Home
          </a>
        </div>
      </nav>

      {/* =============================== */}
      {/* MOOD INPUT SECTION */}
      {/* =============================== */}
      <div className="container mx-auto px-6 pt-28 pb-12 max-w-7xl text-center">
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-400 to-blue-500 text-transparent bg-clip-text">
            Discover Movies Based on Your Mood
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell us how you're feeling and we'll recommend the perfect movie for you.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-lg font-semibold">How are you feeling today?</h3>
          <Input
            type="text"
            placeholder="e.g., happy, sad, excited, thoughtful..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="bg-card border-border text-lg h-14 text-center"
          />

          {/* Genre Buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              variant={selectedGenre === "All" ? "default" : "outline"}
              onClick={() => setSelectedGenre("All")}
              className="rounded-full"
            >
              All
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                onClick={() => setSelectedGenre(genre)}
                className="rounded-full"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* =============================== */}
      {/* MOVIE GRID + TRENDS */}
      {/* =============================== */}
      <div className="container mx-auto px-6 pb-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Movies Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-3xl font-bold">
                {mood ? "Recommended for You" : "Popular Movies"}
              </h3>
              <a href="#" className="text-primary hover:underline text-lg">
                See all →
              </a>
            </div>

            {loading && <p>Loading recommendations...</p>}
            {!loading && filteredMovies.length === 0 && (
              <p className="text-muted-foreground">No movies found. Try another mood.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredMovies.map((movie, i) => (
                <MovieCard
                  key={i}
                  title={movie.title}
                  year={movie.year}
                  genre={movie.genre}
                  poster={getHighResPoster(movie.poster)}
                  rating={movie.rating}
                  overview={movie.overview}
                />
              ))}
            </div>
          </div>

          {/* Sidebar: Trending */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Trends Now</h3>
            <div className="space-y-3">
              {trendingMovies.map((movie, i) => (
                <TrendCard
                  key={i}
                  title={movie.title}
                  year={movie.year}
                  poster={getHighResPoster(movie.poster)}
                  rating={movie.rating}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;