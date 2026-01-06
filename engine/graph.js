/* ============================================================
   House of Consequences — Consequence Logic (Graph Core)
   File: /engine/graph.js
   ============================================================ */

/* -------- Node schema (canonical) --------
{
  id: "node-id",
  phase: "decision" | "impact" | "consequence" | "adaptation" | "accumulation" | "normalization",
  label: "Short title",
  description?: "Longer text",
  meta?: {}
}
------------------------------------------ */

/* -------- Edge schema (canonical) --------
{
  from: "node-id",
  to: "node-id",
  type?: "causal" | "amplifies" | "delays" | "feedback",
  weight?: number
}
------------------------------------------ */

export function createGraph(nodes = [], edges = []) {
  const nodeMap = new Map();
  nodes.forEach(n => nodeMap.set(n.id, n));

  return {
    nodes: nodeMap,
    edges: [...edges]
  };
}

export function getNode(graph, nodeId) {
  return graph.nodes.get(nodeId) || null;
}

export function getOutgoingEdges(graph, nodeId) {
  return graph.edges.filter(e => e.from === nodeId);
}

export function getIncomingEdges(graph, nodeId) {
  return graph.edges.filter(e => e.to === nodeId);
}

export function getConnectedNodes(graph, nodeId) {
  const outgoing = getOutgoingEdges(graph, nodeId).map(e => getNode(graph, e.to));
  const incoming = getIncomingEdges(graph, nodeId).map(e => getNode(graph, e.from));
  return [...new Set([...outgoing, ...incoming])].filter(Boolean);
}

export function addNode(graph, node) {
  graph.nodes.set(node.id, node);
}

export function addEdge(graph, edge) {
  graph.edges.push(edge);
}

export function removeNode(graph, nodeId) {
  graph.nodes.delete(nodeId);
  graph.edges = graph.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
}

export function removeEdge(graph, from, to) {
  graph.edges = graph.edges.filter(e => !(e.from === from && e.to === to));
}
