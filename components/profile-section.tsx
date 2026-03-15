import Image from "next/image"
import { Separator } from "@/components/ui/separator"

export function ProfileSection() {
  return (
    <section id="profile" className="py-16 md:py-24 bg-accent/30">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Therapist
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
            セラピスト紹介
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 bg-card rounded-2xl p-6 md:p-10 shadow-sm border border-border/60">
          <div className="shrink-0">
            <div className="relative size-48 md:size-56 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src="/images/therapist.jpg"
                alt="Kiranah オーナーセラピスト"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 192px, 224px"
              />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <p className="text-xs text-primary tracking-widest mb-1">
                Owner Therapist
              </p>
              <h3 className="font-serif text-xl font-bold text-card-foreground">
                オーナーセラピスト
              </h3>
            </div>
            <Separator className="mb-4 md:w-16" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              「青森市浪岡の閑静な住宅街の一室にてひっそりと営業しております。」
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              リラクゼーション業界で経験を積み、技術を習得。
              「来てよかった」と感じていただける施術を目指し、完全個室のプライベートサロンをオープンしました。
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              皆様に心地よく過ごしていただけたらと思います。宜しくお願いいたします！
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
