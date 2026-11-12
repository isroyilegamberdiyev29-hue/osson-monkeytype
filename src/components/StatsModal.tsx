import React from 'react';
import { BarChart2, X, Zap, Target, Clock, Award } from 'lucide-react';
import { TestResult } from '../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TestResult[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  if (!isOpen) return null;

  const bestWpm = history.length > 0 ? Math.max(...history.map((h) => h.wpm)) : 0;
  const avgWpm = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.wpm, 0) / history.length) : 0;
  const avgAcc = history.length > 0 ? Math.round(history.reduce((a, b) => a + b.accuracy, 0) / history.length) : 0;
  const totalTimeSeconds = history.reduce((a, b) => a + (b.timeSpent || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-mono">
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
            <BarChart2 className="w-5 h-5" style={{ color: 'var(--main-color)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>
              Shaxsiy Statistika va Mashqlar Tarixi
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--sub-color)' }}>
                <Award className="w-3.5 h-3.5" />
                <span>Eng yuqori WPM</span>
              </div>
              <span className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: 'var(--main-color)' }}>
                {bestWpm}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--sub-color)' }}>
                <Zap className="w-3.5 h-3.5" />
                <span>O'rtacha WPM</span>
              </div>
              <span className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: 'var(--text-color)' }}>
                {avgWpm}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--sub-color)' }}>
                <Target className="w-3.5 h-3.5" />
                <span>O'rtacha aniqlik</span>
              </div>
              <span className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: 'var(--text-color)' }}>
                {avgAcc}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl border flex flex-col justify-between" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <div className="flex items-center gap-1.5 opacity-60" style={{ color: 'var(--sub-color)' }}>
                <Clock className="w-3.5 h-3.5" />
                <span>Mashqlar soni</span>
              </div>
              <span className="text-2xl font-extrabold mt-1 tabular-nums" style={{ color: 'var(--text-color)' }}>
                {history.length} ta
              </span>
            </div>
          </div>

          {/* Test History Table */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold block mb-3" style={{ color: 'var(--sub-color)' }}>
              So'nggi testlar ro'yxati
            </span>

            {history.length > 0 ? (
              <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'rgba(128, 128, 128, 0.15)' }}>
                <table className="w-full text-left text-xs">
                  <thead style={{ backgroundColor: 'var(--sub-alt-color)', color: 'var(--sub-color)' }}>
                    <tr>
                      <th className="py-2.5 px-3">WPM</th>
                      <th className="py-2.5 px-3">Aniqlik</th>
                      <th className="py-2.5 px-3">Rejim</th>
                      <th className="py-2.5 px-3">Til</th>
                      <th className="py-2.5 px-3 text-right">O'rin / Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(128,128,128,0.1)]">
                    {history.slice(0, 10).map((h) => (
                      <tr key={h.id} style={{ color: 'var(--text-color)' }}>
                        <td className="py-2.5 px-3 font-bold text-sm" style={{ color: 'var(--main-color)' }}>
                          {h.wpm}
                        </td>
                        <td className="py-2.5 px-3">{h.accuracy}%</td>
                        <td className="py-2.5 px-3 opacity-75">{h.mode} {h.modeConfig}</td>
                        <td className="py-2.5 px-3 opacity-75">{h.language}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="text-xs font-semibold" style={{ color: h.rankPlacement?.color || 'var(--main-color)' }}>
                            {h.rankPlacement?.badge} #{h.rankPlacement?.rankPosition}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-10 text-center text-xs opacity-50" style={{ color: 'var(--sub-color)' }}>
                Hali mashq qilinmagan. Testni boshlang va natijangiz bu yerda saqlanadi!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-[11px] flex items-center justify-between"
          style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}
        >
          <span style={{ color: 'var(--sub-color)' }}>Jami yozilgan vaqt: {Math.round(totalTimeSeconds / 60)} daqiqa</span>
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
