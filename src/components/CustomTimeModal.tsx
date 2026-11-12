import React, { useState } from 'react';
import { Clock, FileText, Check, X } from 'lucide-react';
import { TestMode } from '../types';

interface CustomTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TestMode;
  currentTime: number;
  currentWords: number;
  onSaveTime: (seconds: number) => void;
  onSaveWords: (words: number) => void;
}

export const CustomTimeModal: React.FC<CustomTimeModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentTime,
  currentWords,
  onSaveTime,
  onSaveWords,
}) => {
  const [val, setVal] = useState<string>(
    mode === 'time' ? currentTime.toString() : currentWords.toString()
  );
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(val, 10);

    if (isNaN(num) || num <= 0) {
      setErrorMsg('Iltimos, 0 dan katta butun son kiriting');
      return;
    }

    if (mode === 'time') {
      if (num > 3600) {
        setErrorMsg('Vaqt 3600 sekunddan (1 soatdan) oshmasligi kerak');
        return;
      }
      onSaveTime(num);
    } else {
      if (num > 1000) {
        setErrorMsg('So\'zlar soni 1000 tadan oshmasligi kerak');
        return;
      }
      onSaveWords(num);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-mono">
      <div
        className="w-full max-w-md rounded-2xl border shadow-2xl p-6 transition-all"
        style={{
          backgroundColor: 'var(--bg-color)',
          borderColor: 'var(--sub-color)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {mode === 'time' ? (
              <Clock className="w-5 h-5" style={{ color: 'var(--main-color)' }} />
            ) : (
              <FileText className="w-5 h-5" style={{ color: 'var(--main-color)' }} />
            )}
            <h3 className="font-bold text-sm sm:text-base" style={{ color: 'var(--text-color)' }}>
              {mode === 'time' ? "Moslashuvchan Vaqt (Sekundlarda)" : "Moslashuvchan So'zlar Soni"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: 'var(--sub-color)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-2 opacity-75" style={{ color: 'var(--sub-color)' }}>
              {mode === 'time'
                ? "Test davomiyligi uchun necha sekund xohlaysiz? (Masalan: 5, 20, 45, 90, 180):"
                : "Nechta so'z yozishni xohlaysiz? (Masalan: 5, 15, 30, 80):"}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max={mode === 'time' ? 3600 : 1000}
                value={val}
                onChange={(e) => {
                  setVal(e.target.value);
                  setErrorMsg('');
                }}
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border text-sm font-mono outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--sub-alt-color)',
                  borderColor: errorMsg ? 'var(--error-color)' : 'var(--sub-color)',
                  color: 'var(--text-color)',
                }}
                placeholder={mode === 'time' ? 'Masalan: 45' : 'Masalan: 35'}
              />
              <span className="absolute right-4 top-2.5 text-xs opacity-50" style={{ color: 'var(--sub-color)' }}>
                {mode === 'time' ? 'sekund' : "so'z"}
              </span>
            </div>
            {errorMsg && (
              <p className="text-xs mt-1.5" style={{ color: 'var(--error-color)' }}>
                {errorMsg}
              </p>
            )}
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-2 text-xs">
            {mode === 'time'
              ? [10, 20, 45, 90, 180].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setVal(s.toString())}
                    className="px-2.5 py-1 rounded-lg border hover:opacity-100 transition-opacity cursor-pointer"
                    style={{
                      borderColor: 'rgba(128, 128, 128, 0.2)',
                      backgroundColor: 'var(--sub-alt-color)',
                      color: 'var(--sub-color)',
                    }}
                  >
                    {s}s
                  </button>
                ))
              : [5, 15, 35, 75, 150].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setVal(w.toString())}
                    className="px-2.5 py-1 rounded-lg border hover:opacity-100 transition-opacity cursor-pointer"
                    style={{
                      borderColor: 'rgba(128, 128, 128, 0.2)',
                      backgroundColor: 'var(--sub-alt-color)',
                      color: 'var(--sub-color)',
                    }}
                  >
                    {w} ta
                  </button>
                ))}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
              style={{ color: 'var(--sub-color)' }}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow"
              style={{
                backgroundColor: 'var(--main-color)',
                color: 'var(--bg-color)',
              }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Tasdiqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
