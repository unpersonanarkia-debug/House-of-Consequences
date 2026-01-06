/* ============================================================
   House of Consequences — Consequence Logic Utilities
   File: /engine/graph-analysis.js
   ============================================================ */

import { getOutgoingEdges, getIncomingEdges } from "./graph.js";

/* Detect linear causal chain from a start node */
export function traceForward(graph, startNodeId, visited = new Set()) {
  if (visited.has(startNodeId)) return [];
  visited.add(startNodeId);

  const edges = getOutgoingEdges(graph, startNodeId);
  return edges.flatMap(e => [
    e.to,
    ...traceForward(graph, e.to, visited)
  ]);
}

/* Detect feedback loops */
export function detectCycles(graph) {
  const cycles = [];

  graph.nodes.forEach((_, nodeId) => {
    const path = traceForward(graph, nodeId);
    if (path.includes(nodeId)) cycles.push(nodeId);
  });

  return [...new Set(cycles)];
}

/* Phase-based grouping */
export function groupNodesByPhase(graph) {
  const groups = {};
  graph.nodes.forEach(node => {
    groups[node.phase] = groups[node.phase] || [];
    groups[node.phase].push(node);
  });
  return groups;
}

/* Impact score (incoming + outgoing edges) */
export function calculateImpact(graph, nodeId) {
  const incoming = getIncomingEdges(graph, nodeId).length;
  const outgoing = getOutgoingEdges(graph, nodeId).length;
  return incoming + outgoing;
}
