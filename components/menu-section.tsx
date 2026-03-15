import { Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const menuItems = [
  {
    name: "極上ドライヘッドスパ",
    duration: "60分",
    price: "¥6,600",
    note: "90分枠（施術60分＋準備30分）",
    badge: "人気 No.1",
    badgeVariant: "default" as const,
    description:
      "頭皮のツボを丁寧にほぐし、深いリラクゼーションへ導きます。眼精疲労や不眠にお悩みの方におすすめです。",
  },
  {
    name: "全身リンパマッサージ",
    duration: "90分",
    price: "¥9,900",
    note: "120分枠（施術90分＋準備30分）",
    badge: "おすすめ",
    badgeVariant: "secondary" as const,
    description:
      "全身のリンパの流れを整え、むくみや疲れをスッキリ解消。デトックス効果で内側から輝く身体へ。",
  },
  {
    name: "アーユルヴェーダ・オイルトリートメント",
    duration: "120分",
    price: "¥13,200",
    note: "150分枠（施術120分＋準備30分）",
    badge: null,
    badgeVariant: "secondary" as const,
    description:
      "インド伝統のアーユルヴェーダに基づいた、温かいオイルを使ったトリートメント。心身ともに深い癒やしを。",
  },
]

export function MenuSection() {
  return (
    <section id="menu" className="py-16 md:py-24 bg-muted/50">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Menu
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
            施術メニュー
          </h2>
          <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
            すべてのメニューは完全個室で、お一人おひとりに合わせた施術をご提供します
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {menuItems.map((item) => (
            <Card
              key={item.name}
              className="group relative overflow-hidden border-border/60 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-bold text-card-foreground leading-snug">
                    {item.name}
                  </CardTitle>
                  {item.badge && (
                    <Badge variant={item.badgeVariant} className="shrink-0 text-[10px]">
                      <Sparkles className="size-3" />
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-sm leading-relaxed mt-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <Separator className="mx-auto w-[calc(100%-2rem)]" />
              <CardContent className="pt-4">
                <div className="flex items-end justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="size-3.5" />
                    <span className="text-sm">{item.duration}</span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {item.price}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      (税込)
                    </span>
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3 bg-muted rounded-md px-3 py-2">
                  ※ ご予約枠：{item.note}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
