import { GameAction } from '@/game/types';

interface ActionButtonProps {
  action: GameAction;
  disabled: boolean;
  lowEnergy: boolean;
  onClick: () => void;
}

const ActionButton = ({ action, disabled, lowEnergy, onClick }: ActionButtonProps) => {
  const isDisabled = disabled || (lowEnergy && action.energyCost > 0);

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        group relative w-full text-left p-3 rounded-md border transition-all duration-200
        ${isDisabled
          ? 'border-border bg-muted/50 opacity-40 cursor-not-allowed'
          : 'border-border bg-secondary/50 hover:border-primary/50 hover:bg-secondary cursor-pointer'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{action.icon}</span>
        <span className="text-sm font-medium text-foreground">{action.label}</span>
        {action.energyCost > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            ⚡{action.energyCost}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground pl-7">
        {action.description}
      </p>
    </button>
  );
};

export default ActionButton;