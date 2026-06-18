import type { Metadata } from "next"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { BuildWizard } from "@/components/build-wizard"

export const metadata: Metadata = {
  title: "Build your tent — Tentworks",
  description:
    "Answer a few quick questions and we'll shape the structure, power, staging, and layout for your day. Maui tents for weddings, lu'aus, galas, and once-in-a-lifetime gatherings.",
}

export default function BuildPage() {
  return (
    <>
      <Nav solid />
      <main className="paper-bg">
        <section className="mx-auto max-w-[1180px] px-6 lg:px-10 pt-24 md:pt-36 pb-24">
          <BuildWizard
            eyebrow="Build a tent"
            title="Tell us what you&rsquo;re holding."
            intro="A few quick questions — event first, footprint second. No calculator, no pressure. We&rsquo;ll use your answers to understand the structure, power, staging, and layout that fits the day."
            note="Takes about one minute."
          />
        </section>
      </main>
      <Footer />
    </>
  )
}
