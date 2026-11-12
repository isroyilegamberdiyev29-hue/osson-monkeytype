import React, { useState } from 'react';
import { RotateCcw, Trophy, CheckCircle, XCircle, Award, ChevronRight, Share2, BarChart2, ShieldAlert } from 'lucide-react';
import { TestResult } from '../types';
import { addScoreToLeaderboard, getSavedUsername, saveUsername } from '../utils/ranking';

interface ResultViewProps {
  result: TestResult;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  onViewErrorAnalysis: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRestart,
  onViewLeaderboard,
  onViewErrorAnalysis,
}) => {
  const [username, setUsername] = useState(getSavedUsername());
  const [isSaved, setIsSaved] = useState(false);
  const [currentRank, setCurrentRank] = useState(result.rankPlacement.rankPosition);
  const [copied, setCopied] = useState(false);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    saveUsername(username);
    const { newRank } = addScoreToLeaderboard(
      username,
      result.wpm,
      result.accuracy,
      result.rawWpm,
      result.mode,
      result.modeConfig,
      result.language
    );

    setCurrentRank(newRank);
    setIsSaved(true);
  };

  const handleShare = () => {
    const text = `🔥 typetype da yangi rekordim: ${result.wpm} WPM | ${result.accuracy}% aniqlik | ${result.rankPlacement.tierName} (${currentRank}-o'rin)!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SVG Chart Dimensions & Data points
  const timeline = result.timeline;
  const maxWpm = Math.max(80, ...timeline.map((p) => Math.max(p.wpm, p.rawWpm)));
  const chartHeight = 120;
  const chartWidth = 600;

  const pointsWpm = timeline.map((p, idx) => {
    const x = timeline.length > 1 ? (idx / (timeline.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (p.wpm / maxWpm) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  const pointsRaw = timeline.map((p, idx) => {
    const x = timeline.length > 1 ? (idx / (timeline.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (p.rawWpm / maxWpm) * (chartHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4 py-6 font-mono select-none animate-in fade-in duration-300">
      {/* Top Banner: Rank Placement & Tier Badge */}
      <div
        className="p-5 sm:p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all border"
        style={{
          backgroundColor: 'var(--sub-alt-color)',
          borderColor: 'rgba(128, 128, 128, 0.2)',
        }}
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0"
            style={{
              backgroundColor: 'var(--bg-color)',
              border: '2px solid var(--main-color)',
            }}
          >
            {result.rankPlacement.badge}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--main-color)' }}>
                Natijaviy Reyting & O'rin
              </span>
              <span className="text-xs opacity-50" style={{ color: 'var(--sub-color)' }}>·</span>
              <span className="text-xs font-semibold" style={{ color: result.rankPlacement.color }}>
                {result.rankPlacement.tierName}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5" style={{ color: 'var(--text-color)' }}>
              Siz {currentRank}-o'rindasiz!
            </h2>
            <p className="text-xs sm:text-sm mt-1 max-w-lg leading-relaxed" style={{ color: 'var(--sub-color)' }}>
              {result.rankPlacement.descriptionUz} (Foydalanuvchilarning eng yuqori {result.rankPlacement.percentile}% qismida)
            </p>
          </div>
        </div>

        {/* Save to Leaderboard form */}
        <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-2">
          {!isSaved ? (
            <form onSubmit={handleSaveScore} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Ismingiz / Nik"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="px-3 py-2 text-xs rounded-lg border outline-none font-mono w-full sm:w-36 transition-colors"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  borderColor: 'var(--sub-color)',
                  color: 'var(--text-color)',
                }}
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                style={{
                  backgroundColor: 'var(--main-color)',
                  color: 'var(--bg-color)',
                }}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Reytingga kiritish</span>
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ color: 'var(--main-color)' }}>
              <CheckCircle className="w-4 h-4" />
              <span>Reyting jadvaliga muvaffaqiyatli saqlandi! (#{currentRank})</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="text-[11px] flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              style={{ color: 'var(--sub-color)' }}
            >
              <Share2 className="w-3 h-3" />
              <span>{copied ? "Nusxalandi!" : "Natijani ulashish"}</span>
            </button>
            <span style={{ color: 'var(--sub-color)' }}>·</span>
            <button
              onClick={onViewLeaderboard}
              className="text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
              style={{ color: 'var(--main-color)' }}
            >
              <span>Jadvalni ko'rish</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Key Metric Tiles (WPM & ACC) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* WPM */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <span className="text-xs uppercase tracking-wider opacity-60" style={{ color: 'var(--sub-color)' }}>
            wpm (so'z/daq)
          </span>
          <span
            className="text-4xl sm:text-5xl font-extrabold tracking-tight my-1 tabular-nums"
            style={{ color: 'var(--main-color)' }}
          >
            {result.wpm}
          </span>
          <span className="text-[11px] opacity-70" style={{ color: 'var(--sub-color)' }}>
            Toza yozish tezligi
          </span>
        </div>

        {/* ACCURACY */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <span className="text-xs uppercase tracking-wider opacity-60" style={{ color: 'var(--sub-color)' }}>
            aniqlik (acc)
          </span>
          <span
            className="text-4xl sm:text-5xl font-extrabold tracking-tight my-1 tabular-nums"
            style={{ color: result.accuracy >= 95 ? 'var(--main-color)' : 'var(--text-color)' }}
          >
            {result.accuracy}%
          </span>
          <span className="text-[11px] opacity-70" style={{ color: 'var(--sub-color)' }}>
            {result.charStats.correct}/{result.charStats.total} to'g'ri belgi
          </span>
        </div>

        {/* RAW WPM & TIME */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <span className="text-xs uppercase tracking-wider opacity-60" style={{ color: 'var(--sub-color)' }}>
            raw wpm / vaqt
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums" style={{ color: 'var(--text-color)' }}>
              {result.rawWpm}
            </span>
            <span className="text-xs opacity-50" style={{ color: 'var(--sub-color)' }}>/ {result.timeSpent}s</span>
          </div>
          <span className="text-[11px] opacity-70" style={{ color: 'var(--sub-color)' }}>
            Xatolarsiz umumiy bosish
          </span>
        </div>

        {/* CONSISTENCY */}
        <div
          className="p-4 rounded-xl border flex flex-col justify-between"
          style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <span className="text-xs uppercase tracking-wider opacity-60" style={{ color: 'var(--sub-color)' }}>
            barqarorlik
          </span>
          <span className="text-2xl sm:text-3xl font-bold my-1 tabular-nums" style={{ color: 'var(--text-color)' }}>
            {result.consistency}%
          </span>
          <span className="text-[11px] opacity-70" style={{ color: 'var(--sub-color)' }}>
            Tezlik o'zgarishi darajasi
          </span>
        </div>
      </div>

      {/* SVG WPM Timeline Chart */}
      {timeline.length > 1 && (
        <div
          className="p-5 rounded-2xl border mb-8"
          style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
        >
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5" style={{ color: 'var(--main-color)' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--main-color)' }} />
                WPM
              </span>
              <span className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--sub-color)' }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--sub-color)' }} />
                Raw WPM
              </span>
            </div>
            <span className="opacity-50 text-[11px]" style={{ color: 'var(--sub-color)' }}>
              Test davomidagi tezlik grafigi
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-28 overflow-visible">
              {/* Grid lines */}
              <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="rgba(128, 128, 128, 0.1)" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="rgba(128, 128, 128, 0.1)" strokeDasharray="3 3" />
              <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="rgba(128, 128, 128, 0.1)" strokeDasharray="3 3" />

              {/* Raw WPM line */}
              <polyline
                fill="none"
                stroke="var(--sub-color)"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.6"
                points={pointsRaw}
              />

              {/* Net WPM line */}
              <polyline
                fill="none"
                stroke="var(--main-color)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsWpm}
              />

              {/* Data points */}
              {timeline.map((p, idx) => {
                const x = (idx / (timeline.length - 1)) * chartWidth;
                const y = chartHeight - (p.wpm / maxWpm) * (chartHeight - 20) - 10;
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="var(--main-color)"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Detailed Character & Error Breakdown */}
      <div
        className="p-5 rounded-2xl border mb-8"
        style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: 'var(--sub-color)' }}>
            Belgilar va Xatolar tahlili
          </span>
          <button
            onClick={onViewErrorAnalysis}
            className="text-xs flex items-center gap-1 hover:underline cursor-pointer"
            style={{ color: 'var(--main-color)' }}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Xatolar issiqlik xaritasi (Heatmap)</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="flex flex-col">
            <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>To'g'ri belgilar</span>
            <span className="text-xl font-bold mt-1" style={{ color: 'var(--main-color)' }}>
              {result.charStats.correct}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>Noto'g'ri (xatolar)</span>
            <span className="text-xl font-bold mt-1" style={{ color: 'var(--error-color)' }}>
              {result.charStats.incorrect}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>Ortiqcha kiritilgan</span>
            <span className="text-xl font-bold mt-1" style={{ color: 'var(--error-extra-color)' }}>
              {result.charStats.extra}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>O'tkazib yuborilgan</span>
            <span className="text-xl font-bold mt-1 opacity-70" style={{ color: 'var(--sub-color)' }}>
              {result.charStats.missed}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
          style={{
            backgroundColor: 'var(--main-color)',
            color: 'var(--bg-color)',
          }}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Qayta urinish (Tab)</span>
        </button>

        <button
          onClick={onViewLeaderboard}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all hover:bg-opacity-80 cursor-pointer border"
          style={{
            backgroundColor: 'var(--sub-alt-color)',
            color: 'var(--text-color)',
            borderColor: 'rgba(128, 128, 128, 0.2)',
          }}
        >
          <Trophy className="w-4 h-4" style={{ color: 'var(--main-color)' }} />
          <span>Reyting jadvali</span>
        </button>
      </div>
    </div>
  );
};
