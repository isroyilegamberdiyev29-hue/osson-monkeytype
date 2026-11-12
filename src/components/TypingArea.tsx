import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { SoundType, TestMode, TestResult } from '../types';
import { playKeySound } from '../utils/audio';

interface TypingAreaProps {
  words: string[];
  mode: TestMode;
  timeLimit: number;
  wordCountLimit: number;
  soundType: SoundType;
  onFinishTest: (stats: TestResult) => void;
  onRestart: () => void;
  language: 'uzbek_latin' | 'uzbek_cyrillic' | 'english';
  includeNumbers: boolean;
  includePunctuation: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  words,
  mode,
  timeLimit,
  wordCountLimit,
  soundType,
  onFinishTest,
  onRestart,
  language,
  includeNumbers,
  includePunctuation,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typedWordsHistory, setTypedWordsHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Caret coordinate tracking
  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({
    left: 0,
    top: 0,
    height: 28,
  });

  // Stats tracking
  const startTimeRef = useRef<number | null>(null);
  const totalCorrectCharsRef = useRef(0);
  const totalIncorrectCharsRef = useRef(0);
  const totalExtraCharsRef = useRef(0);
  const totalMissedCharsRef = useRef(0);
  const keyErrorsRef = useRef<Record<string, number>>({});
  const timelineRef = useRef<Array<{ second: number; wpm: number; rawWpm: number; errors: number }>>([]);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const wordsContainerRef = useRef<HTMLDivElement | null>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  // Focus input automatically
  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  // Sync time limit changes
  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  // Caret position recalculation
  const updateCaretPosition = useCallback(() => {
    if (!wordsContainerRef.current) return;

    // Find current active character element or word element
    const containerRect = wordsContainerRef.current.getBoundingClientRect();
    const activeWordEl = wordsContainerRef.current.querySelector(`[data-word-index="${currentWordIndex}"]`);

    if (activeWordEl) {
      const activeCharEl = activeWordEl.querySelector(`[data-char-index="${typedInput.length}"]`) as HTMLElement;

      if (activeCharEl) {
        const charRect = activeCharEl.getBoundingClientRect();
        setCaretPos({
          left: charRect.left - containerRect.left,
          top: charRect.top - containerRect.top,
          height: charRect.height || 28,
        });
      } else {
        // At the end of the word or beyond
        const allChars = activeWordEl.querySelectorAll('[data-char]');
        const lastChar = allChars[allChars.length - 1] as HTMLElement;
        if (lastChar) {
          const lastRect = lastChar.getBoundingClientRect();
          setCaretPos({
            left: lastRect.right - containerRect.left,
            top: lastRect.top - containerRect.top,
            height: lastRect.height || 28,
          });
        } else {
          const wordRect = activeWordEl.getBoundingClientRect();
          setCaretPos({
            left: wordRect.left - containerRect.left,
            top: wordRect.top - containerRect.top,
            height: wordRect.height || 28,
          });
        }
      }

      // Smooth scroll container if active word moved beyond view
      const wordTop = (activeWordEl as HTMLElement).offsetTop;
      if (wordsContainerRef.current.scrollTop < wordTop - 50) {
        wordsContainerRef.current.scrollTo({
          top: wordTop - 45,
          behavior: 'smooth',
        });
      }
    }
  }, [currentWordIndex, typedInput]);

  useEffect(() => {
    updateCaretPosition();
    window.addEventListener('resize', updateCaretPosition);
    return () => window.removeEventListener('resize', updateCaretPosition);
  }, [updateCaretPosition]);

  // Finalize Test and build detailed stats
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const elapsedSeconds = startTimeRef.current
      ? Math.max(1, (Date.now() - startTimeRef.current) / 1000)
      : 1;

    const correctChars = totalCorrectCharsRef.current;
    const incorrectChars = totalIncorrectCharsRef.current;
    const extraChars = totalExtraCharsRef.current;
    const missedChars = totalMissedCharsRef.current;
    const totalTyped = correctChars + incorrectChars + extraChars;

