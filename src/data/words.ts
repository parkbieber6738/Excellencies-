import { WordEntry } from '../types';
import { wordsPart1 } from './wordsPart1';
import { wordsPart2 } from './wordsPart2';
import { wordsPart3 } from './wordsPart3';
import { wordsPart4 } from './wordsPart4';
import { wordsPart5 } from './wordsPart5';
import { wordsPart6 } from './wordsPart6';
import { wordsPart7 } from './wordsPart7';

export const allWords: WordEntry[] = [
  ...wordsPart1,
  ...wordsPart2,
  ...wordsPart3,
  ...wordsPart4,
  ...wordsPart5,
  ...wordsPart6,
  ...wordsPart7
];

export function getWordById(id: string): WordEntry | undefined {
  return allWords.find(w => w.id.toLowerCase() === id.toLowerCase() || w.word.toLowerCase() === id.toLowerCase());
}

export function getDailyWord(): WordEntry {
  // Deterministic daily word based on current date
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = Math.abs(dayOfYear) % allWords.length;
  return allWords[index] || allWords[0];
}

export function getRecommendedFiveWords(learnedIds: string[]): WordEntry[] {
  const unlearned = allWords.filter(w => !learnedIds.includes(w.id));
  if (unlearned.length >= 5) {
    return unlearned.slice(0, 5);
  }
  return allWords.slice(0, 5);
}
