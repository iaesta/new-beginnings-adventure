export interface GameState {
  day: number;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
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
  phase: 'intro' | 'playing' | 'ending';

  // NEW: time slots (hours)
  slotsPerDay: number;      // e.g. 24
  slotsRemaining: number;   // 0..slotsPerDay
}

export interface GameAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  energyCost: number;

  // NEW: how many hours (slots) this action consumes
  // If omitted, the game assumes 1.
  slotCost?: number;

  effects: Partial<Pick<GameState, 'money' | 'energy' | 'happiness' | 'skills' | 'reputation'>>;
  minSkills?: number;
  lockedText?: string;
  showWhenLocked?: boolean;
  minDay?: number;
}

export interface LogEntry {
  id: number;
  text: string;
  type: 'narrative' | 'action' | 'event' | 'milestone';
  day: number;
}

export interface GameEvent {
  id: string;
  text: string;
  minDay: number;
  maxDay?: number;
  condition?: (state: GameState) => boolean;
  effects: Partial<Pick<GameState, 'money' | 'energy' | 'happiness' | 'skills' | 'reputation'>>;
}
