import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VirtualKeyboard from "./virtual-keyboard";
import { useKeyboard } from "@/hooks/use-keyboard";

export default function KeyboardTester() {
  const { keyLog, clearKeyLog } = useKeyboard();
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new log entries are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [keyLog]);

  return (
    <div className="space-y-8">
      {/* Instructions */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Keyboard Functionality Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Press any key on your keyboard to test its functionality. The corresponding key will light up on the virtual keyboard below.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Key pressed</span>
            <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded ml-4"></div>
            <span>Key not pressed</span>
          </div>
        </CardContent>
      </Card>

      {/* Virtual Keyboard */}
      <VirtualKeyboard />

      {/* Key Press Log */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Key Press Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={logContainerRef} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 mb-4">
            {keyLog.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Press any key to see the log...</p>
            ) : (
              keyLog.map((entry, index) => (
                <div key={index} className="text-sm mb-1">
                  <span className="font-mono text-xs text-gray-500">{entry.timestamp}</span>
                  <span className="ml-2">
                    Key: <strong>{entry.key}</strong> ({entry.type})
                  </span>
                </div>
              ))
            )}
          </div>
          <Button
            onClick={clearKeyLog}
            variant="outline"
            className="bg-gray-500 hover:bg-gray-600 text-white border-none"
          >
            Clear Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
