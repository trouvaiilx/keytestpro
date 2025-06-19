import { useState, useCallback, useEffect, useRef } from "react";

interface TestState {
  timeRemaining: number;
  duration: number;
  wpm: number;
  accuracy: number;
  errors: number;
  correctChars: number;
  totalChars: number;
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
    finalWpm: 0,
    finalAccuracy: 100,
    startTime: null,
    isStarted: false,
  });
  
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [completedWords, setCompletedWords] = useState<{ word: string; isCorrect: boolean }[]>([]);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    setCurrentInput("");
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
      finalWpm: 0,
      finalAccuracy: 100,
      startTime: null,
      isStarted: false,
    });
    
    // Auto-focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTestActive(false);
    setIsTestFinished(false);
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCompletedWords([]);
    setTestState(prev => ({
      ...prev,
      timeRemaining: prev.duration,
      wpm: 0,
      accuracy: 100,
      errors: 0,
      correctChars: 0,
      totalChars: 0,
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
    
    // Check if user pressed space (completed word)
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const targetWord = words[currentWordIndex];
      
      if (targetWord) {
        const isCorrect = typedWord === targetWord;
        
        // Add to completed words
        setCompletedWords(prev => [...prev, { word: typedWord, isCorrect }]);
        
        // Move to next word and clear input
        setCurrentWordIndex(prev => prev + 1);
        setCurrentInput("");
        
        // Update statistics
        setTestState(prev => {
          const newTotalChars = prev.totalChars + targetWord.length + 1; // +1 for space
          const newCorrectChars = prev.correctChars + (isCorrect ? targetWord.length + 1 : 0);
          const newErrors = prev.errors + (isCorrect ? 0 : 1); // Count as 1 error per incorrect word
          const accuracy = newTotalChars > 0 ? Math.round((newCorrectChars / newTotalChars) * 100) : 100;
          
          // Calculate WPM - prevent division by zero when test finishes
          let wpm = prev.wpm; // Keep previous WPM if calculation fails
          if (prev.startTime) {
            const elapsedMinutes = (Date.now() - prev.startTime) / 60000;
            if (elapsedMinutes > 0) {
              wpm = Math.round((newCorrectChars / 5) / elapsedMinutes);
            }
          }
          
          return {
            ...prev,
            wpm,
            accuracy,
            errors: newErrors,
            correctChars: newCorrectChars,
            totalChars: newTotalChars,
          };
        });
        
        // Check if test is complete
        if (currentWordIndex + 1 >= words.length) {
          setIsTestActive(false);
          setIsTestFinished(true);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        }
      }
    } else {
      // Update current input and real-time WPM
      setCurrentInput(value);
      
      // Real-time WPM calculation
      if (testState.isStarted && testState.startTime) {
        const elapsedMinutes = (Date.now() - testState.startTime) / 60000;
        if (elapsedMinutes > 0) {
          const currentCorrectChars = testState.correctChars;
          const wpm = Math.round((currentCorrectChars / 5) / elapsedMinutes);
          setTestState(prev => ({ ...prev, wpm }));
        }
      }
    }
  }, [isTestActive, words, currentWordIndex, testState.startTime, testState.isStarted, testState.correctChars, startTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    testState,
    words,
    currentWordIndex,
    currentInput,
    completedWords,
    isTestActive,
    isTestFinished,
    startTest: setupTest,
    resetTest,
    handleInputChange,
    inputRef,
  };
}