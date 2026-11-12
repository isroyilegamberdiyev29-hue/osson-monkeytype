export type TestMode = 'time' | 'words' | 'quote';

export type LanguageMode = 'uzbek_latin' | 'uzbek_cyrillic' | 'english';

export type SoundType = 'off' | 'thock' | 'click' | 'linear' | 'typewriter';

export type CaretStyle = 'line' | 'block' | 'underline' | 'outline';

export interface ThemeConfig {
  id: string;
  name: string;
  bgColor: string;
  mainColor: string;
  caretColor: string;
  subColor: string;
  subAltColor: string;
  textColor: string;
  errorColor: string;
  errorExtraColor: string;
  isLight?: boolean;
}

export interface CharacterStatus {
  char: string;
  status: 'correct' | 'incorrect' | 'extra' | 'missed' | 'untyped';
}

export interface WordData {
  original: string;
  typed: string;
  isComplete: boolean;
  isCurrent: boolean;
}

export interface TimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeSpent: number;
  mode: TestMode;
  modeConfig: number | string;
  language: LanguageMode;
  numbers: boolean;
  punctuation: boolean;
  charStats: {
    correct: number;
    incorrect: number;
    extra: number;
    missed: number;
    total: number;
  };
  keyErrors: Record<string, number>;
  timeline: TimelinePoint[];
  rankPlacement: RankInfo;
}

export interface RankInfo {
  tierName: string;
  badge: string;
  color: string;
  rankPosition: number;
  totalParticipants: number;
  percentile: number;
  titleUz: string;
  descriptionUz: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  wpm: number;
  accuracy: number;
  rawWpm: number;
  mode: TestMode;
  modeConfig: number | string;
  language: LanguageMode;
  date: string;
  isCurrentUser?: boolean;
}
