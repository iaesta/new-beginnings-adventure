import { GameState, GameAction } from "@/game/types";
import { TIME_LABELS, MILESTONES } from "@/game/data";
import StatBar from "./StatBar";
import GameLog from "./GameLog";
import ActionButton from "./ActionButton";

interface GameScreenProps {
  state: GameState;
  availableActions: GameAction[];
  onAction: (id: string) => void;
  onSkipDay: () => void;
}

const GameScreen = ({ state, availableActions, onAction, onSkipDay }: GameScreenProps) => {
  const unlockedCount = state.milestones.length;

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row">
      {/* LEFT (1/4) — Sidebar */}
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6 space-y-6 bg-white/5 backdrop-blur">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="font-serif text-lg text-primary text-glow-primary">Fresh Start</h2>
          <p className="text-xs text-muted-foreground">
            Day {state.day} · {TIME_LABELS[state.timeOfDay]}
          </p>
          <p className="text-xs text-muted-foreground">{state.jobTitle}</p>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <StatBar label="Money" value={state.money} max={300} colorClass="bg-stat-money" icon="💰" />
          <StatBar label="Energy" value={state.energy} max={100} colorClass="bg-stat-energy" icon="⚡" />
          <StatBar label="Happiness" value={state.happiness} max={100} colorClass="bg-stat-happiness" icon="😊" />
          <StatBar label="Skills" value={state.skills} max={100} colorClass="bg-stat-skills" icon="📈" />
        </div>

        {/* Reputation */}
        <div className="text-xs text-muted-foreground">
          ⭐ Reputation: <span className="text-foreground">{state.reputation}</span>
        </div>

        {/* Milestones */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Milestones {unlockedCount}/{MILESTONES.length}
          </p>
          <div className="flex flex-wrap gap-1">
            {MILESTONES.map((m) => (
              <span
                key={m.id}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  state.milestones.includes(m.id) ? "text-primary" : "text-muted-foreground/30"
                }`}
                title={m.label}
              >
                {m.label.split(" ")[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-muted-foreground">
          Actions are limited by <span className="text-foreground">Energy</span>.
        </div>
      </aside>

      {/* RIGHT (3/4) — Story (top) + Actions (bottom) */}
      <div className="flex-1 min-h-0 lg:h-screen flex flex-col">
        {/* CENTER (2/4) — Story/Log */}
        <main className="flex-1 min-h-0 p-4 lg:p-6">
          <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden">
            <GameLog entries={state.log} />
          </div>
        </main>

        {/* BOTTOM RIGHT (1/4) — Actions */}
        <section className="border-t border-border p-4 lg:p-6 bg-white/5 backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Actions</p>

            <button
              onClick={onSkipDay}
              className="text-xs px-4 py-2 rounded-xl border border-border bg-white/5 hover:bg-white/10 transition-all duration-200"
            >
              Skip to next day →
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {availableActions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={false}
                lowEnergy={state.energy < action.energyCost}
                onClick={() => onAction(action.id)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default GameScreen;