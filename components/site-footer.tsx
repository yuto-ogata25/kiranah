import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="text-center">
          <p className="font-serif text-xl font-bold tracking-wider mb-1">
            Kiranah
          </p>
          <p className="text-xs tracking-widest opacity-70 mb-4">
            キラナ ─ 完全個室プライベートサロン
          </p>
          <Separator className="mx-auto w-12 bg-primary-foreground/20 mb-4" />
          <p className="text-xs opacity-60 leading-relaxed">
            青森県青森市 ｜ 営業時間 10:00〜20:00（不定休）
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-[11px] opacity-40">
            {'© 2026 Kiranah. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
