import React, { useState } from 'react';
import { Palette, Check, X, Sliders, RefreshCw } from 'lucide-react';
import { THEMES } from '../themes';
import { ThemeConfig } from '../types';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: string;
  onSelectTheme: (theme: ThemeConfig) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  const [tab, setTab] = useState<'presets' | 'custom'>('presets');

  // Custom theme editor state
  const [customTheme, setCustomTheme] = useState<ThemeConfig>({
    id: 'custom_user_theme',
    name: 'Shaxsiy Ranglar',
    bgColor: '#1e1e2e',
    mainColor: '#f38ba8',
    caretColor: '#f38ba8',
    subColor: '#6c7086',
    subAltColor: '#181825',
    textColor: '#cdd6f4',
    errorColor: '#f38ba8',
    errorExtraColor: '#eba0ac',
  });

  if (!isOpen) return null;

  const handleApplyCustom = () => {
    onSelectTheme(customTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
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
            <Palette className="w-5 h-5" style={{ color: 'var(--main-color)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-color)' }}>
              Ranglar va Mavzular (Themes)
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

        {/* Tab switch */}
        <div
          className="px-6 py-2.5 border-b flex items-center gap-2 text-xs"
          style={{ borderColor: 'rgba(128, 128, 128, 0.15)', backgroundColor: 'var(--bg-color)' }}
        >
          <button
            onClick={() => setTab('presets')}
            className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium"
            style={{
              backgroundColor: tab === 'presets' ? 'var(--main-color)' : 'transparent',
              color: tab === 'presets' ? 'var(--bg-color)' : 'var(--sub-color)',
            }}
          >
            Tayyor Mavzular ({THEMES.length})
          </button>

          <button
            onClick={() => setTab('custom')}
            className="px-3 py-1.5 rounded-lg transition-colors cursor-pointer font-medium flex items-center gap-1.5"
            style={{
              backgroundColor: tab === 'custom' ? 'var(--main-color)' : 'transparent',
              color: tab === 'custom' ? 'var(--bg-color)' : 'var(--sub-color)',
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>O'z rangingizni yaratish</span>
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'presets' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {THEMES.map((theme) => {
                const isSelected = theme.id === currentThemeId;

                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme);
                    }}
                    className="p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between group"
                    style={{
                      backgroundColor: theme.bgColor,
                      borderColor: isSelected ? theme.mainColor : 'rgba(128, 128, 128, 0.25)',
                      borderWidth: isSelected ? '2px' : '1px',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-xs truncate" style={{ color: theme.textColor }}>
                        {theme.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: theme.mainColor }} />
                      )}
                    </div>

                    {/* Palette Circles */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: theme.bgColor }} title="Orqa fon" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.mainColor }} title="Asosiy rang" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.subColor }} title="Kutilayotgan matn" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.textColor }} title="Yozilgan matn" />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.errorColor }} title="Xato rangi" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {tab === 'custom' && (
            <div className="space-y-6">
              <p className="text-xs opacity-75" style={{ color: 'var(--sub-color)' }}>
                O'zingizga yoqqan har bir element rangini tanlang va o'ziga xos dizayn yarating:
              </p>

              {/* Color pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Background */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}>
                  <span style={{ color: 'var(--text-color)' }}>Orqa fon rangi (Background)</span>
                  <input
                    type="color"
                    value={customTheme.bgColor}
                    onChange={(e) => setCustomTheme({ ...customTheme, bgColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>

                {/* Main Color */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}>
                  <span style={{ color: 'var(--text-color)' }}>Asosiy rang / Kursor (Main)</span>
                  <input
                    type="color"
                    value={customTheme.mainColor}
                    onChange={(e) => setCustomTheme({ ...customTheme, mainColor: e.target.value, caretColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>

                {/* Sub Color */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}>
                  <span style={{ color: 'var(--text-color)' }}>Kutilayotgan harflar (Sub)</span>
                  <input
                    type="color"
                    value={customTheme.subColor}
                    onChange={(e) => setCustomTheme({ ...customTheme, subColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>

                {/* Text Color */}
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}>
                  <span style={{ color: 'var(--text-color)' }}>To'g'ri yozilgan harf (Text)</span>
                  <input
                    type="color"
                    value={customTheme.textColor}
                    onChange={(e) => setCustomTheme({ ...customTheme, textColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>

                {/* Error Color */}
                <div className="flex items-center justify-between p-3 rounded-xl border sm:col-span-2" style={{ borderColor: 'rgba(128, 128, 128, 0.2)', backgroundColor: 'var(--sub-alt-color)' }}>
                  <span style={{ color: 'var(--text-color)' }}>Xatolik rangi (Error)</span>
                  <input
                    type="color"
                    value={customTheme.errorColor}
                    onChange={(e) => setCustomTheme({ ...customTheme, errorColor: e.target.value, errorExtraColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div
                className="p-4 rounded-xl border font-mono text-base select-none"
                style={{
                  backgroundColor: customTheme.bgColor,
                  borderColor: customTheme.subColor,
                }}
              >
                <div className="text-[11px] mb-2 opacity-60" style={{ color: customTheme.subColor }}>
                  Jonli ko'rinish namunasi:
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: customTheme.textColor }}>to'g'ri_matn</span>
                  <span style={{ color: customTheme.errorColor }} className="underline">
                    xato_harf
                  </span>
                  <span
                    className="inline-block w-0.5 h-5 align-middle"
                    style={{ backgroundColor: customTheme.mainColor }}
                  />
                  <span style={{ color: customTheme.subColor }}>kutilayotgan_soz</span>
                </div>
              </div>

              <button
                onClick={handleApplyCustom}
                className="w-full py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-2 shadow"
                style={{
                  backgroundColor: customTheme.mainColor,
                  color: customTheme.bgColor,
                }}
              >
                <Check className="w-4 h-4" />
                <span>Ushbu shaxsiy ranglarni saqlash va qo'llash</span>
              </button>
            </div>
          )}
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
            Tayyor
          </button>
        </div>
      </div>
    </div>
  );
};
