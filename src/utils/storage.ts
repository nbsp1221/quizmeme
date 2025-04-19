import { UserQuizState, QuizResult, UserStreak } from '../types/quiz';

// Storage keys
const STORAGE_KEY = 'quizmeme-state';

// Default state
const DEFAULT_STATE: UserQuizState = {
  completedQuizzes: {},
  streak: {
    currentStreak: 0,
    lastQuizDate: '',
    longestStreak: 0
  }
};

// Load state from localStorage
export const loadState = (): UserQuizState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) {
      return DEFAULT_STATE;
    }
    return JSON.parse(serializedState) as UserQuizState;
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return DEFAULT_STATE;
  }
};

// Save state to localStorage
export const saveState = (state: UserQuizState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

// Save a quiz result and update streak
export const saveQuizResult = (result: QuizResult): void => {
  const state = loadState();
  
  // Add this quiz to completed quizzes
  state.completedQuizzes[result.packId] = result;
  
  // Update streak
  updateStreak(state.streak, result);
  
  // Save updated state
  saveState(state);
};

// Check if user has completed today's quiz
export const hasCompletedTodaysQuiz = (packId: string): boolean => {
  const state = loadState();
  return !!state.completedQuizzes[packId];
};

// Get user's current streak
export const getUserStreak = (): UserStreak => {
  return loadState().streak;
};

// Update the user's streak based on quiz result
const updateStreak = (streak: UserStreak, _result: QuizResult): void => {
  const today = new Date().toISOString().split('T')[0] || '';
  const lastDate = streak.lastQuizDate;
  
  // If this is their first quiz
  if (!lastDate) {
    streak.currentStreak = 1;
    streak.lastQuizDate = today;
    streak.longestStreak = 1;
    return;
  }
  
  // Calculate date difference
  const lastQuizDate = new Date(lastDate);
  const todayDate = new Date(today);
  const dayDifference = Math.floor(
    (todayDate.getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Update streak based on day difference
  if (dayDifference === 1) {
    // Consecutive day
    streak.currentStreak += 1;
    streak.lastQuizDate = today;
    // Update longest streak if needed
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }
  } else if (dayDifference > 1) {
    // Streak broken
    streak.currentStreak = 1;
    streak.lastQuizDate = today;
  } else if (dayDifference === 0) {
    // Same day, no streak change
    // But we update the date to be safe
    streak.lastQuizDate = today;
  }
}; 