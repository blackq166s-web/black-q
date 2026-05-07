"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FlaskConical, PenLine, Camera, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/lab", label: "Lab", icon: FlaskConical, match: (p: string) => p.startsWith("/lab") },
  { href: "/writing", label: "Write", icon: PenLine, match: (p: string) => p.startsWith("/writing") },
  { href: "/photos", label: "Photo", icon: Camera, match: (p: string) => p.startsWith("/photos") },
  {
    href: "/about",
    label: "Me",
    icon: CircleUser,
    match: (p: string) =>
      p.startsWith("/about") ||
      p.startsWith("/now") ||
      p.startsWith("/uses") ||
      p.startsWith("/projects"),
  },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile navigation"
      className={cn(
        "md:hidden",
        "fixed bottom-0 left-0 right-0 z-50",
        "border-t border-[var(--color-border)]",
        "bg-[var(--color-bg)]/85 backdrop-blur-xl backdrop-saturate-150",
        "pb-[env(safe-area-inset-bottom)]",
      )}
    >
      <ul className="flex items-stretch justify-around px-1 pt-2 pb-1">
        {tabs.map((tab) => {
          const isActive = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5",
                  "min-h-[52px] py-1.5 rounded-lg",
                  "transition-all duration-150",
                  "active:scale-95",
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-muted)]",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                <span
                  className={cn(
                    "font-mono text-[11px] leading-none tracking-wide",
                    isActive ? "font-semibold" : "font-normal",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
