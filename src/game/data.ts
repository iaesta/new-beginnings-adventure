import { GameAction, GameEvent } from './types';

export const ACTIONS: GameAction[] = [
  {
    id: 'work',
    label: 'Work',
    icon: '💼',
    description: 'Put in the hours. Earn money, build reputation.',
    energyCost: 25,
    effects: { money: 0, skills: 2, reputation: 3, happiness: -5 },
  },
  {
    id: 'study_1h',
    label: 'Study (1h)',
    icon: '📚',
    description: 'Study for 1 hour. Steady progress.',
    energyCost: 8,
    effects: { skills: 4, happiness: -1 },
  },
  {
    id: 'study_2h',
    label: 'Study (2h)',
    icon: '📚',
    description: 'Study for 2 hours. Steady progress.',
    energyCost: 14,
    effects: { skills: 8, happiness: -2 },
  },
  {
    id: 'study_4h',
    label: 'Study (4h)',
    icon: '📚',
    description: 'Study for 4 hours. Steady progress.',
    energyCost: 22,
    effects: { skills: 16, happiness: -4 },
  },
  {
    id: 'practice_1h',
    label: 'Practice (1h)',
    icon: '🧪',
    description: 'Hands-on practice for 1 hour. +60% XP, but costs +60% energy and happiness.',
    energyCost: 13,
    minSkills: 20,
    lockedText: 'Requires 20 Skills to unlock.',
    showWhenLocked: true,
    effects: { skills: 6, happiness: -2 },
  },
  {
    id: 'practice_2h',
    label: 'Practice (2h)',
    icon: '🧪',
    description: 'Hands-on practice for 2 hours. +60% XP, but costs +60% energy and happiness.',
    energyCost: 22,
    minSkills: 20,
    lockedText: 'Requires 20 Skills to unlock.',
    showWhenLocked: true,
    effects: { skills: 13, happiness: -3 },
  },
  {
    id: 'practice_4h',
    label: 'Practice (4h)',
    icon: '🧪',
    description: 'Hands-on practice for 4 hours. +60% XP, but costs +60% energy and happiness.',
    energyCost: 35,
    minSkills: 20,
    lockedText: 'Requires 20 Skills to unlock.',
    showWhenLocked: true,
    effects: { skills: 26, happiness: -6 },
  },
  {
    id: 'socialize',
    label: 'Socialize',
    icon: '🍻',
    description: 'Meet people. Make connections.',
    energyCost: 15,
    effects: { happiness: 12, reputation: 5, money: -5 },
  },
  {
    id: 'rest',
    label: 'Rest',
    icon: '🛋️',
    description: 'Take it easy. Recharge your batteries.',
    energyCost: -30,
    effects: { energy: 30, happiness: 5 },
  },
  {
    id: 'exercise',
    label: 'Exercise',
    icon: '🏃',
    description: 'Move your body. Clear your mind.',
    energyCost: 20,
    effects: { energy: -5, happiness: 8 },
    minDay: 3,
  },
  {
    id: 'side-hustle',
    label: 'Side Hustle',
    icon: '🔧',
    description: 'Use your skills to earn extra cash.',
    energyCost: 30,
    effects: { money: 25, skills: 3, energy: -10, happiness: -8 },
    minSkills: 20,
  },
  {
    id: 'network',
    label: 'Network',
    icon: '🤝',
    description: 'Attend events. Climb the ladder.',
    energyCost: 20,
    effects: { reputation: 10, happiness: -3, money: -10 },
    minDay: 7,
    minSkills: 15,
  },
  {
    id: 'explore',
    label: 'Explore City',
    icon: '🏙️',
    description: 'Discover your new home.',
    energyCost: 15,
    effects: { happiness: 15, skills: 1 },
    minDay: 2,
  },
  {
    id: 'socialize_coffee',
    label: 'Coffee',
    description: 'Quick chat. Cheap and relaxing.',
    icon: '☕',
    energyCost: 8,
    effects: { money: -5, happiness: +6, reputation: +1 },
  },
  {
    id: 'socialize_dinner',
    label: 'Dinner',
    description: 'A proper dinner out. More expensive, bigger mood boost.',
    icon: '🍽️',
    energyCost: 15,
    effects: { money: -18, happiness: +12, reputation: +2 },
  },
  {
    id: 'socialize_party',
    label: 'Party',
    description: 'Big night. Costs energy, boosts reputation.',
    icon: '🎉',
    energyCost: 25,
    effects: { money: -35, happiness: +18, reputation: +5 },
  },
];

