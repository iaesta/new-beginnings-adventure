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
    line1: "You left your old life behind.",
    line2: "New city. New apartment. New job.",
    line3Prefix: "You start Monday as a",
    line4: "You have $200, a suitcase, and something to prove.",
    start: "Begin",
    tip: "Manage your energy. Build your skills. Find your footing.",
  },

  ENDING: {
    title: "One Month Later",
    story:
      "You came here with nothing but a suitcase and a name on a contract.\nNow you have a routine, a few friends, and a place that's starting to feel\nlike home. It's not perfect — but it's yours.",
    restart: "Start Over",
  },

  ACTIONS: {
    work: { label: "Work", description: "Put in the hours. Build skills and reputation (salary comes on payday)." },
    study: { label: "Study", description: "Choose how long you want to study." },
    study_1h: { label: "Study (1h)", description: "Short study session." },
    study_2h: { label: "Study (2h)", description: "Medium study session." },
    study_4h: { label: "Study (4h)", description: "Deep focus session." },
    socialize: { label: "Socialize", description: "Pick an option (coffee, dinner, party…)." },
    socialize_coffee: { label: "Coffee", description: "Quick chat. Cheap and relaxing." },
    socialize_dinner: { label: "Dinner", description: "A proper dinner out. More expensive, bigger mood boost." },
    socialize_party: { label: "Party", description: "Big night. Costs energy, boosts reputation." },
    exercise: { label: "Exercise", description: "Move your body. Clear your mind." },
    "side-hustle": { label: "Side Hustle", description: "Use your skills to earn extra cash." },
    network: { label: "Network", description: "Attend events. Climb the ladder." },
    explore: { label: "Explore City", description: "Discover your new home." },
    rest: { label: "Rest", description: "Choose how long you want to rest." },
    nap_1h: { label: "Nap (1h)", description: "A quick nap to regain a bit of energy." },
    rest_4h: { label: "Rest (4h)", description: "A solid rest session." },
    sleep_8h: {
      labelWithHours: (hours: number) => `Sleep (${hours}h)`,
      description: "Deep sleep. Recover energy based on hours slept.",
    },
  },

  MILESTONES: {
    "first-week": "📅 Survived the first week",
    "saved-1000": "💰 Saved $1000",
    "skilled-up": "🎓 Skills above 50",
    "popular": "⭐ Reputation above 60",
    "month-one": "🗓️ One month in",
  },

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
    "log.system.burnoutCrash": "You pushed too hard and crashed. Tomorrow will be heavier.",
    "log.system.gameOverBurnout": "Your body and mind couldn't keep going. You reached your limit.",
    "log.money.payday": ({ amount }: any) => `Payday! +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `Bill due: ${label} -$${amount}`,
    "log.money.wentBroke": "You couldn't really afford it… Money reset to 0. Mood and reputation dropped.",
    "log.achievement.unlocked": ({ label }: any) => `Achievement unlocked: ${label}`,
  },

  NARRATIVES: {
    work: [
      "You push through your tasks and keep the day moving.",
      "The work drags a little, but you still get it done.",
      "A tricky problem gives way after some real effort.",
      "Meetings sap your energy, but you hold it together.",
      "You feel a little more capable than you did yesterday.",
    ],
    study: [
      "You settle in with tutorials and notes and keep going.",
      "It takes effort, but your focus sharpens as you continue.",
      "A few ideas finally click into place.",
      "You grind through lessons with stubborn determination.",
    ],
    socialize: [
      "The conversation starts awkwardly, then warms up.",
      "You end up laughing more than you expected.",
      "A casual chat teaches you more than you thought.",
      "You leave feeling a little less alone in the city.",
    ],
    rest: [
      "You slow down and let your mind finally breathe.",
      "For a little while, nothing urgent gets to exist.",
      "Rest feels less like laziness and more like repair.",
    ],
    exercise: [
      "Fresh air and movement help untangle your thoughts.",
    ],
    "side-hustle": [
      "The extra work is tiring, but the money helps.",
    ],
    network: [
      "You show up, talk to people, and leave with useful contacts.",
    ],
    explore: [
      "The city feels slightly less strange than it did before.",
    ],
  },

  EVENTS: {
    "first-paycheck": "Your first paycheck arrives. It's not much, but it's yours. You feel a small surge of pride.",
    "office-lunch": "A coworker invites you to lunch. You stumble through small talk, but they seem genuine.",
    "imposter-syndrome": "Doubt hits hard tonight. Everyone seems more prepared than you, and it weighs on you.",
    "rainy-walk": "You get caught in the rain, duck into a bookstore, and leave with a new perspective.",
    "promotion-hint": "Your manager casually hints that a better position may open soon.",
    "lonely-evening": "The apartment feels especially quiet tonight, and old memories creep in.",
    "breakthrough": "Something finally clicks at work. You can feel yourself improving.",
    "unexpected-bill": "An unexpected bill shows up. New-city life bites back.",
    "friend-visit": "An old friend comes through town, and for a while everything feels familiar again.",
    "recognition": "Your name comes up positively in a meeting. People are starting to notice you.",
  },
} as const;

export type TextSchema = typeof TEXT_EN;