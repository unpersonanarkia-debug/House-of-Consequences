/* ============================================================
   House of Consequences — Timeline Engine
   Maps events to decision lifecycle phases
   ============================================================ */

import { isValidPhase, sortByLifecycle } from "./lifecycle.js";

/* -------- Event schema (canonical) --------
{
  id: "event-id",
  phase: "decision" | "impact" | "consequence" | ...
  timestamp: "YYYY-MM-DD" | number
  title: "Short label",
  description: "Optional longer text"
}
------------------------------------------- */

/* Normalize timestamp to numeric value */
function normalizeTime(ts) {
  if (typeof ts === "number") return ts;
  return new Date(ts).getTime();
}

/* Validate single event */
export function validateEvent(event) {
  if (!event.id) return false;
  if (!isValidPhase(event.phase)) return false;
  if (!event.timestamp) return false;
  return true;
}

/* Normalize event */
export function normalizeEvent(event) {
  if (!validateEvent(event)) {
    throw new Error(Invalid timeline event: ${event.id});
  }

  return {
    ...event,
    time: normalizeTime(event.timestamp)
  };
}

/* Normalize full timeline */
export function buildTimeline(events = []) {
  return events
    .map(normalizeEvent)
    .sort((a, b) => a.time - b.time);
}

/* Group timeline by lifecycle phase */
export function groupTimelineByPhase(events = []) {
  const timeline = buildTimeline(events);

  return timeline.reduce((acc, event) => {
    acc[event.phase] = acc[event.phase] || [];
    acc[event.phase].push(event);
    return acc;
  }, {});
}

/* Flatten timeline in lifecycle order */
export function timelineByLifecycle(events = []) {
  const timeline = buildTimeline(events);
  return sortByLifecycle(timeline, "phase");
}

/* Extract lifecycle progression (unique phase order) */
export function extractLifecyclePath(events = []) {
  const timeline = buildTimeline(events);
  const seen = new Set();

  return timeline
    .filter(e => {
      if (seen.has(e.phase)) return false;
      seen.add(e.phase);
      return true;
    })
    .map(e => e.phase);
}

/* Determine current lifecycle phase (latest event) */
export function getCurrentPhase(events = []) {
  if (!events.length) return null;
  const timeline = buildTimeline(events);
  return timeline[timeline.length - 1].phase;
}
