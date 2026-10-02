import { WordEntry } from '../types';

/**
 * Normalizes text for forgiving matching in both English and Bengali
 */
export function normalizeText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[।.,?!;:'"()[\]{}]/g, '')
    .normalize('NFC');
}

/**
 * Checks if a string contains Bengali Unicode characters
 */
export function isBengaliText(str: string): boolean {
  return /[\u0980-\u09FF]/.test(str);
}

/**
 * Common phonetic transliteration mappings for Bengali search
 */
const phoneticAliases: Record<string, string[]> = {
  durbojjho: ['abstruse', 'esoteric'],
  durbodh: ['abstruse'],
  khonosthayi: ['ephemeral'],
  sholpojeebi: ['ephemeral'],
  shorbobapi: ['ubiquitous'],
  bisshasghatok: ['perfidious'],
  ashabadi: ['sanguine'],
  darthobodhok: ['equivocal'],
  mohanubhob: ['magnanimous'],
  udar: ['magnanimous', 'munificent'],
  khutkhute: ['fastidious'],
  shrutikotu: ['cacophony'],
  obastob: ['quixotic'],
  sholpobhashi: ['taciturn', 'laconic'],
  mohoushodh: ['panacea'],
  durbol: ['enervate'],
  onomoniyo: ['intransigent'],
  petuk: ['voracious'],
  porishromi: ['assiduous'],
  shumodhur: ['mellifluous'],
  kripon: ['parsimonious'],
  shoccho: ['pellucid'],
  bachal: ['loquacious'],
  nirdosh: ['vindicate'],
  ohongkari: ['supercilious', 'hubris'],
  proshomito: ['mitigate'],
  khotikor: ['deleterious', 'pernicious'],
  mishuk: ['gregarious'],
  prothabirodhi: ['iconoclast'],
  shirsho: ['zenith']
};

/**
 * Smart search algorithm for English and Bengali words
 */
export function searchDictionary(
  words: WordEntry[], 
  query: string, 
  filters?: {
    level?: string;
    targetExam?: string;
  }
): WordEntry[] {
  const cleanQuery = normalizeText(query);
  
  let filtered = words;

  if (filters?.level && filters.level !== 'ALL') {
    filtered = filtered.filter(w => w.cefrLevel === filters.level);
  }

  if (filters?.targetExam && filters.targetExam !== 'ALL') {
    filtered = filtered.filter(w => w.targetExams.some(e => e.includes(filters.targetExam!)));
  }

  if (!cleanQuery) {
    return filtered;
  }

  // Check phonetic alias match
  const aliasWordKeys = phoneticAliases[cleanQuery] || [];

  return filtered.filter(item => {
    // 1. Direct word or phonetic alias match
    if (aliasWordKeys.includes(item.id)) return true;

    // 2. English word start or contains
    const wordClean = normalizeText(item.word);
    if (wordClean.includes(cleanQuery)) return true;

    // 3. Bangla Meaning match
    const bnMeaningClean = normalizeText(item.banglaMeaning);
    if (bnMeaningClean.includes(cleanQuery)) return true;

    // 4. Bangla search keywords match
    const bnKeywordMatch = item.banglaSearchKeywords.some(kw => normalizeText(kw).includes(cleanQuery));
    if (bnKeywordMatch) return true;

    // 5. Synonyms or Antonyms match
    const synMatch = item.synonyms.some(s => normalizeText(s).includes(cleanQuery));
    if (synMatch) return true;

    const antMatch = item.antonyms.some(a => normalizeText(a).includes(cleanQuery));
    if (antMatch) return true;

    // 6. English definition match
    if (normalizeText(item.englishDefinition).includes(cleanQuery)) return true;

    return false;
  });
}
