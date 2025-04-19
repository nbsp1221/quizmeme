import { forwardRef } from 'preact/compat';
import { QuizPack } from '../types/quiz';

interface MemeCardProps {
  title: string;
  subtitle: string;
  quizPack: QuizPack;
  scorePercent: number;
  backgroundPattern: string;
}

const MemeCard = forwardRef<HTMLDivElement, MemeCardProps>((props, ref) => {
  const { title, subtitle, quizPack, scorePercent, backgroundPattern } = props;
  
  // Date in readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div 
      ref={ref}
      className={`${backgroundPattern} text-white rounded-lg overflow-hidden p-6 w-full max-w-md mx-auto`}
      style={{ minHeight: '400px' }}
    >
      <div className="flex flex-col items-center justify-between h-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-lg opacity-90">{subtitle}</p>
        </div>
        
        <div className="bg-white/20 p-4 rounded-lg w-full text-center mb-6">
          <div className="text-4xl font-bold mb-2">
            {scorePercent}%
          </div>
          <div className="text-xl">
            {quizPack.title}
          </div>
          <div className="text-lg opacity-80">
            {quizPack.emoji}
          </div>
        </div>
        
        <div className="text-center w-full">
          <div className="text-sm opacity-90 mb-2">
            {today}
          </div>
          <div className="text-xs opacity-75">
            Daily Quiz & Meme Generator
          </div>
        </div>
      </div>
    </div>
  );
});

export default MemeCard; 