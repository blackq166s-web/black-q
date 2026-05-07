import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

interface WorkCardProps {
  icon: LucideIcon;
  category: string;
  title: string;
  description: string;
  links: { href: string; label: string }[];
}

export function WorkCard({ icon: Icon, category, title, description, links }: WorkCardProps) {
  return (
    <div className="border border-[var(--color-border)] rounded-xl p-6 md:p-7 hover:border-[var(--color-muted)] transition-colors">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[var(--color-accent)]" strokeWidth={2} />
        <span className="font-mono text-[11px] tracking-widest uppercase text-[var(--color-muted)]">
          {category}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-3 text-[var(--color-fg)] leading-snug">
        {title}
      </h3>
      <p className="text-[15px] md:text-base text-[var(--color-muted)] leading-relaxed mb-5">
        {description}
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1 font-mono text-xs text-[var(--color-accent)] hover:gap-2 transition-all"
          >
            {link.href} <ArrowRight className="w-3 h-3" />
          </Link>
        ))}
      </div>
    </div>
  );
}
