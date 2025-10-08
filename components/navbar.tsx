"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";

function HamburgerIcon({
  className,
  ...props
}: React.SVGAttributes<SVGElement>) {
  return (
    <svg
      className={cn("pointer-events-none", className)}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 6H20" />
      <path d="M4 12H20" />
      <path d="M4 18H20" />
    </svg>
  );
}

export type NavLink = { href: string; label: string };

type NavbarProps = {
  links?: NavLink[];
  brand?: React.ReactNode;
  signInHref?: string;
  signInText?: string;
  ctaHref?: string;
  ctaText?: string;
  className?: string;
};

const DEFAULT_LINKS: NavLink[] = [{ href: "/", label: "Home" }];

export default function Navbar({
  links = DEFAULT_LINKS,
  brand = (
    <div className="flex items-center gap-2 text-primary">
      <span className="font-bold text-xl">Smart Lifting</span>
    </div>
  ),
  signInHref = "/signin",
  signInText = "Sign In",
  ctaHref = "/get-started",
  ctaText = "Get Started",
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const NavItem = ({ href, label }: NavLink) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition-colors no-underline",
          active
            ? "bg-accent text-accent-foreground"
            : "text-foreground/80 hover:bg-accent hover:text-accent-foreground"
        )}
        onClick={() => setOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Left: brand + desktop nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="no-underline text-primary hover:opacity-90">
            {brand}
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavItem key={l.href} {...l} />
            ))}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="font-medium">
            <Link href={signInHref}>{signInText}</Link>
          </Button>
          <ModeToggle />
        </div>

        {/* Mobile: menu button */}
        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          onClick={() => setOpen((s) => !s)}
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* Mobile: drawer */}
      {open && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col gap-1 p-2">
            {links.map((l) => (
              <NavItem key={l.href} {...l} />
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="ghost" className="flex-1">
                <Link href={signInHref}>{signInText}</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href={ctaHref}>{ctaText}</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
