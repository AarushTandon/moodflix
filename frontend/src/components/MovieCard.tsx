import { Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface MovieCardProps {
  title: string;
  year: number;
  genre: string;
  poster: string;
  rating: number;
  overview: string;
  cast?: string;
}

export const MovieCard = ({
  title,
  year,
  genre,
  poster,
  rating,
  overview,
  cast,
}: MovieCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const finalPoster =
    poster && poster !== "N/A"
      ? poster
      : "https://placehold.co/400x600/1a1a1a/ffffff?text=No+Poster";

  return (
    <div
      className="group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-primary/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`transition-transform duration-300 ${
          isHovered ? "scale-105" : "scale-100"
        }`}
      >
        <img
          src={finalPoster}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-[400px] object-cover rounded-xl bg-card"
          style={{ objectFit: "cover", imageRendering: "auto" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x600/1a1a1a/ffffff?text=No+Poster";
          }}
        />
        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground font-semibold">
          {genre.split(",")[0]}
        </Badge>

        <div
          className={`absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
            <h3 className="font-bold text-xl text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{year}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded">
                <Star className="w-4 h-4 fill-primary-foreground text-primary-foreground" />
                <span className="text-sm font-bold text-primary-foreground">
                  {rating}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {overview}
            </p>
            {cast && (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold">Cast:</span> {cast}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
