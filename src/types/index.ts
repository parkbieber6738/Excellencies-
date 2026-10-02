export type CefrLevel = 'C1' | 'C2' | 'Exam Prep (DU/IBA)';

export type ExamCategory = 
  | 'DU Kha/B Unit' 
  | 'DU IBA' 
  | 'DU Ga/C Unit' 
  | 'DU Ka/A Unit' 
  | 'IELTS (7.5-9.0)' 
  | 'GRE Advanced' 
  | 'BCS Cadre' 
  | 'SAT/TOEFL';

export interface SentenceUsageInfo {
  sentence: string;
  banglaTranslation: string;
  context: string; // e.g. "DU Written Exam / Critical Analysis"
  collocations: string[]; // e.g. ["abstruse reasoning", "abstruse philosophical doctrine"]
  examNote?: string;
  recommendedRegister: 'Academic' | 'Formal' | 'Journalistic' | 'Literary';
}

export interface WordEntry {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb';
  partOfSpeechBn: string; // e.g. "বিশেষণ"
  cefrLevel: CefrLevel;
  targetExams: ExamCategory[];
  banglaMeaning: string;
  banglaSearchKeywords: string[]; // For smart Bangla matching
  englishDefinition: string;
  synonyms: string[];
  antonyms: string[];
  usage: SentenceUsageInfo;
  etymology: string;
  mnemonic: string;
  frequency: number; // 1 to 5
  duPreviousYear?: string; // e.g. "DU Kha 2021-22, IBA 2018"
}

export interface AdmissionQuestion {
  id: string;
  questionText: string;
  banglaContext?: string;
  questionType: 'Synonym' | 'Antonym' | 'Analogy' | 'Sentence Completion' | 'Appropriate Preposition';
  targetUnit: 'DU Kha' | 'DU IBA' | 'DU Ga' | 'CU/RU/GST' | 'Medical/Engineering';
  sourceYear: string; // e.g. "DU 'Kha' Unit 2022-23"
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  explanationBn: string;
  associatedWord?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'sepia' | 'du';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  voiceAccent: 'en-US' | 'en-GB';
  speechRate: number; // 0.8, 1.0, 1.2
  soundEnabled: boolean;
  showBanglaKeywords: boolean;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  wordOfTheDayId: string;
  learnedWordIds: string[];
  quizCompleted: boolean;
  quizScore: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface MockTestResult {
  id: string;
  date: string;
  unit: string;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  score: number; // +1 for correct, -0.25 for wrong
  timeSpentSeconds: number;
}
