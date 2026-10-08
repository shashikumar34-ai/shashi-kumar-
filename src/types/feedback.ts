export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface FeedbackItem {
  id: string;
  name: string;
  role: string;
  rating: StarRating;
  comment: string;
  tags: string[];
  createdAt: string;
  likes: number;
}

export interface RatingReaction {
  rating: StarRating;
  label: string;
  subtitle: string;
  shinchanQuote: string;
  japanesePhrase: string;
  moodColor: string;
  bgColor: string;
  accentBg: string;
  borderColor: string;
}
