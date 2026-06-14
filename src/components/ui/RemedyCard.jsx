import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { CategoryBadge } from './CategoryBadge';
import { RatingStars } from './RatingStars';
import { cn } from '../../utils/cn';
import { useFavoritesStore } from '../../store/favoritesStore';
import { Link } from 'react-router-dom';

export function RemedyCard({ remedy, className }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorite = isFavorite(remedy.id);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow relative group flex flex-col h-full",
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <CategoryBadge category={remedy.category} />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(remedy);
          }}
          className="text-ink-muted hover:text-forest transition-colors p-1 -mr-1 -mt-1"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-5 h-5", favorite && "fill-forest text-forest")} />
        </motion.button>
      </div>

      <h3 className="font-bold text-lg text-ink mb-2 line-clamp-1">{remedy.name}</h3>
      
      <p className="text-sm text-ink-muted line-clamp-2 mb-4 flex-grow">
        {remedy.shortDescription}
      </p>

      <RatingStars rating={remedy.rating} reviewCount={remedy.reviewCount} className="mb-4" />

      <div className="flex items-center gap-2 mb-4 text-xs font-medium text-ink-muted">
        <span className="bg-snow-dark px-2 py-1 rounded-md">{remedy.cost}</span>
        <span>•</span>
        <span>{remedy.timeToEffect}</span>
      </div>

      <Link
        to={`/remedy/${remedy.id}`}
        className="w-full mt-auto text-center py-2.5 rounded-xl text-sm font-semibold text-forest bg-forest/5 hover:bg-forest/10 transition-colors"
      >
        View Details &rarr;
      </Link>
    </motion.div>
  );
}
