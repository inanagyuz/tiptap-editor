/**
 * @module LanguageSelector
 *
 * This component provides a language selection dropdown for the editor UI.
 * It allows users to switch between supported languages, updating the i18n context and triggering UI re-render.
 *
 * @remarks
 * - Supported languages: Turkish, English, German, French, Spanish.
 * - When the language is changed, a custom 'languageChanged' event is dispatched to notify other components.
 * - The selected language is stored in local state and in the i18n singleton.
 *
 * @example
 * ```tsx
 * <LanguageSelector onLanguageChange={(lang) => console.log(lang)} />
 * ```
 *
 * @property onLanguageChange - Optional callback fired when the language changes.
 */

import React from 'react';
import { i18n, type Language } from './i18n';

/**
 * Props for the LanguageSelector component.
 *
 * @property onLanguageChange - Optional callback fired when the language changes.
 */
interface LanguageSelectorProps {
   onLanguageChange?: (lang: Language) => void;
}

/**
 * List of supported languages with code, display name, and flag emoji.
 */
const languages: { code: Language; name: string; flag: string }[] = [
   { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
   { code: 'en', name: 'English', flag: '🇬🇧' },
   { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
   { code: 'fr', name: 'Français', flag: '🇫🇷' },
   { code: 'es', name: 'Español', flag: '🇪🇸' },
];

/**
 * LanguageSelector component renders a dropdown for selecting the editor language.
 *
 * @param onLanguageChange - Optional callback fired when the language changes.
 */
export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
   const [currentLang, setCurrentLang] = React.useState<Language>(i18n.getCurrentLanguage());

   /**
    * Handles language change, updates i18n context and local state,
    * and dispatches a 'languageChanged' event for global listeners.
    *
    * @param lang - The selected language code.
    */
   const handleLanguageChange = (lang: Language) => {
      i18n.setLanguage(lang);
      setCurrentLang(lang);
      onLanguageChange?.(lang);

      // Force re-render of slash commands and other listeners
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
   };

   return (
      <div className="relative">
         <select
            value={currentLang}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-background border border-muted rounded px-2 py-1 text-sm"
         >
            {languages.map((lang) => (
               <option key={lang.code} value={lang.code}>
                  {lang.flag}
               </option>
            ))}
         </select>
      </div>
   );
};
