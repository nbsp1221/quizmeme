export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface QuizPack {
  id: string;
  title: string;
  description: string;
  emoji: string;
  releaseDate: string; // ISO string for the date this quiz becomes available
  questions: QuizQuestion[];
}

export type QuizAnswer = {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
  timeSpentMs: number;
};

export interface QuizResult {
  packId: string;
  date: string; // ISO string of when the quiz was taken
  answers: QuizAnswer[];
  totalCorrect: number;
  totalTimeMs: number;
  streakMaintained: boolean;
}

export interface UserStreak {
  currentStreak: number;
  lastQuizDate: string; // ISO string of the last completed quiz
  longestStreak: number;
}

export interface UserQuizState {
  completedQuizzes: Record<string, QuizResult>; // packId -> result
  streak: UserStreak;
} 