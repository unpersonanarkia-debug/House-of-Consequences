/* ============================================================
   House of Consequences — Core Engine
   Yksi totuus kaikille näkymille ja casebookeille
   ============================================================ */

/* ---------- 1. Päätöksen elinkaari ---------- */

export const LIFECYCLE = [
  { id: "decision", index: 1, label: "Päätös" },
  { id: "impact", index: 2, label: "Vaikutus" },
  { id: "consequence", index: 3, label: "Seuraukset" },
  { id: "adaptation", index: 4, label: "Sopeutuminen" },
  { id: "accumulation", index: 5, label: "Kertautuminen" },
  { id: "normalization", index: 6, label: "Normalisoituminen" }
];

/* ---------- 2. Node ---------- */

export class Node {
  constructor({
    id,
    text,
    phase,
    timestamp = null,
    metadata = {}
  }) {
    this.id = id;
    this.text = text;
    this.phase = phase;           // lifecycle id
    this.timestamp = timestamp;   // Date | null
    this.metadata = metadata;
  }
}

/* ---------- 3. Edge ---------- */

export class Edge {
  constructor({
    from,
    to,
    type = "causal",   // causal | inferred | institutional
    weight = 1
  }) {
    this.from = from;
    this.to = to;
    this.type = type;
    this.weight = weight;
  }
}

/* ---------- 4. Case ---------- */

export class Case {
  constructor({ id, title, source }) {
    this.id = id;
    this.title = title;
    this.source = source;
    this.nodes = [];
    this.edges = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  addEdge(edge) {
    this.edges.push(edge);
  }

  /* Palauttaa nodet elinkaaren mukaisessa järjestyksessä */
  getNodesByLifecycle() {
    return [...this.nodes].sort((a, b) => {
      const pa = LIFECYCLE.find(p => p.id === a.phase)?.index || 99;
      const pb = LIFECYCLE.find(p => p.id === b.phase)?.index || 99;
      return pa - pb;
    });
  }

  /* Aikajana */
  getTimeline() {
    return this.nodes
      .filter(n => n.timestamp)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
}

/* ---------- 5. Seurauslogiikka ---------- */

export class ConsequenceEngine {

  static validate(caseData) {
    const errors = [];

    caseData.nodes.forEach(n => {
      if (!LIFECYCLE.find(p => p.id === n.phase)) {
        errors.push(Node ${n.id}: tuntematon vaihe ${n.phase});
      }
    });

    caseData.edges.forEach(e => {
      if (!caseData.nodes.find(n => n.id === e.from)) {
        errors.push(Edge from ${e.from}: node puuttuu);
      }
      if (!caseData.nodes.find(n => n.id === e.to)) {
        errors.push(Edge to ${e.to}: node puuttuu);
      }
    });

    return errors;
  }

  /* Palauttaa seurauspuun yhdestä nodelta eteenpäin */
  static getConsequences(caseData, nodeId) {
    const visited = new Set();
    const result = [];

    function walk(id) {
      if (visited.has(id)) return;
      visited.add(id);

      const outgoing = caseData.edges.filter(e => e.from === id);
      outgoing.forEach(e => {
        const target = caseData.nodes.find(n => n.id === e.to);
        if (target) {
          result.push(target);
          walk(target.id);
        }
      });
    }

    walk(nodeId);
    return result;
  }
}

/* ---------- 6. Visualisointimoottorin rajapinta ---------- */
/* Engine EI piirrä mitään – se vain antaa datan */

export const VisualizationAdapter = {

  /* Talo (pystyakseli) */
  toTower(caseData) {
    return caseData.getNodesByLifecycle().map(n => ({
      id: n.id,
      label: n.text,
      phase: n.phase
    }));
  },

  /* Ympyrä (kehämalli) */
  toCircle(caseData) {
    const nodes = caseData.getNodesByLifecycle();
    const step = (Math.PI * 2) / nodes.length;

    return nodes.map((n, i) => ({
      id: n.id,
      label: n.text,
      phase: n.phase,
      angle: i * step
    }));
  },

  /* Graafi */
  toGraph(caseData) {
    return {
      nodes: caseData.nodes.map(n => ({
        id: n.id,
        label: n.text,
        phase: n.phase
      })),
      edges: caseData.edges
    };
  }
};
