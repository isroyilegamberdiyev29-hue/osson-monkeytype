import React from 'react';
import { Volume2, VolumeX, Palette, Trophy, BarChart2, Keyboard, RotateCcw } from 'lucide-react';
import { SoundType } from '../types';

interface HeaderProps {
  currentTab: 'test' | 'leaderboard' | 'stats' | 'themes';
  onSelectTab: (tab: 'test' | 'leaderboard' | 'stats' | 'themes') => void;
  soundType: SoundType;
  onChangeSound: (nextSound: SoundType) => void;
  themeName: string;
  onOpenThemeModal: () => void;
  onRestartTest: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  soundType,
  onChangeSound,
  themeName,
  onOpenThemeModal,
  onRestartTest,
}) => {
  const getNextSound = (): SoundType => {
    const list: SoundType[] = ['thock', 'click', 'linear', 'typewriter', 'off'];
    const idx = list.indexOf(soundType);
    return list[(idx + 1) % list.length];
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-6 transition-colors">
      {/* Zone 1: Wordmark */}
      <button
        onClick={() => {
          onSelectTab('test');
          onRestartTest();
        }}
        className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        title="Bosh sahifa / Qayta boshlash"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
        >
          <Keyboard className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span
            className="text-xl font-bold tracking-tight whitespace-nowrap leading-none transition-colors"
            style={{ color: 'var(--text-color)' }}
          >
            typetype
          </span>
          <span className="text-[10px] font-mono tracking-wider opacity-60" style={{ color: 'var(--sub-color)' }}>
            tez yozish testi
          </span>
        </div>
      </button>

      {/* Zone 2: Clean single-line nav links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onSelectTab('test')}
          className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer"
          style={{
            color: currentTab === 'test' ? 'var(--main-color)' : 'var(--sub-color)',
            backgroundColor: currentTab === 'test' ? 'var(--sub-alt-color)' : 'transparent',
          }}
        >
          Test
        </button>

        <button
          onClick={() => onSelectTab('leaderboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer hover:opacity-100"
          style={{
            color: currentTab === 'leaderboard' ? 'var(--main-color)' : 'var(--sub-color)',
            backgroundColor: currentTab === 'leaderboard' ? 'var(--sub-alt-color)' : 'transparent',
          }}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Reyting</span>
        </button>

        <button
          onClick={() => onSelectTab('themes')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer hover:opacity-100"
          style={{
            color: currentTab === 'themes' ? 'var(--main-color)' : 'var(--sub-color)',
            backgroundColor: currentTab === 'themes' ? 'var(--sub-alt-color)' : 'transparent',
          }}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Ranglar</span>
        </button>

        <button
          onClick={() => onSelectTab('stats')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap cursor-pointer hover:opacity-100"
          style={{
            color: currentTab === 'stats' ? 'var(--main-color)' : 'var(--sub-color)',
            backgroundColor: currentTab === 'stats' ? 'var(--sub-alt-color)' : 'transparent',
          }}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Statistika</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action & sound switcher */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onChangeSound(getNextSound())}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-md transition-all cursor-pointer"
          style={{
            backgroundColor: 'var(--sub-alt-color)',
            color: soundType !== 'off' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title={`Ovoz rejimi: ${soundType} (O'zgartirish uchun bosing)`}
        >
          {soundType === 'off' ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline capitalize text-[11px]">{soundType}</span>
        </button>

        <button
          onClick={onOpenThemeModal}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer hover:opacity-90"
          style={{
            backgroundColor: 'var(--sub-alt-color)',
            color: 'var(--text-color)',
            border: '1px solid var(--sub-color)',
            borderColor: 'rgba(128, 128, 128, 0.2)',
          }}
          title="Mavzular va ranglarni tanlash"
        >
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'var(--main-color)' }}
          />
          <span className="hidden sm:inline max-w-[100px] truncate">{themeName}</span>
        </button>
      </div>
    </header>
  );
};
