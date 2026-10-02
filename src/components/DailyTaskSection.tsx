import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  ArrowRight, 
  Trophy, 
  Award, 
  Bookmark, 
  RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WordEntry, DailyProgress, UserSettings } from '../types';
import { speakWord } from '../utils/speech';

interface DailyTaskSectionProps {
  wordOfTheDay: WordEntry;
  recommendedWords: WordEntry[];
  dailyProgress: DailyProgress;
  onUpdateDailyProgress: (progress: DailyProgress) => void;
  onSelectWord: (word: WordEntry) => void;
  onToggleFavorite: (id: string) => void;
  favorites: string[];
  settings: UserSettings;
}

export const DailyTaskSection: React.FC<DailyTaskSectionProps> = ({
  wordOfTheDay,
  recommendedWords,
  dailyProgress,
  onUpdateDailyProgress,
  onSelectWord,
  onToggleFavorite,
  favorites,
  settings,
}) => {
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(dailyProgress.quizCompleted);

  // Generate 5 quick daily questions based on today's recommended words
  const quizWords = recommendedWords.slice(0, 5);
  const currentQuizWord = quizWords[activeQuizIndex];

  // Distractors
  const generateOptions = (word: WordEntry) => {
    const correct = word.banglaMeaning.split(',')[0];
    const others = recommendedWords
      .filter(w => w.id !== word.id)
      .map(w => w.banglaMeaning.split(',')[0])
      .slice(0, 3);
    const combined = [correct, ...others].sort();
    return { options: combined, correctIndex: combined.indexOf(correct) };
  };

  const { options, correctIndex } = currentQuizWord ? generateOptions(currentQuizWord) : { options: [], correctIndex: 0 };

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const isCorrect = idx === correctIndex;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    setTimeout(() => {
      if (activeQuizIndex + 1 < quizWords.length) {
        setActiveQuizIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setQuizFinished(true);
        const updated: DailyProgress = {
          ...dailyProgress,
          quizCompleted: true,
          quizScore: newScore,
          streakDays: dailyProgress.quizCompleted ? dailyProgress.streakDays : dailyProgress.streakDays + 1,
        };
        onUpdateDailyProgress(updated);
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    }, 1200);
  };

  const handlePlayWodAudio = () => {
    speakWord(wordOfTheDay.word, {
      accent: settings.voiceAccent,
      rate: settings.speechRate,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Daily Banner & Streak */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-white" />
            <span>Daily Admission Streak</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {dailyProgress.streakDays} Days Learning Streak!
          </h2>
          <p className="text-white/90 text-sm max-w-xl font-medium">
            Daily consistency is the secret to cracking DU 'Kha' Unit, DU IBA, and GRE vocabulary. Complete today's tasks to maintain your streak.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[160px]">
          <span className="text-xs uppercase tracking-wider font-semibold text-white/80 block">Today's Progress</span>
          <span className="text-3xl font-extrabold block my-1">
            {dailyProgress.quizCompleted ? '100%' : '50%'}
          </span>
          <span className="text-xs text-white/80">
            {dailyProgress.quizCompleted ? 'All tasks done!' : '1 task remaining'}
          </span>
        </div>
      </div>

      {/* Word of the Day Feature Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Word of the Day (আজকের নির্বাচিত শব্দ)
              </span>
              <h3 className="text-sm text-slate-500">Handpicked for University Admission & C1/C2 mastery</h3>
            </div>
          </div>

          <button
            onClick={() => onToggleFavorite(wordOfTheDay.id)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500"
          >
            <Bookmark className={`w-5 h-5 ${favorites.includes(wordOfTheDay.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
            <div className="flex items-baseline gap-3">
              <h4 
                onClick={() => onSelectWord(wordOfTheDay)}
                className="text-3xl sm:text-4xl font-extrabold font-serif-title text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer"
              >
                {wordOfTheDay.word}
              </h4>
              <span className="text-base font-mono text-indigo-600 dark:text-indigo-400">
                {wordOfTheDay.phonetic}
              </span>
              <button
                onClick={handlePlayWodAudio}
                className="p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                title="Listen to pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                {wordOfTheDay.cefrLevel} Level
              </span>
              {wordOfTheDay.duPreviousYear && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                  {wordOfTheDay.duPreviousYear}
                </span>
              )}
            </div>
          </div>

          {/* Meaning */}
          <div className="mb-4">
            <p className="font-bengali text-xl font-bold text-slate-800 dark:text-slate-100">
              বাংলা অর্থ: {wordOfTheDay.banglaMeaning}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {wordOfTheDay.englishDefinition}
            </p>
          </div>

          {/* Example Sentence */}
          <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700 mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Sentence Application in Exam:
            </span>
            <p className="text-sm text-slate-800 dark:text-slate-200 italic">
              "{wordOfTheDay.usage.sentence}"
            </p>
            <p className="font-bengali text-xs text-slate-500 dark:text-slate-400 mt-1">
              অনুবাদ: {wordOfTheDay.usage.banglaTranslation}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">Synonyms:</span>
              <span className="text-slate-600 dark:text-slate-300">
                {wordOfTheDay.synonyms.slice(0, 3).join(', ')}
              </span>
            </div>

            <button
              onClick={() => onSelectWord(wordOfTheDay)}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
            >
              Full Study Card <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Daily 5-Word Challenge Quiz */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Daily 5-Word Micro Quiz
              </h3>
              <p className="text-xs text-slate-500">
                Test your retention of today's recommended vocabulary in 60 seconds.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {quizFinished ? 'Completed' : `Question ${activeQuizIndex + 1} of 5`}
          </span>
        </div>

        {!quizFinished && currentQuizWord ? (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                Identify Bangla Meaning:
              </span>
              <h4 className="text-2xl font-bold font-serif-title text-slate-900 dark:text-white">
                "{currentQuizWord.word}"
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {currentQuizWord.phonetic} • {currentQuizWord.partOfSpeech}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((option, idx) => {
                const isChosen = selectedAnswer === idx;
                const isRealCorrect = idx === correctIndex;
                let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400';

                if (selectedAnswer !== null) {
                  if (isRealCorrect) {
                    btnStyle = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                  } else if (isChosen) {
                    btnStyle = 'bg-rose-50 dark:bg-rose-950/80 border-rose-500 text-rose-800 dark:text-rose-200 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleSelectOption(idx)}
                    className={`font-bengali text-sm p-4 rounded-xl border text-left font-medium transition-all ${btnStyle}`}
                  >
                    {String.fromCharCode(65 + idx)}. {option}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
              Daily Quiz Complete!
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              You scored <span className="font-bold text-emerald-600 text-lg">{dailyProgress.quizScore || score}/5</span>. Your streak has been recorded!
            </p>
            <button
              onClick={() => {
                setActiveQuizIndex(0);
                setSelectedAnswer(null);
                setQuizFinished(false);
                setScore(0);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
