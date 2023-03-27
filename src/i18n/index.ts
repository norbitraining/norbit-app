import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';

i18n
  .use(initReactI18next)
  .use({
    type: 'languageDetector',
    name: 'customDetector',
    async: true,
    init: function () {},
    detect: function (callback: (val: string) => void) {
      AsyncStorage.getItem('language').then((val: string | null) => {
        const detected = val || 'es';
        callback(detected);
      });
    },
    cacheUserLanguage: function (lng: string) {
      return lng;
    },
  })
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'es',
    resources: {
      en,
      es,
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
