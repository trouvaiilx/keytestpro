import { useState, useCallback, useEffect, useRef } from "react";

interface TestState {
  timeRemaining: number;
  duration: number;
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalChars: number;
  maxCharsTyped: number;
  finalWpm: number;
  finalAccuracy: number;
  startTime: number | null;
  isStarted: boolean;
}

export function useTypingTest() {
  const [testState, setTestState] = useState<TestState>({
    timeRemaining: 60,
    duration: 60,
    wpm: 0,
    accuracy: 100,
    errors: 0,
    correctChars: 0,
    totalChars: 0,
    maxCharsTyped: 0,
    finalWpm: 0,
    finalAccuracy: 100,
    startTime: null,
    isStarted: false,
  });
  
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentWordTyped, setCurrentWordTyped] = useState<string>("");
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    
    const startTime = Date.now();
    setTestState(prev => ({ ...prev, startTime, isStarted: true }));
    
    timerRef.current = setInterval(() => {
      setTestState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          setIsTestActive(false);
          setIsTestFinished(true);
          
          return {
            ...prev,
            timeRemaining: 0,
            finalWpm: prev.wpm,
            finalAccuracy: prev.accuracy,
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);
  }, []);

  const setupTest = useCallback((duration: number, text: string) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    const wordList = text.split(' ');
    setWords(wordList);
    setCurrentWordIndex(0);
    setCurrentWordTyped("");
    setCompletedWords([]);
    setIsTestActive(true);
    setIsTestFinished(false);
    setTestState({
      timeRemaining: duration,
      duration,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      maxCharsTyped: 0,
      finalWpm: 0,
      finalAccuracy: 100,
      startTime: null,
      isStarted: false,
    });
  }, []);

  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTestActive(false);
    setIsTestFinished(false);
    setCurrentWordTyped("");
    setCurrentWordIndex(0);
    setCompletedWords([]);
    setTestState(prev => ({
      ...prev,
      timeRemaining: prev.duration,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
      maxCharsTyped: 0,
      startTime: null,
      isStarted: false,
    }));
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isTestActive) return;
    
    const value = event.target.value;
    
    // Start timer on first keystroke
    if (!testState.isStarted && value.length > 0) {
      startTimer();
    }
    
    // For now, keep compatibility with the old system
    const currentText = words.join(' ');
    
    // Calculate accuracy that never recovers from mistakes
    let correctChars = 0;
    
    for (let i = 0; i < value.length && i < currentText.length; i++) {
      if (value[i] === currentText[i]) {
        correctChars++;
      }
    }
    
    setTestState(prev => {
      // Track the maximum characters ever typed (accuracy never recovers)
      const newMaxCharsTyped = Math.max(prev.maxCharsTyped, value.length);
      const newCorrectChars = Math.max(prev.correctChars, correctChars);
      const newErrors = newMaxCharsTyped - newCorrectChars;
      
      // Accuracy based on maximum characters ever attempted
      const accuracy = newMaxCharsTyped > 0 ? Math.round((newCorrectChars / newMaxCharsTyped) * 100) : 100;
      
      // Calculate WPM (assuming average word length of 5 characters)
      let wpm = 0;
      if (prev.startTime) {
        const elapsedMinutes = (Date.now() - prev.startTime) / 60000;
        wpm = elapsedMinutes > 0 ? Math.round((correctChars / 5) / elapsedMinutes) : 0;
      }
      
      return {
        ...prev,
        wpm: wmp,
        accuracy,
        errors: newErrors,
        correctChars: newCorrectChars,
        totalChars: value.length,
        maxCharsTyped: newMaxCharsTyped,
      };
    });
  }, [isTestActive, words, testState.startTime, testState.isStarted, startTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-finish test when all text is typed
  useEffect(() => {
    if (isTestActive && userInput.length >= currentText.length && currentText.length > 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsTestActive(false);
      setIsTestFinished(true);
      setTestState(prev => ({
        ...prev,
        finalWpm: prev.wpm,
        finalAccuracy: prev.accuracy,
      }));
    }
  }, [userInput, currentText, isTestActive]);

  return {
    testState,
    currentText,
    userInput,
    currentCharIndex,
    isTestActive,
    isTestFinished,
    startTest: setupTest,
    resetTest,
    handleInputChange,
  };
}
