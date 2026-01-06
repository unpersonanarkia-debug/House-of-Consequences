/* ============================================================
   House of Consequences — Decision Lifecycle
   Canonical 6-phase model
   ============================================================ */

export const DECISION_LIFECYCLE = Object.freeze([
  {
    id: "decision",
    index: 1,
    label: "Päätös",
    description:
      "Yksi toimintalinja valitaan muiden vaihtoehtojen sijaan. \
       Päätös voi olla eksplisiittinen tai implisiittinen.",
    axis: "origin"
  },
  {
    id: "impact",
    index: 2,
    label: "Vaikutus",
    description:
      "Päätöksen välittömät vaikutukset ympäristöön, ihmisiin tai järjestelmiin.",
    axis: "short-term"
  },
  {
    id: "consequence",
    index: 3,
    label: "Seuraukset",
    description:
      "Vaikutuksista syntyvät epäsuorat, viivästyneet tai kumuloituvat seuraukset.",
    axis: "medium-term"
  },
  {
    id: "adaptation",
    index: 4,
    label: "Sopeutuminen",
    description:
      "Yksilöt ja instituutiot muuttavat toimintaansa vastatakseen seurauksiin.",
    axis: "behavioral"
  },
  {
    id: "accumulation",
    index: 5,
    label: "Kertautuminen",
    description:
      "Sopeutuminen institutionalisoituu ja alkaa tuottaa uusia vaikutuksia.",
    axis: "structural"
  },
  {
    id: "normalization",
    index: 6,
    label: "Normalisoituminen",
    description:
      "Alkuperäinen päätös katoaa näkyvistä ja sen tuottamaa tilaa pidetään normaalina.",
    axis: "invisible"
  }
]);

/* ---------- Utilities ---------- */

/* Hae vaihe ID:llä */
export function getPhaseById(id) {
  return DECISION_LIFECYCLE.find(p => p.id === id) || null;
}

/* Hae seuraava vaihe (ympyrälogiikka) */
export function getNextPhase(id) {
  const current = getPhaseById(id);
  if (!current) return null;

  const nextIndex = current.index % DECISION_LIFECYCLE.length;
  return DECISION_LIFECYCLE.find(p => p.index === nextIndex + 1);
}

/* Hae edellinen vaihe */
export function getPreviousPhase(id) {
  const current = getPhaseById(id);
  if (!current) return null;

  const prevIndex =
    current.index === 1
      ? DECISION_LIFECYCLE.length
      : current.index - 1;

  return DECISION_LIFECYCLE.find(p => p.index === prevIndex);
}

/* Järjestä mikä tahansa lista lifecycle-järjestykseen */
export function sortByLifecycle(items, phaseKey = "phase") {
  return [...items].sort((a, b) => {
    const pa = getPhaseById(a[phaseKey])?.index || 99;
    const pb = getPhaseById(b[phaseKey])?.index || 99;
    return pa - pb;
  });
}

/* Validointi: kuuluuko vaihe elinkaareen */
export function isValidPhase(id) {
  return Boolean(getPhaseById(id));
}
