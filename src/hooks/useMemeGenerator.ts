import { useState, useRef } from 'preact/hooks';
import html2canvas from 'html2canvas';
import { QuizResult, QuizPack } from '../types/quiz';

export function useMemeGenerator(quizResult: QuizResult | null, quizPack: QuizPack | undefined) {
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const memeRef = useRef<HTMLDivElement | null>(null);
  
  // Generate meme-ready statements based on score
  const getMemeText = (): { title: string; subtitle: string } => {
    if (!quizResult || !quizPack) {
      return { title: 'Quiz not completed', subtitle: 'Try again!' };
    }
    
    const score = quizResult.totalCorrect;
    const total = quizPack.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    // Different text based on score
    if (percentage >= 90) {
      return {
        title: 'Quiz Champion!',
        subtitle: `You got ${score}/${total} correct. Are you secretly Google?`
      };
    } else if (percentage >= 70) {
      return {
        title: 'Quiz Wizard!',
        subtitle: `You got ${score}/${total} correct. Pretty impressive!`
      };
    } else if (percentage >= 50) {
      return {
        title: 'Not bad!',
        subtitle: `You got ${score}/${total} correct. Room for improvement!`
      };
    } else if (percentage >= 30) {
      return {
        title: 'Nice try!',
        subtitle: `You got ${score}/${total} correct. Maybe read more Wikipedia?`
      };
    } else {
      return {
        title: 'Oops!',
        subtitle: `You got ${score}/${total} correct. At least you're honest!`
      };
    }
  };
  
  // Generate a background pattern based on score
  const getBackgroundPattern = (): string => {
    if (!quizResult || !quizPack) return 'bg-gradient-to-r from-blue-500 to-purple-500';
    
    const score = quizResult.totalCorrect;
    const total = quizPack.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    if (percentage >= 90) {
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    } else if (percentage >= 70) {
      return 'bg-gradient-to-r from-green-400 to-blue-500';
    } else if (percentage >= 50) {
      return 'bg-gradient-to-r from-blue-400 to-indigo-500';
    } else if (percentage >= 30) {
      return 'bg-gradient-to-r from-purple-400 to-pink-500';
    } else {
      return 'bg-gradient-to-r from-red-400 to-pink-500';
    }
  };
  
  // Generate meme image from the meme card component
  const generateMeme = async (): Promise<void> => {
    if (!memeRef.current || !quizResult || !quizPack) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(memeRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null,
        logging: false
      });
      
      const image = canvas.toDataURL('image/png');
      setMemeImage(image);
      
      // Create blob for sharing
      const blob = await (await fetch(image)).blob();
      const imageFile = new File([blob], 'quiz-meme.png', { type: 'image/png' });
      
      // Create a share URL if the Web Share API is available
      if ('share' in navigator && 'canShare' in navigator && navigator.canShare({ files: [imageFile] })) {
        setShareUrl('native');
      } else {
        setShareUrl(image);
      }
    } catch (error) {
      console.error('Error generating meme:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Share the meme using the Web Share API or fallback to download
  const shareMeme = async (): Promise<void> => {
    if (!memeImage) return;
    
    try {
      // Try to use the Web Share API
      if (shareUrl === 'native' && 'share' in navigator) {
        const blob = await (await fetch(memeImage)).blob();
        const imageFile = new File([blob], 'quiz-meme.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'My Daily Quiz Result',
          text: 'Check out my quiz result!',
          files: [imageFile]
        });
      } else {
        // Fallback: download the image
        const link = document.createElement('a');
        link.href = memeImage;
        link.download = 'quiz-meme.png';
        link.click();
      }
    } catch (error) {
      console.error('Error sharing meme:', error);
    }
  };
  
  return {
    memeRef,
    memeImage,
    isGenerating,
    generateMeme,
    shareMeme,
    memeText: getMemeText(),
    backgroundPattern: getBackgroundPattern()
  };
} 