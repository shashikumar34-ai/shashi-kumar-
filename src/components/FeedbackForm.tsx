import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { StarRating, FeedbackItem } from '../types/feedback';
import { sound } from '../utils/audio';
import { Send, CheckCircle2, Tag, PlusCircle } from 'lucide-react';

interface FeedbackFormProps {
  currentRating: StarRating;
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'likes'>) => void;
  accentColor: string;
}

const SUGGESTED_TAGS = [
  '⚡ High Energy',
  '💡 Great Insights',
  '🎨 Lovely Slides',
  '👏 Engaging Delivery',
  '⏱️ Perfect Timing',
  '🙋 Interactive Q&A',
  '🎯 Clear Explanations',
  '✨ Super Fun Vibe',
];

const ROLES = [
  'Audience Attendee',
  'Fellow Speaker',
  'Event Organizer',
  'Session Reviewer',
  'Casual Viewer',
];

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  currentRating,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES[0]);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const toggleTag = (tag: string) => {
    sound.playHoverStar(3);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleResetForm = () => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setName('');
    setComment('');
    setSelectedTags([]);
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessSubmit();

    const trimmedComment = comment.trim();
    const finalComment =
      trimmedComment ||
      (selectedTags.length > 0
        ? `Rated ${currentRating} stars with highlights: ${selectedTags.join(', ')}`
        : `Gave a wonderful ${currentRating}-star rating!`);

    onSubmit({
      name: name.trim() || 'Anonymous Fan',
      role,
      rating: currentRating,
      comment: finalComment,
      tags: selectedTags,
    });

    setIsSubmitted(true);
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    successTimeoutRef.current = setTimeout(() => {
      handleResetForm();
    }, 2800);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center justify-center gap-3"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
        </div>
        <h4 className="text-lg sm:text-xl font-bold text-slate-800">
          Arigatou Gozaimasu! (Thank You!)
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md">
          Shin-chan has received your feedback! Thank you for sharing your thoughtful rating.
        </p>
        <button
          type="button"
          onClick={handleResetForm}
          className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-white border border-emerald-200 px-3.5 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Submit Another Note</span>
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      {/* Quick feedback tags */}
      <div>
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <span>What stood out most? (Tap tags)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TAGS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm font-semibold'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Name and Role Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label 
            htmlFor="feedback-name"
            className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
          >
            Your Name / Handle
          </label>
          <input
            id="feedback-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Toru Kazama (or Anonymous)"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white transition-all"
            maxLength={40}
          />
        </div>
        <div>
          <label 
            htmlFor="feedback-role"
            className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
          >
            Audience Role
          </label>
          <select
            id="feedback-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white transition-all cursor-pointer"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comment text area */}
      <div>
        <label 
          htmlFor="feedback-comment"
          className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5"
        >
          Audience Message / Suggestions
        </label>
        <textarea
          id="feedback-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={`Tell the speaker what you enjoyed or what could be even better! Shin-chan is listening...`}
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white transition-all resize-y"
          maxLength={300}
        />
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
          <span>Constructive feedback makes every performance shine.</span>
          <span className="font-mono tabular-nums">{comment.length} / 300</span>
        </div>
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-[0.99] transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
      >
        <Send className="w-4 h-4" />
        <span>Submit {currentRating}-Star Feedback</span>
      </button>
    </form>
  );
};
