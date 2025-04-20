import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/preact';
import MemeCard from './MemeCard';

declare global {
  var Date: DateConstructor;
}

describe('MemeCard', () => {
  // Mock data for testing
  const mockQuizPack = {
    id: 'test-quiz',
    title: 'Test Quiz',
    description: 'A test quiz description',
    emoji: '🧪',
    releaseDate: '2023-04-18',
    questions: [
      {
        id: 'q1',
        text: 'Test question 1?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 0,
      },
    ],
  };

  // Mock date to ensure consistent test results
  const originalDate = Date;
  
  beforeEach(() => {
    // Mock the Date object to return a fixed date for toLocaleDateString
    const mockDate = new Date('2023-04-18T12:00:00Z');
    // @ts-ignore - Mocking the Date constructor
    Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
      
      toLocaleDateString() {
        return 'Tuesday, April 18, 2023';
      }
    } as DateConstructor;
  });

  afterEach(() => {
    // Restore original Date
    // @ts-ignore - Restoring the Date constructor
    Date = originalDate;
  });

  it('should render with title, subtitle and score', () => {
    render(
      <MemeCard
        title="Quiz Champion!"
        subtitle="You got 5/5 correct. Are you secretly Google?"
        quizPack={mockQuizPack}
        scorePercent={100}
        backgroundPattern="bg-gradient-to-r from-yellow-400 to-yellow-600"
      />
    );

    // Check title and subtitle
    expect(screen.getByText('Quiz Champion!')).toBeDefined();
    expect(screen.getByText('You got 5/5 correct. Are you secretly Google?')).toBeDefined();
    
    // Check score
    expect(screen.getByText('100%')).toBeDefined();
    
    // Check quiz pack info
    expect(screen.getByText('Test Quiz')).toBeDefined();
    expect(screen.getByText('🧪')).toBeDefined();
    
    // Check date
    expect(screen.getByText('Tuesday, April 18, 2023')).toBeDefined();
    
    // Check footer text
    expect(screen.getByText('Daily Quiz & Meme Generator')).toBeDefined();
  });

  it('should apply different background patterns', () => {
    const { container, rerender } = render(
      <MemeCard
        title="Quiz Champion!"
        subtitle="You got 5/5 correct."
        quizPack={mockQuizPack}
        scorePercent={100}
        backgroundPattern="bg-gradient-to-r from-yellow-400 to-yellow-600"
      />
    );

    // Check if the yellow gradient is applied for high score
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain('bg-gradient-to-r');
    expect(element.className).toContain('from-yellow-400');
    expect(element.className).toContain('to-yellow-600');

    // Rerender with different background for medium score
    rerender(
      <MemeCard
        title="Not bad!"
        subtitle="You got 3/5 correct."
        quizPack={mockQuizPack}
        scorePercent={60}
        backgroundPattern="bg-gradient-to-r from-blue-400 to-indigo-500"
      />
    );

    // Check if the blue gradient is applied for medium score
    expect(element.className).toContain('bg-gradient-to-r');
    expect(element.className).toContain('from-blue-400');
    expect(element.className).toContain('to-indigo-500');
  });

  it('should render with minimum height', () => {
    const { container } = render(
      <MemeCard
        title="Quiz Champion!"
        subtitle="You got 5/5 correct."
        quizPack={mockQuizPack}
        scorePercent={100}
        backgroundPattern="bg-gradient-to-r from-yellow-400 to-yellow-600"
      />
    );

    // Check if minimum height is applied
    const style = (container.firstChild as HTMLElement).style;
    expect(style.minHeight).toBe('400px');
  });
}); 