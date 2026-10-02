import { WordEntry } from '../types';

export function generateSocialShareUrl(word: WordEntry, platform: 'whatsapp' | 'facebook' | 'twitter' | 'telegram'): string {
  const text = `📖 Word of the Day: *${word.word}* (${word.phonetic})
✨ বাংলা অর্থ: ${word.banglaMeaning}
🎯 CEFR: ${word.cefrLevel} | Target: ${word.targetExams.slice(0, 2).join(', ')}
💡 Synonyms: ${word.synonyms.slice(0, 3).join(', ')}
⚖️ Antonyms: ${word.antonyms.slice(0, 3).join(', ')}
📝 Example: "${word.usage.sentence}"

Master C1/C2 & DU Admission Vocabulary on Lexicon!`;

  const encodedText = encodeURIComponent(text);
  const currentUrl = encodeURIComponent(window.location.origin);

  switch (platform) {
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${encodedText}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedText}`;
    case 'telegram':
      return `https://t.me/share/url?url=${currentUrl}&text=${encodedText}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&quote=${encodedText}`;
    default:
      return '';
  }
}

/**
 * Renders a crisp graphic study flashcard onto an HTML5 Canvas and triggers download as PNG
 */
export function downloadWordFlashcard(word: WordEntry): void {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background Gradient (Academic Midnight / Deep Slate)
  const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 630);

  // Decorative border
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 1140, 570);

  // Inner subtle frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(45, 45, 1110, 540);

  // App Brand header
  ctx.fillStyle = '#818cf8';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('LEXICON • ADVANCED C1/C2 & DU ADMISSION DICTIONARY', 80, 95);

  // Level & Exam badge
  ctx.fillStyle = '#4338ca';
  ctx.beginPath();
  ctx.roundRect(80, 120, 160, 38, [8]);
  ctx.fill();
  ctx.fillStyle = '#e0e7ff';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${word.cefrLevel} LEVEL`, 105, 145);

  if (word.duPreviousYear) {
    ctx.fillStyle = 'rgba(225, 29, 72, 0.3)';
    ctx.beginPath();
    ctx.roundRect(260, 120, 280, 38, [8]);
    ctx.fill();
    ctx.fillStyle = '#fda4af';
    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`🎯 ${word.duPreviousYear}`, 275, 145);
  }

  // Word Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px "Playfair Display", Georgia, serif';
  ctx.fillText(word.word, 80, 220);

  // Phonetic & POS
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${word.phonetic}  •  ${word.partOfSpeech} (${word.partOfSpeechBn})`, 80, 260);

  // Bangla Meaning (Highlight box)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.beginPath();
  ctx.roundRect(80, 290, 1040, 75, [12]);
  ctx.fill();
  ctx.strokeStyle = 'rgba(129, 140, 248, 0.4)';
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px "Hind Siliguri", sans-serif';
  ctx.fillText('বাংলা অর্থ:', 110, 335);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '24px "Hind Siliguri", sans-serif';
  ctx.fillText(word.banglaMeaning, 240, 335);

  // Synonyms and Antonyms
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SYNONYMS:', 80, 405);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(word.synonyms.slice(0, 4).join(', '), 220, 405);

  ctx.fillStyle = '#f87171';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('ANTONYMS:', 80, 445);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(word.antonyms.slice(0, 4).join(', '), 220, 445);

  // Example Sentence
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('EXAM USAGE:', 80, 495);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
  const sentenceText = `"${word.usage.sentence}"`;
  ctx.fillText(sentenceText.length > 90 ? sentenceText.slice(0, 87) + '...' : sentenceText, 80, 530);

  // Footer
  ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DU IBA • Unit B • Unit C • BCS • IELTS • GRE Prep Companion', 80, 580);

  // Trigger download
  const link = document.createElement('a');
  link.download = `Lexicon_${word.word}_Flashcard.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
