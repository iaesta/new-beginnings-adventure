type SalaryBubbleProps = {
  workedDays: number;
  requiredDays?: number;
  periodLength?: number;
  baseSalary?: number;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function estimateSalary(baseSalary: number, requiredDays: number, workedDays: number) {
  if (workedDays <= 0) return 0;
  if (workedDays <= requiredDays) {
    return Math.round(baseSalary * (workedDays / requiredDays));
  }
  return Math.round(baseSalary * (1 + (workedDays - requiredDays) * 0.05));
}

export default function SalaryBubble({
  workedDays,
  requiredDays = 11,
  periodLength = 15,
  baseSalary = 200,
}: SalaryBubbleProps) {
  const size = 112;
  const stroke = 10;
  const bonusStroke = 7;
  const radius = (size - stroke) / 2;
  const bonusRadius = radius - 12;
  const circumference = 2 * Math.PI * radius;
  const bonusCircumference = 2 * Math.PI * bonusRadius;

  const baseProgress = clamp01(workedDays / requiredDays);
  const extraMax = Math.max(periodLength - requiredDays, 1);
  const bonusProgress = clamp01(Math.max(0, workedDays - requiredDays) / extraMax);

  const baseOffset = circumference * (1 - baseProgress);
  const bonusOffset = bonusCircumference * (1 - bonusProgress);
  const salary = estimateSalary(baseSalary, requiredDays, workedDays);

  return (
    <div className="absolute right-4 top-4 z-20 rounded-2xl border border-white/10 bg-black/35 backdrop-blur-md p-2 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id="salaryBonusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.10)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={baseOffset}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={bonusRadius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={bonusStroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={bonusRadius}
            fill="none"
            stroke="url(#salaryBonusGradient)"
            strokeWidth={bonusStroke}
            strokeLinecap="round"
            strokeDasharray={bonusCircumference}
            strokeDashoffset={bonusOffset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="text-[11px] uppercase tracking-wider text-white/70">Salary</div>
          <div className="text-lg font-bold text-white">${salary}</div>
          <div className="text-[10px] text-white/60">
            {workedDays}/{requiredDays}
          </div>
        </div>
      </div>
    </div>
  );
}
