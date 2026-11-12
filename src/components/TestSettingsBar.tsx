import React from 'react';
import { AtSign, Hash, Clock, FileText, Quote, Sliders, Globe } from 'lucide-react';
import { LanguageMode, TestMode } from '../types';

interface TestSettingsBarProps {
  mode: TestMode;
  onChangeMode: (mode: TestMode) => void;
  timeConfig: number;
  onChangeTimeConfig: (seconds: number) => void;
  wordsConfig: number;
  onChangeWordsConfig: (words: number) => void;
  language: LanguageMode;
  onChangeLanguage: (lang: LanguageMode) => void;
  includeNumbers: boolean;
  onToggleNumbers: () => void;
  includePunctuation: boolean;
  onTogglePunctuation: () => void;
  onOpenCustomModal: () => void;
}

export const TestSettingsBar: React.FC<TestSettingsBarProps> = ({
  mode,
  onChangeMode,
  timeConfig,
  onChangeTimeConfig,
  wordsConfig,
  onChangeWordsConfig,
  language,
  onChangeLanguage,
  includeNumbers,
  onToggleNumbers,
  includePunctuation,
  onTogglePunctuation,
  onOpenCustomModal,
}) => {
  const timePresets = [15, 30, 60, 120];
  const wordPresets = [10, 25, 50, 100];

  return (
    <div
      className="max-w-4xl mx-auto my-4 px-4 py-2 rounded-xl flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-mono transition-colors"
      style={{ backgroundColor: 'var(--sub-alt-color)' }}
    >
      {/* Group 1: Punctuation & Numbers */}
      <div className="flex items-center gap-1 border-r pr-3 sm:pr-4" style={{ borderColor: 'rgba(128, 128, 128, 0.2)' }}>
        <button
          onClick={onTogglePunctuation}
          className="flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: includePunctuation ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title="Tinish belgilari (@)"
        >
          <AtSign className="w-3.5 h-3.5" />
          <span>tinish</span>
        </button>
        <button
          onClick={onToggleNumbers}
          className="flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: includeNumbers ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title="Sonlar (#)"
        >
          <Hash className="w-3.5 h-3.5" />
          <span>sonlar</span>
        </button>
      </div>

      {/* Group 2: Mode Selector */}
      <div className="flex items-center gap-1 border-r pr-3 sm:pr-4" style={{ borderColor: 'rgba(128, 128, 128, 0.2)' }}>
        <button
          onClick={() => onChangeMode('time')}
          className="flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: mode === 'time' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>vaqt</span>
        </button>

        <button
          onClick={() => onChangeMode('words')}
          className="flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: mode === 'words' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>so'zlar</span>
        </button>

        <button
          onClick={() => onChangeMode('quote')}
          className="flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: mode === 'quote' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>iqtibos</span>
        </button>
      </div>

      {/* Group 3: Sub-options (Seconds or Word count) */}
      <div className="flex items-center gap-1 border-r pr-3 sm:pr-4" style={{ borderColor: 'rgba(128, 128, 128, 0.2)' }}>
        {mode === 'time' && (
          <>
            {timePresets.map((t) => (
              <button
                key={t}
                onClick={() => onChangeTimeConfig(t)}
                className="px-2 py-1 rounded transition-colors cursor-pointer"
                style={{
                  color: timeConfig === t ? 'var(--main-color)' : 'var(--sub-color)',
                }}
              >
                {t}s
              </button>
            ))}
            <button
              onClick={onOpenCustomModal}
              className="flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
              style={{
                color: !timePresets.includes(timeConfig) ? 'var(--main-color)' : 'var(--sub-color)',
              }}
              title="O'zingiz xohlagan sekundni kiriting"
            >
              <Sliders className="w-3 h-3" />
              <span>{!timePresets.includes(timeConfig) ? `${timeConfig}s` : 'boshqa'}</span>
            </button>
          </>
        )}

        {mode === 'words' && (
          <>
            {wordPresets.map((w) => (
              <button
                key={w}
                onClick={() => onChangeWordsConfig(w)}
                className="px-2 py-1 rounded transition-colors cursor-pointer"
                style={{
                  color: wordsConfig === w ? 'var(--main-color)' : 'var(--sub-color)',
                }}
              >
                {w}
              </button>
            ))}
            <button
              onClick={onOpenCustomModal}
              className="flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer"
              style={{
                color: !wordPresets.includes(wordsConfig) ? 'var(--main-color)' : 'var(--sub-color)',
              }}
              title="O'zingiz xohlagan so'zlar sonini kiriting"
            >
              <Sliders className="w-3 h-3" />
              <span>{!wordPresets.includes(wordsConfig) ? `${wordsConfig}` : 'boshqa'}</span>
            </button>
          </>
        )}

        {mode === 'quote' && (
          <span className="text-[11px] px-2 py-1" style={{ color: 'var(--sub-color)' }}>
            hikmatli so'zlar
          </span>
        )}
      </div>

      {/* Group 4: Language Selector */}
      <div className="flex items-center gap-1">
        <Globe className="w-3.5 h-3.5 mr-0.5" style={{ color: 'var(--sub-color)' }} />
        <button
          onClick={() => onChangeLanguage('uzbek_latin')}
          className="px-2 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: language === 'uzbek_latin' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title="O'zbek tili (Lotin)"
        >
          uz-lat
        </button>
        <button
          onClick={() => onChangeLanguage('uzbek_cyrillic')}
          className="px-2 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: language === 'uzbek_cyrillic' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title="Ўзбек тили (Кирилл)"
        >
          ўз-кир
        </button>
        <button
          onClick={() => onChangeLanguage('english')}
          className="px-2 py-1 rounded transition-colors cursor-pointer"
          style={{
            color: language === 'english' ? 'var(--main-color)' : 'var(--sub-color)',
          }}
          title="English"
        >
          en
        </button>
      </div>
    </div>
  );
};
