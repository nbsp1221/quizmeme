import { useEffect, useState } from 'preact/hooks';
import { getUserStreak } from '../utils/storage';
import { UserStreak } from '../types/quiz';

export function useStreak() {
  const [streak, setStreak] = useState<UserStreak>({
    currentStreak: 0,
    lastQuizDate: '',
    longestStreak: 0
  });
  
  // Load streak data on mount
  useEffect(() => {
    const userStreak = getUserStreak();
    setStreak(userStreak);
    
    // Add event listener to update streak when storage changes
    const handleStorageChange = () => {
      const updatedStreak = getUserStreak();
      setStreak(updatedStreak);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Get streak badge color based on streak count
  const getStreakBadgeColor = (): string => {
    const colorClasses: string[] = [
      'bg-blue-500', // 1-7 days
      'bg-green-500', // 8-14 days
      'bg-yellow-500', // 15-21 days
      'bg-orange-500', // 22-28 days
      'bg-red-500', // 29-35 days
      'bg-purple-500', // 36-42 days
      'bg-pink-500', // 43+ days
    ];
    
    const streakValue = streak.currentStreak || 0;
    const index = Math.min(Math.floor(streakValue / 7), colorClasses.length - 1);
    // Using type assertion to assure TypeScript this will never be undefined
    return colorClasses[index] as string;
  };
  
  return {
    streak,
    streakBadgeColor: getStreakBadgeColor()
  };
} 