export const EVENTS: GameEvent[] = [
  {
    id: 'first-paycheck',
    text: "Your first paycheck arrives. It's not much, but it's yours. You feel a small surge of pride.",
    minDay: 5,
    maxDay: 7,
    condition: (s) => s.money >= 30,
    effects: { money: 20, happiness: 10 },
  },
  {
    id: 'office-lunch',
    text: 'A coworker invites you to lunch. You stumble through small talk, but they seem genuine.',
    minDay: 3,
    maxDay: 10,
    effects: { happiness: 8, reputation: 5, money: -5 },
  },
  {
    id: 'imposter-syndrome',
    text: "You lie awake at night. Everyone seems to know what they're doing except you. The doubt is heavy.",
    minDay: 4,
    maxDay: 15,
    condition: (s) => s.skills < 25,
    effects: { happiness: -15, energy: -10 },
  },
  {
    id: 'rainy-walk',
    text: 'Caught in the rain without an umbrella. You duck into a bookstore and find a book that changes your perspective.',
    minDay: 2,
    effects: { happiness: 5, skills: 5 },
  },
  {
    id: 'promotion-hint',
    text: 'Your manager mentions a position opening up. "You\'d be a good fit," they say casually.',
    minDay: 14,
    condition: (s) => s.reputation >= 40 && s.skills >= 30,
    effects: { happiness: 15, reputation: 10 },
  },
  {
    id: 'lonely-evening',
    text: 'The apartment is quiet tonight. You scroll through your phone, seeing old friends living their lives.',
    minDay: 5,
    condition: (s) => s.happiness < 40,
    effects: { happiness: -10 },
  },
  {
    id: 'breakthrough',
    text: "Something clicks at work. A problem you've been wrestling with suddenly makes sense. You're getting good at this.",
    minDay: 10,
    condition: (s) => s.skills >= 35,
    effects: { skills: 10, happiness: 12, reputation: 5 },
  },
  {
    id: 'unexpected-bill',
    text: 'An unexpected bill arrives. Life in a new city is expensive.',
    minDay: 8,
    effects: { money: -25, happiness: -8 },
  },
  {
    id: 'friend-visit',
    text: 'An old friend passes through town. For a few hours, everything feels familiar again.',
    minDay: 12,
    effects: { happiness: 20, energy: 10 },
  },
  {
    id: 'recognition',
    text: 'Your name comes up in a meeting — positively. People are starting to notice your work.',
    minDay: 18,
    condition: (s) => s.reputation >= 50,
    effects: { reputation: 15, happiness: 10 },
  },
];

export const MILESTONES = [
  { id: 'first-week', label: '📅 Survived the first week', condition: (s: any) => s.day >= 7 },
  { id: 'saved-100', label: '💰 Saved $100', condition: (s: any) => s.money >= 100 },
  { id: 'skilled-up', label: '🎓 Skills above 50', condition: (s: any) => s.skills >= 50 },
  { id: 'popular', label: '⭐ Reputation above 60', condition: (s: any) => s.reputation >= 60 },
  { id: 'month-one', label: '🗓️ One month in', condition: (s: any) => s.day >= 30 },
  {
    id: 'thriving',
    label: '🌟 All stats above 50',
    condition: (s: any) => s.money >= 50 && s.energy >= 50 && s.happiness >= 50 && s.skills >= 50,
  },
  { id: 'wealthy', label: '🏦 Saved $300', condition: (s: any) => s.money >= 300 },
  { id: 'master', label: '🏆 Skills above 80', condition: (s: any) => s.skills >= 80 },
];

export const TIME_LABELS = {
  morning: '🌅 Morning',
  afternoon: '☀️ Afternoon',
  evening: '🌆 Evening',
  night: '🌙 Night',
};

export const JOB_TITLES = [
  'Junior Developer',
  'Marketing Associate',
  'Analyst',
  'Design Assistant',
  'Account Manager',
  'Research Assistant',
];

export const WORK_NARRATIVES = [
  'You power through your tasks. Another day, another dollar.',
  'The work is tedious, but you push through.',
  'You tackle a challenging problem and make progress.',
  'Meetings all day. Draining, but you showed up.',
  "A productive day. You're finding your rhythm.",
];

export const STUDY_NARRATIVES = [
  'You spend time with tutorials and documentation.',
  'A late night of learning. Your eyes are tired but your mind is sharp.',
  'You practice new techniques. Slowly, it clicks.',
  'Online courses and coffee. The grind continues.',
];

export const SOCIAL_NARRATIVES = [
  "Drinks with new acquaintances. It's awkward but warm.",
  'A group dinner. You laugh more than expected.',
  'Coffee with a coworker. You learn about the office dynamics.',
  'A community event. You meet interesting people.',
];

export const REST_NARRATIVES = [
  'A quiet evening in. Sometimes doing nothing is everything.',
  'You sleep in. The world can wait.',
  'A long bath and a good book. Simple pleasures.',
  'You binge a show. Guilt-free relaxation.',
];

export const EXERCISE_NARRATIVES = [
  'A morning jog through unfamiliar streets. You\'re starting to recognize landmarks.',
  'The gym is intimidating, but you push through.',
  'A walk in the park. Fresh air clears the mind.',
];

export const EXPLORE_NARRATIVES = [
  'You discover a hidden café with excellent coffee.',
  "A winding walk through neighborhoods you haven't seen.",
  'You find a park bench with a perfect view of the city.',
  'A local market catches your eye. This place has character.',
];

export const SOCIAL_COFFEE_NARRATIVES = [
  'You had a nice coffee chat. Small boost, big comfort.',
  'A quick café stop reset your mood.',
  'Short talk, warm drink, calmer mind.',
];

export const SOCIAL_DINNER_NARRATIVES = [
  'Dinner was great. You laughed more than expected.',
  'A proper meal out made the day feel lighter.',
  'Good food, good company. Worth it.',
];

export const SOCIAL_PARTY_NARRATIVES = [
  'Big night. You met new people and made connections.',
  "You danced, you laughed… you’ll feel it tomorrow.",
  'Wild party. Reputation up, energy down.',
];

export const ACTION_NARRATIVES: Record<string, string[]> = {
  work: WORK_NARRATIVES,
  study: STUDY_NARRATIVES,
  socialize: SOCIAL_NARRATIVES,
  rest: REST_NARRATIVES,
  exercise: EXERCISE_NARRATIVES,
  'side-hustle': [
    "You take on freelance work. It's exhausting but the extra cash helps.",
    'A side project keeps you busy. Your skills are paying off.',
  ],
  network: ['You attend a mixer. Business cards exchanged, connections made.', "An industry meetup. You're building your network."],
  explore: EXPLORE_NARRATIVES,
  socialize_coffee: SOCIAL_NARRATIVES,
  socialize_dinner: SOCIAL_NARRATIVES,
  socialize_party: SOCIAL_NARRATIVES,
};
