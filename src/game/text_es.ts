export const TEXT_ES = {
  GAME: { title: "Nuevo Comienzo" },

  UI: {
    day: "Día",
    month: "Mes",
    actions: "Acciones",
    achievements: "Logros",
    close: "Cerrar",
    language: "Idioma",
    timeAriaLabel: "Tiempo",
    energyLimitPrefix: "Las acciones están limitadas por",
    energy: "Energía",
    endDay: "Terminar el día (recarga total) →",
  },

  TIME: {
    morning: "🌅 Mañana",
    afternoon: "☀️ Tarde",
    evening: "🌆 Atardecer",
    night: "🌙 Noche",
  },

  STATS: {
    money: "Dinero",
    energy: "Energía",
    happiness: "Felicidad",
    skills: "Habilidades",
    reputation: "Reputación",
    reputationTitle: "Reputación (0–100)",
  },

  MODALS: {
    studyTitle: "Estudiar",
    studySubtitle: "Elige cuánto tiempo quieres estudiar.",
    practiceTitle: "Practicar",
    practiceSubtitle: "+60% XP, pero cuesta +60% de energía y felicidad.",
    socialTitle: "Socializar",
    socialSubtitle: "Elige una opción.",
    restTitle: "Descansar",
    restSubtitle: "Elige una opción.",
  },

  INTRO: {
    subtitle: "Un juego sobre empezar de nuevo",
    line1: "Dejaste tu vida anterior.",
    line2: "Nueva ciudad. Nuevo apartamento. Nuevo trabajo.",
    line3Prefix: "Empiezas el lunes como",
    line4: "Tienes $20, una maleta y algo que demostrar.",
    start: "Empezar",
    tip: "Gestiona tu energía. Sube habilidades. Encuentra tu sitio.",
  },

  ENDING: {
    title: "Un mes después",
    story:
      "Llegaste con una maleta y un nombre en un contrato.\nAhora tienes una rutina, algunos amigos y un lugar que empieza a sentirse\ncomo hogar. No es perfecto, pero es tuyo.",
    restart: "Empezar de nuevo",
  },

  ACTIONS: {
    work: {
      label: "Trabajar",
      description: "Echa horas. Sube habilidades y reputación (el salario llega en el día de pago).",
    },
    study: { label: "Estudiar", description: "Elige cuánto tiempo quieres estudiar." },
    study_1h: { label: "Estudiar (1h)", description: "Sesión corta." },
    study_2h: { label: "Estudiar (2h)", description: "Sesión media." },
    study_4h: { label: "Estudiar (4h)", description: "Sesión intensa." },

    socialize: { label: "Socializar", description: "Elige una opción (café, cena, fiesta…)."},
    socialize_coffee: { label: "Café", description: "Charla rápida. Barato y relajante."},
    socialize_dinner: { label: "Cena", description: "Cena fuera. Más caro, mejora más el ánimo."},
    socialize_party: { label: "Fiesta", description: "Noche grande. Gasta energía, sube reputación."},

    exercise: { label: "Ejercicio", description: "Muévete. Aclara la mente."},
    "side-hustle": { label: "Extra", description: "Usa tus habilidades para ganar dinero extra."},
    network: { label: "Networking", description: "Asiste a eventos. Sube en la empresa."},
    explore: { label: "Explorar la ciudad", description: "Descubre tu nuevo hogar."},

    rest: { label: "Descansar", description: "Elige cuánto tiempo quieres descansar."},
    nap_1h: { label: "Siesta (1h)", description: "Una siesta rápida para recuperar energía."},
    rest_4h: { label: "Descanso (4h)", description: "Un descanso sólido."},
    sleep_8h: {
      labelWithHours: (hours: number) => `Dormir (${hours}h)`,
      description: "Sueño profundo. Recupera energía (proporcional a las horas).",
    },
  },

  LOG: {
    "log.system.newDay": ({ day, timeOfDay }: any) => `Día ${day} · {TIME:${timeOfDay}}`,
    "log.system.freshStart": "Empieza un nuevo comienzo.",
            "log.system.sleepNewDay": "Te fuiste a dormir. Empieza un nuevo día.",
    "log.system.exhausted": "Estás agotada.",
    "log.system.noTimeLeft": "No queda tiempo hoy.",
    "log.system.notEnoughTime": "No queda tiempo suficiente hoy para eso.",
    "log.system.notEnoughEnergy": "No tienes energía suficiente para eso.",
    "log.system.lockedBySkills": ({ minSkills }: any) => `Necesitas ${minSkills} de habilidades para desbloquearlo.`,
    "log.system.salaryRules": "El salario llega en el día 15 y el día 30. Las facturas llegan durante el mes.",

    "log.money.payday": ({ amount }: any) => `¡Día de pago! +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `Factura: ${label} -$${amount}`,
    "log.money.wentBroke": "No te lo podías permitir… Dinero a 0. Baja el ánimo y la reputación.",

    "log.action.performed": (p: any) => {
      const { icon, actionId, label, hours } = p ?? {};
      return `${icon} {ACTION:${actionId}:${label}} (⏱️ ${hours}h)`;
    },
    "log.achievement.unlocked": ({ label }: any) => `Logro desbloqueado: ${label}`,
    "log.event.text": ({ text }: any) => text,
  },
} as const;

export type TextSchema = typeof TEXT_ES;
