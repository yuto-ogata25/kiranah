import { DoorOpen, Hand, Flower2 } from "lucide-react"

const features = [
  {
    icon: DoorOpen,
    title: "完全個室",
    description:
      "周りを気にせず、リラックスできるプライベート空間をご用意しています。お客様だけの特別な時間をお過ごしください。",
  },
  {
    icon: Hand,
    title: "オールハンド",
    description:
      "機械を使わず、すべて手の温もりで施術。繊細なタッチで身体の声に耳を傾け、一人ひとりに最適なケアをお届けします。",
  },
  {
    icon: Flower2,
    title: "選べるアロマ",
    description:
      "その日の体調や気分に合わせてお好きなアロマをお選びいただけます。香りの力で心身ともに深い癒やしへ。",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Commitment
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-balance">
            Kiranahのこだわり
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group text-center px-4"
            >
              <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <feature.icon className="size-7" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
