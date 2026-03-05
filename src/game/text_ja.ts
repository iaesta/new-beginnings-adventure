export const TEXT_JA = {
  GAME: { title: "Fresh Start" },

  UI: {
    day: "日",
    month: "月",
    actions: "アクション",
    achievements: "実績",
    close: "閉じる",
    recharge: "エネルギー回復 (100%) →",
    energyLimitPrefix: "アクションは次で制限されます:",
    energy: "エネルギー",
    timeAriaLabel: "時間",
    yourJourney: "これまで",
    milestones: "マイルストーン",
    language: "言語",
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
} as const;

export type TextSchema = typeof TEXT_JA;
