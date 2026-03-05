import type { GameAction, GameEvent, GameState } from "./types";

/**
 * Fresh Start - data.ts
 *
 * Kept rules:
 * - Work does NOT give money directly (salary is paid on Day 15/30 in useGameState).
 * - Base salary = 200 (useGameState).
 * - Slots (slotCost) control timeOfDay (useGameState).
 * - Achievements only visible when unlocked (GameScreen).
 */

export const ACTIONS: GameAction[] = [
  {
    id: "work",
    label: "Work",
    icon: "💼",
    description: "Put in the hours. Build skills and reputation (salary comes on payday).",
    energyCost: 25,
    slotCost: 9,
    effects: { skills: 2, reputation: 3, happiness: -5 },
  },

  // This base 'study' can exist, but the UI uses the modal options below.
  // You can keep it or remove it later if you want ONLY the modal.
  {
    id: "study",
    label: "Study",
    icon: "📚",
    description: "Choose how long you want to study.",
    energyCost: 0,
    slotCost: 0,
    effects: {},
  },

  // Study options (used by the Study modal)
  {
    id: "study_1h",
    label: "Study (1h)",
    icon: "📚",
    description: "Short study session.",
    energyCost: 6,
    slotCost: 1,
    effects: { skills: 2, happiness: -1 },
  },
  {
    id: "study_2h",
    label: "Study (2h)",
    icon: "📚",
    description: "Medium study session.",
    energyCost: 10,
    slotCost: 2,
    effects: { skills: 4, happiness: -2 },
  },
  {
    id: "study_4h",
    label: "Study (4h)",
    icon: "📚",
    description: "Deep focus session.",
    energyCost: 18,
    slotCost: 4,
    effects: { skills: 8, happiness: -4 },
  },

  // This base 'socialize' can exist, but the UI uses the modal options below.
  {
    id: "socialize",
    label: "Socialize",
    icon: "🗣️",
    description: "Pick an option (coffee, dinner, party…).",
    energyCost: 0,
    slotCost: 0,
    effects: {},
  },

  // Socialize options (used by the Socialize modal)
  {
    id: "socialize_coffee",
    label: "Coffee",
    icon: "☕",
    description: "Quick chat. Cheap and relaxing.",
    energyCost: 8,
    slotCost: 1,
    effects: { money: -5, happiness: 6, reputation: 1 },
  },
  {
    id: "socialize_dinner",
    label: "Dinner",
    icon: "🍽️",
    description: "A proper dinner out. More expensive, bigger mood boost.",
    energyCost: 15,
    slotCost: 2,
    effects: { money: -18, happiness: 12, reputation: 2 },
  },
  {
    id: "socialize_party",
    label: "Party",
    icon: "🎉",
    description: "Big night. Costs energy, boosts reputation.",
    energyCost: 25,
    slotCost: 3,
    effects: { money: -35, happiness: 18, reputation: 5 },
  },

  {
    id: "rest",
    label: "Rest",
    icon: "🛋️",
    description: "Take it easy. Recharge your batteries.",
    energyCost: -30,
    slotCost: 2,
    effects: { energy: 30, happiness: 5 },
  },
  {
    id: "exercise",
    label: "Exercise",
    icon: "🏃",
    description: "Move your body. Clear your mind.",
    energyCost: 20,
    slotCost: 2,
    effects: { energy: -5, happiness: 8 },
    minDay: 3,
  },
  {
    id: "side-hustle",
    label: "Side Hustle",
    icon: "🔧",
    description: "Use your skills to earn extra cash.",
    energyCost: 30,
    slotCost: 3,
    effects: { money: 25, skills: 3, energy: -10, happiness: -8 },
    minSkills: 20,
  },
  {
    id: "network",
    label: "Network",
    icon: "🤝",
    description: "Attend events. Climb the ladder.",
    energyCost: 20,
    slotCost: 2,
    effects: { reputation: 10, happiness: -3, money: -10 },
    minDay: 7,
    minSkills: 15,
  },
  {
    id: "explore",
    label: "Explore City",
    icon: "🏙️",
    description: "Discover your new home.",
    energyCost: 15,
    slotCost: 2,
    effects: { happiness: 15, skills: 1 },
    minDay: 2,
  },


  // Rest menu + options
  {
    id: "rest",
    label: "Rest",
    icon: "🛋️",
    description: "Choose how long you want to rest.",
    energyCost: 0,
    slotCost: 0,
    effects: {},
  },
  {
    id: "nap_1h",
    label: "Nap (1h)",
    icon: "😴",
    description: "A quick nap to regain a bit of energy.",
    energyCost: 0,
    slotCost: 1,
    effects: { energy: 15, happiness: 1 },
  },
  {
    id: "rest_4h",
    label: "Rest (4h)",
    icon: "🛌",
    description: "A solid rest session.",
    energyCost: 0,
    slotCost: 4,
    effects: { energy: 50, happiness: 4 },
  },
  {
    id: "sleep_8h",
    label: "Sleep (8h)",
    icon: "🌙",
    description: "Deep sleep. Fully recover energy.",
    energyCost: 0,
    slotCost: 8,
    effects: { energy: 100, happiness: 6 },
  },
];

