export interface GameState {
  day: number;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";

  money: number;
  energy: number;
  happiness: number;
  skills: number;
  reputation: number;

  actionsToday: number;
  maxActions: number;

  log: LogEntry[];
  milestones: string[];
  jobTitle: string;
  phase: "intro" | "playing" | "ending";

  // Time slots (hours)
  slotsPerDay: number; // e.g. 24
  slotsRemaining: number; // 0..slotsPerDay

  // Events (limits + cooldown)
  dailyEventTriggeredToday: boolean; // max 1/day
  actionEventTriggeredToday: boolean; // max 1/day
  eventLastDay: Record<string, number>; // eventId -> last day triggered

  // Fatigue system (anti-abuse for crashing to 0 energy)
  fatigueDebt: number; // stacks; crash adds +3, recharge clears -1 per day
  needsRecharge: boolean; // when true, actions are blocked until you recharge
  crashPenaltyApplied: number; // happiness penalty applied on crash (refunded on recharge)
}

export interface GameAction {
  id: string;
  
  parentId?: string;
  hidden?: boolean;
label: string;
  icon: string;
  description: string;
  energyCost: number;

  // how many hours (slots) this action consumes
  slotCost?: number;

  effects: Partial<Pick<GameState, "money" | "energy" | "happiness" | "skills" | "reputation">>;
  minSkills?: number;
  lockedText?: string;
  showWhenLocked?: boolean;
  minDay?: number;
}

export interface LogEntry {
  id: number;
  text?: string;
  key?: string;
  params?: Record<string, any>;
  type: "narrative" | "action" | "event" | "milestone";
  day: number;
}

export type EventKind = "daily" | "action";

export interface GameEvent {
  id: string;

  // daily = evaluated at start of the day
  // action = evaluated after a big action
  kind: EventKind;

  text: string;
  chance: number; // 0..1

  minDay: number;
  maxDay?: number;

  condition?: (state: GameState) => boolean;

  // only for kind="action"
  trigger?: (actionId: string, state: GameState) => boolean;

  effects: Partial<Pick<GameState, "money" | "energy" | "happiness" | "skills" | "reputation">>;
}
