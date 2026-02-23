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
      className={`group relative w-full text-left rounded-2xl border p-4
                  transition-all duration-200 backdrop-blur-sm
                  shadow-[0_4px_20px_rgba(0,0,0,0.25)]
    ${isDisabled
                  ? "border-white/10 bg-black/30 opacity-40 cursor-not-allowed"
                  : "border-white/10 bg-black/40 hover:bg-black/50 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
  }
`}
    >
   <div className="flex items-center gap-3">
  <span className="text-2xl leading-none">{action.icon}</span>

  {/* Esto permite que el texto se recorte bonito sin romper el layout */}
  <span className="text-sm font-semibold text-foreground truncate flex-1 min-w-0">
      {action.label}
  </span>

       {action.energyCost > 0 && (
    <span
       className="shrink-0 inline-flex items-center gap-1
                  rounded-full px-3 py-1 text-xs font-semibold
                  bg-black/25 backdrop-blur-sm
                  bg-gradient-to-r from-emerald-400/15 to-cyan-400/15
                  border border-cyan-300/25
                  text-white
                  shadow-[0_0_8px_rgba(0,255,200,0.18)]">
      ⚡ {action.energyCost}
    </span>
  )}
</div>
           <div className="pointer-events-none absolute left-4 right-4 top-full mt-2 z-20
                  hidden lg:block
                  translate-y-1 opacity-0
                  group-hover:translate-y-0 group-hover:opacity-100
                  transition-all duration-200"
>
      <div className="rounded-xl border border-white/10
                  bg-black/60 backdrop-blur-md
                  px-3 py-2 text-xs text-white
                  shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
        {action.description}
      </div>
</div>
    </button>
  );
};

export default ActionButton;