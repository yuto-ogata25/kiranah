import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { MenuSection } from "@/components/menu-section"
import { FeaturesSection } from "@/components/features-section"
import { ProfileSection } from "@/components/profile-section"
import { AccessSection } from "@/components/access-section"
import { SiteFooter } from "@/components/site-footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <HeroSection />
        <MenuSection />
        <FeaturesSection />
        <ProfileSection />
        <AccessSection />
      </main>
      <SiteFooter />
    </div>
  )
}
