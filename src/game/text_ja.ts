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
    line1: "前の生活を手放した。",
    line2: "新しい街。新しい部屋。新しい仕事。",
    line3Prefix: "月曜日から",
    line4: "手元には$200、スーツケース、そして証明したい気持ち。",
    start: "はじめる",
    tip: "エネルギーを管理して、スキルを上げて、自分の居場所を作ろう。",
  },

  ENDING: {
    title: "1か月後",
    story:
      "スーツケースと契約書の名前だけでここに来た。\n今はルーティンができて、友だちも少し増えて、ここが\n少しずつ家みたいになってきた。完璧じゃない。でも自分の場所だ。",
    restart: "やり直す",
  },

  ACTIONS: {
    work: { label: "仕事", description: "働く。スキルと評判が上がる（給料は給料日）。" },
    study: { label: "勉強", description: "勉強する時間を選ぶ。" },
    study_1h: { label: "勉強 (1h)", description: "短い勉強。" },
    study_2h: { label: "勉強 (2h)", description: "ふつうの勉強。" },
    study_4h: { label: "勉強 (4h)", description: "集中して勉強。" },
    socialize: { label: "交流", description: "選ぶ（コーヒー、夕食、パーティー…）。" },
    socialize_coffee: { label: "コーヒー", description: "短いおしゃべり。安くて気楽。" },
    socialize_dinner: { label: "夕食", description: "ちゃんと外食。高いけど気分が上がる。" },
    socialize_party: { label: "パーティー", description: "大きい夜。エネルギーは減るけど評判は上がる。" },
    exercise: { label: "運動", description: "体を動かす。気分転換。" },
    "side-hustle": { label: "副業", description: "スキルを使って少しお金を稼ぐ。" },
    network: { label: "人脈作り", description: "イベントに行って評価を上げる。" },
    explore: { label: "街を探検", description: "新しい街を知る。" },
    rest: { label: "休む", description: "休む時間を選ぶ。" },
    nap_1h: { label: "昼寝 (1h)", description: "少しだけ回復する。" },
    rest_4h: { label: "休憩 (4h)", description: "しっかり休む。" },
    sleep_8h: {
      labelWithHours: (hours: number) => `睡眠 (${hours}h)`,
      description: "眠った時間に応じてエネルギーを回復する。",
    },
  },

  MILESTONES: {
    "first-week": "📅 最初の一週間を乗り切った",
    "saved-1000": "💰 $1000貯めた",
    "skilled-up": "🎓 スキル50以上",
    "popular": "⭐ 評判60以上",
    "month-one": "🗓️ 1か月経過",
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
    "log.system.burnoutCrash": "あなたはしすぎてクラッシュした。明日は重い。",
    "log.system.gameOverBurnout": "あなたの体と心はこれ以上我慢できなかった。あなたの限界に達した。",
    "log.money.payday": ({ amount }: any) => `給料日！ +$${amount}`,
    "log.money.billDue": ({ label, amount }: any) => `請求: ${label} -$${amount}`,
    "log.money.wentBroke": "払えなかった… お金は0。気分と評判が下がった。",
    "log.achievement.unlocked": ({ label }: any) => `実績解除: ${label}`,
  },

  NARRATIVES: {
    work: [
      "今日の仕事を何とか前に進めた。",
      "しんどい日だけど、やることはちゃんと終えた。",
      "難しい問題が少しずつほどけていく。",
      "会議で疲れたけど、最後まで持ちこたえた。",
      "昨日より少しだけ自信が出てきた。",
    ],
    study: [
      "ノートとチュートリアルに向き合って続けた。",
      "大変だけど、少しずつ集中できるようになる。",
      "いくつかの考えがようやくつながった。",
      "根気で押し切って学び続けた。",
    ],
    socialize: [
      "最初はぎこちなかったけど、だんだん会話が楽になった。",
      "思ったより笑う時間が多かった。",
      "何気ない会話が意外と心に残った。",
      "街の中で少しだけ孤独が薄れた気がした。",
    ],
    rest: [
      "少し立ち止まって、頭の中に余白が戻った。",
      "しばらくの間、急ぐことを考えなくてよかった。",
      "休むことが甘えではなく回復に思えた。",
    ],
    exercise: [
      "体を動かすと、心の重さも少し軽くなる。",
    ],
    "side-hustle": [
      "疲れるけれど、少しの収入が助けになる。",
    ],
    network: [
      "人と話して、有益なつながりを少し作れた。",
    ],
    explore: [
      "この街が前より少しだけ自分のものに感じた。",
    ],
  },

  EVENTS: {
    "first-paycheck": "初めての給料が入った。多くはないけど、自分で手にしたお金だ。",
    "office-lunch": "同僚にランチへ誘われた。最初はぎこちないけど、少しずつ話せた。",
    "imposter-syndrome": "今夜は不安が強い。みんなが自分よりうまくやっている気がする。",
    "rainy-walk": "雨に降られて本屋に逃げ込み、少し視界が変わった。",
    "promotion-hint": "上司が、近いうちにもっと良いポジションが空くかもしれないとほのめかした。",
    "lonely-evening": "今夜の部屋は特に静かで、少し心細い。",
    "breakthrough": "仕事でようやく一つの感覚がつながった。自分が伸びていると感じる。",
    "unexpected-bill": "予想外の請求が来た。新しい生活は容赦ない。",
    "friend-visit": "昔の友だちが街に寄ってくれて、少しだけ懐かしい気持ちになった。",
    "recognition": "会議であなたの名前が良い意味で話題になった。少しずつ見てもらえている。",
  },
} as const;

export type TextSchema = typeof TEXT_JA;