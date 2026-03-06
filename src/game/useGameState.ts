import { useMemo, useState } from "react";
import type { GameAction, GameEvent, GameState, LogEntry } from "@/game/types";
import { ACTIONS, EVENTS, MILESTONES, TIME_LABELS, WORK_NARRATIVES, STUDY_NARRATIVES, SOCIAL_NARRATIVES } from "@/game/data";

const DEFAULT_SLOTS_PER_DAY = 24;

// Salary & bills
const PAY_DAYS = [15, 30];
const paycheckAmount = 200;

const BILLS = [
  { id: "utilities", day: 10, label: "Utilities", amount: 30 },
  { id: "phone", day: 20, label: "Phone", amount: 20 },
  { id: "rent", day: 29, label: "Rent", amount: 120 },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function addLog(state: GameState, entry: Omit<LogEntry, "id">): GameState {
  const lastId = Number(state.log[state.log.length - 1]?.id ?? 0);
  const id = lastId + 1;
  return { ...state, log: [...state.log, { id, ...entry }] };
}

function timeOfDayFromSlots(slotsPerDay: number, slotsRemaining: number): GameState["timeOfDay"] {
  const used = slotsPerDay - slotsRemaining;
  const pct = used / slotsPerDay;

  if (pct < 0.25) return "morning";
  if (pct < 0.5) return "afternoon";
  if (pct < 0.75) return "evening";
  return "night";
}

function applyMonthlySystem(state: GameState): GameState {
  let s = state;

  if (PAY_DAYS.includes(s.day)) {
    s = { ...s, money: s.money + paycheckAmount };
    s = addLog(s, { text: `Payday! +$${paycheckAmount}`, type: "event", day: s.day });
  }

  for (const bill of BILLS) {
    if (bill.day === s.day) {
      const moneyRaw = s.money - bill.amount;
      const wentBroke = moneyRaw < 0;
      const money = wentBroke ? 0 : moneyRaw;

      s = { ...s, money };
      s = addLog(s, { text: `Bill due: ${bill.label} -$${bill.amount}`, type: "event", day: s.day });

      if (wentBroke) {
        const happiness = clamp(s.happiness - 8, 0, 100);
        const reputation = clamp(s.reputation - 2, 0, 100);
        s = { ...s, happiness, reputation, money: 0 };
        s = addLog(s, {
          text: "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",
          type: "event",
          day: s.day,
        });
      }
    }
  }

  return s;
}

function isBigActionId(actionId: string): boolean {
  return (
    actionId === "work" ||
    actionId === "study" ||
    actionId.startsWith("study_") ||
    actionId === "socialize" ||
    actionId.startsWith("socialize_") ||
    actionId === "practice" ||
    actionId.startsWith("practice_")
  );
}

function isEventOnCooldown(state: GameState, eventId: string): boolean {
  const last = state.eventLastDay?.[eventId];
  return last != null && state.day - last <= 1;
}

function applyEvent(state: GameState, ev: GameEvent): GameState {
  const eff = ev.effects ?? {};

  const moneyRaw = state.money + (eff.money ?? 0);
  const wentBroke = moneyRaw < 0;
  const money = wentBroke ? 0 : moneyRaw;

  let next: GameState = {
    ...state,
    money,
    energy: clamp(state.energy + (eff.energy ?? 0), 0, 100),
    happiness: clamp(state.happiness + (eff.happiness ?? 0), 0, 100),
    skills: clamp(state.skills + (eff.skills ?? 0), 0, 100),
    reputation: clamp(state.reputation + (eff.reputation ?? 0), 0, 100),
    eventLastDay: { ...(state.eventLastDay ?? {}), [ev.id]: state.day },
    dailyEventTriggeredToday: ev.kind === "daily" ? true : state.dailyEventTriggeredToday,
    actionEventTriggeredToday: ev.kind === "action" ? true : state.actionEventTriggeredToday,
  };

  next = addLog(next, { text: ev.text, type: "event", day: next.day });

  if (wentBroke) {
    const happiness = clamp(next.happiness - 8, 0, 100);
    const reputation = clamp(next.reputation - 2, 0, 100);
    next = { ...next, happiness, reputation, money: 0 };
    next = addLog(next, {
      text: "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",
      type: "event",
      day: next.day,
    });
  }

  return next;
}

function tryTriggerEvent(state: GameState, kind: "daily" | "action", actionId?: string): GameState {
  if (kind === "daily" && state.dailyEventTriggeredToday) return state;
  if (kind === "action" && state.actionEventTriggeredToday) return state;

  for (const ev of EVENTS) {
    if (ev.kind !== kind) continue;

    if (state.day < ev.minDay) continue;
    if (ev.maxDay != null && state.day > ev.maxDay) continue;

    if (isEventOnCooldown(state, ev.id)) continue;
    if (typeof ev.condition === "function" && !ev.condition(state)) continue;

    if (kind === "action" && typeof ev.trigger === "function") {
      if (!actionId) continue;
      if (!ev.trigger(actionId, state)) continue;
    }

    if (ev.chance > 0 && Math.random() < ev.chance) {
      return applyEvent(state, ev);
    }
  }

  return state;
}

function startNextDay(state: GameState): GameState {
  const slotsPerDay = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;

  const base: GameState = {
    ...state,
    day: state.day + 1,
    timeOfDay: "morning",
    actionsToday: 0,
    energy: 100,
    slotsPerDay,
    slotsRemaining: slotsPerDay,
    dailyEventTriggeredToday: false,
    actionEventTriggeredToday: false,
  };

  let s = addLog(base, { text: "You went to sleep. A new day begins.", type: "narrative", day: base.day });
  s = addLog(s, { text: `Day ${base.day} · ${TIME_LABELS.morning}`, type: "narrative", day: base.day });

  s = applyMonthlySystem(s);
  s = tryTriggerEvent(s, "daily");

  return s;
}

function pickNarrative(actionId: string): string | null {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  if (actionId === "work") return pick(WORK_NARRATIVES);
  if (actionId === "study" || actionId.startsWith("study_")) return pick(STUDY_NARRATIVES);
  if (actionId === "socialize" || actionId.startsWith("socialize_")) return pick(SOCIAL_NARRATIVES);
  return null;
}

function applyMilestones(state: GameState): GameState {
  let s = state;
  for (const m of MILESTONES) {
    const already = s.milestones.includes(m.id);
    if (!already && m.condition(s)) {
      s = { ...s, milestones: [...s.milestones, m.id] };
      s = addLog(s, { text: `Achievement unlocked: ${m.label}`, type: "milestone", day: s.day });
    }
  }
  return s;
}

function applyAction(state: GameState, action: GameAction): GameState {
  if (state.energy <= 0) return startNextDay(state);

  const slotsPerDay = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;
  const slotCost = action.slotCost ?? 1;

  const isSleepFlexible = action.id === "sleep_8h";
  const effectiveSlotCost =
    isSleepFlexible ? Math.min(slotCost, Math.max(0, state.slotsRemaining)) : slotCost;

  if (effectiveSlotCost > 0 && !isSleepFlexible && state.slotsRemaining < slotCost) {

    return addLog(state, { text: "Not enough time left today for that.", type: "event", day: state.day });
  }

  if (action.minSkills != null && state.skills < action.minSkills) {
    return addLog(state, {
      text: action.lockedText ?? `Requires ${action.minSkills} Skills to unlock.`,
      type: "event",
      day: state.day,
    });
  }

  if (action.energyCost > 0 && state.energy < action.energyCost) {
    return addLog(state, { text: "You don't have enough energy for that.", type: "event", day: state.day });
  }

  const slotsRemaining = clamp(state.slotsRemaining - effectiveSlotCost, 0, slotsPerDay);
  const energyAfterCost = clamp(state.energy - action.energyCost, 0, 100);

  const eff = action.effects ?? {};

  // Flexible sleep: if less than 8h remain, scale recovery proportionally
  const scale = isSleepFlexible && slotCost > 0 ? effectiveSlotCost / slotCost : 1;
  const scaledEff = {
    ...eff,
    energy: eff.energy != null ? Math.round(eff.energy * scale) : eff.energy,
    happiness: eff.happiness != null ? Math.round(eff.happiness * scale) : eff.happiness,
    skills: eff.skills != null ? Math.round(eff.skills * scale) : eff.skills,
    reputation: eff.reputation != null ? Math.round(eff.reputation * scale) : eff.reputation,
    money: eff.money != null ? Math.round(eff.money * scale) : eff.money,
  };

  const moneyRaw = state.money + (scaledEff.money ?? 0);
  const wentBroke = moneyRaw < 0;
  const money = wentBroke ? 0 : moneyRaw;

  let happiness = clamp(state.happiness + (scaledEff.happiness ?? 0), 0, 100);
  const skills = clamp(state.skills + (scaledEff.skills ?? 0), 0, 100);
  const reputation = clamp(state.reputation + (scaledEff.reputation ?? 0), 0, 100);
  const energy = clamp(energyAfterCost + (scaledEff.energy ?? 0), 0, 100);

  const timeOfDay = timeOfDayFromSlots(slotsPerDay, slotsRemaining);

  let next: GameState = {
    ...state,
    money,
    happiness,
    skills,
    reputation,
    energy,
    actionsToday: state.actionsToday + 1,
    timeOfDay,
    slotsPerDay,
    slotsRemaining,
  };

  next = addLog(next, { text: `${action.icon} ${action.label} (⏱️ ${effectiveSlotCost}h)`, type: "action", day: next.day });

  if (wentBroke) {
    happiness = clamp(next.happiness - 8, 0, 100);
    const repPenalty = clamp(next.reputation - 2, 0, 100);
    next = { ...next, happiness, reputation: repPenalty, money: 0 };
    next = addLog(next, {
      text: "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",
      type: "event",
      day: next.day,
    });
  }

  const narrative = pickNarrative(action.id);
  if (narrative) next = addLog(next, { text: narrative, type: "narrative", day: next.day });

  next = applyMilestones(next);

  if (isBigActionId(action.id)) next = tryTriggerEvent(next, "action", action.id);

  if (next.energy <= 0) return startNextDay(addLog(next, { text: "You're exhausted.", type: "event", day: next.day }));
  if (next.slotsRemaining <= 0) return startNextDay(addLog(next, { text: "No time left today.", type: "event", day: next.day }));

  return next;
}

export const STARTING_STATE: GameState = {
  day: 1,
  timeOfDay: "morning",

  money: 200,
  energy: 100,
  happiness: 55,
  skills: 0,
  reputation: 0,

  fatigueDebt: 0,
  needsRecharge: false,
  crashPenaltyApplied: 0,

  actionsToday: 0,
  maxActions: 999,
  milestones: [],
  jobTitle: "Junior Developer",
  phase: "intro",
  slotsPerDay: DEFAULT_SLOTS_PER_DAY,
  slotsRemaining: DEFAULT_SLOTS_PER_DAY,
  dailyEventTriggeredToday: false,
  actionEventTriggeredToday: false,
  eventLastDay: {},
  log: [
    { id: 1, text: "A fresh start begins.", type: "narrative", day: 1 },
    { id: 2, text: `Day 1 · ${TIME_LABELS.morning}`, type: "narrative", day: 1 },
    { id: 3, text: "Salary is paid on Day 15 and Day 30. Bills arrive during the month.", type: "event", day: 1 },
  ],
};

function _useGameState() {
  const [state, setState] = useState<GameState>(STARTING_STATE);

  const availableActions = useMemo(() => {
    // IMPORTANT: We keep actions visible only when truly unlocked (your current rule).
    // If later you want to show locked actions, we can use showWhenLocked + lockedText.
    return ACTIONS.filter((a) => {
      if (a.minDay && state.day < a.minDay) return false;
      if (a.minSkills && state.skills < a.minSkills) return false;
      return true;
    });
  }, [state.day, state.skills]);

  const onAction = (id: string) => {
    const action = availableActions.find((a) => a.id === id);
    if (!action) return;
    setState((prev) => applyAction(prev, action));
  };

  const onSkipDay = () => setState((prev) => startNextDay(prev));

  const onStart = () =>
    setState((prev) => {
      const started = applyMonthlySystem({ ...prev, phase: "playing" });
      return tryTriggerEvent(started, "daily");
    });

  const onRestart = () => setState(STARTING_STATE);

  return { state, availableActions, onAction, onSkipDay, onStart, onRestart };
}

export const useGameState = _useGameState;
export default _useGameState;