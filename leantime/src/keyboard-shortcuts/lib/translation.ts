import { translations } from './translations';

// @todo Use https://www.i18next.com/ for this.
export const translate = (text) => {
  const lang = document.documentElement.lang ?? 'en-US';

  return translations[lang]?.[text] ?? text;
};