export const EVENTS: GameEvent[] = [
  {
    id: "first-paycheck",
    kind: "daily",
    chance: 0.35,
    text: "Your first paycheck arrives. It's not much, but it's yours. You feel a small surge of pride.",
    minDay: 5,
    maxDay: 7,
    condition: (s) => s.money >= 30,
    effects: { money: 20, happiness: 10 },
  },
  {
    id: "office-lunch",
    kind: "daily",
    chance: 0.35,
    text: "A coworker invites you to lunch. You stumble through small talk, but they seem genuine.",
    minDay: 3,
    maxDay: 10,
    effects: { happiness: 8, reputation: 5, money: -5 },
  },
  {
    id: "imposter-syndrome",
    kind: "daily",
    chance: 0.35,
    text: "You lie awake at night. Everyone seems to know what they're doing except you. The doubt is heavy.",
    minDay: 4,
    maxDay: 15,
    condition: (s) => s.skills < 25,
    effects: { happiness: -15, energy: -10 },
  },
  {
    id: "rainy-walk",
    kind: "daily",
    chance: 0.35,
    text: "Caught in the rain without an umbrella. You duck into a bookstore and find a book that changes your perspective.",
    minDay: 2,
    effects: { happiness: 5, skills: 5 },
  },
  {
    id: "promotion-hint",
    kind: "daily",
    chance: 0.35,
    text: "Your manager mentions a position opening up. \"You'd be a good fit,\" they say casually.",
    minDay: 14,
    condition: (s) => s.reputation >= 40 && s.skills >= 30,
    effects: { happiness: 15, reputation: 10 },
  },
  {
    id: "lonely-evening",
    kind: "daily",
    chance: 0.35,
    text: "The apartment is quiet tonight. You scroll through your phone, seeing old friends living their lives.",
    minDay: 5,
    condition: (s) => s.happiness < 40,
    effects: { happiness: -10 },
  },
  {
    id: "breakthrough",
    kind: "daily",
    chance: 0.35,
    text: "Something clicks at work. A problem you've been wrestling with suddenly makes sense. You're getting good at this.",
    minDay: 10,
    condition: (s) => s.skills >= 35,
    effects: { skills: 10, happiness: 12, reputation: 5 },
  },
  {
    id: "unexpected-bill",
    kind: "daily",
    chance: 0.35,
    text: "An unexpected bill arrives. Life in a new city is expensive.",
    minDay: 8,
    effects: { money: -25, happiness: -8 },
  },
  {
    id: "friend-visit",
    kind: "daily",
    chance: 0.35,
    text: "An old friend passes through town. For a few hours, everything feels familiar again.",
    minDay: 12,
    effects: { happiness: 20, energy: 10 },
  },
  {
    id: "recognition",
    kind: "daily",
    chance: 0.35,
    text: "Your name comes up in a meeting — positively. People are starting to notice your work.",
    minDay: 18,
    condition: (s) => s.reputation >= 50,
    effects: { reputation: 15, happiness: 10 },
  },
];

export const MILESTONES: Array<{
  id: string;
  label: string;
  condition: (s: GameState) => boolean;
}> = [
  { id: "first-week", label: "📅 Survived the first week", condition: (s) => s.day >= 7 },
  { id: "saved-1000", label: "💰 Saved $1000", condition: (s) => s.money >= 1000 },
  { id: "skilled-up", label: "🎓 Skills above 50", condition: (s) => s.skills >= 50 },
  { id: "popular", label: "⭐ Reputation above 60", condition: (s) => s.reputation >= 60 },
  { id: "month-one", label: "🗓️ One month in", condition: (s) => s.day >= 30 },
];

export const TIME_LABELS: Record<GameState["timeOfDay"], string> = {
  morning: "🌅 Morning",
  afternoon: "☀️ Afternoon",
  evening: "🌆 Evening",
  night: "🌙 Night",
};

export const JOB_TITLES = [
  "Junior Developer",
  "Marketing Associate",
  "Analyst",
  "Design Assistant",
  "Account Manager",
  "Research Assistant",
];

export const WORK_NARRATIVES = [
  "You power through your tasks. Another day, another dollar.",
  "The work is tedious, but you push through.",
  "You tackle a challenging problem and make progress.",
  "Meetings all day. Draining, but you showed up.",
  "A productive day. You're finding your rhythm.",
];

export const STUDY_NARRATIVES = [
  "You spend time with tutorials and documentation.",
  "A late night of learning. Your eyes are tired but your mind is sharp.",
  "You practice new techniques. Slowly, it clicks.",
  "Online courses and coffee. The grind continues.",
];

export const SOCIAL_NARRATIVES = [
  "Drinks with new acquaintances. It's awkward but warm.",
  "A group dinner. You laugh more than expected.",
  "Coffee with a coworker. You learn about the office dynamics.",
  "A community event. You meet interesting people.",
];

export const ACTION_NARRATIVES: Record<string, string[]> = {
  work: WORK_NARRATIVES,
  study: STUDY_NARRATIVES,
  socialize: SOCIAL_NARRATIVES,
  rest: ["A quiet evening in. Sometimes doing nothing is everything."],
  exercise: ["A walk in the park. Fresh air clears the mind."],
  "side-hustle": ["You take on freelance work. It's exhausting but the extra cash helps."],
  network: ["You attend a mixer. Business cards exchanged, connections made."],
  explore: ["You find a park bench with a perfect view of the city."],
  socialize_coffee: SOCIAL_NARRATIVES,
  socialize_dinner: SOCIAL_NARRATIVES,
  socialize_party: SOCIAL_NARRATIVES,
};
