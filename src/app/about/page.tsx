import { Settings, FlaskConical, PenLine } from "lucide-react";
import { Section } from "@/components/about/section";
import { WorkCard } from "@/components/about/work-card";
import { ogImageUrl } from "@/lib/og";

export const metadata = {
  title: "关于我",
  description:
    "我是 BlackQ,一名常驻长沙的 AI 工程师。让 AI 走进每个人的生活——这是从我奶奶开始的承诺。",
  openGraph: {
    title: "关于我 · BlackQ",
    description: "让 AI 走进每个人的生活——这是从我奶奶开始的承诺。",
    images: [
      ogImageUrl({ title: "我是 BlackQ", subtitle: "AI 工程师 · 让 AI 走进每个人的生活" }),
    ],
  },
};

export default function AboutPage() {
  return (
    <main className="pt-8 md:pt-16">
      {/* 屏 1: 起点 */}
      <Section label="Origin">
        <h1 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-12 text-[var(--color-fg)]">
          我做这一切,
          <br />
          是因为我的奶奶。
        </h1>

        <div className="space-y-6 text-[17px] md:text-lg leading-[1.8] text-[var(--color-fg)]">
          <p>
            去年的一个下午,我看着她对着手机问 AI:
            <br />
            <span className="text-[var(--color-muted)] italic">
              "我最近膝盖疼,是不是要紧?"
            </span>
          </p>
          <p>她得到了答案。耐心、清楚、不催她、不让她等。</p>
          <p className="text-[var(--color-muted)]">
            那一刻我意识到 ——
            <br />
            她不再需要守在电视机前等健康节目,
            <br />
            不再需要打电话麻烦子女,
            <br />
            不再需要在医院排两小时的队。
          </p>
          <p>AI 真的可以让一个普通人的生活更轻松。</p>
          <p className="text-[var(--color-accent)] font-medium">但前提是:她得用得上。</p>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border)]">
          <p className="text-base md:text-lg text-[var(--color-fg)] leading-relaxed">
            「让 AI 走进每个人的生活」
            <br />
            <span className="text-[var(--color-muted)]">
              不是一句口号。是从我奶奶开始的承诺。
            </span>
          </p>
        </div>
      </Section>

      {/* 屏 2: 我是谁 */}
      <Section label="Who">
        <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-4 text-[var(--color-fg)]">
          我是 BlackQ。
        </h2>
        <p className="text-lg md:text-xl text-[var(--color-muted)] mb-12">
          一名 AI 工程师。
        </p>

        <div className="space-y-4 text-[17px] md:text-lg leading-[1.8] mb-16">
          <p>白天,我把复杂的 AI 系统交付给企业。</p>
          <p>晚上,我把它翻译成普通人能用的工具。</p>
        </div>

        <div className="border-t border-[var(--color-border)] pt-12">
          <p className="font-mono text-xs text-[var(--color-muted)] tracking-widest uppercase mb-8">
            我相信三件事
          </p>

          <div className="space-y-10">
            {[
              {
                num: "①",
                title: "AI 不该只属于工程师。",
                body: "谁都该用得上,包括我们的爸妈,包括小孩。",
              },
              {
                num: "②",
                title: "好的工具不需要说明书。",
                body: `如果一个 AI 工具需要"先学会怎么用",那它就还不够好。`,
              },
              {
                num: "③",
                title: "普惠不是慈善,是工程问题。",
                body: "让一亿人能用,比让一个人惊艳,更难,也更值得。",
              },
            ].map((belief) => (
              <div key={belief.num} className="flex gap-4 md:gap-6">
                <span className="font-mono text-2xl text-[var(--color-accent)] leading-none pt-1 shrink-0">
                  {belief.num}
                </span>
                <div>
                  <p className="text-lg md:text-xl font-semibold text-[var(--color-fg)] mb-2 leading-snug">
                    {belief.title}
                  </p>
                  <p className="text-[15px] md:text-base text-[var(--color-muted)] leading-relaxed">
                    {belief.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* 屏 3: 我在做的事 */}
      <Section label="What">
        <h2 className="text-3xl md:text-5xl font-bold leading-[1.15] tracking-tight mb-4 text-[var(--color-fg)]">
          我同时做着三件事,
        </h2>
        <p className="text-lg md:text-xl text-[var(--color-muted)] mb-12">
          它们都为同一个目标服务。
        </p>

        <div className="space-y-4">
          <WorkCard
            icon={Settings}
            category="Engineering"
            title="在企业把 AI 落到地上"
            description="我现在在一家上市公司做 AI 工程化交付,让企业级 AI 真正能用、能跑、能值回票价。"
            links={[{ href: "/projects", label: "/projects" }]}
          />
          <WorkCard
            icon={FlaskConical}
            category="AI Lab"
            title="做普通人能用的 AI 工具"
            description={`Trip Planner 是第一个,之后还会有给爸妈的"文档秒读"和给孩子的"故事生成器"。`}
            links={[{ href: "/lab", label: "/lab" }]}
          />
          <WorkCard
            icon={PenLine}
            category="Writing & Visual"
            title="把我看到的翻译给你"
            description="写技术文章、写普惠教程、拍人像和风光、做 Vlog。代码和影像,在我看来是同一种创造力。"
            links={[
              { href: "/writing", label: "/writing" },
              { href: "/photos", label: "/photos" },
            ]}
          />
        </div>
      </Section>

      {/* 屏 4: 此刻（微调版） */}
      <Section label="Now">
        <p className="text-lg md:text-xl leading-[1.8] text-[var(--color-fg)] mb-20">
          写代码、拍照、健身、
          <br />
          偶尔写点什么、偶尔做点什么。
        </p>

        <p className="text-base md:text-lg leading-[1.8] text-[var(--color-muted)] mb-8">
          十年后回头看,
          <br />
          我希望我能说一句:
        </p>

        <p className="text-2xl md:text-3xl leading-[1.4] text-[var(--color-fg)] font-medium mb-24">
          我努力了,
          <br />
          <span className="text-[var(--color-accent)]">我没有错过这个时代。</span>
        </p>

        <div className="border-t border-[var(--color-border)] pt-10">
          <ul className="space-y-3 font-mono text-sm">
            <li>
              <a
                href="mailto:hi@black-q.com"
                className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:gap-3 transition-all"
              >
                → hi@black-q.com
              </a>
            </li>
            <li>
              <a
                href="https://github.com/BlackQ"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:gap-3 transition-all"
              >
                → github.com/BlackQ
              </a>
            </li>
            <li>
              <a
                href="/now"
                className="inline-flex items-center gap-2 text-[var(--color-accent)] hover:gap-3 transition-all"
              >
                → /now
              </a>
            </li>
          </ul>
        </div>
      </Section>
    </main>
  );
}
