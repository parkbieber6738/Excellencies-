import React, { useState } from 'react';
import { 
  Compass, 
  Volume2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  BookOpen, 
  FileText 
} from 'lucide-react';
import { WordEntry, UserSettings } from '../types';
import { speakWord } from '../utils/speech';

interface SentenceUsageStudioProps {
  words: WordEntry[];
  selectedWord: WordEntry;
  onSelectWord: (word: WordEntry) => void;
  settings: UserSettings;
}

export const SentenceUsageStudio: React.FC<SentenceUsageStudioProps> = ({
  words,
  selectedWord,
  onSelectWord,
  settings,
}) => {
  const [userSentence, setUserSentence] = useState('');
  const [feedback, setFeedback] = useState<{
    status: 'success' | 'warning' | 'info' | null;
    message: string;
    details?: string[];
  }>({ status: null, message: '' });

  const handleTestSentence = () => {
    if (!userSentence.trim()) {
      setFeedback({
        status: 'warning',
        message: 'Please write a sentence first before testing.',
      });
      return;
    }

    const lowerSentence = userSentence.toLowerCase();
    const wordRoot = selectedWord.word.toLowerCase();
    const containsWord = lowerSentence.includes(wordRoot);

    if (!containsWord) {
      setFeedback({
        status: 'warning',
        message: `Your sentence does not appear to contain the word "${selectedWord.word}". Try incorporating it naturally!`,
      });
      return;
    }

    const wordCount = userSentence.trim().split(/\s+/).length;
    const endsWithPunctuation = /[.!?]$/.test(userSentence.trim());

    const suggestions: string[] = [];
    if (wordCount < 6) {
      suggestions.push('Try expanding your sentence with more descriptive context or dependent clauses.');
    }
    if (!endsWithPunctuation) {
      suggestions.push('Remember to end your sentence with proper terminal punctuation (., !, or ?).');
    }

    setFeedback({
      status: 'success',
      message: `Excellent sentence composition using "${selectedWord.word}"!`,
      details: [
        `Word count: ${wordCount} words (Ideal for academic essays)`,
        `Target word "${selectedWord.word}" identified correctly`,
        ...suggestions,
      ],
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>Usage Studio & Collocation Master</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Where Can I Use This Word?
          </h2>
          <p className="text-white/80 text-sm max-w-xl font-medium">
            Discover the exact academic registers, natural collocations, and university admission contexts where C1/C2 words create maximum impact.
          </p>
        </div>

        {/* Word Switcher */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 self-start md:self-center">
          <span className="text-[11px] font-bold text-white/80 uppercase block mb-1">Select Word to Explore</span>
          <select
            value={selectedWord.id}
            onChange={(e) => {
              const target = words.find(w => w.id === e.target.value);
              if (target) {
                onSelectWord(target);
                setUserSentence('');
                setFeedback({ status: null, message: '' });
              }
            }}
            className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {words.map((w) => (
              <option key={w.id} value={w.id}>
                {w.word} ({w.cefrLevel}) - {w.banglaMeaning.slice(0, 20)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Target Word Hero Details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-3xl sm:text-4xl font-extrabold font-serif-title text-slate-900 dark:text-white">
                {selectedWord.word}
              </h3>
              <span className="text-base font-mono text-indigo-600 dark:text-indigo-400">
                {selectedWord.phonetic}
              </span>
              <button
                onClick={() => speakWord(selectedWord.word, { accent: settings.voiceAccent, rate: settings.speechRate })}
                className="p-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
                title="Pronounce"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            <p className="font-bengali text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
              বাংলা অর্থ: {selectedWord.banglaMeaning}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              Level {selectedWord.cefrLevel}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              Register: {selectedWord.usage.recommendedRegister}
            </span>
          </div>
        </div>

        {/* Recommended Contexts & Collocations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Natural Collocations */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              High-Scoring Collocations (প্রাকৃতিক শব্দযুগল)
            </h4>
            <p className="text-xs text-slate-500">
              Academic examiners look for these natural word pairings in DU written exams and IELTS essays:
            </p>
            <div className="space-y-2">
              {selectedWord.usage.collocations.map((col, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-semibold font-mono text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  {col}
                </div>
              ))}
            </div>
          </div>

          {/* Exam Sentence Reference */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Standard Exam Sentence Exemplar
            </h4>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 space-y-2">
              <p className="text-sm italic text-slate-800 dark:text-slate-100 font-medium">
                "{selectedWord.usage.sentence}"
              </p>
              <p className="font-bengali text-xs text-slate-500 dark:text-slate-400">
                বাংলা অর্থ: {selectedWord.usage.banglaTranslation}
              </p>
            </div>
            {selectedWord.usage.examNote && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
                <strong>DU Question Setter's Tip:</strong> {selectedWord.usage.examNote}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Sentence Builder Workbench */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Sentence Builder Workbench (বাক্য গঠন অনুশীলন)
            </h4>
            <p className="text-xs text-slate-500">
              Draft your own sentence using <span className="font-bold text-indigo-600 dark:text-indigo-400">"{selectedWord.word}"</span> to cement your active vocabulary memory.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={userSentence}
            onChange={(e) => setUserSentence(e.target.value)}
            placeholder={`Example: In his university graduation speech, the chancellor made a ${selectedWord.word.toLowerCase()} plea for unity...`}
            className="w-full text-sm p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {userSentence.trim().split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              onClick={handleTestSentence}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Evaluate Sentence</span>
            </button>
          </div>

          {/* Feedback Display */}
          {feedback.status && (
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              feedback.status === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {feedback.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
                <span>{feedback.message}</span>
              </div>
              {feedback.details && (
                <ul className="list-disc list-inside space-y-0.5 pt-1 text-slate-700 dark:text-slate-300">
                  {feedback.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
