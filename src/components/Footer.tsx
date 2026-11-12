import React from 'react';
import { Command, Keyboard } from 'lucide-react';

interface FooterProps {
  onRestart: () => void;
  onOpenThemeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRestart, onOpenThemeModal }) => {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 py-8 mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono select-none transition-colors">
      <div className="flex items-center gap-3" style={{ color: 'var(--sub-color)' }}>
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:opacity-100 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'var(--sub-alt-color)' }}
        >
          <kbd className="font-bold text-[10px] px-1 py-0.5 rounded border border-current">tab</kbd>
          <span>qayta boshlash</span>
        </button>

        <button
          onClick={onOpenThemeModal}
          className="flex items-center gap-1.5 px-2 py-1 rounded hover:opacity-100 transition-opacity cursor-pointer"
          style={{ backgroundColor: 'var(--sub-alt-color)' }}
        >
          <kbd className="font-bold text-[10px] px-1 py-0.5 rounded border border-current">ranglar</kbd>
          <span>mavzuni almashtirish</span>
        </button>
      </div>

      <div className="flex items-center gap-2 opacity-60 text-[11px]" style={{ color: 'var(--sub-color)' }}>
        <span>typetype v2.0</span>
        <span>·</span>
        <span>tez yozish va xatolar tahlili</span>
      </div>
    </footer>
  );
};
