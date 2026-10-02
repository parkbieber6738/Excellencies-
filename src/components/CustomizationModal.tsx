import React from 'react';
import { X, Palette, Volume2, Type, Sliders, Check } from 'lucide-react';
import { UserSettings } from '../types';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-5 h-5" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              App Customization
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Theme Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-500" />
            Appearance & Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'light', label: 'Clean Light', color: 'bg-white border-slate-300' },
              { id: 'dark', label: 'Midnight Dark', color: 'bg-slate-900 border-slate-700 text-white' },
              { id: 'sepia', label: 'Warm Sepia (Paper)', color: 'bg-[#f7f3eb] border-[#ded5c2] text-[#383023]' },
              { id: 'du', label: 'DU Heritage (Crimson)', color: 'bg-[#fff5f5] border-[#fecdd3] text-[#881337]' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onUpdateSettings({ theme: t.id as any })}
                className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all ${
                  settings.theme === t.id
                    ? 'ring-2 ring-indigo-500 border-transparent shadow-sm'
                    : 'hover:border-indigo-300'
                } ${t.color}`}
              >
                <span>{t.label}</span>
                {settings.theme === t.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-500" />
            Reading Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'sm', label: 'Small', sample: 'Aa' },
              { id: 'md', label: 'Normal', sample: 'Aa' },
              { id: 'lg', label: 'Large', sample: 'Aa' },
              { id: 'xl', label: 'Huge', sample: 'Aa' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => onUpdateSettings({ fontSize: s.id as any })}
                className={`p-2 rounded-xl border text-center transition-all ${
                  settings.fontSize === s.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={`text-base ${s.id === 'sm' ? 'text-xs' : s.id === 'lg' ? 'text-lg' : s.id === 'xl' ? 'text-xl' : 'text-sm'}`}>
                  {s.sample}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Audio & Pronunciation Settings */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-indigo-500" />
            Audio Pronunciation Options
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ voiceAccent: 'en-US' })}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                settings.voiceAccent === 'en-US'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇺🇸 American (en-US)</span>
            </button>

            <button
              onClick={() => onUpdateSettings({ voiceAccent: 'en-GB' })}
              className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                settings.voiceAccent === 'en-GB'
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <span>🇬🇧 British (en-GB)</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Pronunciation Speed</span>
            <div className="flex gap-1">
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdateSettings({ speechRate: speed })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    settings.speechRate === speed
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
        >
          Save & Apply Customizations
        </button>
      </div>
    </div>
  );
};
