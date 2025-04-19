import { useEffect, useState } from 'preact/hooks';
import { QuizPack, QuizQuestion, QuizResult, QuizAnswer } from '../types/quiz';
import { saveQuizResult, hasCompletedTodaysQuiz } from '../utils/storage';

export function useQuiz(quizPack: QuizPack | undefined) {
  // Quiz states
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalTimeMs, setTotalTimeMs] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  // Timer state
  const QUESTION_TIME_LIMIT_MS = 12000; // 12 seconds per question
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT_MS);
  const [timerActive, setTimerActive] = useState(false);
  
  // Reset when quiz pack changes
  useEffect(() => {
    if (quizPack) {
      // Check if user already completed this quiz
      const completed = hasCompletedTodaysQuiz(quizPack.id);
      setAlreadyCompleted(completed);
    }
  }, [quizPack]);
  
  // Timer effect
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(prev => Math.max(0, prev - 100));
        
        // Auto-submit when time runs out
        if (timeLeft <= 100) {
          handleTimeout();
        }
      }, 100);
    }
    
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [timerActive, timeLeft]);
  
  const startQuiz = () => {
    if (!quizPack) return;
    
    setIsStarted(true);
    setIsCompleted(false);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTotalCorrect(0);
    setTotalTimeMs(0);
    setTimeLeft(QUESTION_TIME_LIMIT_MS);
    setTimerActive(true);
    setQuestionStartTime(Date.now());
  };
  
  const handleAnswer = (selectedOptionIndex: number) => {
    if (!quizPack) return;
    
    const currentQuestion = quizPack.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Stop timer
    setTimerActive(false);
    
    // Calculate time spent
    const timeSpentMs = Date.now() - questionStartTime;
    const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
    
    // Record answer
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex,
      isCorrect,
      timeSpentMs
    };
    
    // Update answers and stats
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setTotalTimeMs(prev => prev + timeSpentMs);
    
    if (isCorrect) {
      setTotalCorrect(prev => prev + 1);
    }
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < (quizPack.questions.length - 1)) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT_MS);
      setTimerActive(true);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz(newAnswers);
    }
  };
  
  const handleTimeout = () => {
    if (!quizPack) return;
    
    const currentQuestion = quizPack.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Stop timer
    setTimerActive(false);
    
    // Record timed-out answer (auto-incorrect)
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: -1, // -1 represents timeout/no selection
      isCorrect: false,
      timeSpentMs: QUESTION_TIME_LIMIT_MS
    };
    
    // Update answers and stats
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setTotalTimeMs(prev => prev + QUESTION_TIME_LIMIT_MS);
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < (quizPack.questions.length - 1)) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT_MS);
      setTimerActive(true);
      setQuestionStartTime(Date.now());
    } else {
      completeQuiz(newAnswers);
    }
  };
  
  const completeQuiz = (finalAnswers: QuizAnswer[]) => {
    if (!quizPack) return;
    
    setIsCompleted(true);
    setTimerActive(false);
    
    // Calculate final stats
    const correctCount = finalAnswers.filter(a => a.isCorrect).length;
    const totalTime = finalAnswers.reduce((total, a) => total + a.timeSpentMs, 0);
    
    // Create result object
    const result: QuizResult = {
      packId: quizPack.id,
      date: new Date().toISOString(),
      answers: finalAnswers,
      totalCorrect: correctCount,
      totalTimeMs: totalTime,
      streakMaintained: true // Always true for a completed quiz
    };
    
    // Save to localStorage
    saveQuizResult(result);
    setQuizResult(result);
  };
  
  const getCurrentQuestion = (): QuizQuestion | undefined => {
    if (!quizPack) return undefined;
    return quizPack.questions[currentQuestionIndex];
  };
  
  const getProgressPercentage = (): number => {
    if (!quizPack) return 0;
    return Math.round((currentQuestionIndex / quizPack.questions.length) * 100);
  };
  
  const getTimerPercentage = (): number => {
    return Math.round((timeLeft / QUESTION_TIME_LIMIT_MS) * 100);
  };
  
  return {
    // State
    isStarted,
    isCompleted,
    currentQuestionIndex,
    answers,
    totalCorrect,
    totalTimeMs,
    alreadyCompleted,
    quizResult,
    timeLeft,
    
    // Computed
    currentQuestion: getCurrentQuestion(),
    progressPercentage: getProgressPercentage(),
    timerPercentage: getTimerPercentage(),
    
    // Actions
    startQuiz,
    handleAnswer,
  };
} 