import { GameState, GameAction } from '@/game/types';
import { TIME_LABELS, MILESTONES } from '@/game/data';
import StatBar from './StatBar';
import GameLog from './GameLog';
import ActionButton from './ActionButton';

interface GameScreenProps {
  state: GameState;
  availableActions: GameAction[];
  onAction: (id: string) => void;
  onSkipDay: () => void;
}

const GameScreen = ({ state, availableActions, onAction, onSkipDay }: GameScreenProps) => {
  const unlockedCount = state.milestones.length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6 space-y-6 bg-card/50">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="font-serif text-lg text-primary text-glow-primary">Fresh Start</h2>
          <p className="text-xs text-muted-foreground">
            Day {state.day} · {TIME_LABELS[state.timeOfDay]}
          </p>
          <p className="text-xs text-muted-foreground">
            {state.jobTitle}
          </p>
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
            {MILESTONES.map(m => (
              <span
                key={m.id}
                className={`text-xs px-1.5 py-0.5 rounded ${
                  state.milestones.includes(m.id)
                    ? 'text-primary'
                    : 'text-muted-foreground/30'
                }`}
                title={m.label}
              >
                {m.label.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Actions remaining */}
        <div className="flex items-center gap-1">
          {Array.from({ length: state.maxActions }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border ${
                i < state.actionsToday
                  ? 'bg-primary/60 border-primary/40'
                  : 'bg-secondary border-border'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-2">
            {state.maxActions - state.actionsToday} actions left
          </span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col p-4 lg:p-6 gap-4 min-h-0">
        {/* Log */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <GameLog entries={state.log} />
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {availableActions.map(action => (
              <ActionButton
                key={action.id}
                action={action}
                disabled={state.actionsToday >= state.maxActions}
                lowEnergy={state.energy < action.energyCost}
                onClick={() => onAction(action.id)}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onSkipDay}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1"
            >
              Skip to next day →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameScreen;
