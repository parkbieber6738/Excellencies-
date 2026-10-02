import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Timer, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Layers, 
  BookOpen, 
  Award, 
  Sparkles, 
  ChevronRight,
  Bookmark,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdmissionQuestion, MockTestResult, WordEntry, UserSettings } from '../types';
import { admissionQuestions } from '../data/admissionQuestions';
import { saveMockResult } from '../utils/storage';
import { speakWord } from '../utils/speech';

interface AdmissionPrepModuleProps {
  allWords: WordEntry[];
  onSelectWord: (word: WordEntry) => void;
  settings: UserSettings;
}

export const AdmissionPrepModule: React.FC<AdmissionPrepModuleProps> = ({
  allWords,
  onSelectWord,
  settings,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<string>('ALL');
  const [activeMode, setActiveMode] = useState<'mock' | 'flashcards' | 'past_questions'>('mock');

  // Mock Test State
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testFinished, setTestFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300s)

  // Flashcard State
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Filter questions based on selected unit
  const filteredQuestions = selectedUnit === 'ALL'
    ? admissionQuestions
    : admissionQuestions.filter(q => q.targetUnit.includes(selectedUnit));

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isTestStarted && !testFinished && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestStarted, testFinished, timeLeft]);

  const handleStartTest = () => {
    setIsTestStarted(true);
    setTestFinished(false);
    setUserAnswers({});
    setCurrentQIndex(0);
    setTimeLeft(300);
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (testFinished) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    filteredQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        skipped++;
      } else if (ans === q.correctAnswerIndex) {
        correct++;
      } else {
        wrong++;
      }
    });

    // DU Marking Formula: +1 for correct, -0.25 for incorrect
    const score = Number((correct * 1.0 - wrong * 0.25).toFixed(2));
    return { correct, wrong, skipped, score };
  };

  const handleFinishTest = () => {
    setTestFinished(true);
    const { correct, wrong, skipped, score } = calculateScore();
    const result: MockTestResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      unit: selectedUnit,
      totalQuestions: filteredQuestions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedAnswers: skipped,
      score,
      timeSpentSeconds: 300 - timeLeft,
    };
    saveMockResult(result);
    try {
      if (score > filteredQuestions.length * 0.6) {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } catch {
      // ignore
    }
  };

  // Flashcards filtered words
  const duTargetWords = allWords.filter(w => w.targetExams.some(e => e.includes('DU')));
  const currentCard = duTargetWords[flashcardIndex] || duTargetWords[0];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            <span>Dhaka University & Admission Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            DU Admission Special Preparation
          </h2>
          <p className="text-white/80 text-sm max-w-xl font-medium">
            Dedicated module for DU 'Kha' (Arts & Law), DU IBA (BBA/MBA), DU 'Ga' (Business), and other public universities with authentic questions & DU marking standard.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="relative z-10 flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 self-start md:self-center">
          <button
            onClick={() => setActiveMode('mock')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'mock' ? 'bg-white text-rose-900 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Mock Test
          </button>
          <button
            onClick={() => setActiveMode('flashcards')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'flashcards' ? 'bg-white text-rose-900 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveMode('past_questions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'past_questions' ? 'bg-white text-rose-900 shadow-md' : 'text-white/80 hover:text-white'
            }`}
          >
            Past Questions
          </button>
        </div>
      </div>

      {/* Unit Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Target Unit:</span>
        {[
          { id: 'ALL', label: 'All Units' },
          { id: 'DU Kha', label: 'DU Kha / B Unit (Arts & Law)' },
          { id: 'DU IBA', label: 'DU IBA (BBA & MBA)' },
          { id: 'DU Ga', label: 'DU Ga / C Unit (Business)' },
          { id: 'CU/RU/GST', label: 'CU / RU / Cluster' },
        ].map((unit) => (
          <button
            key={unit.id}
            onClick={() => {
              setSelectedUnit(unit.id);
              if (isTestStarted) setIsTestStarted(false);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedUnit === unit.id
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-400'
            }`}
          >
            {unit.label}
          </button>
        ))}
      </div>

      {/* 1. MOCK TEST MODE */}
      {activeMode === 'mock' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {!isTestStarted ? (
            <div className="text-center py-10 space-y-6 max-w-xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                <Timer className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  DU English Admission Standard Mock Test
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Test your speed and accuracy under real admission exam conditions.
                </p>
              </div>

              {/* Exam Rules Breakdown */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
                  <span>Questions: {filteredQuestions.length} MCQs</span>
                  <span>Time: 5 Minutes (300 sec)</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400">Correct Answer: +1.00 Mark</span>
                  <span className="text-rose-600 dark:text-rose-400">Negative Marking: -0.25 Mark</span>
                </div>
                <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700">
                  *Follows exact Dhaka University grading formula.
                </p>
              </div>

              <button
                onClick={handleStartTest}
                className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/25 transition-all hover:scale-105"
              >
                Start Timed Mock Exam
              </button>
            </div>
          ) : !testFinished ? (
            /* Active Mock Test Screen */
            <div className="space-y-6">
              {/* Test Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                    Question {currentQIndex + 1} of {filteredQuestions.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    {filteredQuestions[currentQIndex]?.sourceYear}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                    timeLeft < 60 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}>
                    <Timer className="w-4 h-4" />
                    <span>{formatTimer(timeLeft)}</span>
                  </div>

                  <button
                    onClick={handleFinishTest}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                  >
                    Submit Test
                  </button>
                </div>
              </div>

              {/* Question Card */}
              {filteredQuestions[currentQIndex] && (
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-2">
                      {filteredQuestions[currentQIndex].questionType} • {filteredQuestions[currentQIndex].targetUnit}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
                      {filteredQuestions[currentQIndex].questionText}
                    </h3>
                    {filteredQuestions[currentQIndex].banglaContext && (
                      <p className="font-bengali text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {filteredQuestions[currentQIndex].banglaContext}
                      </p>
                    )}
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredQuestions[currentQIndex].options.map((opt, oIdx) => {
                      const isChosen = userAnswers[currentQIndex] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectAnswer(currentQIndex, oIdx)}
                          className={`p-4 rounded-xl border text-left font-medium text-sm transition-all flex items-center justify-between ${
                            isChosen
                              ? 'bg-rose-50 dark:bg-rose-950/70 border-rose-500 text-rose-900 dark:text-rose-100 font-bold ring-2 ring-rose-500/20'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-400'
                          }`}
                        >
                          <span>
                            <strong className="mr-2 font-mono">{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                          </span>
                          {isChosen && <div className="w-3 h-3 rounded-full bg-rose-600" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Footer */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      disabled={currentQIndex === 0}
                      onClick={() => setCurrentQIndex(prev => prev - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1.5">
                      {filteredQuestions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentQIndex(i)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            currentQIndex === i
                              ? 'bg-rose-600 text-white'
                              : userAnswers[i] !== undefined
                              ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentQIndex === filteredQuestions.length - 1}
                      onClick={() => setCurrentQIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Test Result & Detailed Explanations */
            <div className="space-y-8">
              {(() => {
                const { correct, wrong, skipped, score } = calculateScore();
                return (
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                          Exam Score Card
                        </span>
                        <h3 className="text-3xl font-extrabold mt-1">
                          DU Admission Result: {score} Marks
                        </h3>
                        <p className="text-xs text-slate-300 mt-1">
                          Total: {filteredQuestions.length} Questions • Negatives: -{Number((wrong * 0.25).toFixed(2))}
                        </p>
                      </div>

                      <button
                        onClick={handleStartTest}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-rose-900 font-bold text-xs hover:bg-slate-100 transition-colors self-start"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Retake Exam</span>
                      </button>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <span className="text-xs text-emerald-400 block font-bold">Correct (+1.00)</span>
                        <span className="text-2xl font-black">{correct}</span>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <span className="text-xs text-rose-400 block font-bold">Wrong (-0.25)</span>
                        <span className="text-2xl font-black">{wrong}</span>
                      </div>
                      <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
                        <span className="text-xs text-slate-300 block font-bold">Skipped (0)</span>
                        <span className="text-2xl font-black">{skipped}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Explanations with Bangla Breakdown */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Answer Key & Comprehensive Explanations (উত্তরমাল ও ব্যাখ্যা)
                </h4>

                {filteredQuestions.map((q, idx) => {
                  const userChoice = userAnswers[idx];
                  const isCorrect = userChoice === q.correctAnswerIndex;
                  const isSkipped = userChoice === undefined;

                  return (
                    <div 
                      key={q.id}
                      className={`p-5 rounded-2xl border ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                          : isSkipped
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                          : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-xs font-bold text-slate-500">
                          Q{idx + 1}. {q.sourceYear}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCorrect 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                            : isSkipped 
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {isCorrect ? 'Correct (+1.0)' : isSkipped ? 'Skipped (0.0)' : 'Incorrect (-0.25)'}
                        </span>
                      </div>

                      <h5 className="font-bold text-slate-900 dark:text-white text-base mb-3">
                        {q.questionText}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                        {q.options.map((opt, oIdx) => {
                          const isRealAnswer = oIdx === q.correctAnswerIndex;
                          const wasSelected = oIdx === userChoice;

                          let style = 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
                          if (isRealAnswer) {
                            style = 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 font-bold border-emerald-300';
                          } else if (wasSelected && !isCorrect) {
                            style = 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 font-bold border-rose-300';
                          }

                          return (
                            <div key={oIdx} className={`p-2.5 rounded-xl border flex items-center justify-between ${style}`}>
                              <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                              {isRealAnswer && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                              {wasSelected && !isCorrect && <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation in Bangla & English */}
                      <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs space-y-1">
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong>English Reason:</strong> {q.explanation}
                        </p>
                        <p className="font-bengali text-slate-800 dark:text-slate-200 font-medium">
                          <strong>বাংলা ব্যাখ্যা:</strong> {q.explanationBn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FLASHCARD SPACED REPETITION MODE */}
      {activeMode === 'flashcards' && currentCard && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm max-w-2xl mx-auto space-y-6 text-center">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Card {flashcardIndex + 1} of {duTargetWords.length}</span>
            <span className="font-bold text-rose-600 dark:text-rose-400">Click card to reveal meaning</span>
          </div>

          {/* Flashcard Component */}
          <div 
            onClick={() => setIsFlipped(prev => !prev)}
            className="cursor-pointer min-h-[300px] p-8 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-white to-rose-50/40 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-[1.01]"
          >
            {!isFlipped ? (
              /* Front of card */
              <div className="space-y-4">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {currentCard.cefrLevel} • {currentCard.partOfSpeech}
                </span>
                <h3 className="text-5xl font-extrabold font-serif-title text-slate-900 dark:text-white">
                  {currentCard.word}
                </h3>
                <p className="text-lg font-mono text-indigo-600 dark:text-indigo-400">
                  {currentCard.phonetic}
                </p>
                {currentCard.duPreviousYear && (
                  <span className="inline-block text-xs font-bold text-rose-600 dark:text-rose-400">
                    🎯 {currentCard.duPreviousYear}
                  </span>
                )}
                <p className="text-xs text-slate-400 pt-4">
                  (Tap anywhere to flip card)
                </p>
              </div>
            ) : (
              /* Back of card */
              <div className="space-y-4 max-w-md">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  বাংলা অর্থ ও সমার্থক শব্দ
                </span>
                <h4 className="font-bengali text-3xl font-bold text-slate-900 dark:text-white">
                  {currentCard.banglaMeaning}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {currentCard.englishDefinition}
                </p>

                <div className="pt-2 text-xs flex justify-center gap-1.5 flex-wrap">
                  {currentCard.synonyms.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                      {s}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-500 italic mt-2">
                  "{currentCard.usage.sentence}"
                </p>
              </div>
            )}
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex(prev => (prev === 0 ? duTargetWords.length - 1 : prev - 1));
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100"
            >
              Previous Card
            </button>

            <button
              onClick={() => {
                speakWord(currentCard.word, {
                  accent: settings.voiceAccent,
                  rate: settings.speechRate,
                });
              }}
              className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100"
              title="Pronounce"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setFlashcardIndex(prev => (prev + 1) % duTargetWords.length);
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/20"
            >
              Next Card
            </button>
          </div>
        </div>
      )}

      {/* 3. PAST QUESTIONS BANK */}
      {activeMode === 'past_questions' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                DU Past Years High-Frequency Vocabulary Bank
              </h3>
              <p className="text-xs text-slate-500">
                Terms and questions that recurrently appear in Dhaka University B, C, & IBA entrance examinations.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {filteredQuestions.length} Questions Available Offline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-rose-600 dark:text-rose-400">{q.sourceYear}</span>
                  <span className="text-slate-400">{q.questionType}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {q.questionText}
                </h4>
                <div className="pt-2 text-xs border-t border-slate-200/60 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold flex items-center justify-between">
                  <span>Answer: {q.options[q.correctAnswerIndex]}</span>
                  {q.associatedWord && (
                    <button
                      onClick={() => {
                        const target = allWords.find(w => w.id === q.associatedWord);
                        if (target) onSelectWord(target);
                      }}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      Study Term <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
