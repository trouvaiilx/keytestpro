import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useKeyboard } from "@/hooks/use-keyboard";

const keyboardLayout = [
  // Function keys row
  {
    type: "function",
    keys: [
      { key: "Escape", display: "Esc", width: "w-10" },
      { key: "", display: "", width: "w-4", spacer: true },
      { key: "F1", display: "F1", width: "w-10" },
      { key: "F2", display: "F2", width: "w-10" },
      { key: "F3", display: "F3", width: "w-10" },
      { key: "F4", display: "F4", width: "w-10" },
      { key: "", display: "", width: "w-2", spacer: true },
      { key: "F5", display: "F5", width: "w-10" },
      { key: "F6", display: "F6", width: "w-10" },
      { key: "F7", display: "F7", width: "w-10" },
      { key: "F8", display: "F8", width: "w-10" },
      { key: "", display: "", width: "w-2", spacer: true },
      { key: "F9", display: "F9", width: "w-10" },
      { key: "F10", display: "F10", width: "w-10" },
      { key: "F11", display: "F11", width: "w-10" },
      { key: "F12", display: "F12", width: "w-10" },
    ],
  },
  // Number row
  {
    type: "number",
    keys: [
      { key: "`", display: "` ~", width: "w-12" },
      { key: "1", display: "1 !", width: "w-12" },
      { key: "2", display: "2 @", width: "w-12" },
      { key: "3", display: "3 #", width: "w-12" },
      { key: "4", display: "4 $", width: "w-12" },
      { key: "5", display: "5 %", width: "w-12" },
      { key: "6", display: "6 ^", width: "w-12" },
      { key: "7", display: "7 &", width: "w-12" },
      { key: "8", display: "8 *", width: "w-12" },
      { key: "9", display: "9 (", width: "w-12" },
      { key: "0", display: "0 )", width: "w-12" },
      { key: "-", display: "- _", width: "w-12" },
      { key: "=", display: "= +", width: "w-12" },
      { key: "Backspace", display: "⌫", width: "w-20" },
    ],
  },
  // QWERTY row
  {
    type: "qwerty",
    keys: [
      { key: "Tab", display: "Tab", width: "w-16" },
      { key: "q", display: "Q", width: "w-12" },
      { key: "w", display: "W", width: "w-12" },
      { key: "e", display: "E", width: "w-12" },
      { key: "r", display: "R", width: "w-12" },
      { key: "t", display: "T", width: "w-12" },
      { key: "y", display: "Y", width: "w-12" },
      { key: "u", display: "U", width: "w-12" },
      { key: "i", display: "I", width: "w-12" },
      { key: "o", display: "O", width: "w-12" },
      { key: "p", display: "P", width: "w-12" },
      { key: "[", display: "[ {", width: "w-12" },
      { key: "]", display: "] }", width: "w-12" },
      { key: "\\", display: "\\ |", width: "w-16" },
    ],
  },
  // ASDF row
  {
    type: "asdf",
    keys: [
      { key: "CapsLock", display: "Caps", width: "w-20" },
      { key: "a", display: "A", width: "w-12" },
      { key: "s", display: "S", width: "w-12" },
      { key: "d", display: "D", width: "w-12" },
      { key: "f", display: "F", width: "w-12" },
      { key: "g", display: "G", width: "w-12" },
      { key: "h", display: "H", width: "w-12" },
      { key: "j", display: "J", width: "w-12" },
      { key: "k", display: "K", width: "w-12" },
      { key: "l", display: "L", width: "w-12" },
      { key: ";", display: "; :", width: "w-12" },
      { key: "'", display: "' \"", width: "w-12" },
      { key: "Enter", display: "Enter", width: "w-20" },
    ],
  },
  // ZXCV row
  {
    type: "zxcv",
    keys: [
      { key: "Shift", display: "Shift", width: "w-24" },
      { key: "z", display: "Z", width: "w-12" },
      { key: "x", display: "X", width: "w-12" },
      { key: "c", display: "C", width: "w-12" },
      { key: "v", display: "V", width: "w-12" },
      { key: "b", display: "B", width: "w-12" },
      { key: "n", display: "N", width: "w-12" },
      { key: "m", display: "M", width: "w-12" },
      { key: ",", display: ", <", width: "w-12" },
      { key: ".", display: ". >", width: "w-12" },
      { key: "/", display: "/ ?", width: "w-12" },
      { key: "Shift", display: "Shift", width: "w-24" },
    ],
  },
  // Bottom row
  {
    type: "bottom",
    keys: [
      { key: "Control", display: "Ctrl", width: "w-16" },
      { key: "Meta", display: "⌘", width: "w-12" },
      { key: "Alt", display: "Alt", width: "w-16" },
      { key: " ", display: "Space", width: "w-48" },
      { key: "Alt", display: "Alt", width: "w-16" },
      { key: "Meta", display: "⌘", width: "w-12" },
      { key: "Control", display: "Ctrl", width: "w-16" },
    ],
  },
];

export default function VirtualKeyboard() {
  const { pressedKeys } = useKeyboard();

  const isKeyPressed = (key: string) => {
    return pressedKeys.has(key) || pressedKeys.has(key.toLowerCase());
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Virtual Keyboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="keyboard-container space-y-3">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className={`flex ${row.type === 'function' ? 'justify-center mb-4' : 'justify-center'} space-x-1`}>
              {row.keys.map((keyData, keyIndex) => {
                if (keyData.spacer) {
                  return <div key={keyIndex} className={keyData.width}></div>;
                }

                const isPressed = isKeyPressed(keyData.key);

                return (
                  <button
                    key={keyIndex}
                    className={`
                      key ${keyData.width} h-12 border border-gray-300 dark:border-gray-600 rounded 
                      font-medium transition-all duration-100 text-xs
                      ${isPressed 
                        ? 'bg-blue-600 text-white key-pressed transform scale-95' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }
                    `}
                    data-key={keyData.key}
                  >
                    {keyData.display}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
