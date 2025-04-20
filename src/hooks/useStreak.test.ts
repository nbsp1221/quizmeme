import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/preact';
import { useStreak } from './useStreak';
import * as storage from '../utils/storage';

// Mock the storage utilities
vi.mock('../utils/storage', () => ({
  getUserStreak: vi.fn(),
}));

describe('useStreak', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default streak values', () => {
    // Mock the getUserStreak function to return default values
    vi.mocked(storage.getUserStreak).mockReturnValue({
      currentStreak: 0,
      lastQuizDate: '',
      longestStreak: 0,
    });

    // Render the hook
    const { result } = renderHook(() => useStreak());

    // Check if the streak is initialized correctly
    expect(result.current.streak).toEqual({
      currentStreak: 0,
      lastQuizDate: '',
      longestStreak: 0,
    });

    // Default color for streak = 0
    expect(result.current.streakBadgeColor).toBe('bg-blue-500');
  });

  it('should set correct badge color based on streak count', () => {
    // Test with different streak values
    const testCases = [
      { streak: 3, expectedColor: 'bg-blue-500' },   // 1-7 days: blue
      { streak: 10, expectedColor: 'bg-green-500' },  // 8-14 days: green
      { streak: 18, expectedColor: 'bg-yellow-500' }, // 15-21 days: yellow
      { streak: 25, expectedColor: 'bg-orange-500' }, // 22-28 days: orange
      { streak: 32, expectedColor: 'bg-red-500' },    // 29-35 days: red
      { streak: 40, expectedColor: 'bg-purple-500' }, // 36-42 days: purple
      { streak: 50, expectedColor: 'bg-pink-500' },   // 43+ days: pink
    ];

    testCases.forEach(({ streak, expectedColor }) => {
      // Mock the getUserStreak for each test case
      vi.mocked(storage.getUserStreak).mockReturnValue({
        currentStreak: streak,
        lastQuizDate: '2023-04-18',
        longestStreak: streak,
      });

      // Render the hook
      const { result } = renderHook(() => useStreak());

      // Check if the badge color is correct
      expect(result.current.streakBadgeColor).toBe(expectedColor);
    });
  });

  it('should update streak when storage changes', async () => {
    // Initial state
    vi.mocked(storage.getUserStreak).mockReturnValue({
      currentStreak: 1,
      lastQuizDate: '2023-04-18',
      longestStreak: 1,
    });

    // Render the hook
    const { result, rerender } = renderHook(() => useStreak());

    // Initial streak check
    expect(result.current.streak.currentStreak).toBe(1);

    // Update the mocked return value
    vi.mocked(storage.getUserStreak).mockReturnValue({
      currentStreak: 2,
      lastQuizDate: '2023-04-19',
      longestStreak: 2,
    });

    // Manually trigger storage event
    window.dispatchEvent(new Event('storage'));
    
    // Force rerender to see updated state
    rerender();
    
    // Check if the streak was updated
    expect(result.current.streak.currentStreak).toBe(2);
  });
}); 