import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTypingTest } from "@/hooks/use-typing-test-word-based";
import { typingTexts } from "@/lib/typing-texts";

export default function TypingTest() {
  const [duration, setDuration] = useState(60);
  const [textType, setTextType] = useState<keyof typeof typingTexts>("common");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    testState,
    words,
    currentWordIndex,
    currentInput,
    completedWords,
    handleInputChange,
    startTest,
    resetTest,
    isTestActive,
    isTestFinished,
    inputRef: hookInputRef
  } = useTypingTest();

  const handleStart = () => {
    const selectedText = textType === "quotes" ? typingTexts.quotes(duration) : typingTexts.common(duration);
    startTest(duration, selectedText);
  };

  const renderTextDisplay = () => {
    if (!currentText) return null;

    const words = currentText.split(' ');
    let charIndex = 0;
    let currentWordIndex = 0;
    
    // Find which word we're currently typing
    let tempIndex = 0;
    for (let i = 0; i < words.length; i++) {
      if (tempIndex + words[i].length >= userInput.length) {
        currentWordIndex = i;
        break;
      }
      tempIndex += words[i].length + 1; // +1 for space
    }

    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 min-h-48 flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {words.map((word, wordIndex) => {
            const wordStartIndex = charIndex;
            const wordEndIndex = charIndex + word.length;
            let wordClassName = "relative px-3 py-2 rounded-lg transition-all duration-300 ease-in-out";
            
            // Current word styling
            if (wordIndex === currentWordIndex) {
              wordClassName += " text-2xl font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 scale-110 shadow-lg";
            } else if (wordIndex < currentWordIndex) {
              // Completed words
              const wordTyped = userInput.slice(wordStartIndex, wordEndIndex);
              if (wordTyped === word) {
                wordClassName += " text-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
              } else {
                wordClassName += " text-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 line-through";
              }
            } else {
              // Future words
              wordClassName += " text-lg text-gray-400 dark:text-gray-500";
            }

            // Update charIndex for next word
            charIndex = wordEndIndex + 1; // +1 for space

            return (
              <span key={wordIndex} className={wordClassName}>
                {word}
              </span>
            );
          })}
        </div>
        
        {/* Character-level feedback for current word */}
        {currentWordIndex < words.length && (
          <div className="mt-6 text-center">
            <div className="inline-flex bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600">
              {words[currentWordIndex].split('').map((char, charIdx) => {
                const globalCharIndex = words.slice(0, currentWordIndex).join(' ').length + (currentWordIndex > 0 ? 1 : 0) + charIdx;
                let charClassName = "text-xl font-mono ";
                
                if (globalCharIndex < userInput.length) {
                  if (userInput[globalCharIndex] === char) {
                    charClassName += "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
                  } else {
                    charClassName += "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 line-through";
                  }
                } else if (globalCharIndex === userInput.length) {
                  charClassName += "bg-blue-500 text-white animate-pulse";
                } else {
                  charClassName += "text-gray-400 dark:text-gray-500";
                }

                return (
                  <span key={charIdx} className={`${charClassName} px-1 py-0.5 rounded`}>
                    {char}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const progress = testState.duration > 0 ? ((testState.duration - testState.timeRemaining) / testState.duration) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Test Configuration */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Typing Speed Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Duration:</label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Text Type:</label>
              <Select value={textType} onValueChange={(value) => setTextType(value as keyof typeof typingTexts)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="common">Common Words</SelectItem>
                  <SelectItem value="quotes">Famous Quotes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleStart}
              disabled={isTestActive}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Display */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardContent className="p-8">
          {/* Timer and Stats */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{testState.timeRemaining}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">seconds</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{testState.wpm}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{testState.accuracy}%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">accuracy</div>
              </div>
            </div>
            <Button
              onClick={resetTest}
              variant="outline"
              className="bg-gray-500 hover:bg-gray-600 text-white border-none"
            >
              Reset
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Text Display */}
          <div className="mb-6">
            {renderTextDisplay()}
          </div>

          {/* Input Area */}
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={isTestActive ? "Start typing..." : "Click 'Start Test' to begin"}
              value={userInput}
              onChange={handleInputChange}
              disabled={!isTestActive}
              className="w-full px-4 py-3 text-lg border-2 focus:border-blue-600 dark:focus:border-blue-500 caret-transparent"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      {isTestFinished && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                <div className="text-4xl font-bold text-green-600">{testState.finalWpm}</div>
                <div className="text-sm text-green-700 dark:text-green-300 mt-2">Words Per Minute</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                <div className="text-4xl font-bold text-blue-600">{testState.finalAccuracy}%</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-2">Accuracy</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                <div className="text-4xl font-bold text-purple-600">{testState.correctChars}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 mt-2">Correct Characters</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg">
                <div className="text-4xl font-bold text-red-600">{testState.errors}</div>
                <div className="text-sm text-red-700 dark:text-red-300 mt-2">Errors Made</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={handleStart}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={() => {
                  const text = `I just completed a typing test! WPM: ${testState.finalWpm}, Accuracy: ${testState.finalAccuracy}% 🚀`;
                  navigator.clipboard?.writeText(text);
                }}
                variant="outline"
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white border-none"
              >
                Share Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
