const i18n = {
  en: { decision: 'DECISION', consequences: 'CONSEQUENCES' },
  fi: { päätös: 'PÄÄTÖS', seuraukset: 'SEURAUKSET' }
};

export const t = key => i18n[localStorage.lang || 'en'][key];
