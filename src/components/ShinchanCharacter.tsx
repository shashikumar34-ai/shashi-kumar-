import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarRating, RatingReaction } from '../types/feedback';
import { sound } from '../utils/audio';
import { Sparkles, Heart } from 'lucide-react';

interface ShinchanCharacterProps {
  rating: StarRating;
  activeReaction: RatingReaction;
  isHovering?: boolean;
  hoverRating?: StarRating | null;
}

export const ShinchanCharacter: React.FC<ShinchanCharacterProps> = ({
  rating,
  activeReaction,
}) => {
  const [isPoked, setIsPoked] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const pokeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pokeTimeoutRef.current) {
        clearTimeout(pokeTimeoutRef.current);
      }
    };
  }, []);

  const handlePoke = () => {
    sound.playPoke();
    setIsPoked(true);
    setPokeCount((prev) => prev + 1);

    if (pokeTimeoutRef.current) {
      clearTimeout(pokeTimeoutRef.current);
    }
    pokeTimeoutRef.current = setTimeout(() => {
      setIsPoked(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePoke();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-full max-w-sm mx-auto">
      {/* Speech Bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${rating}-${pokeCount}`}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          className="relative mb-3 px-4 py-2.5 rounded-2xl bg-white shadow-lg border border-slate-100 text-center max-w-[88%] sm:max-w-[320px] w-full z-20"
        >
          {/* Japanese voice subtext */}
          <div className="text-[11px] font-semibold tracking-wider text-rose-500 uppercase mb-0.5 truncate">
            {isPoked ? 'Kyaa~! Hehehe!' : activeReaction.japanesePhrase}
          </div>
          {/* Main quote */}
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
            {isPoked
              ? 'Hey hey! Stop poking my cute chubby cheek! It tickles~!'
              : activeReaction.shinchanQuote}
          </p>
          {/* Speech bubble tail pointer */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Main Character Stage Container */}
      <div 
        role="button"
        tabIndex={0}
        onClick={handlePoke}
        onKeyDown={handleKeyDown}
        aria-label="Click or press enter to poke Shin-chan's cheek"
        title="Click Shin-chan to poke his cheek!"
        className="relative group cursor-pointer w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center outline-none focus-visible:ring-4 focus-visible:ring-rose-400/40 rounded-full"
      >
        {/* Ambient Mood Aura Glow */}
        <motion.div
          animate={{
            scale: rating === 5 ? [1, 1.08, 1] : 1,
            opacity: rating === 1 ? 0.35 : 0.6,
          }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          className="absolute inset-4 rounded-full blur-2xl -z-10 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: activeReaction.accentBg }}
        />

        {/* 5-Star Confetti & Star Sparkles */}
        {rating === 5 && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-amber-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.2, 0.6],
                  y: [-10, -50 - (i % 3) * 15],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 12)],
                  rotate: [0, i % 2 === 0 ? 45 : -45],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  delay: i * 0.22,
                  ease: 'easeOut',
                }}
                style={{
                  top: `${20 + (i % 4) * 15}%`,
                  left: `${15 + (i * 11) % 70}%`,
                }}
              >
                {i % 2 === 0 ? (
                  <Sparkles className="w-5 h-5 text-amber-400 drop-shadow" />
                ) : (
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 drop-shadow" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 1-Star Raindrops & Tear Puddles */}
        {rating === 1 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-3.5 bg-blue-400/80 rounded-full"
                animate={{
                  y: [0, 60],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  delay: i * 0.16,
                  ease: 'linear',
                }}
                style={{
                  top: `${10 + (i % 3) * 15}%`,
                  left: `${18 + i * 13}%`,
                }}
              />
            ))}
          </div>
        )}

        {/* Shin-chan Animated Vector Illustration */}
        <motion.div
          animate={
            isPoked
              ? { rotate: [-6, 7, -5, 5, 0], scale: [1, 1.1, 0.96, 1.03, 1] }
              : rating === 5
              ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
              : rating === 4
              ? { y: [0, -4, 0] }
              : rating === 1
              ? { y: [0, 2, 0], rotate: [-1, 1, -1] }
              : {}
          }
          transition={{
            repeat: isPoked ? 0 : Infinity,
            duration: rating === 5 ? 0.7 : rating === 1 ? 1.4 : 1.2,
            ease: 'easeInOut',
          }}
          className="w-full h-full relative"
        >
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full drop-shadow-md overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* DEFINITIONS FOR GRADIENTS */}
            <defs>
              <linearGradient id="shinSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE0B2" />
                <stop offset="100%" stopColor="#FBCBA5" />
              </linearGradient>
              <linearGradient id="shinShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" />
                <stop offset="100%" stopColor="#DC2626" />
              </linearGradient>
              <linearGradient id="tearFallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            {/* --- SHIN-CHAN BODY & CLOTHING --- */}
            {/* Yellow Shorts */}
            <path
              d="M 112 225 L 188 225 L 182 256 L 152 256 L 150 242 L 148 256 L 118 256 Z"
              fill="#FBBF24"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Little Legs */}
            {/* Left Leg */}
            <path
              d="M 124 256 L 124 274 L 140 274 L 140 256"
              fill="#FFE0B2"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Left Shoe (Yellow) */}
            <path
              d="M 116 274 C 116 270 144 270 144 274 C 144 282 114 282 116 274 Z"
              fill="#F59E0B"
              stroke="#1E293B"
              strokeWidth="3.5"
            />

            {/* Right Leg */}
            <path
              d="M 160 256 L 160 274 L 176 274 L 176 256"
              fill="#FFE0B2"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Right Shoe (Yellow) */}
            <path
              d="M 156 274 C 156 270 184 270 184 274 C 184 282 154 282 156 274 Z"
              fill="#F59E0B"
              stroke="#1E293B"
              strokeWidth="3.5"
            />

            {/* Red T-Shirt Body */}
            <path
              d="M 104 168 C 104 168 126 160 150 160 C 174 160 196 168 196 168 L 192 232 L 108 232 Z"
              fill="url(#shinShirtGrad)"
              stroke="#1E293B"
              strokeWidth="4.5"
              strokeLinejoin="round"
            />

            {/* Yellow Shirt Collar Trim */}
            <path
              d="M 132 162 C 142 168 158 168 168 162"
              stroke="#FACC15"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* ARMS - POSED ACCORDING TO RATING */}
            {/* 1 STAR: Limp droopy arms, sad */}
            {rating === 1 && (
              <g>
                <path
                  d="M 104 172 Q 88 198 84 218"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 104 172 Q 88 198 84 218"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="84" cy="220" r="7" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />

                <path
                  d="M 196 172 Q 212 198 216 218"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 196 172 Q 212 198 216 218"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="216" cy="220" r="7" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />
              </g>
            )}

            {/* 2 STARS: Arms crossed pout */}
            {rating === 2 && (
              <g>
                <path
                  d="M 100 178 C 115 204 185 204 200 178"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 100 178 C 115 204 185 204 200 178"
                  stroke="#EF4444"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="198" r="8" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />
              </g>
            )}

            {/* 3 STARS: One hand on hip, one finger on cheek thinking */}
            {rating === 3 && (
              <g>
                <path
                  d="M 104 175 Q 86 195 106 208"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 104 175 Q 86 195 106 208"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d="M 196 176 Q 216 160 196 138"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 196 176 Q 216 160 196 138"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="196" cy="138" r="6" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />
              </g>
            )}

            {/* 4 STARS: Cheerful Thumbs Up / Peace Sign */}
            {rating === 4 && (
              <g>
                <path
                  d="M 104 175 Q 82 170 78 150"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 104 175 Q 82 170 78 150"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="78" cy="148" r="7" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />
                <path d="M 78 143 L 78 135" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

                <path
                  d="M 196 175 Q 218 170 222 150"
                  stroke="#1E293B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 196 175 Q 218 170 222 150"
                  stroke="#FFE0B2"
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <circle cx="222" cy="148" r="7" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />
                <path d="M 220 143 L 216 134 M 224 143 L 228 134" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" />
              </g>
            )}

            {/* 5 STARS: ACTION KAMEN ARMS RAISED TRIUMPHANT POSE */}
            {rating === 5 && (
              <g>
                <path
                  d="M 104 172 Q 74 145 68 115"
                  stroke="#1E293B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 104 172 Q 74 145 68 115"
                  stroke="#FFE0B2"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="68" cy="115" r="8" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />

                <path
                  d="M 196 172 Q 226 145 232 115"
                  stroke="#1E293B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 196 172 Q 226 145 232 115"
                  stroke="#FFE0B2"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <circle cx="232" cy="115" r="8" fill="#FFE0B2" stroke="#1E293B" strokeWidth="3" />

                <path
                  d="M 60 100 L 68 108 L 62 112 M 240 100 L 232 108 L 238 112"
                  stroke="#EAB308"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* --- ICONIC SHIN-CHAN HEAD & FACE --- */}
            <path
              d="M 152 48
                 C 192 48 218 68 218 96
                 C 218 114 208 126 216 138
                 C 226 152 208 174 172 174
                 C 142 174 102 170 88 150
                 C 74 130 76 108 94 94
                 C 74 74 114 48 152 48 Z"
              fill="url(#shinSkinGrad)"
              stroke="#1E293B"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Cropped black hair along top and back */}
            <path
              d="M 112 56
                 C 134 46 170 46 195 56
                 C 212 65 218 82 218 96
                 C 210 92 195 86 182 86
                 C 165 86 148 94 135 94
                 C 120 94 112 86 104 80
                 C 98 72 104 60 112 56 Z"
              fill="#18181B"
            />

            {/* Right Ear */}
            <path
              d="M 216 116 C 228 114 230 132 217 136"
              fill="#FBCBA5"
              stroke="#1E293B"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Rosy Cheek Blush */}
            <ellipse
              cx="110"
              cy="138"
              rx={rating >= 4 ? 14 : 10}
              ry={rating >= 4 ? 9 : 7}
              fill="#FB7185"
              opacity={rating >= 4 ? 0.75 : 0.45}
            />
            <ellipse
              cx="192"
              cy="142"
              rx={rating >= 4 ? 12 : 8}
              ry={rating >= 4 ? 8 : 6}
              fill="#FB7185"
              opacity={rating >= 4 ? 0.75 : 0.45}
            />

            {/* --- ICONIC ULTRA-THICK SHIN-CHAN EYEBROWS --- */}
            {/* 1 STAR: Drooping sad / crying eyebrows */}
            {rating === 1 && (
              <g>
                <path
                  d="M 108 94 C 122 104 136 100 144 95"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 164 96 C 176 104 192 102 202 96"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 2 STARS: Furrowed, grumpy/annoyed eyebrows */}
            {rating === 2 && (
              <g>
                <path
                  d="M 110 96 C 124 90 136 94 144 100"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 166 100 C 174 94 188 90 202 95"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 3 STARS: One raised quizzically, one relaxed */}
            {rating === 3 && (
              <g>
                <path
                  d="M 110 82 C 124 74 138 80 146 88"
                  stroke="#18181B"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 164 96 C 176 92 192 92 202 96"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 4 STARS: Cheerful arched eyebrows */}
            {rating === 4 && (
              <g>
                <path
                  d="M 110 88 C 124 78 138 80 144 88"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 166 88 C 176 80 190 78 202 88"
                  stroke="#18181B"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 5 STARS: Action Kamen heroic lifted eyebrows! */}
            {rating === 5 && (
              <g>
                <path
                  d="M 108 82 C 122 70 138 72 146 82"
                  stroke="#18181B"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <path
                  d="M 164 82 C 174 72 190 70 204 82"
                  stroke="#18181B"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* --- EYES --- */}
            {/* 1 STAR: Waterfall crying anime tears */}
            {rating === 1 && (
              <g>
                <ellipse cx="128" cy="114" rx="10" ry="12" fill="#18181B" />
                <circle cx="125" cy="110" r="4" fill="#FFFFFF" />
                <ellipse cx="182" cy="116" rx="9" ry="11" fill="#18181B" />
                <circle cx="180" cy="112" r="3.5" fill="#FFFFFF" />

                <path
                  d="M 124 122 C 120 140 114 165 110 195 C 114 198 126 195 128 175 C 130 155 132 135 130 122 Z"
                  fill="url(#tearFallGrad)"
                />
                <path
                  d="M 180 124 C 182 142 186 165 190 192 C 186 195 176 194 175 175 C 175 155 177 135 178 124 Z"
                  fill="url(#tearFallGrad)"
                />
              </g>
            )}

            {/* 2 STARS: Unimpressed sideways slit/glare + sweat drop */}
            {rating === 2 && (
              <g>
                <path d="M 118 114 Q 128 108 138 114" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
                <circle cx="128" cy="116" r="3" fill="#18181B" />
                <path d="M 174 116 Q 183 110 192 116" stroke="#18181B" strokeWidth="5" strokeLinecap="round" />
                <circle cx="183" cy="118" r="3" fill="#18181B" />
                <path
                  d="M 206 90 C 206 85 212 78 212 78 C 212 78 218 85 218 90 C 218 94 213 96 209 96 C 206 96 206 93 206 90 Z"
                  fill="#60A5FA"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* 3 STARS: Curious classic wide round pupils */}
            {rating === 3 && (
              <g>
                <ellipse cx="128" cy="110" rx="9" ry="11" fill="#18181B" />
                <circle cx="126" cy="107" r="3.5" fill="#FFFFFF" />
                <ellipse cx="180" cy="112" rx="8" ry="10" fill="#18181B" />
                <circle cx="178" cy="109" r="3" fill="#FFFFFF" />
              </g>
            )}

            {/* 4 STARS: Cheerful smiling crescents (^_^) */}
            {rating === 4 && (
              <g>
                <path
                  d="M 118 114 C 122 102 134 102 138 114"
                  stroke="#18181B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M 172 116 C 176 104 188 104 192 116"
                  stroke="#18181B"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* 5 STARS: Starry / Sparkling Anime Eyes */}
            {rating === 5 && (
              <g>
                <ellipse cx="128" cy="112" rx="11" ry="13" fill="#18181B" />
                <path
                  d="M 128 104 L 130 110 L 136 112 L 130 114 L 128 120 L 126 114 L 120 112 L 126 110 Z"
                  fill="#FACC15"
                />
                <circle cx="124" cy="108" r="2" fill="#FFFFFF" />

                <ellipse cx="182" cy="114" rx="10" ry="12" fill="#18181B" />
                <path
                  d="M 182 107 L 184 112 L 189 114 L 184 116 L 182 121 L 180 116 L 175 114 L 180 112 Z"
                  fill="#FACC15"
                />
                <circle cx="179" cy="110" r="2" fill="#FFFFFF" />
              </g>
            )}

            {/* --- MOUTH --- */}
            {/* 1 STAR: Quivering sad downturned mouth */}
            {rating === 1 && (
              <path
                d="M 144 146 C 150 140 158 140 164 145"
                stroke="#18181B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {/* 2 STARS: Disappointed tight squiggly pout */}
            {rating === 2 && (
              <path
                d="M 146 142 C 152 144 156 140 162 143"
                stroke="#18181B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {/* 3 STARS: Small playful smirk */}
            {rating === 3 && (
              <path
                d="M 146 138 C 152 142 160 142 166 136"
                stroke="#18181B"
                strokeWidth="4"
                strokeLinecap="round"
              />
            )}

            {/* 4 STARS: Big open cheerful smile with pink tongue */}
            {rating === 4 && (
              <g>
                <path
                  d="M 142 135 C 144 150 166 150 168 135 Z"
                  fill="#E11D48"
                  stroke="#18181B"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M 148 144 C 152 140 160 140 162 144"
                  fill="#FDA4AF"
                />
              </g>
            )}

            {/* 5 STARS: Overjoyed wide Action Kamen laugh with teeth and tongue */}
            {rating === 5 && (
              <g>
                <path
                  d="M 136 132 C 138 156 172 156 174 132 Z"
                  fill="#BE123C"
                  stroke="#18181B"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                <path
                  d="M 140 133 C 148 138 162 138 170 133"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <ellipse cx="155" cy="147" rx="10" ry="6" fill="#FB7185" />
              </g>
            )}

            {/* BONUS ACCESSORY: Floating Chocobi biscuit box on 5 Stars */}
            {rating === 5 && (
              <g transform="translate(35, 175) rotate(-15)">
                <rect x="0" y="0" width="32" height="42" rx="4" fill="#10B981" stroke="#047857" strokeWidth="2.5" />
                <rect x="4" y="6" width="24" height="12" rx="2" fill="#FDE047" />
                <text x="7" y="15" fontSize="7" fontWeight="bold" fill="#B91C1C">チョコビ</text>
                <circle cx="16" cy="28" r="7" fill="#F43F5E" />
                <circle cx="14" cy="27" r="1.5" fill="#FFFFFF" />
              </g>
            )}
          </svg>
        </motion.div>
      </div>

      {/* Mood status text */}
      <div className="mt-2 text-center">
        <span 
          className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: activeReaction.accentBg,
            color: activeReaction.moodColor,
            border: `1px solid ${activeReaction.borderColor}`,
          }}
        >
          {activeReaction.label}
        </span>
        <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
          {activeReaction.subtitle}
        </p>
      </div>
    </div>
  );
};