    // Standard WPM = (all correct characters / 5) / (time in minutes)
    const minutes = elapsedSeconds / 60;
    const netWpm = Math.max(0, Math.round((correctChars / 5) / minutes));
    const rawWpm = Math.max(0, Math.round((totalTyped / 5) / minutes));
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;

    // Calculate consistency based on timeline
    let consistency = 85;
    if (timelineRef.current.length > 2) {
      const wpms = timelineRef.current.map((p) => p.wpm).filter((w) => w > 0);
      if (wpms.length > 1) {
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        const variance = wpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
        consistency = Math.max(20, Math.min(100, Math.round(100 - cv)));
      }
    }

    const modeConfig = mode === 'time' ? timeLimit : mode === 'words' ? wordCountLimit : 'quote';

    const result: TestResult = {
      id: 'res_' + Date.now(),
      timestamp: Date.now(),
      wpm: netWpm,
      rawWpm: rawWpm,
      accuracy,
      consistency,
      timeSpent: Math.round(elapsedSeconds),
      mode,
      modeConfig,
      language,
      numbers: includeNumbers,
      punctuation: includePunctuation,
      charStats: {
        correct: correctChars,
        incorrect: incorrectChars,
        extra: extraChars,
        missed: missedChars,
        total: totalTyped,
      },
      keyErrors: keyErrorsRef.current,
      timeline: timelineRef.current,
      rankPlacement: {} as any, // Filled by parent
    };

