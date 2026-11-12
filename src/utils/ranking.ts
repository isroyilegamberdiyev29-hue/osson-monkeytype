import { LeaderboardEntry, RankInfo, TestMode, LanguageMode } from '../types';

const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb_1', username: 'Javohir_Coder', wpm: 136, accuracy: 98, rawWpm: 140, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: 'Bugun' },
  { id: 'lb_2', username: 'TypingSamurai', wpm: 124, accuracy: 99, rawWpm: 126, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: 'Kecha' },
  { id: 'lb_3', username: 'Malika_IT', wpm: 114, accuracy: 97, rawWpm: 118, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '2 kun oldin' },
  { id: 'lb_4', username: 'Alisher_Swift', wpm: 102, accuracy: 96, rawWpm: 107, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '3 kun oldin' },
  { id: 'lb_5', username: 'Ulugbek_Dev', wpm: 93, accuracy: 95, rawWpm: 98, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '4 kun oldin' },
  { id: 'lb_6', username: 'Azizbek_Type', wpm: 85, accuracy: 96, rawWpm: 89, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '5 kun oldin' },
  { id: 'lb_7', username: 'Shahzod_99', wpm: 76, accuracy: 94, rawWpm: 81, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '1 hafta oldin' },
  { id: 'lb_8', username: 'Nodira_K', wpm: 68, accuracy: 93, rawWpm: 72, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '1 hafta oldin' },
  { id: 'lb_9', username: 'Bobur_Pro', wpm: 61, accuracy: 92, rawWpm: 66, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '2 hafta oldin' },
  { id: 'lb_10', username: 'Dilnoza_S', wpm: 53, accuracy: 91, rawWpm: 57, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '2 hafta oldin' },
  { id: 'lb_11', username: 'Farhod_Uz', wpm: 46, accuracy: 89, rawWpm: 50, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '3 hafta oldin' },
  { id: 'lb_12', username: 'Sherzod_T', wpm: 38, accuracy: 88, rawWpm: 42, mode: 'time', modeConfig: 30, language: 'uzbek_latin', date: '1 oy oldin' },
];

const STORAGE_KEY = 'typetype_leaderboard_v1';
const HISTORY_KEY = 'typetype_history_v1';
const USERNAME_KEY = 'typetype_username_v1';

export function getStoredLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return INITIAL_LEADERBOARD;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
      return INITIAL_LEADERBOARD;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_LEADERBOARD;
  } catch {
    return INITIAL_LEADERBOARD;
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export function getSavedUsername(): string {
  try {
    return localStorage.getItem(USERNAME_KEY) || 'Siz (Foydalanuvchi)';
  } catch {
    return 'Siz (Foydalanuvchi)';
  }
}

export function saveUsername(name: string): void {
  try {
    localStorage.setItem(USERNAME_KEY, name.trim());
  } catch (e) {
    console.error('Failed to save username', e);
  }
}

export function calculateRank(
  wpm: number,
  accuracy: number,
  mode: TestMode,
  modeConfig: number | string,
  language: LanguageMode
): RankInfo {
  // Get all leaderboard entries
  const currentLeaderboard = getStoredLeaderboard();
  
  // Rank position calculation
  // Count how many people scored higher than this WPM (or same WPM with higher accuracy)
  let position = 1;
  currentLeaderboard.forEach((entry) => {
    if (entry.wpm > wpm || (entry.wpm === wpm && entry.accuracy > accuracy)) {
      position++;
    }
  });

  const total = currentLeaderboard.length + 1;
  const percentile = Math.max(1, Math.round(((total - position + 1) / total) * 100));

  // Determine Tier
  if (wpm >= 120) {
    return {
      tierName: 'Godlike / Afsonaviy',
      badge: '👑',
      color: '#e2b714',
      rankPosition: position,
      totalParticipants: total,
      percentile: 99,
      titleUz: `${position}-o'rin (Afsonaviy Daraja)`,
      descriptionUz: 'Aqlbovar qilmas tezlik! Siz dunyodagi eng tez yozuvchilarning 1% qatoridasiz.',
    };
  }

  if (wpm >= 100) {
    return {
      tierName: 'Master / Usta',
      badge: '💎',
      color: '#bd93f9',
      rankPosition: position,
      totalParticipants: total,
      percentile: 95,
      titleUz: `${position}-o'rin (Master Daraja)`,
      descriptionUz: 'Yuqori professional mahorat! Klaviaturani ko\'rmasdan benuqson yozasiz.',
    };
  }

  if (wpm >= 80) {
    return {
      tierName: 'Professional',
      badge: '🚀',
      color: '#40a9ff',
      rankPosition: position,
      totalParticipants: total,
      percentile: 85,
      titleUz: `${position}-o'rin (Professional)`,
      descriptionUz: 'Juda tez va chaqqon! IT mutaxassislari darajasidagi ajoyib tezlik.',
    };
  }

  if (wpm >= 60) {
    return {
      tierName: 'Tezkor / Fast',
      badge: '⚡',
      color: '#00ff66',
      rankPosition: position,
      totalParticipants: total,
      percentile: 70,
      titleUz: `${position}-o'rin (Tezkor)`,
      descriptionUz: 'O\'rtachadan ancha yuqori tezlik! Kunda bir necha mashq bilan Master bo\'lishingiz mumkin.',
    };
  }

  if (wpm >= 40) {
    return {
      tierName: 'O\'rtacha / Normal',
      badge: '📈',
      color: '#f66e0d',
      rankPosition: position,
      totalParticipants: total,
      percentile: 50,
      titleUz: `${position}-o'rin (O'rtacha)`,
      descriptionUz: 'Yaxshi boshlanish! To\'g\'ri barmoq texnikasini qo\'llasangiz, tezlik yanada oshadi.',
    };
  }

  return {
    tierName: 'Boshlang\'ich / Beginner',
    badge: '🌱',
    color: '#646669',
    rankPosition: position,
    totalParticipants: total,
    percentile: 25,
    titleUz: `${position}-o'rin (Boshlang'ich)`,
    descriptionUz: 'Mashq qilishda davom eting! Xatolarni kamaytirish orqali tezlik tez orada ko\'tariladi.',
  };
}

export function addScoreToLeaderboard(
  username: string,
  wpm: number,
  accuracy: number,
  rawWpm: number,
  mode: TestMode,
  modeConfig: number | string,
  language: LanguageMode
): { updatedEntries: LeaderboardEntry[]; newRank: number } {
  const list = getStoredLeaderboard().filter((e) => !e.isCurrentUser);

  const newEntry: LeaderboardEntry = {
    id: 'user_' + Date.now(),
    username: username || 'Siz',
    wpm,
    accuracy,
    rawWpm,
    mode,
    modeConfig,
    language,
    date: 'Hozir',
    isCurrentUser: true,
  };

  const combined = [...list, newEntry].sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  saveLeaderboard(combined);
  const newRank = combined.findIndex((e) => e.id === newEntry.id) + 1;

  return {
    updatedEntries: combined,
    newRank,
  };
}
