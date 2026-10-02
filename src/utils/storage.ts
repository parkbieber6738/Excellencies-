import { UserSettings, DailyProgress, MockTestResult } from '../types';

const STORAGE_KEYS = {
  FAVORITES: 'lexicon_favorites',
  COLLECTIONS: 'lexicon_collections',
  USER_NOTES: 'lexicon_notes',
  SETTINGS: 'lexicon_settings',
  DAILY_PROGRESS: 'lexicon_daily_progress',
  MOCK_RESULTS: 'lexicon_mock_results',
};

export const defaultSettings: UserSettings = {
  theme: 'light',
  fontSize: 'md',
  voiceAccent: 'en-US',
  speechRate: 1.0,
  soundEnabled: true,
  showBanglaKeywords: true,
};

export function getStoredFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : ['abstruse', 'ephemeral', 'ubiquitous'];
  } catch {
    return [];
  }
}

export function saveStoredFavorites(favs: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  } catch (err) {
    console.error('Failed to save favorites', err);
  }
}

export function toggleFavorite(wordId: string): string[] {
  const current = getStoredFavorites();
  const exists = current.includes(wordId);
  const updated = exists ? current.filter(id => id !== wordId) : [...current, wordId];
  saveStoredFavorites(updated);
  return updated;
}

export function getStoredSettings(): UserSettings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveStoredSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

export function getStoredDailyProgress(): DailyProgress {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultProgress: DailyProgress = {
    date: todayStr,
    wordOfTheDayId: 'abstruse',
    learnedWordIds: [],
    quizCompleted: false,
    quizScore: 0,
    streakDays: 1,
    lastActiveDate: todayStr,
  };

  if (typeof window === 'undefined') return defaultProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    if (!raw) return defaultProgress;
    const parsed: DailyProgress = JSON.parse(raw);
    
    // Check if new day
    if (parsed.date !== todayStr) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const streakContinued = parsed.lastActiveDate === yesterday;
      return {
        ...defaultProgress,
        date: todayStr,
        streakDays: streakContinued ? parsed.streakDays + 1 : 1,
        lastActiveDate: todayStr,
      };
    }
    return parsed;
  } catch {
    return defaultProgress;
  }
}

export function saveStoredDailyProgress(progress: DailyProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save daily progress', err);
  }
}

export function getStoredMockResults(): MockTestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MOCK_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMockResult(result: MockTestResult): MockTestResult[] {
  const list = [result, ...getStoredMockResults()];
  if (typeof window === 'undefined') return list;
  try {
    localStorage.setItem(STORAGE_KEYS.MOCK_RESULTS, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save mock test result', err);
  }
  return list;
}

export function getStoredWordNotes(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_NOTES);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWordNote(wordId: string, note: string): Record<string, string> {
  const current = getStoredWordNotes();
  const updated = { ...current, [wordId]: note };
  if (typeof window === 'undefined') return updated;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_NOTES, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save word note', err);
  }
  return updated;
}
