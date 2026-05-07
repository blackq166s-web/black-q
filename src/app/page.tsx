import { ArrowUpRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="px-6 md:px-12 pt-8 flex items-center justify-between">
        <div className="font-mono text-sm tracking-tight">
          <span className="text-[var(--color-fg)]">Black</span>
          <span className="text-[var(--color-accent)]">Q</span>
          <span className="text-[var(--color-muted)]">.com</span>
        </div>
        <div className="font-mono text-xs text-[var(--color-muted)]">
          v0.1 · building in public
        </div>
      </header>

      <section className="flex-1 flex flex-col justify-center px-6 md:px-12 max-w-5xl">
        <p className="font-mono text-xs text-[var(--color-accent)] mb-6 tracking-widest uppercase">
          ◆ Mission
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8">
          Bring AI<br />
          to <span className="text-[var(--color-muted)]">every</span>one.
        </h1>

        <p className="text-xl md:text-2xl text-[var(--color-fg)] max-w-2xl leading-relaxed mb-4">
          让 AI 走进每个人的生活。
        </p>

        <p className="text-base md:text-lg text-[var(--color-muted)] max-w-2xl leading-relaxed">
          我是 BlackQ，一名 AI 工程师。<br />
          白天我把复杂的 AI 系统交付给企业，<br />
          晚上我把它翻译成普通人也能用的工具。<br />
          <span className="text-[var(--color-fg)]">包括你爸妈，也包括你。</span>
        </p>

        <div className="mt-12 flex items-center gap-2 font-mono text-sm text-[var(--color-muted)]">
          <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          full site launching soon
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </section>

      <footer className="px-6 md:px-12 pb-8 pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between gap-4 font-mono text-xs text-[var(--color-muted)]">
        <div>© 2026 BlackQ · Changsha, China</div>
        <div className="flex gap-6">
          <a href="https://github.com/BlackQ" target="_blank" rel="noreferrer" className="hover:text-[var(--color-fg)] transition-colors">
            GitHub
          </a>
          <a href="mailto:hi@black-q.com" className="hover:text-[var(--color-fg)] transition-colors">
            Email
          </a>
        </div>
      </footer>
    </main>
  );
}
