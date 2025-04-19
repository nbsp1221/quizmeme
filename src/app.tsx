import { useState, useEffect } from 'preact/hooks';
import { QuizPack } from './types/quiz';
import { getTodaysQuiz, getAvailableQuizPacks } from './data/quizData';
import QuizCard from './components/QuizCard';
import Header from './components/Header';
import Footer from './components/Footer';
import OfflineNotice from './components/OfflineNotice';
import { useStreak } from './hooks/useStreak';
import { useAds } from './hooks/useAds';

export function App() {
  const [todaysQuiz, setTodaysQuiz] = useState<QuizPack | undefined>(undefined);
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizPack[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { streak } = useStreak();
  const { initBannerAd } = useAds();
  
  // Load today's quiz and available quizzes
  useEffect(() => {
    const fetchQuizzes = () => {
      const todaysPack = getTodaysQuiz();
      const availablePacks = getAvailableQuizPacks();
      
      setTodaysQuiz(todaysPack);
      setAvailableQuizzes(availablePacks);
    };
    
    fetchQuizzes();
    
    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Initialize ads after component mounts
  useEffect(() => {
    // Initialize banner ad at the bottom of the page
    setTimeout(() => {
      initBannerAd('footer-ad-container');
    }, 2000); // Delay ad initialization for better user experience
  }, [initBannerAd]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header streakCount={streak.currentStreak} />
      
      <main className="flex-grow max-w-4xl w-full mx-auto p-4">
        {!isOnline && <OfflineNotice />}
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Today's Quiz</h2>
          {todaysQuiz ? (
            <QuizCard quizPack={todaysQuiz} />
          ) : (
            <div className="p-6 bg-white rounded-lg shadow-md text-center">
              <p className="text-gray-500">No quiz available for today yet. Check back later!</p>
            </div>
          )}
        </section>
        
        {availableQuizzes.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">Previous Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableQuizzes
                .filter(quiz => quiz.id !== todaysQuiz?.id)
                .map(quiz => (
                  <QuizCard key={quiz.id} quizPack={quiz} compact />
                ))}
            </div>
          </section>
        )}
      </main>
      
      <div id="footer-ad-container" className="w-full max-w-sm mx-auto my-4 h-[250px] bg-gray-200 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Advertisement</p>
      </div>
      
      <Footer />
    </div>
  );
}
