import { FunctionComponent } from 'preact';
import { useStreak } from '../hooks/useStreak';

interface HeaderProps {
  streakCount: number;
}

const Header: FunctionComponent<HeaderProps> = ({ streakCount }) => {
  const { streakBadgeColor } = useStreak();
  
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span role="img" aria-label="Logo" className="text-3xl mr-2">
            🧠
          </span>
          <h1 className="text-xl font-bold">Daily Quiz & Meme</h1>
        </div>
        
        <div className="flex items-center">
          <div className="flex flex-col items-end">
            <div className={`${streakBadgeColor} text-white font-bold rounded-full px-3 py-1 text-sm`}>
              {streakCount} day streak
            </div>
            <span className="text-xs text-gray-500 mt-1">
              Come back daily to maintain your streak!
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 