export const TEXT_JA = {
  GAME: { title: "Fresh Start" },

  UI: {
    day: "日",
    month: "月",
    actions: "アクション",
    achievements: "実績",
    close: "閉じる",
    language: "言語",
    timeAriaLabel: "時間",
    energyLimitPrefix: "アクションは次で制限されます:",
    energy: "エネルギー",
    endDay: "一日終了（全回復）→",
  },

  TIME: {
    morning: "🌅 朝",
    afternoon: "☀️ 昼",
    evening: "🌆 夕方",
    night: "🌙 夜",
  },

  STATS: {
    money: "お金",
    energy: "エネルギー",
    happiness: "幸福度",
    skills: "スキル",
    reputation: "評判",
    reputationTitle: "評判 (0–100)",
  },

  MODALS: {
    studyTitle: "勉強",
    studySubtitle: "勉強する時間を選んでください。",
    practiceTitle: "練習",
    practiceSubtitle: "XP +60% ただしエネルギーと幸福度の消費も +60%。",
    socialTitle: "交流",
    socialSubtitle: "選んでください。",
    restTitle: "休む",
    restSubtitle: "選んでください。",
  },

  INTRO: {
    subtitle: "もう一度はじめるゲーム",
    line1: "前の生活をやめた。",
    line2: "新しい街。新しい部屋。新しい仕事。",
    line3Prefix: "月曜日から",
    line4: "手元には$20、スーツケース、そして証明したい気持ち。",
    start: "はじめる",
    tip: "エネルギー管理。スキルアップ。自分の居場所を作ろう。",
  },

  ENDING: {
    title: "1か月後",
    story:
      "スーツケースと契約書の名前だけでここに来た。\n今はルーティンができて、友だちも少し増えて、ここが\n少しずつ家みたいになってきた。完璧じゃない。でも自分の場所だ。",
    restart: "やり直す",
  },

  ACTIONS: {
    work: { label: "仕事", description: "働く。スキルと評判が上がる（給料は給料日）。" },
    study: { label: "勉強", description: "勉強時間を選ぶ。" },
    study_1h: { label: "勉強 (1h)", description: "短い勉強。" },
    study_2h: { label: "勉強 (2h)", description: "ふつうの勉強。" },
    study_4h: { label: "勉強 (4h)", description: "集中して勉強。" },

    socialize: { label: "交流", description: "選ぶ（コーヒー、夕食、パーティー…）。" },
    socialize_coffee: { label: "コーヒー", description: "短いおしゃべり。安くて気楽。" },
    socialize_dinner: { label: "夕食", description: "ちゃんと外食。高いけど気分アップ。" },
    socialize_party: { label: "パーティー", description: "大きい夜。エネルギー消費、評判アップ。" },

    exercise: { label: "運動", description: "体を動かす。気分転換。" },
    "side-hustle": { label: "副業", description: "スキルでお金を稼ぐ。" },
    network: { label: "人脈作り", description: "イベントに行く。評価アップ。" },
    explore: { label: "街を探検", description: "新しい街を知る。" },

    rest: { label: "休む", description: "休む時間を選ぶ。" },
    nap_1h: { label: "昼寝 (1h)", description: "少し回復する。" },
    rest_4h: { label: "休憩 (4h)", description: "しっかり休む。" },
    sleep_8h: {
      labelWithHours: (hours: number) => `睡眠 (${hours}h)`,
      description: "深い睡眠。時間に比例して回復。",
    },
  },

  LOG: {
    "log.system.newDay": ({ day, timeOfDay }: any) => `${day}日目 · {TIME:${timeOfDay}}`,
    "log.system.freshStart": "新しいスタートが始まる。",
        "log.system.sleepNewDay": "眠った。新しい一日が始まる。",
    "log.system.exhausted": "疲れ切った。",
    "log.system.noTimeLeft": "今日はもう時間がない。",
    "log.system.notEnoughTime": "今日は時間が足りない。",
    "log.system.notEnoughEnergy": "エネルギーが足りない。",
    "log.system.lockedBySkills": ({ minSkills }: any) => `スキル${minSkills}が必要。`,
    "log.system.salaryRules": "給料日は15日と30日。請求は月の途中に来る。",

    "log.money.payday": ({ amount }: any) => `給料日！ +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `請求: ${label} -$${amount}`,
    "log.money.wentBroke": "払えなかった… お金は0。気分と評判が下がった。",

    "log.action.performed": (p: any) => {
      const { icon, actionId, label, hours } = p ?? {};
      return `${icon} {ACTION:${actionId}:${label}} (⏱️ ${hours}h)`;
    },
    "log.achievement.unlocked": ({ label }: any) => `実績解除: ${label}`,
    "log.event.text": ({ text }: any) => text,
  },
} as const;

export type TextSchema = typeof TEXT_JA;
