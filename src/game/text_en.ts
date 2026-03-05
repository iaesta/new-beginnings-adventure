export const TEXT_EN = {
  GAME: { title: "Fresh Start" },

  UI: {
    day: "Day",
    month: "Month",
    actions: "Actions",
    achievements: "Achievements",
    close: "Close",
    recharge: "Recharge Energy (100%) →",
    energyLimitPrefix: "Actions are limited by",
    energy: "Energy",
    timeAriaLabel: "Time",
    yourJourney: "Your Journey",
    milestones: "Milestones",
    language: "Language",
  },

  STATS: {
    money: "Money",
    energy: "Energy",
    happiness: "Happiness",
    skills: "Skills",
    reputation: "Reputation",
    reputationTitle: "Reputation (0–100)",
  },

  MODALS: {
    studyTitle: "Study",
    studySubtitle: "Pick how long you want to study.",
    practiceTitle: "Practice",
    practiceSubtitle: "+60% XP, but costs +60% energy & happiness.",
    socialTitle: "Socialize",
    socialSubtitle: "Pick an option.",
  },

  INTRO: {
    subtitle: "A game about beginning again",
    line1: "You quit your old life.",
    line2: "New city. New apartment. New job.",
    line3Prefix: "You start Monday as a",
    line4: "You have $20, a suitcase, and something to prove.",
    start: "Begin",
    tip: "Manage your energy. Build your skills. Find your footing.",
  },

  ENDING: {
    title: "One Month Later",
    story:
      "You came here with nothing but a suitcase and a name on a contract.\nNow you have a routine, a few friends, and a place that's starting to feel\nlike home. It's not perfect — but it's yours.",
    restart: "Start Over",
  },
} as const;

export type TextSchema = typeof TEXT_EN;
