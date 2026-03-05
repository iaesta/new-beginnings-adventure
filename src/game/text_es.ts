export const TEXT_ES = {
  GAME: { title: "Nuevo Comienzo" },

  UI: {
    day: "Día",
    month: "Mes",
    actions: "Acciones",
    achievements: "Logros",
    close: "Cerrar",
    recharge: "Recargar energía (100%) →",
    energyLimitPrefix: "Las acciones están limitadas por",
    energy: "Energía",
    timeAriaLabel: "Tiempo",
    yourJourney: "Tu viaje",
    milestones: "Hitos",
    language: "Idioma",
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
} as const;

export type TextSchema = typeof TEXT_ES;
