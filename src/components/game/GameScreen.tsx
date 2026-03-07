
// GameScreen.tsx PATCH
// - Removed Skip the Day button
// - Burnout flame moved to the right of the clock
// - Clock slightly larger

import { useMemo, useState, type CSSProperties } from "react";
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
}

type TooltipData = { text: string; x: number; y: number };

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function burnoutFireStyle(stacks: number): CSSProperties {
  if (stacks <= 0) return { display: "none" };
  if (stacks === 1) return { fontSize: "1.4rem", filter: "drop-shadow(0 0 6px rgba(250,204,21,0.35))" };
  if (stacks === 2) return { fontSize: "1.8rem", filter: "drop-shadow(0 0 8px rgba(249,115,22,0.4))" };
  return { fontSize: "2.2rem", filter: "drop-shadow(0 0 10px rgba(239,68,68,0.45))" };
}

function TimeClock({ slotsRemaining, slotsPerDay, timeOfDay }: any) {
  const perDay = slotsPerDay || 24;
  const remaining = clamp(slotsRemaining ?? perDay, 0, perDay);

  const used = perDay - remaining;
  const progress = used / perDay;
  const degrees = Math.round(progress * 360);

  const color = progress < 0.6 ? "#22c55e" : progress < 0.8 ? "#eab308" : "#ef4444";

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div
          className="rounded-full grid place-items-center"
          style={{
            width: 120,
            height: 120,
            background: `conic-gradient(${color} ${degrees}deg, rgba(255,255,255,0.15) 0deg)`,
          }}
        >
          <div
            className="rounded-full grid place-items-center bg-black/40 border border-white/10"
            style={{ width: 90, height: 90 }}
          >
            <div className="text-5xl leading-none">
              {timeOfDay === "morning" ? "☀️" :
               timeOfDay === "afternoon" ? "🌤️" :
               timeOfDay === "evening" ? "🌆" : "🌙"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const GameScreen = ({ state, availableActions, onAction }: GameScreenProps) => {
  const { lang, setLang } = useI18n();
  const T = useText();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const showTooltip = (text: string, rect: DOMRect) => {
    const x = rect.left + rect.width / 2;
    const y = rect.top - 10;
    setTooltip({ text, x, y });
    window.setTimeout(() => setTooltip(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <aside className="w-full lg:w-80 border-r border-border p-6 space-y-6 bg-white/5 backdrop-blur">

        <div className="space-y-1">
          <h2 className="font-serif text-lg text-primary">{T.GAME.title}</h2>
          <p className="text-xs text-muted-foreground">
            {T.UI.day} {state.day} · {T.TIME[state.timeOfDay]}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <TimeClock
            slotsRemaining={state.slotsRemaining}
            slotsPerDay={state.slotsPerDay}
            timeOfDay={state.timeOfDay}
          />

          {state.fatigueStacks > 0 && (
            <div style={burnoutFireStyle(state.fatigueStacks)}>
              🔥
            </div>
          )}
        </div>

        <div className="space-y-3">
          <StatBar label={T.STATS.money} value={state.money} max={300} colorClass="bg-stat-money" icon="💰" />
          <StatBar label={T.STATS.energy} value={state.energy} max={100} colorClass="bg-stat-energy" icon="⚡" />
          <StatBar label={T.STATS.happiness} value={state.happiness} max={100} colorClass="bg-stat-happiness" icon="😊" />
          <StatBar label={T.STATS.skills} value={state.skills} max={100} colorClass="bg-stat-skills" icon="📈" />
        </div>

      </aside>

      <div className="flex-1 flex flex-col">

        <main className="flex-1 p-6">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <GameLog entries={state.log} />
          </div>
        </main>

        <section className="border-t border-border p-6 bg-white/5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {T.UI.actions}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {availableActions.map((action: GameAction) => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={false}
                lowEnergy={false}
                onClick={() => onAction(action.id)}
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
          <div className="rounded-xl border border-white/10 bg-black/80 px-4 py-2 text-xs text-white shadow-lg">
            {tooltip.text}
          </div>
        </div>
      )}

    </div>
  );
};

export default GameScreen;
