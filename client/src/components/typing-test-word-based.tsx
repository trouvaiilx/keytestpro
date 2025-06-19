import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTypingTest } from "@/hooks/use-typing-test-word-based";
import { typingTexts } from "@/lib/typing-texts";

export default function TypingTest() {
  const [duration, setDuration] = useState(60);
  const [textType, setTextType] = useState<keyof typeof typingTexts>("common");
  
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
    inputRef
  } = useTypingTest();

  const handleStart = () => {
    const selectedText = textType === "quotes" ? typingTexts.quotes(duration) : typingTexts.common(duration);
    startTest(duration, selectedText);
  };

  const renderWordDisplay = () => {
    if (words.length === 0) return null;

    // Check if current word input is incorrect
    const currentWord = words[currentWordIndex];
    const isCurrentWordIncorrect = currentWord && currentInput.length > 0 && 
      !currentWord.startsWith(currentInput);

    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-600 min-h-48 flex flex-col justify-center">
        <div className="flex flex-wrap justify-center gap-4 items-center">
          {/* Completed words */}
          {completedWords.map((completedWord, index) => (
            <span 
              key={`completed-${index}`}
              className={`px-3 py-2 rounded-lg text-lg transition-all duration-300 ${
                completedWord.isCorrect 
                  ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
                  : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 line-through'
              }`}
            >
              {completedWord.word}
            </span>
          ))}
          
          {/* Current word - shows error in real-time */}
          {currentWordIndex < words.length && (
            <span 
              className={`text-3xl font-bold px-4 py-3 rounded-lg shadow-lg scale-110 transition-all duration-500 ease-in-out transform ${
                isCurrentWordIncorrect
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 animate-pulse'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
              }`}
              style={{
                animation: isCurrentWordIncorrect ? 'shake 0.5s ease-in-out' : undefined
              }}
            >
              {words[currentWordIndex]}
            </span>
          )}
          
          {/* Next few words */}
          {words.slice(currentWordIndex + 1, currentWordIndex + 6).map((word, index) => (
            <span 
              key={`upcoming-${index}`}
              className="text-lg text-gray-600 dark:text-gray-400 px-2 py-1 transition-all duration-300"
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Typing Speed Test</CardTitle>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Type each word and press Space to move to the next. No going back!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test display */}
          {renderWordDisplay()}

          {/* Input field - only visible during test */}
          {isTestActive && (
            <div className="flex justify-center">
              <Input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                placeholder={`Type: ${words[currentWordIndex] || ''}`}
                className="text-2xl p-6 w-96 text-center font-mono border-2 focus:border-blue-500 transition-all duration-200"
                autoFocus
              />
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.floor(testState.timeRemaining / 60)}:{(testState.timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {isTestFinished ? testState.finalWpm : testState.wpm}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">WPM</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {isTestFinished ? testState.finalAccuracy : testState.accuracy}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {testState.errors}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {testState.errors === 1 ? 'Error' : 'Errors'}
              </div>
            </div>
          </div>

          {/* Controls */}
          {!isTestActive && !isTestFinished && (
            <div className="flex flex-wrap justify-center gap-4 items-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Duration:</label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 seconds</SelectItem>
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
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Start Test
              </Button>
            </div>
          )}

          {/* Reset button */}
          {(isTestActive || isTestFinished) && (
            <div className="flex justify-center">
              <Button
                onClick={resetTest}
                variant="outline"
                size="lg"
                className="px-8"
              >
                {isTestFinished ? 'Take Another Test' : 'Reset Test'}
              </Button>
            </div>
          )}

          {/* Animated Results Screen */}
          {isTestFinished && (
            <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-8 rounded-xl border-2 border-blue-200 dark:border-blue-700 animate-in slide-in-from-bottom duration-700">
              <div className="text-center">
                {/* Celebration Header */}
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-2 animate-in fade-in duration-1000 delay-300">
                    🎉 Test Complete! 🎉
                  </h3>
                  <div className="text-lg text-gray-600 dark:text-gray-400 animate-in fade-in duration-1000 delay-500">
                    {testState.finalWpm >= 40 ? "Excellent typing speed!" :
                     testState.finalWpm >= 25 ? "Good job! Keep practicing!" :
                     "Great start! Practice makes perfect!"}
                  </div>
                </div>
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-in zoom-in delay-700">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {testState.finalWpm}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Words Per Minute</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {testState.finalWpm >= 40 ? "🚀 Expert" :
                       testState.finalWpm >= 25 ? "⭐ Intermediate" : "🌱 Beginner"}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-in zoom-in delay-900">
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {testState.finalAccuracy}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Accuracy</div>
                    <div className="mt-2 text-xs text-gray-500">
                      {testState.finalAccuracy >= 95 ? "🎯 Perfect" :
                       testState.finalAccuracy >= 85 ? "✨ Great" : "📈 Improving"}
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-in zoom-in delay-1100">
                    <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {completedWords.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Words Typed</div>
                    <div className="mt-2 text-xs text-gray-500">
                      with {testState.errors} {testState.errors === 1 ? 'error' : 'errors'}
                    </div>
                  </div>
                </div>
                
                {/* Performance Badge */}
                <div className="animate-in fade-in duration-1000 delay-1300">
                  {testState.finalWpm >= 40 && testState.finalAccuracy >= 95 && (
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce">
                      🏆 Typing Master!
                    </div>
                  )}
                  {testState.finalWpm >= 25 && testState.finalAccuracy >= 85 && testState.finalWpm < 40 && (
                    <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                      ⭐ Well Done!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}