interface StatBarProps {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  icon: string;
}

const StatBar = ({ label, value, max, colorClass, icon }: StatBarProps) => {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {icon} {label}
        </span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default StatBar;
