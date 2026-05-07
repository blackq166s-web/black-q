import { Construction } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  subtitle: string;
  description: string;
}

export function PagePlaceholder({ title, subtitle, description }: PagePlaceholderProps) {
  return (
    <main className="px-6 md:px-12 py-16 md:py-24 max-w-3xl mx-auto">
      <p className="font-mono text-xs text-[var(--color-accent)] mb-6 tracking-widest uppercase">
        ◆ {subtitle}
      </p>
      <h1 className="text-3xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
        {title}
      </h1>
      <p className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed mb-12">
        {description}
      </p>
      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-muted)] border-t border-[var(--color-border)] pt-8">
        <Construction className="w-3.5 h-3.5" />
        coming soon
      </div>
    </main>
  );
}
