import React, { useState } from 'react';
import { Volume2, Bookmark, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { WordEntry, UserSettings } from '../types';
import { speakWord } from '../utils/speech';

interface WordCardProps {
  word: WordEntry;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectWord: (word: WordEntry) => void;
  onShareWord: (word: WordEntry) => void;
  settings: UserSettings;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isFavorite,
  onToggleFavorite,
  onSelectWord,
  onShareWord,
  settings,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakWord(word.word, {
      accent: settings.voiceAccent,
      rate: settings.speechRate,
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false),
    });
  };

  const getCefrBadgeStyle = (level: string) => {
    switch (level) {
      case 'C2':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'C1':
        return 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  };

  return (
    <div 
      onClick={() => onSelectWord(word)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Badges and Action Icons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getCefrBadgeStyle(word.cefrLevel)}`}>
              {word.cefrLevel}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {word.partOfSpeech} ({word.partOfSpeechBn})
            </span>
            {word.duPreviousYear && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {word.duPreviousYear.split(',')[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShareWord(word);
              }}
              title="Share or Export Word"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(word.id);
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' 
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Word Title & Audio */}
        <div className="flex items-baseline gap-3 mb-2">
          <h3 className="text-2xl font-bold font-serif-title text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {word.word}
          </h3>
          <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-tight">
            {word.phonetic}
          </span>
          <button
            onClick={handlePlayAudio}
            title="Listen to pronunciation"
            className={`p-1.5 rounded-full transition-all ${
              isPlayingAudio 
                ? 'bg-indigo-600 text-white animate-pulse' 
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Bangla Meaning */}
        <div className="mb-3.5 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <p className="font-bengali text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug">
            {word.banglaMeaning}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
            {word.englishDefinition}
          </p>
        </div>

        {/* Synonyms & Antonyms preview pills */}
        <div className="space-y-1.5 text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 w-12 shrink-0">Syn:</span>
            <div className="flex items-center gap-1 flex-wrap text-slate-600 dark:text-slate-300">
              {word.synonyms.slice(0, 3).map((syn, idx) => (
                <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md text-[11px]">
                  {syn}
                </span>
              ))}
              {word.synonyms.length > 3 && (
                <span className="text-slate-400 text-[10px]">+{word.synonyms.length - 3}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-rose-500 w-12 shrink-0">Ant:</span>
            <div className="flex items-center gap-1 flex-wrap text-slate-600 dark:text-slate-300">
              {word.antonyms.slice(0, 3).map((ant, idx) => (
                <span key={idx} className="bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md text-[11px]">
                  {ant}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentence Snippet & Detail Link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400 italic line-clamp-1 max-w-[80%]">
          "{word.usage.sentence}"
        </span>
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
          Details <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
