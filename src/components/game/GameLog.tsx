import { useEffect, useRef } from 'react';
import { LogEntry } from '@/game/types';

interface GameLogProps {
  entries: LogEntry[];
}

const typeStyles: Record<LogEntry['type'], string> = {
  narrative: 'text-foreground italic font-serif',
  action: 'text-secondary-foreground',
  event: 'text-primary text-glow-primary',
  milestone: 'text-accent font-medium',
};

const GameLog = ({ entries }: GameLogProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
      {entries.map((entry, i) => (
        <p
          key={entry.id}
          className={`text-sm leading-relaxed animate-fade-in ${typeStyles[entry.type]}`}
          style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
        >
          {entry.text}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default GameLog;
