import { JSX } from 'preact';
import { useQuiz } from '../hooks/useQuiz';
import { QuizPack } from '../types/quiz';
import { useAds } from '../hooks/useAds';

interface QuizGameProps {
  quizPack: QuizPack;
  onComplete: () => void;
}

const QuizGame = ({ quizPack, onComplete }: QuizGameProps): JSX.Element => {
  const {
    isStarted,
    isCompleted,
    currentQuestion,
    progressPercentage,
    timerPercentage,
    startQuiz,
    handleAnswer
  } = useQuiz(quizPack);
  
  const { showInterstitial } = useAds();
  
  // Start the quiz when component mounts
  if (!isStarted) {
    startQuiz();
  }
  
  // When completed, show interstitial ad and notify parent
  if (isCompleted) {
    showInterstitial();
    onComplete();
  }
  
  // If no current question, show loading
  if (!currentQuestion) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto mb-4"></div>
          <div className="h-24 bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex justify-center space-x-4">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Question {progressPercentage / 20 + 1} of {quizPack.questions.length}</span>
          <span className="text-sm bg-blue-500 px-2 py-1 rounded-full">{Math.round(timerPercentage)}%</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-blue-800 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Timer */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-6">
          <div
            className={`h-1 rounded-full ${
              timerPercentage > 50
                ? 'bg-green-500'
                : timerPercentage > 20
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          ></div>
        </div>
        
        {/* Question text */}
        <h3 className="text-xl font-bold mb-6">{currentQuestion.text}</h3>
        
        {/* Answer options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="p-4 border border-gray-300 rounded-lg text-left hover:bg-blue-50 hover:border-blue-300 transition duration-150"
            >
              <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-center mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizGame; 