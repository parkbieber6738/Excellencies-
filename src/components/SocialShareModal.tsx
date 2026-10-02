import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  MessageCircle, 
  Send, 
  Facebook, 
  Twitter 
} from 'lucide-react';
import { WordEntry } from '../types';
import { generateSocialShareUrl, downloadWordFlashcard } from '../utils/shareCard';

interface SocialShareModalProps {
  word: WordEntry | null;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ word, onClose }) => {
  if (!word) return null;

  const [copied, setCopied] = useState(false);

  const formattedShareText = `📖 Word of the Day: *${word.word}* (${word.phonetic})
✨ বাংলা অর্থ: ${word.banglaMeaning}
🎯 CEFR: ${word.cefrLevel} | Target: ${word.targetExams.slice(0, 2).join(', ')}
💡 Synonyms: ${word.synonyms.slice(0, 3).join(', ')}
⚖️ Antonyms: ${word.antonyms.slice(0, 3).join(', ')}
📝 Example: "${word.usage.sentence}"

Master C1/C2 & DU Admission Vocabulary on Lexicon!`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(formattedShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleOpenPlatform = (platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram') => {
    const url = generateSocialShareUrl(word, platform);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
          <Share2 className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Share Word: {word.word}
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Export this high-yield vocabulary card or share with your DU admission and study partners.
        </p>

        {/* Action: Download Visual Card */}
        <div className="mb-4">
          <button
            onClick={() => downloadWordFlashcard(word)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.01]"
          >
            <Download className="w-4 h-4" />
            <span>Download Graphic Flashcard (PNG)</span>
          </button>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => handleOpenPlatform('whatsapp')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => handleOpenPlatform('telegram')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-semibold text-xs border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Telegram</span>
          </button>

          <button
            onClick={() => handleOpenPlatform('facebook')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-xs border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            <span>Facebook</span>
          </button>

          <button
            onClick={() => handleOpenPlatform('twitter')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-300 dark:border-slate-700 hover:bg-slate-200 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            <span>X (Twitter)</span>
          </button>
        </div>

        {/* Copy Formatted Text */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono line-clamp-3 mb-2 whitespace-pre-line">
            {formattedShareText}
          </p>
          <button
            onClick={handleCopyText}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Formatted Study Card</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
