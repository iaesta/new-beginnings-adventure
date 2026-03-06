import { useText } from "@/game/i18n";
import { GameState } from '@/game/types';
import { MILESTONES } from '@/game/data';

interface EndingScreenProps {
  state: GameState;
  onRestart: () => void;
}

const EndingScreen = ({ state, onRestart }: EndingScreenProps) => {
  const T = useText();
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <h1 className="text-3xl font-serif text-primary text-glow-primary">
          {T.ENDING.title}
        </h1>

        <p className="text-sm text-secondary-foreground font-serif italic leading-relaxed" style={{ whiteSpace: "pre-line" }}>
          {T.ENDING.story}
        </p>

        <div className="space-y-2 text-left bg-card border border-border rounded-md p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
            {T.UI.yourJourney}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Days:</span>
            <span className="text-foreground">{state.day}</span>
            <span className="text-muted-foreground">Savings:</span>
            <span className="text-stat-money">${state.money}</span>
            <span className="text-muted-foreground">Skills:</span>
            <span className="text-stat-skills">{state.skills}</span>
            <span className="text-muted-foreground">Reputation:</span>
            <span className="text-foreground">{state.reputation}</span>
          </div>
        </div>

        <div className="space-y-2 text-left">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {T.UI.milestones} ({state.milestones.length}/{MILESTONES.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {MILESTONES.map(m => (
              <span
                key={m.id}
                className={`text-xs px-2 py-1 rounded border ${
                  state.milestones.includes(m.id)
                    ? 'border-primary/30 text-primary bg-primary/10'
                    : 'border-border text-muted-foreground opacity-40'
                }`}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          className="px-8 py-3 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-wider uppercase"
        >
          {T.ENDING.restart}
        </button>
      </div>
    </div>
  );
};

export default EndingScreen;
