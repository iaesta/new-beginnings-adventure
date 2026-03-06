import type { GameAction } from "@/game/types";
import { useText } from "@/game/i18n";

interface ActionButtonProps {
  action: GameAction;
  disabled: boolean;
  lowEnergy: boolean;
  onClick: () => void;
  onHover: (text: string, rect: DOMRect) => void;
}

const ActionButton = ({ action, disabled, lowEnergy, onClick, onHover }: ActionButtonProps) => {
  const T = useText();
  const tAction = (T as any).ACTIONS?.[action.id];
  const label = tAction?.label ?? action.label;
  const description = tAction?.description ?? action.description;
  const isDisabled = disabled || (lowEnergy && action.energyCost > 0);

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => onHover(description, e.currentTarget.getBoundingClientRect())}
      disabled={isDisabled}
      className={`group relative w-full text-left rounded-2xl border p-4
                  transition-all duration-200 backdrop-blur-sm
                  shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                  ${
                    isDisabled
                      ? "border-white/10 bg-black/30 opacity-40 cursor-not-allowed"
                      : "border-white/10 bg-black/40 hover:bg-black/50 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                  }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{action.icon}</span>
        <span className="text-sm font-semibold text-foreground truncate flex-1 min-w-0">
          {label}
        </span>

        {action.energyCost > 0 && (
          <span
            className="shrink-0 inline-flex items-center gap-1
                       rounded-full px-3 py-1 text-xs font-semibold
                       bg-black/25 backdrop-blur-sm
                       bg-gradient-to-r from-emerald-400/15 to-cyan-400/15
                       border border-cyan-300/25
                       text-white
                       shadow-[0_0_8px_rgba(0,255,200,0.18)]"
          >
            ⚡ {action.energyCost}
          </span>
        )}
      </div>
    </button>
  );
};

export default ActionButton;