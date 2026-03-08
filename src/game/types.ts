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

  slotsPerDay: number;
  slotsRemaining: number;

  dailyEventTriggeredToday: boolean;
  actionEventTriggeredToday: boolean;
  eventLastDay: Record<string, number>;

  fatigueStacks: number;
  goodSleepStreak: number;
  energyDebt: number;

  workedToday: boolean;
  workedDaysThisPeriod: number;
}

export interface GameAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  energyCost: number;
  slotCost?: number;
  parentId?: string;
  hidden?: boolean;

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
  kind: EventKind;
  text: string;
  chance: number;
  minDay: number;
  maxDay?: number;
  condition?: (state: GameState) => boolean;
  trigger?: (actionId: string, state: GameState) => boolean;
  effects: Partial<Pick<GameState, "money" | "energy" | "happiness" | "skills" | "reputation">>;
}
