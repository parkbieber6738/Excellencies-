/**
 * Audio pronunciation utility using HTML5 SpeechSynthesis API
 */

export function speakWord(
  text: string, 
  options: {
    accent?: 'en-US' | 'en-GB';
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  } = {}
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device/browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate || 1.0;
  utterance.pitch = options.pitch || 1.0;
  utterance.lang = options.accent || 'en-US';

  // Find preferred voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetLang = options.accent === 'en-GB' ? 'en-GB' : 'en-US';
  const preferredVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.slice(0, 2)));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  if (options.onError) utterance.onerror = options.onError;

  window.speechSynthesis.speak(utterance);
}
