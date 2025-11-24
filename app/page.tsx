"use client"

import { useState } from "react"
import LandingSection from "@/components/landing-section"
import DemoSection from "@/components/demo-section"
import AboutSection from "@/components/about-section"
import TeamSection from "@/components/team-section"
import Navigation from "@/components/navigation"

export default function Home() {
  const [activeSection, setActiveSection] = useState("landing")

  const sections = {
    landing: <LandingSection onNavigate={setActiveSection} />,
    demo: <DemoSection />,
    about: <AboutSection />,
    team: <TeamSection />,
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onNavigate={setActiveSection} />
      {sections[activeSection as keyof typeof sections]}
    </div>
  )
}
