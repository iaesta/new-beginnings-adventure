import { useMemo, useState } from "react";
import type { GameAction, GameEvent, GameState, LogEntry } from "@/game/types";
import { ACTIONS, EVENTS, MILESTONES, ACTION_NARRATIVES } from "@/game/data";

const DEFAULT_SLOTS_PER_DAY = 24;
const PAY_DAYS = [15, 30];
const paycheckAmount = 200;
const BILLS = [
  { id: "utilities", day: 10, label: "Utilities", amount: 30 },
  { id: "phone", day: 20, label: "Phone", amount: 20 },
  { id: "rent", day: 29, label: "Rent", amount: 120 },
];
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));
const addLog = (state: GameState, entry: Omit<LogEntry, "id">): GameState => ({
  ...state,
  log: [
    ...state.log,
    { id: Number(state.log[state.log.length - 1]?.id ?? 0) + 1, ...entry },
  ],
});
const getFatigueModifiers = (s: number) =>
  s >= 3
    ? { energyCostMult: 1.45, skillsMult: 0.4, happinessGainMult: 0.6 }
    : s === 2
      ? { energyCostMult: 1.3, skillsMult: 0.6, happinessGainMult: 0.8 }
      : s === 1
        ? { energyCostMult: 1.15, skillsMult: 0.8, happinessGainMult: 1 }
        : { energyCostMult: 1, skillsMult: 1, happinessGainMult: 1 };
const timeOfDayFromSlots = (
  spd: number,
  sr: number,
): GameState["timeOfDay"] => {
  const p = (spd - sr) / spd;
  return p < 0.25
    ? "morning"
    : p < 0.5
      ? "afternoon"
      : p < 0.75
        ? "evening"
        : "night";
};
const calculateSleepStartEnergy = (sr: number) => {
  const sleepHours = Math.min(8, Math.max(0, sr));
  const extraHours = Math.max(0, sr - 8);
  return clamp(
    Math.round((sleepHours / 8) * 90) + Math.min(extraHours * 5, 10),
    0,
    100,
  );
};
const normalizeNarrativeGroup = (id: string) =>
  id.startsWith("study_") || id === "study"
    ? "study"
    : id.startsWith("socialize_") || id === "socialize"
      ? "socialize"
      : ["nap_1h", "rest_4h", "sleep_8h", "rest"].includes(id)
        ? "rest"
        : id;
