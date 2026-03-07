import type { GameAction } from "@/game/types";
import { useText } from "@/game/i18n";

interface ActionButtonProps {
  action: GameAction;
  disabled: boolean;
  lowEnergy: boolean;
  effectiveEnergyCost?: number;
  willCauseBurnout?: boolean;
  onClick: () => void;
  onHover: (text: string, rect: DOMRect) => void;
}

const ActionButton = ({
  action,
  disabled,
  lowEnergy,
  effectiveEnergyCost,
  willCauseBurnout,
  onClick,
  onHover,
}: ActionButtonProps) => {
  const T = useText();
  const tAction = (T as any).ACTIONS?.[action.id];
  const label = tAction?.label ?? action.label;
  const description = tAction?.description ?? action.description;
  const shownEnergyCost = effectiveEnergyCost ?? action.energyCost;
  const hoverText = willCauseBurnout
    ? `${description}\n\n⚠ Burnout risk`
    : description;

  return (
    <button
      onClick={onClick}
      onMouseEnter={(e) => onHover(hoverText, e.currentTarget.getBoundingClientRect())}
      disabled={disabled}
      className={`group relative w-full text-left rounded-2xl border p-4
                  transition-all duration-200 backdrop-blur-sm
                  shadow-[0_4px_20px_rgba(0,0,0,0.25)]
                  ${
                    disabled
                      ? "border-white/10 bg-black/30 opacity-40 cursor-not-allowed"
                      : willCauseBurnout
                      ? "border-red-400/30 bg-black/40 hover:bg-black/50 hover:border-red-300/50 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(120,0,0,0.35)]"
                      : "border-white/10 bg-black/40 hover:bg-black/50 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
                  }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl leading-none">{action.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{label}</div>
          {willCauseBurnout && (
            <div className="mt-1 text-[11px] font-medium text-red-200/90">
              ⚠ Burnout risk
            </div>
          )}
        </div>

        {shownEnergyCost > 0 && (
          <span
            className={`shrink-0 inline-flex items-center gap-1
                       rounded-full px-3 py-1 text-xs font-semibold
                       border ${
                         willCauseBurnout || shownEnergyCost > action.energyCost
                           ? "bg-red-500/15 border-red-300/30 text-red-100"
                           : "bg-black/25 border-cyan-300/25 text-white"
                       }`}
          >
            ⚡ {shownEnergyCost}
          </span>
        )}
      </div>
    </button>
  );
};

export default ActionButton;
