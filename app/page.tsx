"use client"

import dynamic from "next/dynamic"
import { Nav } from "@/components/nav"
import { Moments } from "@/components/moments"
import { Help } from "@/components/help"
import { Footer } from "@/components/footer"

// WebGL hero — client-only, no SSR
const OceanHero = dynamic(
  () => import("@/components/ocean-hero").then((m) => m.OceanHero)
)

// Scroll-cinema sections — client-only (GSAP ScrollTrigger needs window)
const WhatCinema = dynamic(
  () => import("@/components/what-cinema").then((m) => m.WhatCinema)
)

const HowCinema = dynamic(
  () => import("@/components/how-cinema").then((m) => m.HowCinema)
)

const TentsBlueprint = dynamic(
  () => import("@/components/tents-blueprint").then((m) => m.TentsBlueprint)
)

// Pinned scroll build animation — ported from v0, client-only (GSAP ScrollTrigger)
const ConstructionSequence = dynamic(
  () => import("@/components/construction-sequence").then((m) => m.ConstructionSequence)
)

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <OceanHero />
        <WhatCinema />
        <ConstructionSequence />
        <TentsBlueprint />
        <HowCinema />
        <Moments />
        <Help />
      </main>
      <Footer />
    </>
  )
}