function pickNarrativeParams(actionId: string) {
  const arr =
    (ACTION_NARRATIVES as any)[normalizeNarrativeGroup(actionId)] ??
    (ACTION_NARRATIVES as any)[actionId];
  if (!arr?.length) return null;
  return {
    group: normalizeNarrativeGroup(actionId),
    index: Math.floor(Math.random() * arr.length),
  };
}
function applyMonthlySystem(state: GameState) {
  let s = state;
  if (PAY_DAYS.includes(s.day)) {
    s = { ...s, money: s.money + paycheckAmount };
    s = addLog(s, {
      key: "log.money.payday",
      params: { amount: paycheckAmount },
      type: "event",
      day: s.day,
    });
  }
  for (const bill of BILLS) {
    if (bill.day === s.day) {
      const moneyRaw = s.money - bill.amount;
      const wentBroke = moneyRaw < 0;
      const money = wentBroke ? 0 : moneyRaw;
      s = { ...s, money };
      s = addLog(s, {
        key: "log.money.billDue",
        params: { label: bill.label, amount: bill.amount },
        type: "event",
        day: s.day,
      });
      if (wentBroke) {
        s = {
          ...s,
          happiness: clamp(s.happiness - 8, 0, 100),
          reputation: clamp(s.reputation - 2, 0, 100),
          money: 0,
        };
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
const isBigActionId = (id: string) =>
  id === "work" ||
  id === "study" ||
  id.startsWith("study_") ||
  id === "socialize" ||
  id.startsWith("socialize_") ||
  id === "practice" ||
  id.startsWith("practice_");
const isEventOnCooldown = (state: GameState, eventId: string) => {
  const last = state.eventLastDay?.[eventId];
  return last != null && state.day - last <= 1;
};
function applyEvent(state: GameState, ev: GameEvent) {
  const eff = ev.effects ?? {};
  const moneyRaw = state.money + (eff.money ?? 0);
  const wentBroke = moneyRaw < 0;
  const money = wentBroke ? 0 : moneyRaw;
  let next = {
    ...state,
    money,
    energy: clamp(state.energy + (eff.energy ?? 0), 0, 100),
    happiness: clamp(state.happiness + (eff.happiness ?? 0), 0, 100),
    skills: clamp(state.skills + (eff.skills ?? 0), 0, 100),
    reputation: clamp(state.reputation + (eff.reputation ?? 0), 0, 100),
    eventLastDay: { ...(state.eventLastDay ?? {}), [ev.id]: state.day },
    dailyEventTriggeredToday:
      ev.kind === "daily" ? true : state.dailyEventTriggeredToday,
    actionEventTriggeredToday:
      ev.kind === "action" ? true : state.actionEventTriggeredToday,
  };
  next = addLog(next, {
    key: "log.event.byId",
    params: { eventId: ev.id, fallback: ev.text },
    type: "event",
    day: next.day,
  });
  if (wentBroke) {
    next = {
      ...next,
      happiness: clamp(next.happiness - 8, 0, 100),
      reputation: clamp(next.reputation - 2, 0, 100),
      money: 0,
    };
    next = addLog(next, {
      key: "log.money.wentBroke",
      type: "event",
      day: next.day,
    });
  }
  return next;
}
function tryTriggerEvent(
  state: GameState,
  kind: "daily" | "action",
  actionId?: string,
) {
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
    if (ev.chance > 0 && Math.random() < ev.chance)
      return applyEvent(state, ev);
  }
  return state;
}
function startNextDay(state: GameState, startEnergy = 100) {
  const spd = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;
  let s: GameState = {
    ...state,
    day: state.day + 1,
    timeOfDay: "morning",
    actionsToday: 0,
    energy: clamp(startEnergy, 0, 100),
    slotsPerDay: spd,
    slotsRemaining: spd,
    dailyEventTriggeredToday: false,
    actionEventTriggeredToday: false,
  };
  s = addLog(s, {
    key: "log.system.sleepNewDay",
    type: "narrative",
    day: s.day,
  });
  s = addLog(s, {
    key: "log.system.newDay",
    params: { day: s.day, timeOfDay: "morning" },
    type: "narrative",
    day: s.day,
  });
  s = applyMonthlySystem(s);
  s = tryTriggerEvent(s, "daily");
  return s;
}
function applyMilestones(state: GameState) {
  let s = state;
  for (const m of MILESTONES) {
    if (!s.milestones.includes(m.id) && m.condition(s)) {
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
function applyAction(state: GameState, action: GameAction) {
  if (state.energy <= 0) return startNextDay(state, 40);
  const spd = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;
  const slotCost = action.slotCost ?? 1;
  const isSleepFlexible = action.id === "sleep_8h";
  const effectiveSlotCost = isSleepFlexible
    ? Math.min(slotCost, Math.max(0, state.slotsRemaining))
    : slotCost;
  const fatigue = getFatigueModifiers(state.fatigueStacks);
  const effectiveEnergyCost = Math.ceil(
    Math.max(0, action.energyCost) * fatigue.energyCostMult,
  );
  if (
    effectiveSlotCost > 0 &&
    !isSleepFlexible &&
    state.slotsRemaining < slotCost
  )
    return addLog(state, {
      key: "log.system.notEnoughTime",
      type: "event",
      day: state.day,
    });
  if (action.minSkills != null && state.skills < action.minSkills)
    return addLog(state, {
      key: "log.system.lockedBySkills",
      params: { minSkills: action.minSkills },
      type: "event",
      day: state.day,
    });
  if (effectiveEnergyCost > 0 && state.energy < effectiveEnergyCost)
    return addLog(state, {
      key: "log.system.notEnoughEnergy",
      type: "event",
      day: state.day,
    });
  const slotsRemaining = clamp(
    state.slotsRemaining - effectiveSlotCost,
    0,
    spd,
  );
  const energyAfterCost = clamp(state.energy - effectiveEnergyCost, 0, 100);
  const eff = action.effects ?? {};
  const scale =
    isSleepFlexible && slotCost > 0 ? effectiveSlotCost / slotCost : 1;
  const scaled = {
    energy: eff.energy != null ? Math.round(eff.energy * scale) : eff.energy,
    happiness:
      eff.happiness != null ? Math.round(eff.happiness * scale) : eff.happiness,
    skills: eff.skills != null ? Math.round(eff.skills * scale) : eff.skills,
    reputation:
      eff.reputation != null
        ? Math.round(eff.reputation * scale)
        : eff.reputation,
    money: eff.money != null ? Math.round(eff.money * scale) : eff.money,
  };
  if ((scaled.skills ?? 0) > 0)
    scaled.skills = Math.round((scaled.skills ?? 0) * fatigue.skillsMult);
  if ((scaled.happiness ?? 0) > 0)
    scaled.happiness = Math.round(
      (scaled.happiness ?? 0) * fatigue.happinessGainMult,
    );
  const moneyRaw = state.money + (scaled.money ?? 0);
  const wentBroke = moneyRaw < 0;
  const money = wentBroke ? 0 : moneyRaw;
  let next: GameState = {
    ...state,
    money,
    happiness: clamp(state.happiness + (scaled.happiness ?? 0), 0, 100),
    skills: clamp(state.skills + (scaled.skills ?? 0), 0, 100),
    reputation: clamp(state.reputation + (scaled.reputation ?? 0), 0, 100),
    energy: isSleepFlexible
      ? state.energy
      : clamp(energyAfterCost + (scaled.energy ?? 0), 0, 100),
    actionsToday: state.actionsToday + 1,
    timeOfDay: timeOfDayFromSlots(spd, slotsRemaining),
    slotsPerDay: spd,
    slotsRemaining,
  };
  next = addLog(next, {
    key: "log.action.performed",
    params: {
      icon: action.icon,
      actionId: action.id,
      hours: effectiveSlotCost,
    },
    type: "action",
    day: next.day,
  });
  if (wentBroke) {
    next = {
      ...next,
      happiness: clamp(next.happiness - 8, 0, 100),
      reputation: clamp(next.reputation - 2, 0, 100),
      money: 0,
    };
    next = addLog(next, {
      key: "log.money.wentBroke",
      type: "event",
      day: next.day,
    });
  }
  const narrative = pickNarrativeParams(action.id);
  if (narrative)
    next = addLog(next, {
      key: "log.narrative",
      params: narrative,
      type: "narrative",
      day: next.day,
    });
  next = applyMilestones(next);
  if (isBigActionId(action.id))
    next = tryTriggerEvent(next, "action", action.id);
  if (isSleepFlexible) {
    const sleptEnough = state.slotsRemaining >= 8;
    const goodSleepStreak = sleptEnough ? state.goodSleepStreak + 1 : 0;
    let fatigueStacks = state.fatigueStacks;
    if (goodSleepStreak >= 2 && fatigueStacks > 0) fatigueStacks -= 1;
    const afterSleep = {
      ...next,
      goodSleepStreak: goodSleepStreak >= 2 ? 0 : goodSleepStreak,
      fatigueStacks,
    };
    return startNextDay(
      afterSleep,
      calculateSleepStartEnergy(state.slotsRemaining),
    );
  }
  if (next.energy <= 0) {
    if (state.fatigueStacks >= 3) {
      return addLog(
        {
          ...next,
          happiness: clamp(next.happiness - 10, 0, 100),
          phase: "ending",
        },
        { key: "log.system.gameOverBurnout", type: "event", day: next.day },
      );
    }
    const crashed = {
      ...next,
      happiness: clamp(next.happiness - 10, 0, 100),
      fatigueStacks: clamp(state.fatigueStacks + 1, 0, 3),
      goodSleepStreak: 0,
    };
    return startNextDay(
      addLog(crashed, {
        key: "log.system.burnoutCrash",
        type: "event",
        day: crashed.day,
      }),
      40,
    );
  }
  if (next.slotsRemaining <= 0)
    return startNextDay(
      addLog(next, {
        key: "log.system.noTimeLeft",
        type: "event",
        day: next.day,
      }),
      70,
    );
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
  fatigueStacks: 0,
  goodSleepStreak: 0,
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
    {
      id: 2,
      key: "log.system.newDay",
      params: { day: 1, timeOfDay: "morning" },
      type: "narrative",
      day: 1,
    },
    { id: 3, key: "log.system.salaryRules", type: "event", day: 1 },
  ],
};
function _useGameState() {
  const [state, setState] = useState<GameState>(STARTING_STATE);
  const availableActions = useMemo(
    () =>
      ACTIONS.filter((a) => {
        if (a.hidden) return false;
        if (a.minDay && state.day < a.minDay) return false;
        if (a.minSkills && state.skills < a.minSkills) return false;
        return true;
      }),
    [state.day, state.skills],
  );
  const onAction = (id: string) => {
    const action = ACTIONS.find((a) => a.id === id);
    if (!action) return;
    setState((prev) => applyAction(prev, action));
  };
  const onSkipDay = () => setState((prev) => startNextDay(prev));
  const onStart = () =>
    setState((prev) =>
      tryTriggerEvent(
        applyMonthlySystem({ ...prev, phase: "playing" }),
        "daily",
      ),
    );
  const onRestart = () => setState(STARTING_STATE);
  return { state, availableActions, onAction, onSkipDay, onStart, onRestart };
}
export const useGameState = _useGameState;
export default _useGameState;
