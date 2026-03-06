
import { useMemo, useState } from "react";
import type { GameAction, GameState } from "@/game/types";
import { MILESTONES } from "@/game/data";
import { useI18n, useText } from "@/game/i18n";
import StatBar from "./StatBar";
import GameLog from "./GameLog";
import ActionButton from "./ActionButton";

interface GameScreenProps {
  state: GameState;
  availableActions: GameAction[];
  onAction: (id: string) => void;
  onSkipDay: () => void;
}

type TooltipData = { text: string; x: number; y: number };

const isStudyVariant = (id: string) => id === "study" || id.startsWith("study_");
const isPracticeVariant = (id: string) => id === "practice" || id.startsWith("practice_");
const isSocializeVariant = (id: string) => id === "socialize" || id.startsWith("socialize_");

const STUDY_MENU: GameAction = {
  id: "__menu_study__",
  icon: "📚",
  label: "Study",
  description: "Choose how long you want to study.",
  energyCost: 0,
  effects: {},
};

const PRACTICE_MENU: GameAction = {
  id: "__menu_practice__",
  icon: "🧪",
  label: "Practice",
  description: "+60% XP, but costs +60% energy and happiness.",
  energyCost: 0,
  effects: {},
};

const SOCIAL_MENU: GameAction = {
  id: "__menu_social__",
  icon: "🗣️",
  label: "Socialize",
  description: "Pick an option.",
  energyCost: 0,
  effects: {},
};

const REST_MENU: GameAction = {
  id: "__menu_rest__",
  icon: "🛋️",
  label: "Rest",
  description: "Pick an option.",
  energyCost: 0,
  effects: {},
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

type TimeOfDay = GameState["timeOfDay"];
type Stop = { t: number; rgb: [number, number, number] };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}
function progressColor(pUsed: number) {
  const t = clamp01(pUsed);
  const stops: Stop[] = [
    { t: 0.0, rgb: [34, 197, 94] },
    { t: 0.6, rgb: [234, 179, 8] },
    { t: 0.8, rgb: [249, 115, 22] },
    { t: 1.0, rgb: [239, 68, 68] },
  ];

  let a: Stop = stops[0];
  let b: Stop = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].t && t <= stops[i + 1].t) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }

  const localT = (t - a.t) / (b.t - a.t || 1);
  const r = Math.round(lerp(a.rgb[0], b.rgb[0], localT));
  const g = Math.round(lerp(a.rgb[1], b.rgb[1], localT));
  const bb = Math.round(lerp(a.rgb[2], b.rgb[2], localT));
  return `rgb(${r}, ${g}, ${bb})`;
}

function timeOfDayIcon(t: TimeOfDay) {
  if (t === "morning") return "☀️";
  if (t === "afternoon") return "🌤️";
  if (t === "evening") return "🌆";
  return "🌙";
}

