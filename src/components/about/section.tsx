import { cn } from "@/lib/utils";

interface SectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ label, children, className }: SectionProps) {
  return (
    <section
      className={cn(
        "px-6 md:px-12 py-16 md:py-24",
        "max-w-3xl mx-auto",
        "border-b border-[var(--color-border)] last:border-b-0",
        className,
      )}
    >
      <p className="font-mono text-xs text-[var(--color-accent)] mb-8 tracking-widest uppercase">
        ◆ {label}
      </p>
      {children}
    </section>
  );
}
