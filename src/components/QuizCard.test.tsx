import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import QuizCard from './QuizCard';
import * as storage from '../utils/storage';

// Mock the storage utilities and child components
vi.mock('../utils/storage', () => ({
  hasCompletedTodaysQuiz: vi.fn(),
}));

vi.mock('./QuizGame', () => ({
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="quiz-game-mock">
      <button onClick={onComplete}>Complete Quiz</button>
    </div>
  ),
}));

vi.mock('./QuizResult', () => ({
  default: ({ onReset }: { onReset: () => void }) => (
    <div data-testid="quiz-result-mock">
      <button onClick={onReset}>Reset Quiz</button>
    </div>
  ),
}));

describe('QuizCard', () => {
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
      {
        id: 'q2',
        text: 'Test question 2?',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOptionIndex: 1,
      },
    ],
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.hasCompletedTodaysQuiz).mockReturnValue(false);
  });
  
  it('should render in normal mode with quiz details', () => {
    render(<QuizCard quizPack={mockQuizPack} />);
    
    // Check if the quiz title and description are rendered
    expect(screen.getByText('Test Quiz')).toBeDefined();
    expect(screen.getByText('A test quiz description')).toBeDefined();
    expect(screen.getByText('🧪')).toBeDefined();
    
    // Check if the quiz start button is rendered with correct text
    const startButton = screen.getByRole('button', { name: 'Start Quiz' });
    expect(startButton).toBeDefined();
    
    // Check if the questions count badge is displayed
    expect(screen.getByText('2 questions')).toBeDefined();
  });
  
  it('should render in compact mode with minimal details', () => {
    render(<QuizCard quizPack={mockQuizPack} compact={true} />);
    
    // Check if the quiz title is rendered
    expect(screen.getByText('Test Quiz')).toBeDefined();
    
    // Check if the view button is rendered
    const viewButton = screen.getByRole('button', { name: 'View Quiz →' });
    expect(viewButton).toBeDefined();
    
    // Compact mode should not show the start quiz button
    expect(screen.queryByRole('button', { name: 'Start Quiz' })).toBeNull();
  });
  
  it('should show "Retake Quiz" if quiz was already completed', () => {
    // Mock that the quiz was already completed
    vi.mocked(storage.hasCompletedTodaysQuiz).mockReturnValue(true);
    
    render(<QuizCard quizPack={mockQuizPack} />);
    
    // Check if the quiz title and description are rendered
    expect(screen.getByText('Test Quiz')).toBeDefined();
    
    // Check if "Completed" text is shown
    expect(screen.getByText('✓ Completed')).toBeDefined();
    
    // Check if the button says "Retake Quiz" instead of "Start Quiz"
    const retakeButton = screen.getByRole('button', { name: 'Retake Quiz' });
    expect(retakeButton).toBeDefined();
  });
  
  it('should start quiz when start button is clicked', () => {
    render(<QuizCard quizPack={mockQuizPack} />);
    
    // Click the start button
    const startButton = screen.getByRole('button', { name: 'Start Quiz' });
    fireEvent.click(startButton);
    
    // Check if the QuizGame component is rendered
    expect(screen.getByTestId('quiz-game-mock')).toBeDefined();
    
    // The QuizCard content should not be visible anymore
    expect(screen.queryByText('Start Quiz')).toBeNull();
  });
  
  it('should show quiz result when game is completed', () => {
    render(<QuizCard quizPack={mockQuizPack} />);
    
    // Click the start button
    const startButton = screen.getByRole('button', { name: 'Start Quiz' });
    fireEvent.click(startButton);
    
    // Complete the quiz
    const completeButton = screen.getByRole('button', { name: 'Complete Quiz' });
    fireEvent.click(completeButton);
    
    // Check if the QuizResult component is rendered
    expect(screen.getByTestId('quiz-result-mock')).toBeDefined();
  });
  
  it('should reset to quiz card when reset button is clicked', () => {
    render(<QuizCard quizPack={mockQuizPack} />);
    
    // Start quiz
    const startButton = screen.getByRole('button', { name: 'Start Quiz' });
    fireEvent.click(startButton);
    
    // Complete quiz
    const completeButton = screen.getByRole('button', { name: 'Complete Quiz' });
    fireEvent.click(completeButton);
    
    // Reset quiz
    const resetButton = screen.getByRole('button', { name: 'Reset Quiz' });
    fireEvent.click(resetButton);
    
    // Check if we're back to the QuizCard initial state
    expect(screen.getByRole('button', { name: 'Start Quiz' })).toBeDefined();
  });
}); 