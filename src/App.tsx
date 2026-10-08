/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StarRating, FeedbackItem } from './types/feedback';
import { SHINCHAN_REACTIONS } from './utils/reactions';
import { ShinchanCharacter } from './components/ShinchanCharacter';
import { StarRatingBar } from './components/StarRating';
import { FeedbackForm } from './components/FeedbackForm';
import { TopNav } from './components/TopNav';
import { sound } from './utils/audio';
import { HeartHandshake, Sparkles } from 'lucide-react';

export default function App() {
  const [currentRating, setCurrentRating] = useState<StarRating>(5);
  const [hoverRating, setHoverRating] = useState<StarRating | null>(null);

  const activeDisplayRating = hoverRating ?? currentRating;
  const activeReaction = SHINCHAN_REACTIONS[activeDisplayRating];

  const handleRatingChange = (newRating: StarRating) => {
    setCurrentRating(newRating);
  };

  const handleAddFeedback = (newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'likes'>) => {
    // Audience feedback submitted successfully
    try {
      const existing = localStorage.getItem('shinchan_audience_submissions');
      const items = existing ? JSON.parse(existing) : [];
      items.push({
        ...newFeedback,
        id: `fb-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('shinchan_audience_submissions', JSON.stringify(items));
    } catch {
      // Storage unavailable in some iframes
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white flex flex-col">
      {/* Top Navigation */}
      <TopNav onScrollToSection={scrollToSection} />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Hero & Interactive Rating Stage */}
        <section id="rating-stage" className="flex flex-col items-center text-center">
          {/* Editorial Headline */}
          <div className="max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              How did you enjoy the session?
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Tap the stars below to share your honest rating. Watch Shin-chan’s emotions transform in real time from crying sadness to pure Action Kamen excitement!
            </p>
          </div>

          {/* Interactive Card Stage with Dynamic Mood Background */}
          <div
            className="w-full max-w-3xl rounded-3xl p-5 sm:p-10 border transition-all duration-500 shadow-xl relative overflow-hidden"
            style={{
              backgroundColor: activeReaction.bgColor,
              borderColor: activeReaction.borderColor,
            }}
          >
            {/* Quick Star Selection Pills */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 flex-wrap">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
                Quick preview:
              </span>
              {([1, 2, 3, 4, 5] as StarRating[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    handleRatingChange(r);
                    sound.playSelectRating(r);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    currentRating === r
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {r}★ {r === 1 ? '😭' : r === 2 ? '😒' : r === 3 ? '🤔' : r === 4 ? '😊' : '⚡'}
                </button>
              ))}
            </div>

            {/* Shin-chan Reaction Character Stage */}
            <div className="my-2">
              <ShinchanCharacter
                rating={activeDisplayRating}
                activeReaction={activeReaction}
                isHovering={hoverRating !== null}
                hoverRating={hoverRating}
              />
            </div>

            {/* 5-Star Rating Control Bar */}
            <div className="mt-6 pt-6 border-t border-slate-200/60">
              <StarRatingBar
                value={currentRating}
                hoverValue={hoverRating}
                onChange={handleRatingChange}
                onHoverChange={setHoverRating}
              />
            </div>

            {/* Audience Feedback Form */}
            <div 
              id="feedback-form-section"
              className="mt-8 pt-8 border-t border-slate-200/70 bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-7 shadow-sm text-left"
            >
              <h3 className="text-base font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0" />
                <span>Audience Feedback & Suggestions</span>
              </h3>
              <p className="text-xs text-slate-500 mb-5">
                Rating as <span className="font-bold text-slate-700">{currentRating} Stars</span>. Share your thoughts or favorite moments with the presenter.
              </p>
              <FeedbackForm
                currentRating={currentRating}
                onSubmit={handleAddFeedback}
                accentColor={activeReaction.moodColor}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Clean Editorial Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Shin-chan Feedback Express</span>
            <span>·</span>
            <span>Audience Engagement & 5-Star Rating</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Web Audio & Vector Animations
            </span>
            <span>·</span>
            <span>Action Kamen Approved ⚡</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
