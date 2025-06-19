import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import KeyboardTester from "@/components/keyboard-tester";
import TypingTest from "@/components/typing-test-word-based";

export default function Home() {
  const [currentMode, setCurrentMode] = useState<"keyboard" | "typing">("keyboard");
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KeyTest Pro
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Professional Typing & Keyboard Tester
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mode Selector */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setCurrentMode("keyboard")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentMode === "keyboard"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Keyboard Tester
            </Button>
            <Button
              onClick={() => setCurrentMode("typing")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                currentMode === "typing"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Typing Test
            </Button>
          </div>
        </div>

        {/* Content */}
        {currentMode === "keyboard" ? <KeyboardTester /> : <TypingTest />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">
                &copy; 2025 KeyTest Pro. Professional typing and keyboard testing platform.
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                About
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
