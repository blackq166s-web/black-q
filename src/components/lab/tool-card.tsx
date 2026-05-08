import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  status: "wip" | "live";
  name: string;
  nameCn: string;
  description: string;
  features: string[];
  note?: string;
}

export function ToolCard({
  icon: Icon,
  status,
  name,
  nameCn,
  description,
  features,
  note,
}: ToolCardProps) {
  return (
    <div
      className={cn(
        "relative",
        "bg-[#1A1A1A]",
        "border border-[#2E2E2E]",
        "rounded-xl",
        "p-6 md:p-7",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06),0_4px_12px_-2px_rgba(0,0,0,0.6),0_2px_4px_-1px_rgba(0,0,0,0.4)]",
        "hover:bg-[#1F1F1F] hover:border-[#3A3A3A] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_8px_20px_-4px_rgba(0,0,0,0.7),0_4px_8px_-2px_rgba(0,0,0,0.5)]",
        "transition-colors",
      )}
    >
      {/* 状态徽章 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 text-[var(--color-accent)]" strokeWidth={2} />
          <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-muted)]">
            {status === "wip" ? "Work in Progress" : "Live"}
          </span>
        </div>
        <span
          className={cn(
            "font-mono text-[10px] px-2 py-1 rounded uppercase tracking-wider",
            status === "wip"
              ? "bg-[#262626] text-[var(--color-muted)] border border-[#363636]"
              : "bg-[var(--color-accent)] text-white",
          )}
        >
          {status === "wip" ? "WIP" : "LIVE"}
        </span>
      </div>

      {/* 标题 */}
      <h3 className="text-2xl md:text-3xl font-bold mb-1 text-[var(--color-fg)] leading-tight">
        {name}
      </h3>
      <p className="text-base md:text-lg text-[var(--color-muted)] mb-5">{nameCn}</p>

      {/* 描述(确保不溢出) */}
      <p className="text-[15px] md:text-base text-[var(--color-fg)] leading-relaxed mb-5 break-words">
        {description}
      </p>

      {/* 特性标签 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {features.map((f) => (
          <span
            key={f}
            className="font-mono text-[11px] px-2.5 py-1 rounded border border-[#2E2E2E] bg-[#0F0F0F] text-[var(--color-muted)]"
          >
            {f}
          </span>
        ))}
      </div>

      {/* 备注 */}
      {note && (
        <div className="mt-4 pt-4 border-t border-[#2E2E2E]">
          <p className="text-xs text-[var(--color-muted)] italic leading-relaxed">{note}</p>
        </div>
      )}

      {/* 状态指示 */}
      <div className="mt-6 pt-5 border-t border-[#2E2E2E] flex items-center gap-2 font-mono text-xs text-[var(--color-muted)]">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-muted)] animate-pulse" />
        <span>{status === "wip" ? "打磨中,敬请期待" : "已上线"}</span>
      </div>
    </div>
  );
}
