import React, { useState } from 'react';
import { 
  X, 
  Volume2, 
  Bookmark, 
  Share2, 
  Sparkles, 
  BookMarked, 
  Lightbulb, 
  History, 
  PenTool, 
  Check, 
  Download,
  GraduationCap
} from 'lucide-react';
import { WordEntry, UserSettings } from '../types';
import { speakWord } from '../utils/speech';
import { downloadWordFlashcard } from '../utils/shareCard';

interface WordDetailModalProps {
  word: WordEntry | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShare: (word: WordEntry) => void;
  settings: UserSettings;
  userNote: string;
  onSaveNote: (wordId: string, note: string) => void;
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShare,
  settings,
  userNote,
  onSaveNote,
}) => {
  if (!word) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<number>(settings.speechRate || 1.0);
  const [currentAccent, setCurrentAccent] = useState<'en-US' | 'en-GB'>(settings.voiceAccent || 'en-US');
  const [noteInput, setNoteInput] = useState(userNote || '');
  const [noteSavedToast, setNoteSavedToast] = useState(false);

  const handlePlay = (speed = currentSpeed, accent = currentAccent) => {
    setIsPlaying(true);
    speakWord(word.word, {
      accent,
      rate: speed,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleSaveNote = () => {
    onSaveNote(word.id, noteInput);
    setNoteSavedToast(true);
    setTimeout(() => setNoteSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {word.cefrLevel} Level
            </span>
            {word.duPreviousYear && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                {word.duPreviousYear}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(word.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite 
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-500'
              }`}
              title={isFavorite ? "Remove favorite" : "Save to favorites"}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => downloadWordFlashcard(word)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              title="Download Graphic Flashcard PNG"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onShare(word)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors"
              title="Share word to Social Media"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Word Header with Audio Controls */}
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <h1 className="text-4xl sm:text-5xl font-extrabold font-serif-title text-slate-900 dark:text-white">
                    {word.word}
                  </h1>
                  <span className="text-lg font-mono text-indigo-600 dark:text-indigo-400">
                    {word.phonetic}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Part of Speech: <span className="font-semibold text-slate-700 dark:text-slate-300">{word.partOfSpeech} ({word.partOfSpeechBn})</span>
                </p>
              </div>

              {/* Audio Player and Speed/Accent controller */}
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => handlePlay()}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all ${isPlaying ? 'animate-pulse scale-95' : ''}`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Pronounce</span>
                </button>

                <div className="flex items-center text-xs border-l border-slate-200 dark:border-slate-700 pl-2 gap-1 font-semibold">
                  <button
                    onClick={() => {
                      const next = currentAccent === 'en-US' ? 'en-GB' : 'en-US';
                      setCurrentAccent(next);
                      handlePlay(currentSpeed, next);
                    }}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600"
                    title="Toggle US/UK pronunciation"
                  >
                    {currentAccent === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
                  </button>

                  <button
                    onClick={() => {
                      const speeds = [0.8, 1.0, 1.2];
                      const nextIdx = (speeds.indexOf(currentSpeed) + 1) % speeds.length;
                      setCurrentSpeed(speeds[nextIdx]);
                      handlePlay(speeds[nextIdx], currentAccent);
                    }}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    title="Playback Speed"
                  >
                    {currentSpeed}x
                  </button>
                </div>
              </div>
            </div>

            {/* Bangla Meaning Box */}
            <div className="mt-4 pt-4 border-t border-indigo-100/80 dark:border-indigo-900/40">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                বাংলা অর্থ (Bangla Meaning)
              </span>
              <p className="font-bengali text-2xl font-bold text-slate-900 dark:text-white mt-1 leading-relaxed">
                {word.banglaMeaning}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
                {word.englishDefinition}
              </p>
            </div>
          </div>

          {/* Synonyms & Antonyms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Synonyms (সমার্থক শব্দ)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {word.synonyms.map((syn, idx) => (
                  <span key={idx} className="bg-white dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {syn}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Antonyms (বিপরীতার্থক শব্দ)
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {word.antonyms.map((ant, idx) => (
                  <span key={idx} className="bg-white dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {ant}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Where can I use words in sentence */}
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Where Can I Use This Word? (Sentence Usage & Context)
              </h4>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                Register: {word.usage.recommendedRegister}
              </span>
            </div>

            {/* Real Exam Sentence */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
              <p className="text-base text-slate-800 dark:text-slate-100 italic leading-relaxed">
                "{word.usage.sentence}"
              </p>
              <p className="font-bengali text-sm text-slate-600 dark:text-slate-400 mt-2 font-medium">
                অনুবাদ: {word.usage.banglaTranslation}
              </p>
            </div>

            {/* Collocations & Exam Tips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Common Academic Collocations:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 font-medium">
                  {word.usage.collocations.map((col, idx) => (
                    <li key={idx} className="font-mono">{col}</li>
                  ))}
                </ul>
              </div>

              {word.usage.examNote && (
                <div className="bg-amber-50/70 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60">
                  <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">
                    DU Exam Pattern & Trap Note:
                  </span>
                  <p className="text-amber-900 dark:text-amber-200">
                    {word.usage.examNote}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Etymology & Bengali Mnemonic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800">
              <h5 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                Word Origin & Etymology
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {word.etymology}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
              <h5 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Mnemonic for Bengali Students (স্মৃতি কৌশল)
              </h5>
              <p className="font-bengali text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {word.mnemonic}
              </p>
            </div>
          </div>

          {/* Personal Note Box */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-indigo-500" />
                Your Personal Study Notes (Saved locally)
              </label>
              {noteSavedToast && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Note Saved!
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="E.g., Practice this in my DU Kha Unit composition tomorrow..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveNote}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
