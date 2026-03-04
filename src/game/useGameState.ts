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
 * useGameState.ts (Time-slots + Energy + Payroll/Bills)
 *
 * New: "slots" (hours) system
 * - Each day has `slotsPerDay` (default 24).
 * - Each action consumes `slotCost` hours.
 * - If you run out of slots, the day ends (sleep) even if you still have energy.
 * - Energy still matters too (so you can't grind forever).
 *
 * Payroll/Bills
 * - Salary comes every 15 days (Day 15 & Day 30 of a 30-day month)
 * - Fixed bills arrive on set days in the month (rent, utilities, phone)
 *
 * Debt rule (Option B)
 * - Spending can bring Money below 0
 * - If Money would go below 0, it is reset to 0 and a penalty is applied
 *
 * Extra safety:
 * - Exports BOTH default and named `useGameState` so imports won't break.
 */

const TIME_ORDER: GameState["timeOfDay"][] = ["morning", "afternoon", "evening", "night"];

const DAYS_IN_MONTH = 30;
const PAY_DAYS: number[] = [15, 30];

const DEFAULT_SLOTS_PER_DAY = 24;

type Bill = {
  id: string;
  label: string;
  dueDay: number; // 1..30
  amount: number;
};

const BILLS: Bill[] = [
  // NOTE: You said rent should be paid on day 29 and salary base 200.
  // Change here if you want a different balance.
  { id: "rent", label: "Rent", dueDay: 29, amount: 120 },
  { id: "utilities", label: "Utilities", dueDay: 10, amount: 25 },
  { id: "phone", label: "Phone bill", dueDay: 20, amount: 15 },
];

const BILL_WARNINGS = [7, 3, 1]; // days before due day

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

function dayInMonth(day: number) {
  return ((day - 1) % DAYS_IN_MONTH) + 1; // 1..30
}

function advanceTimeOfDay(t: GameState["timeOfDay"]): GameState["timeOfDay"] {
  const idx = TIME_ORDER.indexOf(t);
  if (idx < 0) return "morning";
  return TIME_ORDER[Math.min(idx + 1, TIME_ORDER.length - 1)];
}

function timeOfDayFromSlots(slotsPerDay: number, slotsRemaining: number): GameState["timeOfDay"] {
  // We map the current "hour" based on how many slots have been spent.
  const spent = clamp(slotsPerDay - slotsRemaining, 0, slotsPerDay);
  const hour = Math.floor((spent / slotsPerDay) * 24); // 0..23

  // Simple buckets (tweak if you want):
  // 06-11 morning, 12-17 afternoon, 18-21 evening, 22-05 night
  if (hour >= 6 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 17) return "afternoon";
  if (hour >= 18 && hour <= 21) return "evening";
  return "night";
}

function paycheckAmount(state: GameState) {
  // You asked base salary = 200
  const base = 200;
  const skillBonus = Math.floor(state.skills * 1.5); // 0..150
  const repBonus = Math.floor(state.reputation * 0.6); // 0..60
  return base + skillBonus + repBonus;
}

function applyDebtPenalty(s: GameState, reason: string): GameState {
  const next = {
    ...s,
    money: 0,
    happiness: clamp(s.happiness - 8, 0, 100),
    reputation: clamp(s.reputation - 2, 0, 100),
  };

  return addLog(next, {
    text: reason,
    type: "event",
    day: next.day,
  });
}

function tryPayAmount(state: GameState, amount: number, label: string): GameState {
  const moneyRaw = state.money - amount;
  if (moneyRaw >= 0) {
    const paid = { ...state, money: moneyRaw };
    return addLog(paid, { text: `Paid: ${label} (-$${amount})`, type: "event", day: paid.day });
  }
  // Debt rule: reset to 0 + penalty
  const reset = { ...state, money: 0 };
  return applyDebtPenalty(
    reset,
    `Couldn't pay ${label} (-$${amount}). Money reset to 0. Mood & reputation dropped.`
  );
}

function applyMonthlySystem(state: GameState): GameState {
  let s = state;
  const dim = dayInMonth(s.day);

  // 1) Paycheck
  if (PAY_DAYS.includes(dim)) {
    const pay = paycheckAmount(s);
    s = { ...s, money: s.money + pay };
    s = addLog(s, { text: `💸 Paycheck arrived: +$${pay}`, type: "event", day: s.day });
  }

  // 2) Bill warnings
  for (const bill of BILLS) {
    if (dim < bill.dueDay) {
      const daysLeft = bill.dueDay - dim;
      if (BILL_WARNINGS.includes(daysLeft)) {
        s = addLog(s, {
          text: `Reminder: ${bill.label} due in ${daysLeft} day${daysLeft === 1 ? "" : "s"} (-$${bill.amount}).`,
          type: "event",
          day: s.day,
        });
      }
    }
  }

  // 3) Bills due today
  for (const bill of BILLS) {
    if (dim === bill.dueDay) {
      s = tryPayAmount(s, bill.amount, bill.label);
    }
  }

  return s;
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
    // keep maxActions for compatibility
    maxActions: state.maxActions,
  };

  let s = addLog(base, {
    text: "You went to sleep. A new day begins.",
    type: "narrative",
    day: base.day,
  });

  // Apply paycheck/bills at the start of the day
  s = applyMonthlySystem(s);

  return s;
}

