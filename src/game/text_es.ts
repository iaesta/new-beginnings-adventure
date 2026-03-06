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
    line1: "Dejaste tu vida anterior atrás.",
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
    work: { label: "Trabajar", description: "Echa horas. Sube habilidades y reputación (el salario llega en el día de pago)." },
    study: { label: "Estudiar", description: "Elige cuánto tiempo quieres estudiar." },
    study_1h: { label: "Estudiar (1h)", description: "Sesión corta." },
    study_2h: { label: "Estudiar (2h)", description: "Sesión media." },
    study_4h: { label: "Estudiar (4h)", description: "Sesión intensa." },
    socialize: { label: "Socializar", description: "Elige una opción (café, cena, fiesta…)."},
    socialize_coffee: { label: "Café", description: "Charla rápida. Barato y relajante."},
    socialize_dinner: { label: "Cena", description: "Cena fuera. Más cara, pero anima más."},
    socialize_party: { label: "Fiesta", description: "Noche grande. Gasta energía y sube la reputación."},
    exercise: { label: "Ejercicio", description: "Muévete. Aclara la mente."},
    "side-hustle": { label: "Extra", description: "Usa tus habilidades para ganar dinero extra."},
    network: { label: "Networking", description: "Asiste a eventos. Escala posiciones."},
    explore: { label: "Explorar la ciudad", description: "Descubre tu nuevo hogar."},
    rest: { label: "Descansar", description: "Elige cuánto tiempo quieres descansar."},
    nap_1h: { label: "Siesta (1h)", description: "Una siesta rápida para recuperar un poco de energía."},
    rest_4h: { label: "Descanso (4h)", description: "Un descanso sólido."},
    sleep_8h: {
      labelWithHours: (hours: number) => `Dormir (${hours}h)`,
      description: "Sueño profundo. Recupera energía según las horas dormidas.",
    },
  },

  MILESTONES: {
    "first-week": "📅 Superaste la primera semana",
    "saved-1000": "💰 Ahorraste $1000",
    "skilled-up": "🎓 Habilidades por encima de 50",
    "popular": "⭐ Reputación por encima de 60",
    "month-one": "🗓️ Un mes dentro",
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
    "log.system.salaryRules": "El salario llega el día 15 y el día 30. Las facturas van llegando durante el mes.",
    "log.money.payday": ({ amount }: any) => `¡Día de pago! +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `Factura: ${label} -$${amount}`,
    "log.money.wentBroke": "No te lo podías permitir… Dinero a 0. Baja el ánimo y la reputación.",
    "log.achievement.unlocked": ({ label }: any) => `Logro desbloqueado: ${label}`,
  },

  NARRATIVES: {
    work: [
      "Sacas el trabajo adelante y mantienes el día en marcha.",
      "El trabajo se hace pesado, pero lo terminas igual.",
      "Un problema complicado por fin cede después de insistir.",
      "Las reuniones te drenan, pero aguantas el tipo.",
      "Hoy te sientes un poco más capaz que ayer.",
    ],
    study: [
      "Te sientas con apuntes y tutoriales y sigues adelante.",
      "Cuesta, pero poco a poco tu concentración se afila.",
      "Varias ideas por fin empiezan a encajar.",
      "Tiras de pura constancia y sigues aprendiendo.",
    ],
    socialize: [
      "La conversación empieza rara, pero acaba fluyendo.",
      "Te ríes más de lo que esperabas.",
      "Una charla casual te deja pensando en varias cosas.",
      "Sales sintiéndote un poco menos sola en la ciudad.",
    ],
    rest: [
      "Bajas el ritmo y por fin dejas respirar a la mente.",
      "Durante un rato, nada urgente consigue colarse.",
      "Descansar se siente más a reparación que a pereza.",
    ],
    exercise: [
      "Mover el cuerpo te ayuda a despejar la cabeza.",
    ],
    "side-hustle": [
      "El trabajo extra cansa, pero el dinero ayuda.",
    ],
    network: [
      "Apareces, hablas con gente y sales con contactos útiles.",
    ],
    explore: [
      "La ciudad te resulta un poco menos ajena que antes.",
    ],
  },

  EVENTS: {
    "first-paycheck": "Llega tu primer sueldo. No es mucho, pero es tuyo, y eso se nota.",
    "office-lunch": "Una compañera te invita a comer. La conversación cuesta al principio, pero acaba saliendo.",
    "imposter-syndrome": "Esta noche te golpean las dudas. Sientes que todo el mundo va por delante.",
    "rainy-walk": "Te pilla la lluvia, te refugias en una librería y sales de allí con otra mirada.",
    "promotion-hint": "Tu jefa deja caer que pronto podría abrirse un puesto mejor.",
    "lonely-evening": "El apartamento se siente especialmente silencioso esta noche.",
    "breakthrough": "Por fin algo hace clic en el trabajo. Notas que estás mejorando.",
    "unexpected-bill": "Llega una factura inesperada. La nueva vida aprieta.",
    "friend-visit": "Pasa una vieja amistad por la ciudad y, por unas horas, todo se siente familiar.",
    "recognition": "Tu nombre sale bien parado en una reunión. Empiezan a fijarse en ti.",
  },
} as const;

export type TextSchema = typeof TEXT_ES;