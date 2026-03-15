"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { BookingWidget } from "@/components/booking-widget"

const slides = [
  { src: "/images/hero-1.jpg", alt: "Kiranah 完全個室のプライベート空間" },
  { src: "/images/hero-2.jpg", alt: "ドライヘッドスパ施術風景" },
  { src: "/images/hero-3.jpg", alt: "厳選されたアロマオイル" },
]

export function HeroSection() {
  return (
    <section id="hero" className="relative bg-background">
      {/* Carousel */}
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-primary mb-3">
            Private Salon
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground leading-tight text-balance mb-4">
            自分をいたわる、贅沢な時間。
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            完全個室のプライベート空間で極上の癒やしを
          </p>
        </div>

        <div className="relative px-0 md:px-14">
          <Carousel
            opts={{ loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-[16/9] md:aspect-[2/1] overflow-hidden rounded-xl">
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 960px"
                    />
                    <div className="absolute inset-0 bg-foreground/10" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:inline-flex -left-6 bg-background/80 border-border hover:bg-accent" />
            <CarouselNext className="hidden md:inline-flex -right-6 bg-background/80 border-border hover:bg-accent" />
          </Carousel>
        </div>

        <div className="mt-8 md:mt-10">
          <BookingWidget />
        </div>
      </div>
    </section>
  )
}
