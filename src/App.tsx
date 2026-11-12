/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TestSettingsBar } from './components/TestSettingsBar';
import { TypingArea } from './components/TypingArea';
import { ResultView } from './components/ResultView';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { CustomTimeModal } from './components/CustomTimeModal';
import { ErrorAnalysisModal } from './components/ErrorAnalysisModal';
import { StatsModal } from './components/StatsModal';
import { Footer } from './components/Footer';

import { THEMES, DEFAULT_THEME, applyTheme } from './themes';
import { LanguageMode, SoundType, TestMode, TestResult, ThemeConfig } from './types';
import { generateWords } from './utils/wordGenerator';
import { calculateRank } from './utils/ranking';

const THEME_STORAGE_KEY = 'typetype_theme_id_v1';
const SOUND_STORAGE_KEY = 'typetype_sound_type_v1';
const HISTORY_STORAGE_KEY = 'typetype_test_history_v1';

export default function App() {
  // Navigation & Modals
  const [currentTab, setCurrentTab] = useState<'test' | 'leaderboard' | 'stats' | 'themes'>('test');
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [showErrorAnalysisModal, setShowErrorAnalysisModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  // App Theme & Sound
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(() => {
    try {
      const savedId = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedId) {
        const found = THEMES.find((t) => t.id === savedId);
        if (found) return found;
      }
    } catch {}
    return DEFAULT_THEME;
  });

  const [soundType, setSoundType] = useState<SoundType>(() => {
    try {
      return (localStorage.getItem(SOUND_STORAGE_KEY) as SoundType) || 'thock';
    } catch {
      return 'thock';
    }
  });

  // Test Configurations
  const [mode, setMode] = useState<TestMode>('time');
  const [timeConfig, setTimeConfig] = useState<number>(30); // 30 seconds default
  const [wordsConfig, setWordsConfig] = useState<number>(25);
  const [language, setLanguage] = useState<LanguageMode>('uzbek_latin');
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(false);

  // Active Words & Test Lifecycle
  const [words, setWords] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testKey, setTestKey] = useState<number>(0); // Increment to force fresh reset

  // Test History
  const [testHistory, setTestHistory] = useState<TestResult[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Apply Theme on change
  useEffect(() => {
    applyTheme(currentTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
    } catch {}
  }, [currentTheme]);

  // Save Sound Preference
  const handleSoundChange = (newSound: SoundType) => {
    setSoundType(newSound);
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, newSound);
    } catch {}
  };

  // Generate words whenever configuration parameters change or restart is triggered
  const initTestWords = useCallback(() => {
    const config = mode === 'time' ? timeConfig : wordsConfig;
    const newWords = generateWords(mode, config, language, includeNumbers, includePunctuation);
    setWords(newWords);
    setTestResult(null);
    setTestKey((prev) => prev + 1);
  }, [mode, timeConfig, wordsConfig, language, includeNumbers, includePunctuation]);

  useEffect(() => {
    initTestWords();
  }, [initTestWords]);

  // Finish Test handler
  const handleFinishTest = useCallback((rawResult: TestResult) => {
    // Calculate Rank Placement among participants
    const rankInfo = calculateRank(
      rawResult.wpm,
      rawResult.accuracy,
      rawResult.mode,
      rawResult.modeConfig,
      rawResult.language
    );

    const fullResult: TestResult = {
      ...rawResult,
      rankPlacement: rankInfo,
    };

    setTestResult(fullResult);

    // Save to local test history
    setTestHistory((prev) => {
      const updated = [fullResult, ...prev].slice(0, 50);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Restart Test
  const handleRestart = useCallback(() => {
    initTestWords();
  }, [initTestWords]);

  // Navigation tab handler
  const handleSelectTab = (tab: 'test' | 'leaderboard' | 'stats' | 'themes') => {
    setCurrentTab(tab);
    if (tab === 'test') {
      setShowLeaderboardModal(false);
      setShowThemeModal(false);
      setShowStatsModal(false);
    } else if (tab === 'leaderboard') {
      setShowLeaderboardModal(true);
    } else if (tab === 'themes') {
      setShowThemeModal(true);
    } else if (tab === 'stats') {
      setShowStatsModal(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[var(--main-color)] selection:text-[var(--bg-color)]">
      {/* Top Bar Contract (3 zones) */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        soundType={soundType}
        onChangeSound={handleSoundChange}
        themeName={currentTheme.name}
        onOpenThemeModal={() => setShowThemeModal(true)}
        onRestartTest={handleRestart}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-4">
        {!testResult ? (
          <>
            {/* Quick Settings Bar */}
            <TestSettingsBar
              mode={mode}
              onChangeMode={(m) => {
                setMode(m);
                setTestResult(null);
              }}
              timeConfig={timeConfig}
              onChangeTimeConfig={(t) => {
                setTimeConfig(t);
                setTestResult(null);
              }}
              wordsConfig={wordsConfig}
              onChangeWordsConfig={(w) => {
                setWordsConfig(w);
                setTestResult(null);
              }}
              language={language}
              onChangeLanguage={(lang) => {
                setLanguage(lang);
                setTestResult(null);
              }}
              includeNumbers={includeNumbers}
              onToggleNumbers={() => {
                setIncludeNumbers((prev) => !prev);
                setTestResult(null);
              }}
              includePunctuation={includePunctuation}
              onTogglePunctuation={() => {
                setIncludePunctuation((prev) => !prev);
                setTestResult(null);
              }}
              onOpenCustomModal={() => setShowCustomTimeModal(true)}
            />

            {/* Monkeytype-Style Real-Time Typing Area */}
            {words.length > 0 && (
              <TypingArea
                key={testKey}
                words={words}
                mode={mode}
                timeLimit={timeConfig}
                wordCountLimit={wordsConfig}
                soundType={soundType}
                onFinishTest={handleFinishTest}
                onRestart={handleRestart}
                language={language}
                includeNumbers={includeNumbers}
                includePunctuation={includePunctuation}
              />
            )}
          </>
        ) : (
          /* Results View with Ranking & Error Breakdown */
          <ResultView
            result={testResult}
            onRestart={handleRestart}
            onViewLeaderboard={() => setShowLeaderboardModal(true)}
            onViewErrorAnalysis={() => setShowErrorAnalysisModal(true)}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <Footer
        onRestart={handleRestart}
        onOpenThemeModal={() => setShowThemeModal(true)}
      />

      {/* Modals */}
      <LeaderboardModal
        isOpen={showLeaderboardModal}
        onClose={() => {
          setShowLeaderboardModal(false);
          setCurrentTab('test');
        }}
        currentUserRank={testResult?.rankPlacement.rankPosition}
      />

      <ThemeSelectorModal
        isOpen={showThemeModal}
        onClose={() => {
          setShowThemeModal(false);
          setCurrentTab('test');
        }}
        currentThemeId={currentTheme.id}
        onSelectTheme={(theme) => setCurrentTheme(theme)}
      />

      <CustomTimeModal
        isOpen={showCustomTimeModal}
        onClose={() => setShowCustomTimeModal(false)}
        mode={mode}
        currentTime={timeConfig}
        currentWords={wordsConfig}
        onSaveTime={(sec) => {
          setTimeConfig(sec);
          initTestWords();
        }}
        onSaveWords={(cnt) => {
          setWordsConfig(cnt);
          initTestWords();
        }}
      />

      {testResult && (
        <ErrorAnalysisModal
          isOpen={showErrorAnalysisModal}
          onClose={() => setShowErrorAnalysisModal(false)}
          keyErrors={testResult.keyErrors}
          totalErrors={testResult.charStats.incorrect + testResult.charStats.extra}
          totalCorrect={testResult.charStats.correct}
        />
      )}

      <StatsModal
        isOpen={showStatsModal}
        onClose={() => {
          setShowStatsModal(false);
          setCurrentTab('test');
        }}
        history={testHistory}
      />
    </div>
  );
}
