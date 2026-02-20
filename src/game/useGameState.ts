import { useState, useCallback } from 'react';
import { GameState, LogEntry } from './types';
import { ACTIONS, EVENTS, MILESTONES, ACTION_NARRATIVES, JOB_TITLES } from './data';

const TIME_ORDER: GameState['timeOfDay'][] = ['morning', 'afternoon', 'evening', 'night'];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

let logId = 0;

function createInitialState(): GameState {
  return {
    day: 1,
    timeOfDay: 'morning',
    money: 20,
    energy: 80,
    happiness: 50,
    skills: 5,
    reputation: 0,
    actionsToday: 0,
    maxActions: 4,
    log: [],
    milestones: [],
    jobTitle: JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)],
    phase: 'intro',
  };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(createInitialState);

  const addLog = useCallback((text: string, type: LogEntry['type'], currentState: GameState): LogEntry => {
    return { id: ++logId, text, type, day: currentState.day };
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      phase: 'playing',
      log: [
        {
          id: ++logId,
          text: `Day 1. You step off the bus with a suitcase and a job offer. The city stretches before you — unfamiliar, indifferent, full of possibility. Your new life as a ${prev.jobTitle} begins now.`,
          type: 'narrative',
          day: 1,
        },
      ],
    }));
  }, []);

  const performAction = useCallback((actionId: string) => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;

      const action = ACTIONS.find(a => a.id === actionId);
      if (!action) return prev;

      if (prev.actionsToday >= prev.maxActions) return prev;
      if (action.energyCost > 0 && prev.energy < action.energyCost) return prev;
      if (action.minSkills && prev.skills < action.minSkills) return prev;
      if (action.minDay && prev.day < action.minDay) return prev;

      const narratives = ACTION_NARRATIVES[actionId] || ['You do something.'];
      const narrative = narratives[Math.floor(Math.random() * narratives.length)];

      let newState: GameState = {
        ...prev,
        money: clamp(prev.money + (action.effects.money || 0), 0, 9999),
        energy: clamp(prev.energy - action.energyCost + (action.effects.energy || 0), 0, 100),
        happiness: clamp(prev.happiness + (action.effects.happiness || 0), 0, 100),
        skills: clamp(prev.skills + (action.effects.skills || 0), 0, 100),
        reputation: clamp(prev.reputation + (action.effects.reputation || 0), 0, 100),
        actionsToday: prev.actionsToday + 1,
      };

      // Advance time
      const timeIdx = Math.min(newState.actionsToday - 1, TIME_ORDER.length - 1);
      newState.timeOfDay = TIME_ORDER[timeIdx];

      const newLogs: LogEntry[] = [
        ...prev.log,
        { id: ++logId, text: narrative, type: 'action', day: prev.day },
      ];

      // Check for random event
      if (Math.random() < 0.3) {
        const eligible = EVENTS.filter(e => {
          if (prev.day < e.minDay) return false;
          if (e.maxDay && prev.day > e.maxDay) return false;
          if (e.condition && !e.condition(newState)) return false;
          return !prev.log.some(l => l.text === e.text);
        });
        if (eligible.length > 0) {
          const event = eligible[Math.floor(Math.random() * eligible.length)];
          newState = {
            ...newState,
            money: clamp(newState.money + (event.effects.money || 0), 0, 9999),
            energy: clamp(newState.energy + (event.effects.energy || 0), 0, 100),
            happiness: clamp(newState.happiness + (event.effects.happiness || 0), 0, 100),
            skills: clamp(newState.skills + (event.effects.skills || 0), 0, 100),
            reputation: clamp(newState.reputation + (event.effects.reputation || 0), 0, 100),
          };
          newLogs.push({ id: ++logId, text: event.text, type: 'event', day: prev.day });
        }
      }

      // Check milestones
      const newMilestones = [...prev.milestones];
      for (const m of MILESTONES) {
        if (!newMilestones.includes(m.id) && m.condition(newState)) {
          newMilestones.push(m.id);
          newLogs.push({ id: ++logId, text: `Milestone unlocked: ${m.label}`, type: 'milestone', day: prev.day });
        }
      }

      // Auto advance day if max actions reached
      if (newState.actionsToday >= newState.maxActions) {
        newState = {
          ...newState,
          day: newState.day + 1,
          timeOfDay: 'morning',
          actionsToday: 0,
          energy: clamp(newState.energy + 20, 0, 100),
        };
        newLogs.push({ id: ++logId, text: `— Day ${newState.day} —`, type: 'narrative', day: newState.day });
      }

      // Check ending
      if (newState.day >= 30 && newMilestones.length >= 5) {
        newState.phase = 'ending';
        newLogs.push({
          id: ++logId,
          text: 'A month has passed. You look around your apartment — it\'s starting to feel like home. The city isn\'t so unfamiliar anymore. You\'ve built something here. It\'s not perfect, but it\'s yours.',
          type: 'narrative',
          day: newState.day,
        });
      }

      return { ...newState, log: newLogs, milestones: newMilestones };
    });
  }, []);

  const skipDay = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'playing') return prev;
      const newDay = prev.day + 1;
      const newLogs: LogEntry[] = [...prev.log, { id: ++logId, text: `— Day ${newDay} —`, type: 'narrative' as const, day: newDay }];

      let newState = {
        ...prev,
        day: newDay,
        timeOfDay: 'morning' as const,
        actionsToday: 0,
        energy: clamp(prev.energy + 25, 0, 100),
        happiness: clamp(prev.happiness - 3, 0, 100),
      };

      // Check milestones
      const newMilestones = [...prev.milestones];
      for (const m of MILESTONES) {
        if (!newMilestones.includes(m.id) && m.condition(newState)) {
          newMilestones.push(m.id);
          newLogs.push({ id: ++logId, text: `Milestone unlocked: ${m.label}`, type: 'milestone' as const, day: newDay });
        }
      }

      return { ...newState, log: newLogs, milestones: newMilestones };
    });
  }, []);

  const resetGame = useCallback(() => {
    logId = 0;
    setState(createInitialState());
  }, []);

  const availableActions = ACTIONS.filter(a => {
    if (a.minDay && state.day < a.minDay) return false;
    if (a.minSkills && state.skills < a.minSkills) return false;
    return true;
  });

  return { state, startGame, performAction, skipDay, resetGame, availableActions };
}