function pickNarrative(actionId: string): string | null {
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)] ?? null;

  if (actionId === "work") return pick(WORK_NARRATIVES);
  if (actionId === "study" || actionId.startsWith("study_") || actionId.startsWith("practice_")) return pick(STUDY_NARRATIVES);
  if (actionId === "socialize" || actionId.startsWith("socialize_")) return pick(SOCIAL_NARRATIVES);

  return null;
}

function applyMilestones(state: GameState): GameState {
  let s = state;

  for (const m of MILESTONES) {
    if (!s.milestones.includes(m.id) && typeof m.condition === "function" && m.condition(s)) {
      s = { ...s, milestones: [...s.milestones, m.id] };
      s = addLog(s, {
        text: `Achievement unlocked: ${m.label}`,
        type: "milestone",
        day: s.day,
      });
    }
  }

  return s;
}

function applyAction(state: GameState, action: GameAction): GameState {
  // If energy is already 0, force next day
  if (state.energy <= 0) return startNextDay(state);

  const slotsPerDay = state.slotsPerDay ?? DEFAULT_SLOTS_PER_DAY;
  const slotCost = action.slotCost ?? 1;

  // If you don't have enough time slots, block
  if (slotCost > 0 && state.slotsRemaining < slotCost) {
    return addLog(state, {
      text: "Not enough time left today for that.",
      type: "event",
      day: state.day,
    });
  }

  // Skill lock
  if (action.minSkills != null && state.skills < action.minSkills) {
    return addLog(state, {
      text: action.lockedText ?? `Requires ${action.minSkills} Skills to unlock.`,
      type: "event",
      day: state.day,
    });
  }

  // Energy lock (EnergyCost can be negative for Rest)
  if (action.energyCost > 0 && state.energy < action.energyCost) {
    return addLog(state, {
      text: "You don't have enough energy for that.",
      type: "event",
      day: state.day,
    });
  }

  // 1) Consume time slots
  const slotsRemaining = clamp(state.slotsRemaining - slotCost, 0, slotsPerDay);

  // 2) Pay the energy cost (clamped)
  const energyAfterCost = clamp(state.energy - action.energyCost, 0, 100);

  // 3) Apply effects
  const eff = action.effects ?? {};

  // Money (Option B Debt rule)
  const moneyRaw = state.money + (eff.money ?? 0);
  const wentBroke = moneyRaw < 0;
  const money = wentBroke ? 0 : moneyRaw;

  // Other stats
  let happiness = clamp(state.happiness + (eff.happiness ?? 0), 0, 100);
  const skills = clamp(state.skills + (eff.skills ?? 0), 0, 100);

  const crossedPracticeUnlock = state.skills < 20 && skills >= 20 && !state.milestones.includes("practice_unlocked");

  let reputation = clamp(state.reputation + (eff.reputation ?? 0), 0, 100);
  const energy = clamp(energyAfterCost + (eff.energy ?? 0), 0, 100);

  const timeOfDay = timeOfDayFromSlots(slotsPerDay, slotsRemaining);

  let next: GameState = {
    ...state,
    money,
    happiness,
    skills,
    reputation,
    energy,
    actionsToday: state.actionsToday + 1,
    // You can keep this "advanceTimeOfDay" if you like the old pacing,
    // but with slots it's cleaner to derive from time.
    timeOfDay,
    slotsPerDay,
    slotsRemaining,
  };

  // Action log line
  next = addLog(next, {
    text: `${action.icon} ${action.label} (⏱️ ${slotCost}h)`,
    type: "action",
    day: next.day,
  });

  if (crossedPracticeUnlock) {
    next = { ...next, milestones: [...next.milestones, "practice_unlocked"] };
    next = addLog(next, {
      text: "Unlocked: Practice — +60% XP, +60% energy & happiness cost.",
      type: "milestone",
      day: next.day,
    });
  }

  // Debt penalty
  if (wentBroke) {
    happiness = clamp(next.happiness - 8, 0, 100);
    reputation = clamp(next.reputation - 2, 0, 100);
    next = { ...next, happiness, reputation, money: 0 };

    next = addLog(next, {
      text: "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",
      type: "event",
      day: next.day,
    });
  }

  // Optional narrative
  const narrative = pickNarrative(action.id);
  if (narrative) {
    next = addLog(next, { text: narrative, type: "narrative", day: next.day });
  }

  // Milestones
  next = applyMilestones(next);

  // End day rules:
  // - If energy hits 0 -> sleep
  // - If slots hit 0 -> sleep
  if (next.energy <= 0) {
    next = addLog(next, { text: "You're exhausted.", type: "event", day: next.day });
    return startNextDay(next);
  }

  if (next.slotsRemaining <= 0) {
    next = addLog(next, { text: "No time left today.", type: "event", day: next.day });
    return startNextDay(next);
  }

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
  actionsToday: 0,
  maxActions: 999,
  milestones: [],
  jobTitle: "Junior Developer",
  phase: "intro",
  slotsPerDay: DEFAULT_SLOTS_PER_DAY,
  slotsRemaining: DEFAULT_SLOTS_PER_DAY,
  log: [
    { id: 1, text: "A fresh start begins.", type: "narrative", day: 1 },
    { id: 2, text: `Day 1 · ${TIME_LABELS.morning}`, type: "narrative", day: 1 },
    { id: 3, text: "Salary is paid on Day 15 and Day 30. Bills arrive during the month.", type: "event", day: 1 },
  ],
};

function _useGameState() {
  const [state, setState] = useState<GameState>(STARTING_STATE);

  const availableActions = useMemo(() => {
    return ACTIONS.filter((a) => {
      const okDay = a.minDay == null || state.day >= a.minDay;
      const okSkills = a.minSkills == null || state.skills >= a.minSkills;
      const showLocked = a.showWhenLocked && a.minSkills != null;
      return okDay && (okSkills || showLocked);
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
    // Apply monthly system on day 1 when you start playing
    setState((prev) => applyMonthlySystem({ ...prev, phase: "playing" }));
  };

  const onRestart = () => {
    setState(STARTING_STATE);
  };

  return { state, availableActions, onAction, onSkipDay, onStart, onRestart };
}

// Export BOTH styles so your imports won't break
export const useGameState = _useGameState;
export default _useGameState;
