import { useEffect, useMemo, useRef } from "react";
import type { LogEntry } from "@/game/types";
import { useText } from "@/game/i18n";

function formatTemplate(template: any, params?: Record<string, any>) {
  if (typeof template === "function") return template(params ?? {});
  if (typeof template === "string") {
    const p = params ?? {};
    return template.replace(/\{(\w+)\}/g, (_, k) => String(p[k] ?? ""));
  }
  return "";
}

function applyTokens(T: any, s: string) {
  return s
    .replace(/\{TIME:([a-z]+)\}/g, (_, k) => String(T.TIME?.[k] ?? k))
    .replace(/\{ACTION:([^:}]+):([^}]+)\}/g, (_, id, fallback) =>
      String(T.ACTIONS?.[id]?.label ?? fallback)
    );
}

function renderEntry(T: any, e: LogEntry) {
  if (e.key === "log.action.performed") {
    const p: any = e.params ?? {};
    const icon = p.icon ?? "";
    const actionId = p.actionId ?? "";
    const fallback = actionId || "Action";
    const label = T.ACTIONS?.[actionId]?.label ?? fallback;
    const hours = p.hours ?? "";
    return applyTokens(T, `${icon} ${label} (⏱️ ${hours}h)`);
  }

  const template = T.LOG?.[e.key];
  if (template) {
    const raw = formatTemplate(template, e.params);
    return applyTokens(T, raw);
  }

  return applyTokens(T, e.text ?? e.key);
}

export default function GameLog({ entries }: { entries: LogEntry[] }) {
  const T = useText();

  const rendered = useMemo(() => {
    return entries.map((e) => ({ ...e, rendered: renderEntry(T as any, e) }));
  }, [entries, T]);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [rendered.length]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-2">
      {rendered.map((e) => (
        <div key={e.id} className="text-sm text-white/90 leading-relaxed">
          {e.rendered}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
