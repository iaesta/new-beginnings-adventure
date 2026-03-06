import { useEffect, useMemo, useRef } from "react";
import type { LogEntry } from "@/game/types";
import { useText } from "@/game/i18n";

function applyTokens(T: any, s: string) {
  return s.replace(/\{TIME:([a-z]+)\}/g, (_, k) => String(T.TIME?.[k] ?? k));
}

function renderEntry(T: any, entry: LogEntry) {
  if (entry.key === "log.action.performed") {
    const p: any = entry.params ?? {};
    const icon = p.icon ?? "";
    const actionId = p.actionId ?? "";
    const hours = Number(p.hours ?? 0);
    const def = T.ACTIONS?.[actionId];

    let label =
      def?.label ??
      actionId;

    if (actionId === "sleep_8h" && def?.labelWithHours) {
      label = def.labelWithHours(hours);
    }

    return `${icon} ${label} (⏱️ ${hours}h)`;
  }

  if (entry.key === "log.narrative") {
    const p: any = entry.params ?? {};
    const group = p.group ?? "work";
    const index = Number(p.index ?? 0);
    const arr = T.NARRATIVES?.[group] ?? [];
    return arr[index] ?? entry.text ?? "";
  }

  if (entry.key === "log.event.byId") {
    const p: any = entry.params ?? {};
    return T.EVENTS?.[p.eventId] ?? p.fallback ?? "";
  }

  if (entry.key === "log.achievement.unlocked") {
    const p: any = entry.params ?? {};
    const label = T.MILESTONES?.[p.id] ?? p.label ?? p.id;
    const template = T.LOG?.["log.achievement.unlocked"];
    if (typeof template === "function") return template({ label });
    return `Achievement unlocked: ${label}`;
  }

  const template = entry.key ? T.LOG?.[entry.key] : null;
  if (template) {
    const text = typeof template === "function" ? template(entry.params ?? {}) : template;
    return applyTokens(T, text);
  }

  return applyTokens(T, entry.text ?? "");
}

const typeStyles: Record<LogEntry["type"], string> = {
  narrative: "text-foreground italic font-serif",
  action: "text-secondary-foreground",
  event: "text-primary text-glow-primary",
  milestone: "text-accent font-medium",
};

const GameLog = ({ entries }: { entries: LogEntry[] }) => {
  const T = useText();
  const bottomRef = useRef<HTMLDivElement>(null);

  const rendered = useMemo(
    () => entries.map((entry) => ({ ...entry, rendered: renderEntry(T as any, entry) })),
    [entries, T]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [rendered.length]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
      {rendered.map((entry, i) => (
        <p
          key={entry.id}
          className={`text-sm leading-relaxed animate-fade-in ${typeStyles[entry.type]}`}
          style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
        >
          {entry.rendered}
        </p>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default GameLog;