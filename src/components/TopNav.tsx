import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopNavProps {
  onScrollToSection: (sectionId: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onScrollToSection,
}) => {
  const [isMuted, setIsMuted] = useState(!sound.enabled);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = sound.subscribe((enabled) => {
      setIsMuted(!enabled);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleSound = () => {
    const isNowEnabled = sound.toggle();
    if (isNowEnabled) {
      sound.playSelectRating(5);
    }
  };

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    onScrollToSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2 group whitespace-nowrap"
        >
          <span className="text-rose-600 group-hover:scale-110 transition-transform">★</span>
          <span>Shin-chan Feedback</span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('rating-stage')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            5-Star Rating
          </button>
          <button
            onClick={() => handleNavClick('feedback-form-section')}
            className="hover:text-slate-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            Audience Feedback
          </button>
        </nav>

        {/* Zone 3: Primary action (Sound toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-rose-500" />
            )}
            <span className="hidden sm:inline">
              {isMuted ? 'Muted' : 'Sound On'}
            </span>
          </button>

          {/* Mobile hamburger menu trigger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-100 mt-2 flex flex-col gap-1">
          <button
            onClick={() => handleNavClick('rating-stage')}
            className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            5-Star Rating
          </button>
          <button
            onClick={() => handleNavClick('feedback-form-section')}
            className="text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
          >
            Audience Feedback
          </button>
        </div>
      )}
    </header>
  );
};
