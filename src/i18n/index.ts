import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './locale/en.json';
import es from './locale/es.json';
import {NativeModules, Platform} from 'react-native';

i18n
  .use(initReactI18next)
  .use({
    type: 'languageDetector',
    name: 'customDetector',
    async: true,
    init: function () {},
    detect: async function (callback: (val: string) => void) {
      try {
        const supportedLanguages = ['en', 'es'];
        const localLanguage = await AsyncStorage.getItem('language');

        if (localLanguage) {
          callback(localLanguage);
          return;
        }

        const locale =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager?.settings?.AppleLocale ||
              NativeModules.SettingsManager?.settings?.AppleLanguages[0] ||
              ''
            : NativeModules.I18nManager?.localeIdentifier || '';

        const [lowerCaseLocale] = locale?.split('_');
        if (supportedLanguages.includes(lowerCaseLocale)) {
          callback(lowerCaseLocale);
          return lowerCaseLocale;
        }
        callback('es');
      } catch (e) {
        callback('es');
      }
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
