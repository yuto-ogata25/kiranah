"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "メニュー", href: "#menu" },
  { label: "こだわり", href: "#features" },
  { label: "セラピスト紹介", href: "#profile" },
  { label: "アクセス", href: "#access" },
]

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
        <a href="#" className="flex flex-col items-start">
          <span className="font-serif text-xl font-bold tracking-wider text-foreground">
            Kiranah
          </span>
          <span className="text-[10px] text-muted-foreground tracking-widest">
            キラナ
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button size="sm" asChild>
            <a href="#hero">ご予約はこちら</a>
          </Button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {isOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 pb-4" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block py-3 text-sm text-muted-foreground hover:text-primary transition-colors border-b border-border/50 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <Button className="w-full mt-3" size="sm" asChild>
            <a href="#hero" onClick={() => setIsOpen(false)}>ご予約はこちら</a>
          </Button>
        </nav>
      )}
    </header>
  )
}
