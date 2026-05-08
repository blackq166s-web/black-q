import { Compass, Stethoscope } from "lucide-react";
import { ToolCard } from "@/components/lab/tool-card";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "Lab",
  description:
    "BlackQ 的 AI 搭子系列。Trip Planner 旅游搭子、Health Buddy 健康搭子,把企业级 AI 翻译成普通人能用的工具。",
  openGraph: {
    title: "Lab · BlackQ",
    description: "AI 搭子系列 · 让普通人也能用上 AI",
    images: [ogImageUrl({ title: "AI Lab", subtitle: "AI 搭子系列 · 给爸妈和孩子的 AI 工具" })],
  },
};

export default function LabPage() {
  return (
    <main className="px-6 md:px-12 py-12 md:py-20 max-w-3xl mx-auto">
      {/* Hero */}
      <p className="font-mono text-xs text-[var(--color-accent)] mb-6 tracking-widest uppercase">
        ◆ AI Lab
      </p>

      <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-[var(--color-fg)]">
        AI 搭子系列
      </h1>

      <p className="font-mono text-sm text-[var(--color-muted)] mb-8 tracking-wide">
        Tools that work for everyone.
      </p>

      <div className="space-y-4 text-[17px] md:text-lg leading-[1.8] text-[var(--color-fg)] mb-12">
        <p>这里是我做 AI 工具的地方。</p>
        <p className="text-[var(--color-muted)]">
          每个工具都叫"搭子"——
          <br />
          因为我希望它们像朋友一样陪着你,
          <br />
          而不是替你做决定。
        </p>
      </div>

      {/* Status bar */}
      <div className="border-t border-b border-[var(--color-border)] py-3 mb-10">
        <p className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-muted)]">
          Status · 0 Live · 2 In Progress
        </p>
      </div>

      {/* Tool Cards */}
      <div className="space-y-5">
        <ToolCard
          icon={Compass}
          status="wip"
          name="Trip Planner"
          nameCn="旅游搭子"
          description="输入目的地和偏好,得到一份能直接执行的行程。每天去哪、怎么走、吃什么、住哪,一次说清。"
          features={["适老模式", "带娃模式", "预算管理", "避坑提示"]}
        />

        <ToolCard
          icon={Stethoscope}
          status="wip"
          name="Health Buddy"
          nameCn="健康搭子"
          description="把医学语言翻译成爸妈能懂的话。健康知识科普、用药基本信息、就医提醒。"
          features={["适老模式", "语音播放", "用药信息", "就医提醒"]}
          note="不做诊断,不开处方,不替代医生。具体病情请咨询专业医生。"
        />
      </div>

      {/* Footer CTA */}
      <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
        <p className="text-base text-[var(--color-muted)] mb-4 leading-relaxed">
          有想看的工具?
          <br />
          告诉我你的需求 ——
        </p>
        <a
          href="mailto:hi@black-q.com?subject=Lab 工具建议"
          className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-accent)] hover:gap-3 transition-all"
        >
          → hi@black-q.com
        </a>
      </div>
    </main>
  );
}
