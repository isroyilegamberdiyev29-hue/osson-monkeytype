import React, { useState } from 'react';
import { Trophy, Medal, X, Search, Filter } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getStoredLeaderboard } from '../utils/ranking';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRank?: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentUserRank,
}) => {
  const [filterMode, setFilterMode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const entries = getStoredLeaderboard();

  const filteredEntries = entries.filter((entry) => {
    if (filterMode !== 'all') {
      if (filterMode === '30s' && (entry.mode !== 'time' || entry.modeConfig !== 30)) return false;
      if (filterMode === '60s' && (entry.mode !== 'time' || entry.modeConfig !== 60)) return false;
      if (filterMode === 'words' && entry.mode !== 'words') return false;
    }
    if (searchQuery.trim()) {
      return entry.username.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-yellow-400 font-bold flex items-center gap-1">🥇 1</span>;
    if (rank === 2) return <span className="text-slate-300 font-bold flex items-center gap-1">🥈 2</span>;
    if (rank === 3) return <span className="text-amber-600 font-bold flex items-center gap-1">🥉 3</span>;
    return <span className="opacity-70 font-mono">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col font-mono overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--bg-color)',
          borderColor: 'var(--sub-color)',
        }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" style={{ color: 'var(--main-color)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>
              Tezkor Yozuvchilar Reyting Jadvali
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

        {/* Filter bar */}
        <div
          className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 text-xs"
          style={{ borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 mr-1" style={{ color: 'var(--sub-color)' }} />
            {['all', '30s', '60s', 'words'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterMode(f)}
                className="px-2.5 py-1 rounded transition-colors capitalize cursor-pointer"
                style={{
                  backgroundColor: filterMode === f ? 'var(--main-color)' : 'transparent',
                  color: filterMode === f ? 'var(--bg-color)' : 'var(--sub-color)',
                  fontWeight: filterMode === f ? 'bold' : 'normal',
                }}
              >
                {f === 'all' ? 'barchasi' : f}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-50" style={{ color: 'var(--sub-color)' }} />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-md border outline-none font-mono"
              style={{
                backgroundColor: 'var(--sub-alt-color)',
                borderColor: 'rgba(128, 128, 128, 0.2)',
                color: 'var(--text-color)',
              }}
            />
          </div>
        </div>

        {/* Leaderboard Table List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', color: 'var(--sub-color)' }}>
                <th className="pb-2.5 font-medium">O'rin</th>
                <th className="pb-2.5 font-medium">Foydalanuvchi</th>
                <th className="pb-2.5 font-medium text-right">WPM</th>
                <th className="pb-2.5 font-medium text-right">Aniqlik</th>
                <th className="pb-2.5 font-medium text-right hidden sm:table-cell">Rejim</th>
                <th className="pb-2.5 font-medium text-right opacity-60">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(128,128,128,0.1)]">
              {filteredEntries.map((entry, index) => {
                const rank = index + 1;
                const isCurrent = entry.isCurrentUser;

                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${isCurrent ? 'font-bold' : ''}`}
                    style={{
                      backgroundColor: isCurrent ? 'var(--sub-alt-color)' : 'transparent',
                      color: isCurrent ? 'var(--main-color)' : 'var(--text-color)',
                    }}
                  >
                    <td className="py-2.5 whitespace-nowrap">
                      {getRankBadge(rank)}
                    </td>
                    <td className="py-2.5 font-medium flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[200px]">
                      <span>{entry.username}</span>
                      {isCurrent && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}>
                          Siz
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 text-right font-bold text-sm tabular-nums" style={{ color: 'var(--main-color)' }}>
                      {entry.wpm}
                    </td>
                    <td className="py-2.5 text-right tabular-nums opacity-85">
                      {entry.accuracy}%
                    </td>
                    <td className="py-2.5 text-right hidden sm:table-cell opacity-60 text-[11px]">
                      {entry.mode} {entry.modeConfig}
                    </td>
                    <td className="py-2.5 text-right opacity-50 text-[11px] whitespace-nowrap">
                      {entry.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEntries.length === 0 && (
            <div className="py-12 text-center text-xs opacity-60" style={{ color: 'var(--sub-color)' }}>
              Hech qanday natija topilmadi
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-[11px] flex items-center justify-between"
          style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)', color: 'var(--sub-color)' }}
        >
          <span>Jami qatnashuvchilar: {entries.length} nafar</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
