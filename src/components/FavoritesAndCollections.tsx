import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  Download, 
  Volume2, 
  ArrowRight, 
  Search, 
  FileText, 
  Check 
} from 'lucide-react';
import { WordEntry, UserSettings } from '../types';
import { speakWord } from '../utils/speech';

interface FavoritesAndCollectionsProps {
  favoriteIds: string[];
  allWords: WordEntry[];
  wordNotes: Record<string, string>;
  onToggleFavorite: (id: string) => void;
  onSelectWord: (word: WordEntry) => void;
  settings: UserSettings;
}

export const FavoritesAndCollections: React.FC<FavoritesAndCollectionsProps> = ({
  favoriteIds,
  allWords,
  wordNotes,
  onToggleFavorite,
  onSelectWord,
  settings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  const favoriteWords = allWords.filter(w => favoriteIds.includes(w.id));
  const filteredFavorites = favoriteWords.filter(w => 
    w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.banglaMeaning.includes(searchQuery)
  );

  const handleExportText = () => {
    let content = "=== LEXICON DU & C1/C2 ADMISSION STUDY SHEET ===\n\n";
    favoriteWords.forEach((w, i) => {
      content += `${i + 1}. ${w.word} (${w.phonetic}) [${w.cefrLevel} - ${w.partOfSpeech}]\n`;
      content += `   বাংলা অর্থ: ${w.banglaMeaning}\n`;
      content += `   Synonyms: ${w.synonyms.join(', ')}\n`;
      content += `   Antonyms: ${w.antonyms.join(', ')}\n`;
      content += `   Sentence: "${w.usage.sentence}"\n`;
      if (wordNotes[w.id]) {
        content += `   Note: ${wordNotes[w.id]}\n`;
      }
      content += `\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Lexicon_Favorites_StudySheet_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyStudyNotes = async () => {
    let content = "";
    favoriteWords.forEach((w, i) => {
      content += `${i + 1}. ${w.word} - ${w.banglaMeaning} (Syn: ${w.synonyms.slice(0, 2).join(', ')})\n`;
    });
    try {
      await navigator.clipboard.writeText(content);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 mb-1">
            <Bookmark className="w-5 h-5 fill-amber-500" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              My Saved Vocabulary & Notes ({favoriteWords.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Personalized collection of terms for high-priority review and revision.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyStudyNotes}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Quick Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportText}
            disabled={favoriteWords.length === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Study Sheet (.txt)</span>
          </button>
        </div>
      </div>

      {/* Search Favorites */}
      {favoriteWords.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within your saved words or Bangla meanings..."
            className="w-full text-xs pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* Word List */}
      {filteredFavorites.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto">
            <Bookmark className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            {favoriteWords.length === 0 ? 'No Saved Words Yet' : 'No Matching Saved Words'}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {favoriteWords.length === 0 
              ? 'Click the bookmark icon on any word in the dictionary to save it here for fast revision.'
              : 'Try searching with a different keyword.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFavorites.map((word) => (
            <div
              key={word.id}
              onClick={() => onSelectWord(word)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {word.cefrLevel}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {word.phonetic}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(word.word, { accent: settings.voiceAccent, rate: settings.speechRate });
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(word.id);
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xl font-bold font-serif-title text-slate-900 dark:text-white">
                  {word.word}
                </h4>

                <p className="font-bengali text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {word.banglaMeaning}
                </p>

                {wordNotes[word.id] && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 font-medium">
                    📝 Note: {wordNotes[word.id]}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500 truncate max-w-[70%]">
                  {word.synonyms.slice(0, 3).join(', ')}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-0.5">
                  View <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
