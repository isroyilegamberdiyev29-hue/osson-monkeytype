import React from 'react';
import { ShieldAlert, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ErrorAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyErrors: Record<string, number>;
  totalErrors: number;
  totalCorrect: number;
}

export const ErrorAnalysisModal: React.FC<ErrorAnalysisModalProps> = ({
  isOpen,
  onClose,
  keyErrors,
  totalErrors,
  totalCorrect,
}) => {
  if (!isOpen) return null;

  const sortedErrors = Object.entries(keyErrors).sort((a, b) => b[1] - a[1]);
  const totalTyped = totalCorrect + totalErrors;
  const accuracy = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100;

  // QWERTY keyboard rows to visualize error distribution
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ];

  const maxKeyErrorCount = Math.max(1, ...Object.values(keyErrors));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 font-mono">
      <div
        className="w-full max-w-xl max-h-[85vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all"
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
            <ShieldAlert className="w-5 h-5" style={{ color: 'var(--error-color)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>
              Xatoliklar va Klaviaturadagi Muammolar Tahlili
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
          {/* Quick summary cards */}
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>Jami xatolar</span>
              <span className="text-xl font-bold mt-1" style={{ color: 'var(--error-color)' }}>
                {totalErrors} ta
              </span>
            </div>

            <div className="p-3 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>To'g'ri harflar</span>
              <span className="text-xl font-bold mt-1" style={{ color: 'var(--main-color)' }}>
                {totalCorrect} ta
              </span>
            </div>

            <div className="p-3 rounded-xl border flex flex-col" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
              <span className="opacity-60" style={{ color: 'var(--sub-color)' }}>Aniqlik darajasi</span>
              <span className="text-xl font-bold mt-1" style={{ color: 'var(--text-color)' }}>
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Keyboard Heatmap visualization */}
          <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)' }}>
            <span className="text-xs uppercase tracking-wider font-semibold block mb-3" style={{ color: 'var(--sub-color)' }}>
              Klaviatura xatolar xaritasi
            </span>

            <div className="flex flex-col gap-1.5 items-center">
              {rows.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1.5 justify-center">
                  {row.map((char) => {
                    const errCount = keyErrors[char] || keyErrors[char.toUpperCase()] || 0;
                    const intensity = errCount > 0 ? Math.min(1, errCount / maxKeyErrorCount) : 0;

                    let bg = 'var(--bg-color)';
                    let textColor = 'var(--sub-color)';

                    if (errCount > 0) {
                      bg = `rgba(202, 71, 84, ${0.3 + intensity * 0.7})`;
                      textColor = '#fff';
                    }

                    return (
                      <div
                        key={char}
                        className="w-7 h-8 sm:w-8 sm:h-9 rounded-md flex flex-col items-center justify-center text-xs border transition-colors relative"
                        style={{
                          backgroundColor: bg,
                          color: textColor,
                          borderColor: errCount > 0 ? 'var(--error-color)' : 'rgba(128, 128, 128, 0.2)',
                        }}
                        title={errCount > 0 ? `'${char}' harfida ${errCount} ta xato qilingan` : `'${char}': xato yo'q`}
                      >
                        <span className="font-semibold uppercase">{char}</span>
                        {errCount > 0 && (
                          <span className="text-[9px] font-bold leading-none">{errCount}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Most mistyped letters list */}
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold block mb-3" style={{ color: 'var(--sub-color)' }}>
              Eng ko'p adashilgan harflar
            </span>

            {sortedErrors.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {sortedErrors.slice(0, 9).map(([char, count]) => (
                  <div
                    key={char}
                    className="p-2.5 rounded-lg border flex items-center justify-between"
                    style={{
                      backgroundColor: 'var(--sub-alt-color)',
                      borderColor: 'rgba(128, 128, 128, 0.2)',
                    }}
                  >
                    <span className="font-bold text-sm px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--error-color)' }}>
                      '{char}'
                    </span>
                    <span style={{ color: 'var(--sub-color)' }}>
                      <b style={{ color: 'var(--text-color)' }}>{count}</b> marta xato
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs flex items-center justify-center gap-2" style={{ color: 'var(--main-color)' }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>Tabriklaymiz! Ushbu testda umuman xatolik sodir bo'lmadi!</span>
              </div>
            )}
          </div>

          {/* Advice */}
          <div className="p-3.5 rounded-xl border text-xs leading-relaxed" style={{ backgroundColor: 'var(--sub-alt-color)', borderColor: 'rgba(128, 128, 128, 0.15)', color: 'var(--sub-color)' }}>
            <span className="font-bold block mb-1 text-[var(--main-color)]">Maslahat:</span>
            Tezlikni oshirish uchun avval xatolarni minimal darajaga tushiring. 98%+ aniqlikka erishganingizdan so'ng tabiiy ritm paydo bo'ladi va tezlik o'z-o'zidan keskin ko'tariladi.
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3 border-t text-[11px] flex items-center justify-end"
          style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
            style={{ backgroundColor: 'var(--main-color)', color: 'var(--bg-color)' }}
          >
            Tushundim
          </button>
        </div>
      </div>
    </div>
  );
};
