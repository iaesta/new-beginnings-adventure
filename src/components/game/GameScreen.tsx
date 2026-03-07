import { useMemo, useState, type CSSProperties } from "react";
import type { GameAction, GameState } from "@/game/types";
import { ACTIONS, MILESTONES } from "@/game/data";
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
const isSocializeVariant = (id: string) => id === "socialize" || id.startsWith("socialize_");

const STUDY_MENU: GameAction = { id: "__menu_study__", icon: "📚", label: "Study", description: "Choose how long you want to study.", energyCost: 0, effects: {} };
const SOCIAL_MENU: GameAction = { id: "__menu_social__", icon: "🗣️", label: "Socialize", description: "Pick an option.", energyCost: 0, effects: {} };
const REST_MENU: GameAction = { id: "__menu_rest__", icon: "🛋️", label: "Rest", description: "Pick an option.", energyCost: 0, effects: {} };

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }
function getFatigueEnergyMultiplier(stacks: number) { if (stacks >= 3) return 1.45; if (stacks === 2) return 1.3; if (stacks === 1) return 1.15; return 1; }

type TimeOfDay = GameState["timeOfDay"];
type Stop = { t: number; rgb: [number, number, number] };
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function progressColor(pUsed: number) {
  const t = clamp01(pUsed);
  const stops: Stop[] = [
    { t: 0.0, rgb: [34, 197, 94] },
    { t: 0.6, rgb: [234, 179, 8] },
    { t: 0.8, rgb: [249, 115, 22] },
    { t: 1.0, rgb: [239, 68, 68] },
  ];
  let a: Stop = stops[0]; let b: Stop = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) { if (t >= stops[i].t && t <= stops[i + 1].t) { a = stops[i]; b = stops[i + 1]; break; } }
  const localT = (t - a.t) / (b.t - a.t || 1);
  const r = Math.round(lerp(a.rgb[0], b.rgb[0], localT));
  const g = Math.round(lerp(a.rgb[1], b.rgb[1], localT));
  const bb = Math.round(lerp(a.rgb[2], b.rgb[2], localT));
  return `rgb(${r}, ${g}, ${bb})`;
}
function timeOfDayIcon(t: TimeOfDay) { if (t === "morning") return "☀️"; if (t === "afternoon") return "🌤️"; if (t === "evening") return "🌆"; return "🌙"; }
function burnoutFireStyle(stacks: number): CSSProperties { if (stacks <= 0) return { display: "none" }; if (stacks === 1) return { fontSize: "1.2rem", lineHeight: 1, filter: "drop-shadow(0 0 6px rgba(250,204,21,0.35))" }; if (stacks === 2) return { fontSize: "1.5rem", lineHeight: 1, filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" }; return { fontSize: "1.8rem", lineHeight: 1, filter: "drop-shadow(0 0 10px rgba(239,68,68,0.45))" }; }

function TimeClock({ slotsRemaining, slotsPerDay, timeOfDay }: { slotsRemaining: number; slotsPerDay: number; timeOfDay: TimeOfDay }) {
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
        <div className="absolute inset-0 rounded-full" style={{ width: 128, height: 128, left: -4, top: -4, background: `conic-gradient(rgba(99,102,241,0) 0deg, rgba(99,102,241,0) ${sleepZoneStartDeg}deg, rgba(99,102,241,0.28) ${sleepZoneStartDeg}deg, rgba(99,102,241,0.28) 360deg)`, mask: "radial-gradient(circle, transparent 58%, black 59%)", WebkitMask: "radial-gradient(circle, transparent 58%, black 59%)" }} />
        <div className="rounded-full grid place-items-center" style={{ width: 120, height: 120, background: `conic-gradient(${color} ${degrees}deg, rgba(255,255,255,0.15) 0deg)` }}>
          <div className="rounded-full grid place-items-center bg-black/40 border border-white/10" style={{ width: 92, height: 92 }}>
            <div className="text-5xl leading-none">{timeOfDayIcon(timeOfDay)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleModal({ title, subtitle, options, onPick, onClose, fatigueEnergyMultiplier, currentEnergy }: { title: string; subtitle?: string; options: GameAction[]; onPick: (id: string) => void; onClose: () => void; fatigueEnergyMultiplier: number; currentEnergy: number; }) {
  const T = useText();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/70 backdrop-blur p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div><p className="text-sm font-semibold text-white">{title}</p>{subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}</div>
          <button className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10" onClick={onClose} type="button">{T.UI.close}</button>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {options.map((a) => {
            const shownEnergyCost = Math.ceil(Math.max(0, a.energyCost) * fatigueEnergyMultiplier);
            const willCauseBurnout = shownEnergyCost > currentEnergy && shownEnergyCost > 0;
            return (
              <button key={a.id} className={`rounded-xl border px-3 py-2 text-left transition-colors ${willCauseBurnout ? "border-red-300/20 bg-red-500/5 hover:bg-red-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`} onClick={() => onPick(a.id)} type="button">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white flex items-center gap-2"><span className="text-lg leading-none">{a.icon}</span>{a.label}</span>
                  {shownEnergyCost > 0 && <span className={`text-xs ${willCauseBurnout ? "text-red-100" : "text-white/70"}`}>⚡ {shownEnergyCost}</span>}
                </div>
                <div className="text-xs text-white/60 mt-1">{a.description}</div>
                {willCauseBurnout && <div className="mt-1 text-[11px] font-medium text-red-200/90">⚠ Burnout risk</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function hexToRgb(hex: string) { const h = hex.replace("#", ""); const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h; const n = parseInt(full, 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }
function rgbToHex(r: number, g: number, b: number) { const to = (x: number) => x.toString(16).padStart(2, "0"); return `#${to(r)}${to(g)}${to(b)}`; }
function mix(a: string, b: string, t: number) { const A = hexToRgb(a); const B = hexToRgb(b); const r = Math.round(A.r + (B.r - A.r) * t); const g = Math.round(A.g + (B.g - A.g) * t); const bb = Math.round(A.b + (B.b - A.b) * t); return rgbToHex(r, g, bb); }
function repColor(rep: number) { const r = clamp(rep, 0, 100); const stops = [{ p: 0, c: "#0B1020" }, { p: 25, c: "#6B7280" }, { p: 50, c: "#F97316" }, { p: 75, c: "#F59E0B" }, { p: 100, c: "#10B981" }]; for (let i = 0; i < stops.length - 1; i++) { const a = stops[i]; const b = stops[i + 1]; if (r >= a.p && r <= b.p) { return mix(a.c, b.c, (r - a.p) / (b.p - a.p)); } } return stops[stops.length - 1].c; }

const GameScreen = ({ state, availableActions, onAction }: GameScreenProps) => {
  const { lang, setLang } = useI18n();
  const T = useText();
  const DAYS_IN_MONTH = 30;
  const dayInMonth = ((state.day - 1) % DAYS_IN_MONTH) + 1;
  const monthNumber = Math.floor((state.day - 1) / DAYS_IN_MONTH) + 1;
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [studyOpen, setStudyOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [restOpen, setRestOpen] = useState(false);
  const fatigueEnergyMultiplier = getFatigueEnergyMultiplier(state.fatigueStacks);

  const showTooltip = (text: string, rect: DOMRect) => { setTooltip({ text, x: rect.left + rect.width / 2, y: rect.top - 10 }); window.setTimeout(() => setTooltip(null), 3000); };
  const tr = (a: GameAction): GameAction => { const tAction = (T as any).ACTIONS?.[a.id]; return { ...a, label: tAction?.label ?? a.label, description: tAction?.description ?? a.description }; };

  const studyOptions = useMemo(() => availableActions.filter((a) => a.id === "study_1h" || a.id === "study_2h" || a.id === "study_4h").map(tr), [availableActions, T]);
  const socialOptions = useMemo(() => availableActions.filter((a) => a.id.startsWith("socialize_") && a.id !== "socialize").map(tr), [availableActions, T]);
  const restOptions = useMemo(() => {
    const sleepHours = Math.min(8, Math.max(0, state.slotsRemaining));
    return ACTIONS.filter((a) => a.parentId === "rest").map((a) => {
      const tAction = (T as any).ACTIONS?.[a.id];
      if (a.id === "sleep_8h" && tAction?.labelWithHours) return { ...a, label: tAction.labelWithHours(sleepHours), description: tAction.description ?? a.description };
      return { ...a, label: tAction?.label ?? a.label, description: tAction?.description ?? a.description };
    });
  }, [state.slotsRemaining, T]);

  const actionsForGrid = useMemo(() => {
    const base = availableActions.filter((a) => { if (a.hidden || a.parentId) return false; if (isStudyVariant(a.id)) return false; if (isSocializeVariant(a.id)) return false; if (a.id === "rest") return false; return true; });
    const withMenus: GameAction[] = [];
    if (studyOptions.length > 0) withMenus.push({ ...STUDY_MENU, label: T.MODALS.studyTitle, description: T.MODALS.studySubtitle });
    if (socialOptions.length > 0) withMenus.push({ ...SOCIAL_MENU, label: T.MODALS.socialTitle, description: T.MODALS.socialSubtitle });
    if (restOptions.length > 0) withMenus.push({ ...REST_MENU, label: T.MODALS.restTitle, description: T.MODALS.restSubtitle });
    return [...withMenus, ...base.map(tr)];
  }, [availableActions, socialOptions.length, restOptions.length, studyOptions.length, T]);

  const handleActionClick = (id: string) => { if (id === STUDY_MENU.id) return setStudyOpen(true); if (id === SOCIAL_MENU.id) return setSocialOpen(true); if (id === REST_MENU.id) return setRestOpen(true); onAction(id); };
  const unlockedAchievements = useMemo(() => !state.milestones?.length ? [] : MILESTONES.filter((m) => state.milestones.includes(m.id)), [state.milestones]);
  const rep = clamp(state.reputation, 0, 100);
  const medalBase = repColor(rep); const medalHighlight = repColor(clamp(rep + 18, 0, 100));
  const medalStyle: CSSProperties = { backgroundImage: `linear-gradient(135deg, ${medalHighlight}, ${medalBase})`, boxShadow: `0 0 18px ${medalBase}55` };

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row">
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6 space-y-6 bg-white/5 backdrop-blur">
        <div className="space-y-1">
          <h2 className="font-serif text-lg text-primary text-glow-primary">{T.GAME.title}</h2>
          <p className="text-xs text-muted-foreground">{T.UI.day} {dayInMonth}/{DAYS_IN_MONTH} · {T.TIME[state.timeOfDay]}</p>
          <p className="text-xs text-muted-foreground">{state.jobTitle}</p>
          <p className="text-[11px] text-muted-foreground/70">{T.UI.month} {monthNumber}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground/70">{T.UI.language}:</span>
            <select value={lang} onChange={(e) => setLang(e.target.value as any)} className="text-[11px] rounded-md border border-white/10 bg-black/30 px-2 py-1 text-white/80 hover:bg-black/40"><option value="en">EN</option><option value="es">ES</option><option value="ja">JA</option></select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <TimeClock slotsRemaining={state.slotsRemaining} slotsPerDay={state.slotsPerDay} timeOfDay={state.timeOfDay} />
          {(state.fatigueStacks > 0 || state.energyDebt > 0) && (
            <div className="flex flex-col items-center gap-1">
              {state.fatigueStacks > 0 && <div style={burnoutFireStyle(state.fatigueStacks)} title={`Burnout ${state.fatigueStacks}`}>🔥</div>}
              {state.energyDebt > 0 && <div className="rounded-full border border-red-300/30 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-100" title={`Tomorrow energy penalty: -${state.energyDebt}`}>🔥⚡-{state.energyDebt}</div>}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <StatBar label={T.STATS.money} value={state.money} max={300} colorClass="bg-stat-money" icon="💰" />
          <div className="space-y-1">
            <StatBar label={T.STATS.energy} value={state.energy} max={100} colorClass="bg-stat-energy" icon="⚡" />
            {state.energyDebt > 0 && <div className="h-2 w-full rounded-full bg-transparent overflow-hidden"><div className="h-full rounded-full bg-red-500/35" style={{ width: `${Math.min(state.energyDebt, 100)}%` }} title={`Tomorrow wake-up penalty: -${state.energyDebt} energy`} /></div>}
          </div>
          <StatBar label={T.STATS.happiness} value={state.happiness} max={100} colorClass="bg-stat-happiness" icon="😊" />
          <StatBar label={T.STATS.skills} value={state.skills} max={100} colorClass="bg-stat-skills" icon="📈" />
        </div>

        <div className="space-y-2"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-sm font-extrabold text-black" style={medalStyle} title={T.STATS.reputationTitle}>{rep}</div><div className="min-w-0"><div className="text-xs text-muted-foreground">{T.STATS.reputation}</div><div className="h-2 w-40 max-w-full rounded-full bg-white/10 overflow-hidden mt-1"><div className="h-full" style={{ width: `${rep}%`, backgroundImage: `linear-gradient(90deg, ${medalBase}, ${medalHighlight})` }} /></div></div></div></div>

        {unlockedAchievements.length > 0 && <div className="space-y-2"><p className="text-xs text-muted-foreground uppercase tracking-wider">{T.UI.achievements}</p><div className="flex flex-wrap gap-1">{unlockedAchievements.map((m) => <span key={m.id} className="text-xs px-2 py-1 rounded bg-white/10" title={m.label}>{(T as any).MILESTONES?.[m.id] ?? m.label}</span>)}</div></div>}
        <div className="text-xs text-muted-foreground">{T.UI.energyLimitPrefix} <span className="text-foreground">{T.UI.energy}</span>.</div>
      </aside>

      <div className="flex-1 min-h-0 lg:h-screen flex flex-col">
        <main className="flex-1 min-h-0 p-4 lg:p-6"><div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden"><GameLog entries={state.log} /></div></main>
        <section className="border-t border-border p-4 lg:p-6 bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between mb-3"><p className="text-xs text-muted-foreground uppercase tracking-wider">{T.UI.actions}</p></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {actionsForGrid.map((action) => {
              const effectiveEnergyCost = Math.ceil(Math.max(0, action.energyCost) * fatigueEnergyMultiplier);
              const willCauseBurnout = effectiveEnergyCost > state.energy && effectiveEnergyCost > 0;
              return <ActionButton key={action.id} action={action} effectiveEnergyCost={effectiveEnergyCost} disabled={false} lowEnergy={willCauseBurnout} willCauseBurnout={willCauseBurnout} onClick={() => handleActionClick(action.id)} onHover={(text, rect) => showTooltip(text, rect)} />;
            })}
          </div>
        </section>
      </div>

      {tooltip && <div className="fixed z-50 pointer-events-none" style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}><div className="max-w-xs whitespace-pre-line rounded-xl border border-white/10 bg-black/80 backdrop-blur-md px-4 py-2 text-xs text-white shadow-lg">{tooltip.text}</div></div>}

      {studyOpen && <SimpleModal title={T.MODALS.studyTitle} subtitle={T.MODALS.studySubtitle} options={studyOptions} fatigueEnergyMultiplier={fatigueEnergyMultiplier} currentEnergy={state.energy} onClose={() => setStudyOpen(false)} onPick={(id) => { onAction(id); setStudyOpen(false); }} />}
      {socialOpen && <SimpleModal title={T.MODALS.socialTitle} subtitle={T.MODALS.socialSubtitle} options={socialOptions} fatigueEnergyMultiplier={fatigueEnergyMultiplier} currentEnergy={state.energy} onClose={() => setSocialOpen(false)} onPick={(id) => { onAction(id); setSocialOpen(false); }} />}
      {restOpen && <SimpleModal title={T.MODALS.restTitle} subtitle={T.MODALS.restSubtitle} options={restOptions} fatigueEnergyMultiplier={fatigueEnergyMultiplier} currentEnergy={state.energy} onClose={() => setRestOpen(false)} onPick={(id) => { onAction(id); setRestOpen(false); }} />}
    </div>
  );
};

export default GameScreen;
