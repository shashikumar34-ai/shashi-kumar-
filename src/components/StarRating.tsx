import React from 'react';
import { motion } from 'motion/react';
import { StarRating } from '../types/feedback';
import { sound } from '../utils/audio';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: StarRating;
  hoverValue: StarRating | null;
  onChange: (rating: StarRating) => void;
  onHoverChange: (rating: StarRating | null) => void;
}

const RATING_DESCRIPTIONS: Record<StarRating, string> = {
  1: 'Heartbroken',
  2: 'Unimpressed',
  3: 'Just Alright',
  4: 'Pretty Awesome',
  5: 'Action Kamen Level!',
};

export const StarRatingBar: React.FC<StarRatingProps> = ({
  value,
  hoverValue,
  onChange,
  onHoverChange,
}) => {
  const activeDisplayRating = hoverValue ?? value;

  const handleSelect = (star: StarRating) => {
    sound.playSelectRating(star);
    onChange(star);
  };

  const handleHover = (star: StarRating) => {
    sound.playHoverStar(star);
    onHoverChange(star);
  };

  const handleKeyDown = (e: React.KeyboardEvent, star: StarRating) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      const nextStar = Math.min(5, (hoverValue ?? value) + 1) as StarRating;
      handleSelect(nextStar);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      const prevStar = Math.max(1, (hoverValue ?? value) - 1) as StarRating;
      handleSelect(prevStar);
    } else if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      const num = parseInt(e.key, 10) as StarRating;
      handleSelect(num);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(star);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* 5-Star Row */}
      <div 
        className="flex items-center justify-center gap-1 sm:gap-3 p-1 max-w-full"
        role="radiogroup"
        aria-label="Audience feedback 5-star rating"
        onMouseLeave={() => onHoverChange(null)}
        onTouchEnd={() => onHoverChange(null)}
      >
        {([1, 2, 3, 4, 5] as StarRating[]).map((star) => {
          const isFilled = star <= activeDisplayRating;
          const isSelected = star === value;

          return (
            <motion.button
              key={star}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${star} star${star > 1 ? 's' : ''} - ${RATING_DESCRIPTIONS[star]}`}
              onClick={() => handleSelect(star)}
              onMouseEnter={() => handleHover(star)}
              onFocus={() => handleHover(star)}
              onBlur={() => onHoverChange(null)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              whileHover={{ scale: 1.2, y: -4 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className={`relative p-2 sm:p-2.5 rounded-2xl transition-all duration-150 outline-none focus-visible:ring-3 focus-visible:ring-amber-400 cursor-pointer ${
                isSelected
                  ? 'bg-amber-100/70 shadow-sm'
                  : 'hover:bg-slate-100/60'
              }`}
            >
              {/* Star Icon */}
              <Star
                className={`w-9 h-9 sm:w-11 sm:h-11 transition-all duration-200 ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                    : 'text-slate-300 fill-transparent hover:text-amber-300'
                }`}
                strokeWidth={1.75}
              />

              {/* Number indicator beneath each star */}
              <span
                className={`block text-[11px] font-bold text-center mt-1 transition-colors font-mono tabular-nums ${
                  isFilled ? 'text-amber-600 font-extrabold' : 'text-slate-400'
                }`}
              >
                {star}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Dynamic Text Badge for selected/hovered star */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-extrabold text-slate-800 text-base font-mono tabular-nums">
          {activeDisplayRating} / 5
        </span>
        <span className="text-slate-400">·</span>
        <motion.span
          key={activeDisplayRating}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-semibold text-slate-700"
        >
          {RATING_DESCRIPTIONS[activeDisplayRating]}
        </motion.span>
      </div>

      <p className="text-[11px] text-slate-400">
        Use arrows or keys 1–5 to change rating with keyboard
      </p>
    </div>
  );
};
