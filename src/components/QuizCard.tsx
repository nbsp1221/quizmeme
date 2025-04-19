import { useState } from 'preact/hooks';
import { JSX } from 'preact';
import { QuizPack } from '../types/quiz';
import { hasCompletedTodaysQuiz } from '../utils/storage';
import QuizGame from './QuizGame';
import QuizResult from './QuizResult';

interface QuizCardProps {
  quizPack: QuizPack;
  compact?: boolean;
}

const QuizCard = ({ quizPack, compact = false }: QuizCardProps): JSX.Element => {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const alreadyCompleted = hasCompletedTodaysQuiz(quizPack.id);
  
  const startQuiz = () => {
    setIsGameStarted(true);
    setIsGameCompleted(false);
  };
  
  const handleQuizComplete = () => {
    setIsGameCompleted(true);
  };
  
  const resetQuiz = () => {
    setIsGameStarted(false);
    setIsGameCompleted(false);
  };
  
  // If the quiz is in progress, show the game component
  if (isGameStarted && !isGameCompleted) {
    return <QuizGame quizPack={quizPack} onComplete={handleQuizComplete} />;
  }
  
  // If the quiz is completed, show the result component
  if (isGameCompleted) {
    return <QuizResult quizPack={quizPack} onReset={resetQuiz} />;
  }
  
  // Otherwise, show the quiz card
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${compact ? 'h-48' : ''}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <span className="text-2xl mr-2">{quizPack.emoji}</span>
            {quizPack.title}
          </h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {quizPack.questions.length} questions
          </span>
        </div>
        
        <p className="text-gray-600 mb-4">{quizPack.description}</p>
        
        {!compact && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {alreadyCompleted ? (
                <span className="text-green-600 font-medium">✓ Completed</span>
              ) : (
                <span>Takes about 1 minute</span>
              )}
            </div>
            
            <button
              onClick={startQuiz}
              className={`px-4 py-2 rounded-lg font-medium ${
                alreadyCompleted
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {alreadyCompleted ? 'Retake Quiz' : 'Start Quiz'}
            </button>
          </div>
        )}
        
        {compact && (
          <div className="flex justify-end mt-2">
            <button
              onClick={startQuiz}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View Quiz →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCard; 