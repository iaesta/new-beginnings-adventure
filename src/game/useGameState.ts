import { useMemo, useState } from "react";
import type { GameAction, GameState, LogEntry } from "@/game/types";
import {
  ACTIONS,
  MILESTONES,
  TIME_LABELS,
  WORK_NARRATIVES,
  STUDY_NARRATIVES,
  SOCIAL_NARRATIVES,
} from "@/game/data";

/**
 * useGameState.ts (Energy-based loop)
 * - Gameplay is limited by energy (NOT by maxActions)
 * - Auto-advances to the next day when energy reaches 0
 * - Provides onStart/onRestart for IntroScreen/EndingScreen
 *
 * Extra safety:
 * - Exports BOTH default and named `useGameState` so imports won't break.
 */

const TIME_ORDER: GameState["timeOfDay"][] = ["morning", "afternoon", "evening", "night"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function nextLogId(log: LogEntry[]) {
  const last = log[log.length - 1];
  return last ? last.id + 1 : 1;
}

function addLog(state: GameState, entry: Omit<LogEntry, "id">): GameState {
  const id = nextLogId(state.log);
  return { ...state, log: [...state.log, { id, ...entry }] };
}

function advanceTimeOfDay(t: GameState["timeOfDay"]): GameState["timeOfDay"] {
  const idx = TIME_ORDER.indexOf(t);
  if (idx < 0) return "morning";
  return TIME_ORDER[Math.min(idx + 1, TIME_ORDER.length - 1)];
}

function startNextDay(state: GameState): GameState {
  const base: GameState = {
    ...state,
    day: state.day + 1,
    timeOfDay: "morning",
    actionsToday: 0,
    energy: 100,
    // keep maxActions for compatibility (UI shouldn't rely on it anymore)
    maxActions: state.maxActions,
  };

  return addLog(base, {
    text: "You went to sleep. A new day begins.",
    type: "narrative",
    day: base.day,
  });
}

function pickNarrative(actionId: string): string | null {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] ?? null;

  if (actionId === "work") return pick(WORK_NARRATIVES);
  if (actionId === "study") return pick(STUDY_NARRATIVES);
  if (actionId === "socialize") return pick(SOCIAL_NARRATIVES);
  return null;
}

function applyMilestones(state: GameState): GameState {
  let s = state;

  for (const m of MILESTONES as any[]) {
    if (!s.milestones.includes(m.id) && typeof m.condition === "function" && m.condition(s)) {
      s = { ...s, milestones: [...s.milestones, m.id] };
      s = addLog(s, {
        text: `Milestone unlocked: ${m.label}`,
        type: "milestone",
        day: s.day,
      });
    }
  }

  return s;
}

function applyAction(state: GameState, action: GameAction): GameState {
  // If energy is already 0, force next day (prevents weird stuck states)
  if (state.energy <= 0) return startNextDay(state);

  // If the action costs energy and we don't have enough, ignore it
  // (EnergyCost can be negative for Rest)
  if (action.energyCost > 0 && state.energy < action.energyCost) {
    return addLog(state, {
      text: "You don't have enough energy for that.",
      type: "event",
      day: state.day,
    });
  }

  // 1) Pay the energy cost (clamped)
  const energyAfterCost = clamp(state.energy - action.energyCost, 0, 100);

  // 2) Apply effects
  const eff = action.effects ?? {};
  const money = Math.max(0, state.money + (eff.money ?? 0));
  const happiness = clamp(state.happiness + (eff.happiness ?? 0), 0, 100);
  const skills = clamp(state.skills + (eff.skills ?? 0), 0, 100);
  const reputation = Math.max(0, state.reputation + (eff.reputation ?? 0));
  const energy = clamp(energyAfterCost + (eff.energy ?? 0), 0, 100);

  let next: GameState = {
    ...state,
    money,
    happiness,
    skills,
    reputation,
    energy,
    actionsToday: state.actionsToday + 1,
    timeOfDay: advanceTimeOfDay(state.timeOfDay),
  };

  // Action log line
  next = addLog(next, {
    text: `${action.icon} ${action.label}`,
    type: "action",
    day: next.day,
  });

  // Optional narrative
  const narrative = pickNarrative(action.id);
  if (narrative) {
    next = addLog(next, { text: narrative, type: "narrative", day: next.day });
  }

  // Milestones
  next = applyMilestones(next);

  // ✅ If energy hits 0, auto-sleep to next day
  if (next.energy <= 0) {
    next = addLog(next, { text: "You're exhausted.", type: "event", day: next.day });
    return startNextDay(next);
  }

  return next;
}

export const STARTING_STATE: GameState = {
  day: 1,
  timeOfDay: "morning",
  money: 0,
  energy: 100,
  happiness: 55,
  skills: 0,
  reputation: 0,
  actionsToday: 0,
  maxActions: 999, // kept for compatibility; gameplay does not use it
  milestones: [],
  jobTitle: "Junior Developer",
  phase: "intro",
  log: [
    { id: 1, text: "A fresh start begins.", type: "narrative", day: 1 },
    { id: 2, text: `Day 1 · ${TIME_LABELS.morning}`, type: "narrative", day: 1 },
  ],
};

function _useGameState() {
  const [state, setState] = useState<GameState>(STARTING_STATE);

  const availableActions = useMemo(() => {
    return ACTIONS.filter((a) => {
      const okDay = a.minDay == null || state.day >= a.minDay;
      const okSkills = a.minSkills == null || state.skills >= a.minSkills;
      return okDay && okSkills;
    });
  }, [state.day, state.skills]);

  const onAction = (id: string) => {
    const action = availableActions.find((a) => a.id === id);
    if (!action) return;
    setState((prev) => applyAction(prev, action));
  };

  const onSkipDay = () => {
    setState((prev) => startNextDay(prev));
  };

  const onStart = () => {
    setState((prev) => ({ ...prev, phase: "playing" }));
  };

  const onRestart = () => {
    setState(STARTING_STATE);
  };

  return { state, availableActions, onAction, onSkipDay, onStart, onRestart };
}

// Export BOTH styles so your imports won't break
export const useGameState = _useGameState;
export default _useGameState;
