import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadState, saveState, hasCompletedTodaysQuiz, getUserStreak } from './storage';
import { UserQuizState } from '../types/quiz';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Assign mock to global
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });
  
  it('should load default state when nothing in localStorage', () => {
    const state = loadState();
    expect(state).toEqual({
      completedQuizzes: {},
      streak: {
        currentStreak: 0,
        lastQuizDate: '',
        longestStreak: 0
      }
    });
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(1);
  });
  
  it('should save state to localStorage', () => {
    const testState: UserQuizState = {
      completedQuizzes: {
        'test-quiz': {
          packId: 'test-quiz',
          date: '2023-04-18T00:00:00.000Z',
          answers: [],
          totalCorrect: 5,
          totalTimeMs: 30000,
          streakMaintained: true
        }
      },
      streak: {
        currentStreak: 1,
        lastQuizDate: '2023-04-18',
        longestStreak: 1
      }
    };
    
    saveState(testState);
    
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'quizmeme-state',
      JSON.stringify(testState)
    );
  });
  
  it('should check if user completed specific quiz', () => {
    const testState: UserQuizState = {
      completedQuizzes: {
        'test-quiz': {
          packId: 'test-quiz',
          date: '2023-04-18T00:00:00.000Z',
          answers: [],
          totalCorrect: 5,
          totalTimeMs: 30000,
          streakMaintained: true
        }
      },
      streak: {
        currentStreak: 1,
        lastQuizDate: '2023-04-18',
        longestStreak: 1
      }
    };
    
    // Mock that loadState returns our test state
    vi.spyOn(window.localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(testState));
    
    const completed = hasCompletedTodaysQuiz('test-quiz');
    expect(completed).toBe(true);
    
    const notCompleted = hasCompletedTodaysQuiz('other-quiz');
    expect(notCompleted).toBe(false);
  });
  
  it('should get user streak', () => {
    const testStreak = {
      currentStreak: 5,
      lastQuizDate: '2023-04-18',
      longestStreak: 10
    };
    
    const testState: UserQuizState = {
      completedQuizzes: {},
      streak: testStreak
    };
    
    // Mock that loadState returns our test state
    vi.spyOn(window.localStorage, 'getItem').mockReturnValueOnce(JSON.stringify(testState));
    
    const streak = getUserStreak();
    expect(streak).toEqual(testStreak);
  });
}); 