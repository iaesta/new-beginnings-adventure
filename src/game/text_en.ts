export const TEXT_EN = {
  GAME: { title: "Fresh Start" },

  UI: {
    day: "Day",
    month: "Month",
    actions: "Actions",
    achievements: "Achievements",
    close: "Close",
    language: "Language",
    timeAriaLabel: "Time",
    energyLimitPrefix: "Actions are limited by",
    energy: "Energy",
    endDay: "End Day (Full Recharge) →",
  },

  TIME: {
    morning: "🌅 Morning",
    afternoon: "☀️ Afternoon",
    evening: "🌆 Evening",
    night: "🌙 Night",
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
    restTitle: "Rest",
    restSubtitle: "Pick an option.",
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

  // Per-action UI text overrides (buttons + tooltips)
  ACTIONS: {
    work: {
      label: "Work",
      description: "Put in the hours. Build skills and reputation (salary comes on payday).",
    },
    study: { label: "Study", description: "Choose how long you want to study." },
    study_1h: { label: "Study (1h)", description: "Short study session." },
    study_2h: { label: "Study (2h)", description: "Medium study session." },
    study_4h: { label: "Study (4h)", description: "Deep focus session." },

    socialize: { label: "Socialize", description: "Pick an option (coffee, dinner, party…)."},
    socialize_coffee: { label: "Coffee", description: "Quick chat. Cheap and relaxing."},
    socialize_dinner: { label: "Dinner", description: "A proper dinner out. More expensive, bigger mood boost."},
    socialize_party: { label: "Party", description: "Big night. Costs energy, boosts reputation."},

    exercise: { label: "Exercise", description: "Move your body. Clear your mind."},
    "side-hustle": { label: "Side Hustle", description: "Use your skills to earn extra cash."},
    network: { label: "Network", description: "Attend events. Climb the ladder."},
    explore: { label: "Explore City", description: "Discover your new home."},

    rest: { label: "Rest", description: "Choose how long you want to rest."},
    nap_1h: { label: "Nap (1h)", description: "A quick nap to regain a bit of energy."},
    rest_4h: { label: "Rest (4h)", description: "A solid rest session."},
    sleep_8h: {
      labelWithHours: (hours: number) => `Sleep (${hours}h)`,
      description: "Deep sleep. Recover energy (scaled by hours).",
    },
  },

  // Log message templates (i18n-first)
  LOG: {
    "log.system.newDay": ({ day, timeOfDay }: any) => `Day ${day} · {TIME:${timeOfDay}}`,
    "log.system.freshStart": "A fresh start begins.",
            "log.system.sleepNewDay": "You went to sleep. A new day begins.",
    "log.system.exhausted": "You're exhausted.",
    "log.system.noTimeLeft": "No time left today.",
    "log.system.notEnoughTime": "Not enough time left today for that.",
    "log.system.notEnoughEnergy": "You don't have enough energy for that.",
    "log.system.lockedBySkills": ({ minSkills }: any) => `Requires ${minSkills} Skills to unlock.`,
    "log.system.salaryRules": "Salary is paid on Day 15 and Day 30. Bills arrive during the month.",

    "log.money.payday": ({ amount }: any) => `Payday! +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `Bill due: ${label} -$${amount}`,
    "log.money.wentBroke": "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",

    "log.action.performed": (p: any) => {
      const { icon, actionId, label, hours } = p ?? {};
      return `${icon} {ACTION:${actionId}:${label}} (⏱️ ${hours}h)`;
    },
    "log.achievement.unlocked": ({ label }: any) => `Achievement unlocked: ${label}`,
    "log.event.text": ({ text }: any) => text,
  },
} as const;

export type TextSchema = typeof TEXT_EN;
