import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/preact';
import { useMemeGenerator } from './useMemeGenerator';
import { QuizResult, QuizPack } from '../types/quiz';

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: vi.fn().mockReturnValue('mock-data-url'),
  }),
}));

describe('useMemeGenerator', () => {
  // Mock quiz pack for testing
  const mockQuizPack: QuizPack = {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'A test quiz',
    emoji: '🧪',
    releaseDate: '2023-04-18',
    questions: Array(5).fill(0).map((_, i) => ({
      id: `q${i}`,
      text: `Question ${i}?`,
      options: ['A', 'B', 'C', 'D'],
      correctOptionIndex: 0,
    })),
  };

  // Test different score scenarios
  it('should generate appropriate meme text based on score', () => {
    // Test different score scenarios
    const scoreScenarios = [
      {
        score: 5, // 100%
        expected: {
          title: 'Quiz Champion!',
          subtitle: 'You got 5/5 correct. Are you secretly Google?',
        },
      },
      {
        score: 4, // 80%
        expected: {
          title: 'Quiz Wizard!',
          subtitle: 'You got 4/5 correct. Pretty impressive!',
        },
      },
      {
        score: 3, // 60%
        expected: {
          title: 'Not bad!',
          subtitle: 'You got 3/5 correct. Room for improvement!',
        },
      },
      {
        score: 2, // 40%
        expected: {
          title: 'Nice try!',
          subtitle: 'You got 2/5 correct. Maybe read more Wikipedia?',
        },
      },
      {
        score: 0, // 0%
        expected: {
          title: 'Oops!',
          subtitle: 'You got 0/5 correct. At least you\'re honest!',
        },
      },
    ];

    scoreScenarios.forEach(({ score, expected }) => {
      // Create a mock quiz result with the specified score
      const mockResult: QuizResult = {
        packId: 'test-quiz',
        date: '2023-04-18T12:00:00.000Z',
        answers: [],
        totalCorrect: score,
        totalTimeMs: 30000,
        streakMaintained: true,
      };

      // Render the hook with the mock result
      const { result } = renderHook(() => useMemeGenerator(mockResult, mockQuizPack));

      // Check if the meme text is generated correctly
      expect(result.current.memeText.title).toBe(expected.title);
      expect(result.current.memeText.subtitle).toBe(expected.subtitle);
    });
  });

  it('should generate appropriate background pattern based on score', () => {
    // Test different score scenarios and their expected background patterns
    const patternScenarios = [
      {
        score: 5, // 100%
        expected: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      },
      {
        score: 4, // 80%
        expected: 'bg-gradient-to-r from-green-400 to-blue-500',
      },
      {
        score: 3, // 60%
        expected: 'bg-gradient-to-r from-blue-400 to-indigo-500',
      },
      {
        score: 2, // 40%
        expected: 'bg-gradient-to-r from-purple-400 to-pink-500',
      },
      {
        score: 1, // 20%
        expected: 'bg-gradient-to-r from-red-400 to-pink-500',
      },
    ];

    patternScenarios.forEach(({ score, expected }) => {
      // Create a mock quiz result with the specified score
      const mockResult: QuizResult = {
        packId: 'test-quiz',
        date: '2023-04-18T12:00:00.000Z',
        answers: [],
        totalCorrect: score,
        totalTimeMs: 30000,
        streakMaintained: true,
      };

      // Render the hook with the mock result
      const { result } = renderHook(() => useMemeGenerator(mockResult, mockQuizPack));

      // Check if the background pattern is generated correctly
      expect(result.current.backgroundPattern).toBe(expected);
    });
  });

  it('should return default values when quiz result is null', () => {
    // Render hook with null quiz result
    const { result } = renderHook(() => useMemeGenerator(null, mockQuizPack));

    // Check if default values are returned
    expect(result.current.memeText).toEqual({
      title: 'Quiz not completed',
      subtitle: 'Try again!',
    });
    expect(result.current.backgroundPattern).toBe('bg-gradient-to-r from-blue-500 to-purple-500');
  });

  it('should not have an image initially', () => {
    // Render hook
    const { result } = renderHook(() => useMemeGenerator(null, mockQuizPack));

    // Check initial state
    expect(result.current.memeImage).toBeNull();
    expect(result.current.isGenerating).toBe(false);
  });
}); 