    onFinishTest(result);
  }, [mode, timeLimit, wordCountLimit, language, includeNumbers, includePunctuation, onFinishTest]);

  // Main Timer Hook
  useEffect(() => {
    if (!hasStarted) return;

    if (mode === 'time') {
      timerIntervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          const next = prev - 1;

          // Record timeline point
          if (startTimeRef.current) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            const currentMins = elapsed / 60;
            const curWpm = Math.round((totalCorrectCharsRef.current / 5) / currentMins) || 0;
            const curRaw = Math.round(((totalCorrectCharsRef.current + totalIncorrectCharsRef.current + totalExtraCharsRef.current) / 5) / currentMins) || 0;

            timelineRef.current.push({
              second: Math.round(elapsed),
              wpm: curWpm,
              rawWpm: curRaw,
              errors: totalIncorrectCharsRef.current,
            });
          }

          if (next <= 0) {
            clearInterval(timerIntervalRef.current!);
            finishTest();
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      // In words/quote mode, track elapsed time and timeline
      timerIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const currentMins = elapsed / 60;
          const curWpm = Math.round((totalCorrectCharsRef.current / 5) / currentMins) || 0;
          const curRaw = Math.round(((totalCorrectCharsRef.current + totalIncorrectCharsRef.current + totalExtraCharsRef.current) / 5) / currentMins) || 0;

          timelineRef.current.push({
            second: Math.round(elapsed),
            wpm: curWpm,
            rawWpm: curRaw,
            errors: totalIncorrectCharsRef.current,
          });
        }
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [hasStarted, mode, finishTest]);

  // Handle Keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLockActive(e.getModifierState('CapsLock'));

    // Restart test on Tab or Esc
    if (e.key === 'Tab' || e.key === 'Escape') {
      e.preventDefault();
      onRestart();
      return;
    }

    // Start timer on first genuine typing key
    if (!hasStarted && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
    }

    const currentTargetWord = words[currentWordIndex] || '';

    // Handle Space (Word submission)
    if (e.key === ' ') {
      e.preventDefault();
      if (typedInput.length === 0) return; // Don't allow multiple leading spaces

      // Evaluate the completed word
      let wordCorrectChars = 0;
      let wordErrors = 0;

      for (let i = 0; i < currentTargetWord.length; i++) {
        const expected = currentTargetWord[i];
        const typed = typedInput[i];
        if (typed === expected) {
          wordCorrectChars++;
        } else if (typed !== undefined) {
          wordErrors++;
        } else {
          // Missed character
          totalMissedCharsRef.current++;
        }
      }

      totalCorrectCharsRef.current += wordCorrectChars;
      totalIncorrectCharsRef.current += wordErrors;

      if (typedInput.length > currentTargetWord.length) {
        totalExtraCharsRef.current += typedInput.length - currentTargetWord.length;
      }

      // Add to word history
      setTypedWordsHistory((prev) => [...prev, typedInput]);
      setTypedInput('');
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);

      // Play sound
      playKeySound(soundType, wordErrors > 0);

      // Check if finished in words mode or quote mode
      if (mode === 'words' && nextIndex >= wordCountLimit) {
        finishTest();
      } else if (mode === 'quote' && nextIndex >= words.length) {
        finishTest();
      }
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (e.ctrlKey || e.altKey) {
        e.preventDefault();
        setTypedInput('');
        return;
      }

      if (typedInput.length > 0) {
        setTypedInput((prev) => prev.slice(0, -1));
        playKeySound(soundType);
      } else if (currentWordIndex > 0) {
        // Jump back to previous word if it had mistakes
        const prevTyped = typedWordsHistory[currentWordIndex - 1];
        const prevTarget = words[currentWordIndex - 1];
        if (prevTyped !== prevTarget) {
          e.preventDefault();
          setCurrentWordIndex(currentWordIndex - 1);
          setTypedInput(prevTyped);
          setTypedWordsHistory((prev) => prev.slice(0, -1));
        }
      }
      return;
    }

    // Standard character typing
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const nextTyped = typedInput + e.key;
      setTypedInput(nextTyped);

      const charIdx = typedInput.length;
      const expectedChar = currentTargetWord[charIdx];
      const isMismatch = charIdx < currentTargetWord.length && e.key !== expectedChar;

      if (isMismatch) {
        keyErrorsRef.current[expectedChar] = (keyErrorsRef.current[expectedChar] || 0) + 1;
      }

      playKeySound(soundType, isMismatch);
    }
  };

  return (
    <div
      className="relative w-full max-w-4xl mx-auto my-8 px-4 py-6 rounded-2xl select-none"
      onClick={() => {
        hiddenInputRef.current?.focus();
        setIsFocused(true);
      }}
    >
      {/* Hidden input to capture physical & virtual keyboard inputs */}
      <input
        ref={hiddenInputRef}
        type="text"
        className="absolute -top-9999 left-0 opacity-0 pointer-events-none"
        value={typedInput}
        onChange={() => {}} // Controlled by onKeyDown
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {/* Live Counter Display: Time countdown or Words count */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-baseline gap-2">
          {mode === 'time' && (
            <span
              className="text-2xl sm:text-3xl font-mono font-bold tracking-tight transition-colors tabular-nums"
              style={{ color: 'var(--main-color)' }}
            >
              {timeLeft}
            </span>
          )}

          {mode === 'words' && (
            <div className="flex items-baseline gap-1 font-mono text-xl sm:text-2xl" style={{ color: 'var(--main-color)' }}>
              <span className="font-bold">{currentWordIndex}</span>
              <span className="text-sm opacity-50" style={{ color: 'var(--sub-color)' }}>/ {wordCountLimit}</span>
            </div>
          )}

          {mode === 'quote' && (
            <div className="flex items-baseline gap-1 font-mono text-xl" style={{ color: 'var(--main-color)' }}>
              <span className="font-bold">{Math.round((currentWordIndex / Math.max(1, words.length)) * 100)}%</span>
            </div>
          )}

          {hasStarted && (
            <span className="text-xs font-mono ml-2 opacity-60" style={{ color: 'var(--sub-color)' }}>
              {mode === 'time' ? 'sekund qoldi' : 'bajarildi'}
            </span>
          )}
        </div>

        {/* CapsLock Warning */}
        {capsLockActive && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium animate-pulse"
            style={{ backgroundColor: 'var(--error-color)', color: '#fff' }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Caps Lock yoniq!</span>
          </div>
        )}
      </div>

      {/* Words Container with Monkeytype-style smooth caret */}
      <div
        ref={wordsContainerRef}
        className="relative font-mono text-xl sm:text-2xl md:text-[26px] leading-relaxed tracking-wide h-[155px] overflow-hidden select-none outline-none cursor-text transition-all"
        style={{ letterSpacing: '0.04em' }}
      >
        {/* Animated Caret */}
        {isFocused && (
          <div
            className={`absolute pointer-events-none transition-all duration-75 ease-out ${!hasStarted ? 'caret-blink' : ''}`}
            style={{
              left: `${caretPos.left}px`,
              top: `${caretPos.top + 3}px`,
              width: '2.5px',
              height: `${caretPos.height - 6}px`,
              backgroundColor: 'var(--caret-color)',
              borderRadius: '1.5px',
              zIndex: 10,
            }}
          />
        )}

        {/* Unfocused Blur Overlay */}
        {!isFocused && (
          <div className="absolute inset-0 backdrop-blur-xs flex items-center justify-center z-20 transition-all cursor-pointer">
            <div
              className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg"
              style={{ backgroundColor: 'var(--sub-alt-color)', color: 'var(--main-color)' }}
            >
              <Eye className="w-4 h-4" />
              <span>Yozish uchun bosing yoki klaviaturani bosing</span>
            </div>
          </div>
        )}

        {/* Words Grid */}
        <div className="flex flex-wrap gap-x-3.5 gap-y-2.5">
          {words.map((word, wordIdx) => {
            const isCompletedWord = wordIdx < currentWordIndex;
            const isCurrentWord = wordIdx === currentWordIndex;
            const isUpcomingWord = wordIdx > currentWordIndex;
            const historicalInput = typedWordsHistory[wordIdx] || '';

            return (
              <span
                key={wordIdx}
                data-word-index={wordIdx}
                className="relative inline-flex items-center"
              >
                {/* Completed Word Rendering */}
                {isCompletedWord && (
                  <span
                    className={historicalInput === word ? '' : 'underline decoration-1 decoration-[var(--error-color)]'}
                    style={{
                      color: historicalInput === word ? 'var(--text-color)' : 'var(--error-color)',
                    }}
                  >
                    {word}
                  </span>
                )}

                {/* Current Active Word with Letter-by-Letter Real-Time Highlighting */}
                {isCurrentWord && (
                  <>
                    {word.split('').map((char, charIdx) => {
                      const typedChar = typedInput[charIdx];
                      let charColor = 'var(--sub-color)'; // default untyped
                      let isError = false;

                      if (typedChar !== undefined) {
                        if (typedChar === char) {
                          charColor = 'var(--text-color)';
                        } else {
                          charColor = 'var(--error-color)';
                          isError = true;
                        }
                      }

                      return (
                        <span
                          key={charIdx}
                          data-char={char}
                          data-char-index={charIdx}
                          className={isError ? 'underline decoration-2' : ''}
                          style={{ color: charColor }}
                        >
                          {char}
                        </span>
                      );
                    })}

                    {/* Extra characters typed beyond word length */}
                    {typedInput.length > word.length &&
                      typedInput
                        .slice(word.length)
                        .split('')
                        .map((extraChar, extraIdx) => (
                          <span
                            key={`extra-${extraIdx}`}
                            data-char={extraChar}
                            data-char-index={word.length + extraIdx}
                            style={{ color: 'var(--error-extra-color)' }}
                          >
                            {extraChar}
                          </span>
                        ))}
                  </>
                )}

                {/* Upcoming Untyped Words */}
                {isUpcomingWord && (
                  <span style={{ color: 'var(--sub-color)' }}>
                    {word}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Restart and Quick Actions Bar */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={onRestart}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: 'var(--sub-alt-color)',
            color: 'var(--sub-color)',
          }}
          title="Qayta boshlash (Tab yoki Esc)"
        >
          <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" />
          <span className="group-hover:text-[var(--text-color)]">Qayta boshlash (Tab)</span>
        </button>
      </div>
    </div>
  );
};