function TimeClock({
  slotsRemaining,
  slotsPerDay,
  timeOfDay,
}: {
  slotsRemaining: number;
  slotsPerDay: number;
  timeOfDay: TimeOfDay;
}) {
  const T = useText();
  const perDay = Number.isFinite(slotsPerDay) && slotsPerDay > 0 ? slotsPerDay : 24;
  const remaining = Number.isFinite(slotsRemaining) ? clamp(slotsRemaining, 0, perDay) : perDay;

  const used = perDay - remaining;
  const progress = clamp01(used / perDay);
  const degrees = Math.round(progress * 360);
  const color = progressColor(progress);
  const sleepZoneStartDeg = Math.round(((perDay - 8) / perDay) * 360);

  return (
    <div className="flex items-center justify-center">
      <div className="relative" title={T.TIME[timeOfDay]} aria-label={T.UI.timeAriaLabel}>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            width: 86,
            height: 86,
            left: -3,
            top: -3,
            background: `conic-gradient(
              rgba(99,102,241,0) 0deg,
              rgba(99,102,241,0) ${sleepZoneStartDeg}deg,
              rgba(99,102,241,0.35) ${sleepZoneStartDeg}deg,
              rgba(99,102,241,0.35) 360deg
            )`,
            mask: "radial-gradient(circle, transparent 58%, black 59%)",
            WebkitMask: "radial-gradient(circle, transparent 58%, black 59%)",
          }}
        />
        <div
          className="rounded-full grid place-items-center"
          style={{
            width: 80,
            height: 80,
            background: `conic-gradient(${color} ${degrees}deg, rgba(255,255,255,0.15) 0deg)`,
          }}
        >
          <div
            className="rounded-full grid place-items-center bg-black/40 border border-white/10"
            style={{ width: 60, height: 60 }}
          >
            <div className="text-4xl leading-none">{timeOfDayIcon(timeOfDay)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleModal({
  title,
  subtitle,
  options,
  onPick,
  onClose,
}: {
  title: string;
  subtitle?: string;
  options: GameAction[];
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const T = useText();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-semibold text-white">{title}</p>
            {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
          </div>

          <button
            className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            {T.UI.close}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {options.map((a: GameAction) => (
            <button
              key={a.id}
              className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 text-left transition-colors"
              onClick={() => onPick(a.id)}
              type="button"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-white flex items-center gap-2">
                  <span className="text-lg leading-none">{a.icon}</span>
                  {a.label}
                </span>
                <span className="text-xs text-white/70">⚡ {a.energyCost}</span>
              </div>
              <div className="text-xs text-white/60 mt-1">{a.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
function rgbToHex(r: number, g: number, b: number) {
  const to = (x: number) => x.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}
function mix(a: string, b: string, t: number) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const bb = Math.round(A.b + (B.b - A.b) * t);
  return rgbToHex(r, g, bb);
}
function repColor(rep: number) {
  const r = clamp(rep, 0, 100);
  const stops = [
    { p: 0, c: "#0B1020" },
    { p: 25, c: "#6B7280" },
    { p: 50, c: "#F97316" },
    { p: 75, c: "#F59E0B" },
    { p: 100, c: "#10B981" },
  ];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (r >= a.p && r <= b.p) {
      const t = (r - a.p) / (b.p - a.p);
      return mix(a.c, b.c, t);
    }
  }
  return stops[stops.length - 1].c;
}

const GameScreen = ({ state, availableActions, onAction, onSkipDay }: GameScreenProps) => {
  const { lang, setLang } = useI18n();
  const T = useText();
  const DAYS_IN_MONTH = 30;
  const dayInMonth = ((state.day - 1) % DAYS_IN_MONTH) + 1;
  const monthNumber = Math.floor((state.day - 1) / DAYS_IN_MONTH) + 1;

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [studyOpen, setStudyOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [restOpen, setRestOpen] = useState(false);

  const canPractice = state.skills >= 20;

  const showTooltip = (text: string, rect: DOMRect) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;
    setTooltip({ text, x, y });
    window.setTimeout(() => setTooltip(null), 3000);
  };

  const tr = (a: GameAction): GameAction => {
    const tAction = (T as any).ACTIONS?.[a.id];
    return {
      ...a,
      label: tAction?.label ?? a.label,
      description: tAction?.description ?? a.description,
    };
  };

  const studyOptions = useMemo(
    () => availableActions.filter((a: GameAction) => a.id === "study_1h" || a.id === "study_2h" || a.id === "study_4h").map(tr),
    [availableActions, T]
  );

  const practiceOptions = useMemo(
    () => availableActions.filter((a: GameAction) => a.id === "practice_1h" || a.id === "practice_2h" || a.id === "practice_4h").map(tr),
    [availableActions, T]
  );

  const socialOptions = useMemo(
    () => availableActions.filter((a: GameAction) => a.id.startsWith("socialize_") && a.id !== "socialize").map(tr),
    [availableActions, T]
  );

  const restOptions = useMemo(() => {
    const sleepHours = Math.min(8, Math.max(0, state.slotsRemaining));
    return availableActions
      .filter((a: GameAction) => a.parentId === "rest")
      .map((a) => {
        const tAction = (T as any).ACTIONS?.[a.id];
        if (a.id === "sleep_8h" && tAction?.labelWithHours) {
          return { ...a, label: tAction.labelWithHours(sleepHours), description: tAction.description ?? a.description };
        }
        return {
          ...a,
          label: tAction?.label ?? a.label,
          description: tAction?.description ?? a.description,
        };
      });
  }, [availableActions, state.slotsRemaining, T]);

  const actionsForGrid = useMemo(() => {
    const base = availableActions.filter((a: GameAction) => {
      if (a.hidden || a.parentId) return false;
      if (isStudyVariant(a.id)) return false;
      if (isPracticeVariant(a.id)) return false;
      if (isSocializeVariant(a.id)) return false;
      if (a.id === "rest") return false;
      return true;
    });

    const withMenus: GameAction[] = [];
    if (studyOptions.length > 0) withMenus.push({ ...STUDY_MENU, label: T.MODALS.studyTitle, description: T.MODALS.studySubtitle });
    if (canPractice && practiceOptions.length > 0) withMenus.push({ ...PRACTICE_MENU, label: T.MODALS.practiceTitle, description: T.MODALS.practiceSubtitle });
    if (socialOptions.length > 0) withMenus.push({ ...SOCIAL_MENU, label: T.MODALS.socialTitle, description: T.MODALS.socialSubtitle });
    if (restOptions.length > 0) withMenus.push({ ...REST_MENU, label: T.MODALS.restTitle, description: T.MODALS.restSubtitle });

    return [...withMenus, ...base.map(tr)];
  }, [availableActions, canPractice, practiceOptions.length, socialOptions.length, restOptions.length, studyOptions.length, T]);

  const handleActionClick = (id: string) => {
    if (id === STUDY_MENU.id) return setStudyOpen(true);
    if (id === PRACTICE_MENU.id) return setPracticeOpen(true);
    if (id === SOCIAL_MENU.id) return setSocialOpen(true);
    if (id === REST_MENU.id) return setRestOpen(true);
    onAction(id);
  };

  const unlockedAchievements = useMemo(() => {
    if (!state.milestones?.length) return [];
    return MILESTONES.filter((m: { id: string; label: string }) => state.milestones.includes(m.id));
  }, [state.milestones]);

  const rep = clamp(state.reputation, 0, 100);
  const medalBase = repColor(rep);
  const medalHighlight = repColor(clamp(rep + 18, 0, 100));
  const medalStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(135deg, ${medalHighlight}, ${medalBase})`,
    boxShadow: `0 0 18px ${medalBase}55`,
  };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row">
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6 space-y-6 bg-white/5 backdrop-blur">
        <div className="space-y-1">
          <h2 className="font-serif text-lg text-primary text-glow-primary">{T.GAME.title}</h2>
          <p className="text-xs text-muted-foreground">
            {T.UI.day} {dayInMonth}/{DAYS_IN_MONTH} · {T.TIME[state.timeOfDay]}
          </p>
          <p className="text-xs text-muted-foreground">{state.jobTitle}</p>
          <p className="text-[11px] text-muted-foreground/70">{T.UI.month} {monthNumber}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground/70">{T.UI.language}:</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="text-[11px] rounded-md border border-white/10 bg-black/30 px-2 py-1 text-white/80 hover:bg-black/40"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="ja">JA</option>
            </select>
          </div>
        </div>

        <TimeClock slotsRemaining={state.slotsRemaining} slotsPerDay={state.slotsPerDay} timeOfDay={state.timeOfDay} />

        <div className="space-y-3">
          <StatBar label={T.STATS.money} value={state.money} max={300} colorClass="bg-stat-money" icon="💰" />
          <StatBar label={T.STATS.energy} value={state.energy} max={100} colorClass="bg-stat-energy" icon="⚡" />
          <StatBar label={T.STATS.happiness} value={state.happiness} max={100} colorClass="bg-stat-happiness" icon="😊" />
          <StatBar label={T.STATS.skills} value={state.skills} max={100} colorClass="bg-stat-skills" icon="📈" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-sm font-extrabold text-black"
              style={medalStyle}
              title={T.STATS.reputationTitle}
            >
              {rep}
            </div>

            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">{T.STATS.reputation}</div>
              <div className="h-2 w-40 max-w-full rounded-full bg-white/10 overflow-hidden mt-1">
                <div
                  className="h-full"
                  style={{
                    width: `${rep}%`,
                    backgroundImage: `linear-gradient(90deg, ${medalBase}, ${medalHighlight})`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {unlockedAchievements.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{T.UI.achievements}</p>
            <div className="flex flex-wrap gap-1">
              {unlockedAchievements.map((m: { id: string; label: string }) => (
                <span key={m.id} className="text-xs px-2 py-1 rounded bg-white/10" title={(T as any).MILESTONES?.[m.id] ?? m.label}>
                  {(T as any).MILESTONES?.[m.id] ?? m.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {T.UI.energyLimitPrefix} <span className="text-foreground">{T.UI.energy}</span>.
        </div>
      </aside>

      <div className="flex-1 min-h-0 lg:h-screen flex flex-col">
        <main className="flex-1 min-h-0 p-4 lg:p-6">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <GameLog entries={state.log} />
          </div>
        </main>

        <section className="border-t border-border p-4 lg:p-6 bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{T.UI.actions}</p>

            <button
              onClick={onSkipDay}
              className={`text-xs px-4 py-2 rounded-xl border transition-all duration-200 ${state.energy <= 0 ? "border-red-500 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-white/5 hover:bg-white/10"}`}
              type="button"
            >
              {T.UI.endDay}
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {actionsForGrid.map((action: GameAction) => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={action.energyCost > 0 && state.energy < action.energyCost}
                lowEnergy={state.energy < action.energyCost}
                onClick={() => handleActionClick(action.id)}
                onHover={(text: string, rect: DOMRect) => showTooltip(text, rect)}
              />
            ))}
          </div>
        </section>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2 text-xs text-white shadow-lg">
            {tooltip.text}
          </div>
        </div>
      )}

      {studyOpen && (
        <SimpleModal
          title={T.MODALS.studyTitle}
          subtitle={T.MODALS.studySubtitle}
          options={studyOptions}
          onClose={() => setStudyOpen(false)}
          onPick={(id) => {
            onAction(id);
            setStudyOpen(false);
          }}
        />
      )}

      {practiceOpen && (
        <SimpleModal
          title={T.MODALS.practiceTitle}
          subtitle={T.MODALS.practiceSubtitle}
          options={practiceOptions}
          onClose={() => setPracticeOpen(false)}
          onPick={(id) => {
            onAction(id);
            setPracticeOpen(false);
          }}
        />
      )}

      {socialOpen && (
        <SimpleModal
          title={T.MODALS.socialTitle}
          subtitle={T.MODALS.socialSubtitle}
          options={socialOptions}
          onClose={() => setSocialOpen(false)}
          onPick={(id) => {
            onAction(id);
            setSocialOpen(false);
          }}
        />
      )}

      {restOpen && (
        <SimpleModal
          title={T.MODALS.restTitle}
          subtitle={T.MODALS.restSubtitle}
          options={restOptions}
          onClose={() => setRestOpen(false)}
          onPick={(id) => {
            onAction(id);
            setRestOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default GameScreen;
