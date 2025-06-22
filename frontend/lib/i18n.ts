// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';
// import en from '../locales/en/translation.json';
// import am from '../locales/am/translation.json';

// // Initialize i18next with your language resources
// i18n.use(initReactI18next).init({
//   resources: {
//     en: { translation: en },
//     fr: { translation: am },
//   },
//   lng: 'en', // Default language
//   fallbackLng: 'en', // Language to use when the specified language is not available
//   interpolation: {
//     escapeValue: false, // React already escapes values
//   },
//   react: {
//     useSuspense: false, // Disable suspense to prevent loading delays during SSR
//   },
// });

// export default i18n;
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "../locales/en/translation.json"
import am from "../locales/am/translation.json"

// Initialize i18next with your language resources
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am }, // Changed from 'fr' to 'am' to correctly map Amharic
  },
  lng: "en", // Default language
  fallbackLng: "en", // Language to use when the specified language is not available
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense to prevent loading delays during SSR
  },
})

export default i18n