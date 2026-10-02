import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  GraduationCap, 
  BookOpen, 
  X, 
  Layers, 
  Check, 
  Flame, 
  Info 
} from 'lucide-react';

import { allWords, getDailyWord, getRecommendedFiveWords } from './data/words';
import { WordEntry, UserSettings, DailyProgress } from './types';
import { searchDictionary } from './utils/banglaSearch';
import { 
  getStoredFavorites, 
  toggleFavorite as toggleStoredFavorite, 
  getStoredSettings, 
  saveStoredSettings,
  getStoredDailyProgress,
  saveStoredDailyProgress,
  getStoredWordNotes,
  saveWordNote as saveStoredWordNote
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { WordCard } from './components/WordCard';
import { WordDetailModal } from './components/WordDetailModal';
import { SocialShareModal } from './components/SocialShareModal';
import { CustomizationModal } from './components/CustomizationModal';
import { DailyTaskSection } from './components/DailyTaskSection';
import { AdmissionPrepModule } from './components/AdmissionPrepModule';
import { SentenceUsageStudio } from './components/SentenceUsageStudio';
import { FavoritesAndCollections } from './components/FavoritesAndCollections';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dictionary' | 'usage' | 'admission' | 'daily' | 'favorites'>('dictionary');

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedExam, setSelectedExam] = useState('ALL');
  const [sortBy, setSortBy] = useState<'alpha' | 'freq' | 'level'>('alpha');

  // Active word modals
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const [studioWord, setStudioWord] = useState<WordEntry>(allWords[0]);
  const [shareWord, setShareWord] = useState<WordEntry | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Persistent States
  const [favorites, setFavorites] = useState<string[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());
  const [dailyProgress, setDailyProgress] = useState<DailyProgress>(getStoredDailyProgress());
  const [wordNotes, setWordNotes] = useState<Record<string, string>>({});

  // Initialize data on mount
  useEffect(() => {
    setFavorites(getStoredFavorites());
    setSettings(getStoredSettings());
    setDailyProgress(getStoredDailyProgress());
    setWordNotes(getStoredWordNotes());
  }, []);

  // Sync theme and font size with document body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Reset theme classes
    root.classList.remove('dark');
    body.classList.remove('theme-sepia', 'theme-du');

    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'sepia') {
      body.classList.add('theme-sepia');
    } else if (settings.theme === 'du') {
      body.classList.add('theme-du');
    }

    // Font size scaling
    switch (settings.fontSize) {
      case 'sm':
        root.style.fontSize = '14px';
        break;
      case 'lg':
        root.style.fontSize = '17px';
        break;
      case 'xl':
        root.style.fontSize = '18.5px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }
  }, [settings.theme, settings.fontSize]);

  // Update settings handler
  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    const updated = toggleStoredFavorite(id);
    setFavorites(updated);
  };

  // Save personal word note
  const handleSaveNote = (wordId: string, note: string) => {
    const updated = saveStoredWordNote(wordId, note);
    setWordNotes(updated);
  };

  // Daily word and recommended 5
  const wordOfTheDay = useMemo(() => getDailyWord(), []);
  const recommendedWords = useMemo(() => getRecommendedFiveWords(dailyProgress.learnedWordIds), [dailyProgress.learnedWordIds]);

  // Filtered & Sorted Word List
  const filteredWords = useMemo(() => {
    let result = searchDictionary(allWords, searchQuery, {
      level: selectedLevel,
      targetExam: selectedExam,
    });

    if (sortBy === 'freq') {
      result = [...result].sort((a, b) => b.frequency - a.frequency);
    } else if (sortBy === 'level') {
      result = [...result].sort((a, b) => b.cefrLevel.localeCompare(a.cefrLevel));
    } else {
      result = [...result].sort((a, b) => a.word.localeCompare(b.word));
    }

    return result;
  }, [searchQuery, selectedLevel, selectedExam, sortBy]);

  // Quick Bangla Search Chips for instant testing without typing
  const quickBanglaChips = [
    { label: 'দুর্বোধ্য', query: 'দুর্বোধ্য' },
    { label: 'ক্ষণস্থায়ী', query: 'ক্ষণস্থায়ী' },
    { label: 'আশাবাদী', query: 'আশাবাদী' },
    { label: 'মহানুভব', query: 'মহানুভব' },
    { label: 'অনমনীয়', query: 'অনমনীয়' },
    { label: 'খুঁতখুঁতে', query: 'খুঁতখুঁতে' },
    { label: 'বাচাল', query: 'বাচাল' },
    { label: 'মহৌষধ', query: 'মহৌষধ' },
    { label: 'কৃপণ', query: 'কৃপণ' },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streakDays={dailyProgress.streakDays}
        favoritesCount={favorites.length}
        openSettings={() => setIsSettingsOpen(true)}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: DICTIONARY EXPLORER */}
        {activeTab === 'dictionary' && (
          <div className="space-y-6">
            {/* Search Hero Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dual English & Bangla Search Engine • Offline Ready</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif-title">
                  Master C1, C2 & DU Admission Vocabulary
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Search in English or বাংলা (Bengali script or phonetic e.g. <span className="text-indigo-300 font-mono">durbojjho</span>, <span className="text-indigo-300 font-mono">khonosthayi</span>) to discover pronunciation, synonyms, antonyms, and exam sentence collocations.
                </p>

                {/* Search Input Bar */}
                <div className="relative mt-4">
                  <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in English or বাংলা (যেমন: 'দুর্বোধ্য', 'ক্ষণস্থায়ী', 'Abstruse', 'durbojjho')..."
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 transition-all text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Quick Bangla Click-to-Search helper chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                  <span className="text-slate-400 font-semibold">Quick Bangla Search:</span>
                  {quickBanglaChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(chip.query)}
                      className={`font-bengali px-2.5 py-1 rounded-lg transition-all ${
                        searchQuery === chip.query
                          ? 'bg-indigo-500 text-white font-bold'
                          : 'bg-white/10 hover:bg-white/20 text-indigo-200'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter and Sorting Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Level Filter */}
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-400 px-2 font-bold uppercase text-[10px]">Level:</span>
                  {['ALL', 'C1', 'C2'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        selectedLevel === lvl
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {lvl === 'ALL' ? 'All' : lvl}
                    </button>
                  ))}
                </div>

                {/* Exam Filter */}
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="text-slate-400 px-2 font-bold uppercase text-[10px]">Exam:</span>
                  {[
                    { id: 'ALL', label: 'All Exams' },
                    { id: 'DU Kha', label: "DU 'Kha'" },
                    { id: 'DU IBA', label: 'DU IBA' },
                    { id: 'IELTS', label: 'IELTS 8+' },
                    { id: 'BCS', label: 'BCS' },
                  ].map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExam(ex.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        selectedExam === ex.id
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sorting and Count */}
              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="text-slate-500 font-semibold">
                  Found <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{filteredWords.length}</strong> words
                </span>

                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-400 text-[10px] uppercase font-bold pl-1">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-700 dark:text-slate-200 font-bold focus:outline-none"
                  >
                    <option value="alpha">A to Z</option>
                    <option value="freq">Exam Frequency</option>
                    <option value="level">CEFR Level</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Word Cards Grid */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No vocabulary matches found for "{searchQuery}"
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try searching with Bengali keywords like "দুর্বোধ্য", "ক্ষণস্থায়ী", or phonetic transliteration, or clear your exam filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedLevel('ALL');
                    setSelectedExam('ALL');
                  }}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isFavorite={favorites.includes(word.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectWord={(w) => setSelectedWord(w)}
                    onShareWord={(w) => setShareWord(w)}
                    settings={settings}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SENTENCE USAGE & COLLOCATIONS */}
        {activeTab === 'usage' && (
          <SentenceUsageStudio
            words={allWords}
            selectedWord={studioWord}
            onSelectWord={setStudioWord}
            settings={settings}
          />
        )}

        {/* TAB 3: DU & UNIVERSITY ADMISSION HUB */}
        {activeTab === 'admission' && (
          <AdmissionPrepModule
            allWords={allWords}
            onSelectWord={(w) => setSelectedWord(w)}
            settings={settings}
          />
        )}

        {/* TAB 4: DAILY TASKS & MICRO QUIZ */}
        {activeTab === 'daily' && (
          <DailyTaskSection
            wordOfTheDay={wordOfTheDay}
            recommendedWords={recommendedWords}
            dailyProgress={dailyProgress}
            onUpdateDailyProgress={(upd) => {
              setDailyProgress(upd);
              saveStoredDailyProgress(upd);
            }}
            onSelectWord={(w) => setSelectedWord(w)}
            onToggleFavorite={handleToggleFavorite}
            favorites={favorites}
            settings={settings}
          />
        )}

        {/* TAB 5: FAVORITES & NOTES */}
        {activeTab === 'favorites' && (
          <FavoritesAndCollections
            favoriteIds={favorites}
            allWords={allWords}
            wordNotes={wordNotes}
            onToggleFavorite={handleToggleFavorite}
            onSelectWord={(w) => setSelectedWord(w)}
            settings={settings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Lexicon © 2026 • Dedicated to Dhaka University & Higher English Aspirants
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span>Offline Database: 100% Loaded</span>
            <span>CEFR C1/C2 Verified</span>
            <button onClick={() => setIsSettingsOpen(true)} className="hover:text-indigo-600 underline">
              Customize App
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedWord && (
        <WordDetailModal
          word={selectedWord}
          onClose={() => setSelectedWord(null)}
          isFavorite={favorites.includes(selectedWord.id)}
          onToggleFavorite={handleToggleFavorite}
          onShare={(w) => setShareWord(w)}
          settings={settings}
          userNote={wordNotes[selectedWord.id] || ''}
          onSaveNote={handleSaveNote}
        />
      )}

      {shareWord && (
        <SocialShareModal
          word={shareWord}
          onClose={() => setShareWord(null)}
        />
      )}

      <CustomizationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
