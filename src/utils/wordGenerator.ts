import { LanguageMode, TestMode } from '../types';
import { UZBEK_LATIN_WORDS, UZBEK_CYRILLIC_WORDS } from '../words/uzbek';
import { ENGLISH_WORDS } from '../words/english';
import { QUOTES } from '../words/quotes';

export function generateWords(
  mode: TestMode,
  modeConfig: number | string,
  language: LanguageMode,
  includeNumbers: boolean,
  includePunctuation: boolean
): string[] {
  if (mode === 'quote') {
    // Select an appropriate quote
    const filtered = QUOTES.filter((q) => {
      if (language === 'english') return q.language === 'english';
      return q.language === 'uzbek';
    });
    const quote = filtered[Math.floor(Math.random() * filtered.length)] || QUOTES[0];
    return quote.text.split(' ');
  }

  // Get base word bank
  let baseList: string[] = UZBEK_LATIN_WORDS;
  if (language === 'uzbek_cyrillic') {
    baseList = UZBEK_CYRILLIC_WORDS;
  } else if (language === 'english') {
    baseList = ENGLISH_WORDS;
  }

  // Determine how many words to generate
  let count = 60;
  if (mode === 'words') {
    count = typeof modeConfig === 'number' ? modeConfig : 25;
  } else if (mode === 'time') {
    // For time mode, generate enough words for continuous typing (at least 150 words)
    const seconds = typeof modeConfig === 'number' ? modeConfig : 30;
    count = Math.max(120, Math.ceil(seconds * 3.5));
  }

  const result: string[] = [];
  const punctuationMarks = ['.', ',', ';', '!', '?', ':'];

  for (let i = 0; i < count; i++) {
    // 10% chance to insert a random number if numbers toggle is active
    if (includeNumbers && Math.random() < 0.12) {
      const num = Math.floor(Math.random() * 900) + 10;
      result.push(num.toString());
      continue;
    }

    const randomIndex = Math.floor(Math.random() * baseList.length);
    let word = baseList[randomIndex];

    // If punctuation is enabled
    if (includePunctuation) {
      // 15% chance to capitalize first letter
      if (Math.random() < 0.15) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      // 15% chance to append a punctuation mark
      if (Math.random() < 0.15 && i !== count - 1) {
        const mark = punctuationMarks[Math.floor(Math.random() * punctuationMarks.length)];
        word = word + mark;
      }
    }

    result.push(word);
  }

  return result;
}
