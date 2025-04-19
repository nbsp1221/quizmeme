import { JSX } from 'preact';
import { useState } from 'preact/hooks';
import { QuizPack } from '../types/quiz';
import { useQuiz } from '../hooks/useQuiz';
import { useMemeGenerator } from '../hooks/useMemeGenerator';
import MemeCard from './MemeCard';

interface QuizResultProps {
  quizPack: QuizPack;
  onReset: () => void;
}

const QuizResult = ({ quizPack, onReset }: QuizResultProps): JSX.Element => {
  const { quizResult, totalCorrect } = useQuiz(quizPack);
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    memeRef,
    memeImage,
    isGenerating,
    generateMeme,
    shareMeme,
    memeText,
    backgroundPattern
  } = useMemeGenerator(quizResult, quizPack);
  
  // Calculate score percentage
  const scorePercentage = quizResult ? 
    Math.round((quizResult.totalCorrect / quizPack.questions.length) * 100) : 0;
  
  // Generate time string (e.g., "32.4 seconds")
  const timeString = quizResult ? 
    `${(quizResult.totalTimeMs / 1000).toFixed(1)} seconds` : '';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`${backgroundPattern} text-white p-6 text-center`}>
        <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
        <div className="text-3xl font-bold mb-4">
          {totalCorrect} / {quizPack.questions.length} Correct
        </div>
        <div className="flex justify-center items-center space-x-2 mb-2">
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {scorePercentage}% Score
          </div>
          <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
            {timeString}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Generate Meme Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Share Your Result</h3>
          
          {!memeImage ? (
            <div className="mb-4">
              <MemeCard
                ref={memeRef}
                title={memeText.title}
                subtitle={memeText.subtitle}
                quizPack={quizPack}
                scorePercent={scorePercentage}
                backgroundPattern={backgroundPattern}
              />
              
              <button
                onClick={generateMeme}
                disabled={isGenerating}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isGenerating ? 'Generating...' : 'Generate Shareable Meme'}
              </button>
            </div>
          ) : (
            <div className="mb-4 text-center">
              <img
                src={memeImage}
                alt="Quiz Result Meme"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
              
              <div className="flex mt-4 space-x-2 justify-center">
                <button
                  onClick={shareMeme}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700"
                >
                  Share Result
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300"
                >
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Quiz Details */}
        {showDetails && quizResult && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Question Details</h3>
            <div className="space-y-3">
              {quizResult.answers.map((answer, index) => {
                const question = quizPack.questions.find(q => q.id === answer.questionId);
                if (!question) return null;
                
                return (
                  <div key={question.id} className="border rounded-lg p-3">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Question {index + 1}</span>
                      <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p className="mb-2">{question.text}</p>
                    <div className="text-sm">
                      <span className="text-gray-600">Your answer: </span>
                      {answer.selectedOptionIndex >= 0 ? 
                        question.options[answer.selectedOptionIndex] : 
                        'Timed out'}
                    </div>
                    {!answer.isCorrect && (
                      <div className="text-sm text-green-600 mt-1">
                        <span className="text-gray-600">Correct answer: </span>
                        {question.options[question.correctOptionIndex]}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      Time: {(answer.timeSpentMs / 1000).toFixed(1)}s
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={onReset}
            className="bg-gray-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-900"
          >
            Return to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult; 