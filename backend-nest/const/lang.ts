
export const Lang = {
  EN: 'en',
  PL: 'pl',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
  ZH: 'zh',
} as const;

export type AvailableLanguage = typeof Lang[keyof typeof Lang];
