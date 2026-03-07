import { useEffect, useMemo, useRef } from "react";
import type { LogEntry } from "@/game/types";
import { useText } from "@/game/i18n";

function fmt(template: any, params?: Record<string, any>) {
  if (typeof template === "function") return template(params ?? {});
  if (typeof template === "string") {
    const p = params ?? {};
    return template.replace(/\{(\w+)\}/g, (_, k) => String(p[k] ?? ""));
  }
  return "";
}

function renderEntry(T: any, e: LogEntry) {
  if (e.key === "log.action.performed") {
    const p: any = e.params ?? {};
    const label = T.ACTIONS?.[p.actionId]?.label ?? p.actionId ?? "Action";
    return `${p.icon ?? ""} ${label} (⏱️ ${p.hours ?? ""}h)`;
  }
  if (e.key === "log.event.byId") {
    const p: any = e.params ?? {};
    return T.EVENTS?.[p.eventId] ?? p.fallback ?? "";
  }
  if (e.key === "log.narrative") {
    const p: any = e.params ?? {};
    return (T.NARRATIVES?.[p.group ?? "work"] ?? [])[Number(p.index ?? 0)] ?? e.text ?? "";
  }
  if (e.key === "log.achievement.unlocked") {
    const p: any = e.params ?? {};
    return fmt(T.LOG?.[e.key], { label: T.MILESTONES?.[p.id] ?? p.label ?? "" });
  }
  return fmt(T.LOG?.[e.key], e.params) || e.text || e.key || "";
}

export default function GameLog({ entries }: { entries: LogEntry[] }) {
  const T = useText();
  const rendered = useMemo(() => entries.map((e) => ({ ...e, rendered: renderEntry(T as any, e) })), [entries, T]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [rendered.length]);
  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      {rendered.map((e) => <div key={e.id} className="text-sm text-white/90 leading-relaxed">{e.rendered}</div>)}
      <div ref={bottomRef} />
    </div>
  );
}
