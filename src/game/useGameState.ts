import { useMemo, useState } from "react";
import type { GameAction, GameEvent, GameState, LogEntry } from "@/game/types";
import { ACTIONS, EVENTS, MILESTONES, ACTION_NARRATIVES, TIME_LABELS } from "@/game/data";

const DEFAULT_SLOTS_PER_DAY = 24;
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

function normalizeNarrativeGroup(actionId: string): string {
  if (actionId.startsWith("study_") || actionId === "study") return "study";
  if (actionId.startsWith("socialize_") || actionId === "socialize") return "socialize";
  if (actionId === "nap_1h" || actionId === "rest_4h" || actionId === "sleep_8h" || actionId === "rest") return "rest";
  return actionId;
}

function pickNarrativeParams(actionId: string): { group: string; index: number } | null {
  const group = normalizeNarrativeGroup(actionId);
  const arr = ACTION_NARRATIVES[group] ?? ACTION_NARRATIVES[actionId];
  if (!arr || arr.length === 0) return null;
  const index = Math.floor(Math.random() * arr.length);
  return { group, index };
}

function applyMonthlySystem(state: GameState): GameState {
  let s = state;

  if (PAY_DAYS.includes(s.day)) {
    s = { ...s, money: s.money + paycheckAmount };
    s = addLog(s, { key: "log.money.payday", params: { amount: paycheckAmount }, type: "event", day: s.day });
  }

  for (const bill of BILLS) {
    if (bill.day === s.day) {
      const moneyRaw = s.money - bill.amount;
      const wentBroke = moneyRaw < 0;
      const money = wentBroke ? 0 : moneyRaw;

      s = { ...s, money };
      s = addLog(s, { key: "log.money.billDue", params: { label: bill.label, amount: bill.amount }, type: "event", day: s.day });

      if (wentBroke) {
        const happiness = clamp(s.happiness - 8, 0, 100);
        const reputation = clamp(s.reputation - 2, 0, 100);
        s = { ...s, happiness, reputation, money: 0 };
        s = addLog(s, {
          key: "log.money.wentBroke",
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

  next = addLog(next, {
    key: "log.event.byId",
    params: { eventId: ev.id, fallback: ev.text },
    type: "event",
    day: next.day,
  });

  if (wentBroke) {
    const happiness = clamp(next.happiness - 8, 0, 100);
    const reputation = clamp(next.reputation - 2, 0, 100);
    next = { ...next, happiness, reputation, money: 0 };
    next = addLog(next, {
      key: "log.money.wentBroke",
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

  let s = addLog(base, { key: "log.system.sleepNewDay", type: "narrative", day: base.day });
  s = addLog(s, { key: "log.system.newDay", params: { day: base.day, timeOfDay: "morning" }, type: "narrative", day: base.day });
  s = applyMonthlySystem(s);
  s = tryTriggerEvent(s, "daily");

  return s;
}

function applyMilestones(state: GameState): GameState {
  let s = state;
  for (const m of MILESTONES) {
    const already = s.milestones.includes(m.id);
    if (!already && m.condition(s)) {
      s = { ...s, milestones: [...s.milestones, m.id] };
      s = addLog(s, {
        key: "log.achievement.unlocked",
        params: { id: m.id, label: m.label },
        type: "milestone",
        day: s.day,
      });
    }
  }
  return s;
}

function applyAction(state: GameState, action: GameAction): GameState {
  if (state.energy <= 0) return startNextDay(state);

  const slotsPerDay = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;
  const slotCost = action.slotCost ?? 1;
  const isSleepFlexible = action.id === "sleep_8h";
  const effectiveSlotCost = isSleepFlexible ? Math.min(slotCost, Math.max(0, state.slotsRemaining)) : slotCost;

  if (effectiveSlotCost > 0 && !isSleepFlexible && state.slotsRemaining < slotCost) {
    return addLog(state, { key: "log.system.notEnoughTime", type: "event", day: state.day });
  }

  if (action.minSkills != null && state.skills < action.minSkills) {
    return addLog(state, {
      key: "log.system.lockedBySkills",
      params: { minSkills: action.minSkills },
      type: "event",
      day: state.day,
    });
  }

  if (action.energyCost > 0 && state.energy < action.energyCost) {
    return addLog(state, { key: "log.system.notEnoughEnergy", type: "event", day: state.day });
  }

  const slotsRemaining = clamp(state.slotsRemaining - effectiveSlotCost, 0, slotsPerDay);
  const energyAfterCost = clamp(state.energy - action.energyCost, 0, 100);
  const eff = action.effects ?? {};
  const scale = isSleepFlexible && slotCost > 0 ? effectiveSlotCost / slotCost : 1;

  const scaledEff = {
    ...eff,
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

  let energy: number;
  if (isSleepFlexible) {
    const recovered = Math.round(100 * scale);
    energy = clamp(energyAfterCost + recovered, 0, 100);
  } else {
    energy = clamp(energyAfterCost + (eff.energy ?? 0), 0, 100);
  }

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

  next = addLog(next, {
    key: "log.action.performed",
    params: { icon: action.icon, actionId: action.id, hours: effectiveSlotCost },
    type: "action",
    day: next.day,
  });

  if (wentBroke) {
    happiness = clamp(next.happiness - 8, 0, 100);
    const repPenalty = clamp(next.reputation - 2, 0, 100);
    next = { ...next, happiness, reputation: repPenalty, money: 0 };
    next = addLog(next, {
      key: "log.money.wentBroke",
      type: "event",
      day: next.day,
    });
  }

  const narrative = pickNarrativeParams(action.id);
  if (narrative) {
    next = addLog(next, {
      key: "log.narrative",
      params: narrative,
      type: "narrative",
      day: next.day,
    });
  }

  next = applyMilestones(next);

  if (isBigActionId(action.id)) next = tryTriggerEvent(next, "action", action.id);

  if (next.energy <= 0) return startNextDay(addLog(next, { key: "log.system.exhausted", type: "event", day: next.day }));
  if (next.slotsRemaining <= 0) return startNextDay(addLog(next, { key: "log.system.noTimeLeft", type: "event", day: next.day }));

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
    { id: 1, key: "log.system.freshStart", type: "narrative", day: 1 },
    { id: 2, key: "log.system.newDay", params: { day: 1, timeOfDay: "morning" }, type: "narrative", day: 1 },
    { id: 3, key: "log.system.salaryRules", type: "event", day: 1 },
  ],
};

function _useGameState() {
  const [state, setState] = useState<GameState>(STARTING_STATE);

  const availableActions = useMemo(() => {
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