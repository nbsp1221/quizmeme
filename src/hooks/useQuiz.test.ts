import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/preact';
import { useQuiz } from './useQuiz';
import * as storage from '../utils/storage';

// Mock the storage module
vi.mock('../utils/storage', () => ({
  saveQuizResult: vi.fn(),
  hasCompletedTodaysQuiz: vi.fn().mockReturnValue(false),
}));

// Mock Date.now() for consistent timing tests
const mockDateNow = vi.fn();
const originalDateNow = Date.now;

describe('useQuiz', () => {
  // Sample quiz pack for testing
  const mockQuizPack = {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'A test quiz',
    emoji: '🧪',
    releaseDate: '2023-04-18',
    questions: [
      {
        id: 'q1',
        text: 'Question 1?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
      },
      {
        id: 'q2',
        text: 'Question 2?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 1,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.hasCompletedTodaysQuiz).mockReturnValue(false);
    
    // Mock Date.now() for timing tests
    Date.now = mockDateNow;
    let time = 1000;
    mockDateNow.mockImplementation(() => time += 1000);
    
    // Mock setInterval and clearInterval
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore original Date.now
    Date.now = originalDateNow;
    vi.useRealTimers();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    expect(result.current.isStarted).toBe(false);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.answers).toEqual([]);
    expect(result.current.totalCorrect).toBe(0);
    expect(result.current.alreadyCompleted).toBe(false);
  });

  it('should start quiz and set initial state', () => {
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    // Initial state
    expect(result.current.isStarted).toBe(false);
    
    // Start the quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Check if the state was updated
    expect(result.current.isStarted).toBe(true);
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.currentQuestionIndex).toBe(0);
    expect(result.current.answers).toEqual([]);
    expect(result.current.totalCorrect).toBe(0);
    expect(result.current.timeLeft).toBe(12000); // Default time limit
  });

  it('should handle correct answer and increment score', () => {
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    // Start the quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer correctly (index 0 is correct for the first question)
    act(() => {
      result.current.handleAnswer(0);
    });
    
    // Check if the answer was recorded correctly
    expect(result.current.totalCorrect).toBe(1);
    expect(result.current.answers.length).toBe(1);
    expect(result.current.answers[0]?.isCorrect).toBe(true);
    
    // Should move to next question
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it('should handle incorrect answer without incrementing score', () => {
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    // Start the quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer incorrectly (index 2 is incorrect for the first question)
    act(() => {
      result.current.handleAnswer(2);
    });
    
    // Check if the answer was recorded correctly
    expect(result.current.totalCorrect).toBe(0);
    expect(result.current.answers.length).toBe(1);
    expect(result.current.answers[0]?.isCorrect).toBe(false);
    
    // Should move to next question
    expect(result.current.currentQuestionIndex).toBe(1);
  });

  it('should complete quiz after answering all questions', () => {
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    // Start the quiz
    act(() => {
      result.current.startQuiz();
    });
    
    // Answer the first question
    act(() => {
      result.current.handleAnswer(0); // Correct
    });
    
    // Answer the second (final) question
    act(() => {
      result.current.handleAnswer(1); // Correct
    });
    
    // Check if the quiz was completed
    expect(result.current.isCompleted).toBe(true);
    expect(result.current.totalCorrect).toBe(2);
    expect(result.current.answers.length).toBe(2);
    
    // Check if the quiz result was saved to storage
    expect(storage.saveQuizResult).toHaveBeenCalledTimes(1);
    expect(storage.saveQuizResult).toHaveBeenCalledWith(expect.objectContaining({
      packId: 'test-quiz',
      totalCorrect: 2,
      answers: expect.arrayContaining([
        expect.objectContaining({ isCorrect: true }),
        expect.objectContaining({ isCorrect: true }),
      ]),
    }));
  });

  it('should check if user already completed the quiz', () => {
    // Mock that the quiz was already completed
    vi.mocked(storage.hasCompletedTodaysQuiz).mockReturnValue(true);
    
    const { result } = renderHook(() => useQuiz(mockQuizPack));
    
    // Should set alreadyCompleted to true
    expect(result.current.alreadyCompleted).toBe(true);
  });
}); 