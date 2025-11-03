import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBestPosterUrl } from "@/lib/utils";

interface TrendCardProps {
  title: string;
  year: number;
  poster: string;
  rating: number;
}

export const TrendCard = ({ title, year, poster, rating }: TrendCardProps) => {
  const finalPoster =
    getBestPosterUrl(poster) ||
    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors cursor-pointer group">
      <img
        src={finalPoster}
        alt={title}
        loading="lazy"
        decoding="async"
        className="w-16 h-24 object-cover rounded-md group-hover:scale-105 transition-transform bg-card"
        style={{
          objectFit: "cover",
          imageRendering: "auto",
          filter: "brightness(0.98)",
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
        }}
      />
      <div className="flex-1 space-y-1">
        <h4 className="font-semibold text-sm text-foreground line-clamp-2">
          {title}
        </h4>
        <p className="text-xs text-muted-foreground">{year}</p>
        <div className="flex items-center gap-1">
          <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0">
            <Star className="w-3 h-3 fill-current mr-1" />
            {rating}
          </Badge>
        </div>
      </div>
    </div>
  );
};
