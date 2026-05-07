import Link from "next/link";

const navItems = [
  { href: "/lab", label: "Lab" },
  { href: "/writing", label: "Write" },
  { href: "/photos", label: "Photo" },
  { href: "/about", label: "Me" },
];

export function SiteHeader() {
  return (
    <>
      {/* 桌面端完整导航 */}
      <header className="hidden md:flex px-12 pt-8 items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="text-[var(--color-fg)]">Black</span>
          <span className="text-[var(--color-accent)]">Q</span>
          <span className="text-[var(--color-muted)]">.com</span>
        </Link>
        <nav>
          <ul className="flex items-center gap-5 font-mono text-xs">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* 移动端 sticky Logo（导航在底部 Tab Bar） */}
      <header className="md:hidden px-6 pt-6 pb-2 sticky top-0 z-40 bg-[var(--color-bg)]/85 backdrop-blur-xl">
        <Link href="/" className="font-mono text-sm tracking-tight">
          <span className="text-[var(--color-fg)]">Black</span>
          <span className="text-[var(--color-accent)]">Q</span>
          <span className="text-[var(--color-muted)]">.com</span>
        </Link>
      </header>
    </>
  );
}
