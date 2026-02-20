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
}

export interface LogEntry {
  id: number;
  text: string;
  type: 'narrative' | 'action' | 'event' | 'milestone';
  day: number;
}

export interface GameAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  energyCost: number;
  effects: Partial<Pick<GameState, 'money' | 'energy' | 'happiness' | 'skills' | 'reputation'>>;
  minSkills?: number;
  minDay?: number;
}

export interface GameEvent {
  id: string;
  text: string;
  minDay: number;
  maxDay?: number;
  condition?: (state: GameState) => boolean;
  effects: Partial<Pick<GameState, 'money' | 'energy' | 'happiness' | 'skills' | 'reputation'>>;
}
