import { MapPin, Clock, Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AccessSection() {
  return (
    <section id="access" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Access
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
            アクセス・営業情報
          </h2>
        </div>

        <Card className="max-w-lg mx-auto border-border/60 bg-card shadow-sm">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MapPin className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-card-foreground mb-1">
                  所在地
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  青森県青森市
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ※ 詳しい住所はご予約確定後にご案内いたします
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-card-foreground mb-1">
                  営業時間
                </h3>
                <p className="text-sm text-muted-foreground">
                  10:00 〜 18:00
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  定休日:  月・水・金（祝日は営業）
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/60 text-secondary-foreground">
                <Info className="size-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-card-foreground mb-1">
                  ご予約について
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  当サロンは完全予約制です。Googleアカウントでログイン後、ご希望のメニューと日時をお選びください。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
