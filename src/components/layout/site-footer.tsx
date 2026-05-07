export function SiteFooter() {
  return (
    <footer className="px-6 md:px-12 pb-8 pt-12 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between gap-4 font-mono text-xs text-[var(--color-muted)]">
      <div>
        <div>© 2026 BlackQ · Changsha, China</div>
        <div className="mt-1">v0.1 · building in public</div>
      </div>
      <div className="flex gap-6">
        <a
          href="https://github.com/BlackQ"
          target="_blank"
          rel="noreferrer"
          className="hover:text-[var(--color-fg)] transition-colors"
        >
          GitHub
        </a>
        <a href="mailto:hi@black-q.com" className="hover:text-[var(--color-fg)] transition-colors">
          Email
        </a>
      </div>
    </footer>
  );
}
