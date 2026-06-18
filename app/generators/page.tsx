import type { Metadata } from "next"
import Image from "next/image"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Generators for Maui events — Tentworks",
  description:
    "Quiet, reliable power for tents, lighting, catering, sound, and remote Maui locations.",
}

/* ----------------------------------------------------------------------
 * Inline blueprint-style icons — minimal, thin-stroke, coral. No library.
 * ------------------------------------------------------------------- */
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--coral)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

// Lighting — bulb with base
function LightingIcon() {
  return (
    <IconFrame>
      <path d="M8.5 14.5 A5 5 0 1 1 15.5 14.5 C14.5 15.5 14 16.5 14 18 H10 C10 16.5 9.5 15.5 8.5 14.5 Z" />
      <path d="M10 20 H14" />
    </IconFrame>
  )
}

// Catering — serving dome
function CateringIcon() {
  return (
    <IconFrame>
      <path d="M4 17 H20" />
      <path d="M5.5 17 A6.5 6.5 0 0 1 18.5 17" />
      <path d="M12 8 V10.5" />
    </IconFrame>
  )
}

// Sound — speaker
function SoundIcon() {
  return (
    <IconFrame>
      <rect x="6.5" y="3.5" width="11" height="17" rx="1.5" />
      <circle cx="12" cy="14" r="3" />
      <circle cx="12" cy="7" r="0.6" fill="var(--coral)" />
    </IconFrame>
  )
}

// Remote sites — map pin
function RemoteIcon() {
  return (
    <IconFrame>
      <path d="M12 21 C12 21 18.5 14.5 18.5 9.5 A6.5 6.5 0 1 0 5.5 9.5 C5.5 14.5 12 21 12 21 Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </IconFrame>
  )
}

// Backup power — battery with bolt
function BackupIcon() {
  return (
    <IconFrame>
      <rect x="3" y="8" width="16" height="9" rx="1.5" />
      <path d="M21 11 V14" />
      <path d="M11 9.5 L9 12.5 H11 L9.5 15.5" />
    </IconFrame>
  )
}

// Full builds — tent peak with center pole
function FullBuildIcon() {
  return (
    <IconFrame>
      <path d="M3 18 L12 5 L21 18" />
      <path d="M3 18 H21" opacity="0.5" />
      <path d="M12 5 V18" opacity="0.6" />
    </IconFrame>
  )
}

const CARDS = [
  {
    title: "Lighting",
    body: "Steady power for string lights, uplighting, pathways, and stage washes.",
    Icon: LightingIcon,
  },
  {
    title: "Catering",
    body: "Clean load capacity for warmers, refrigeration, bars, and field kitchens.",
    Icon: CateringIcon,
  },
  {
    title: "Sound",
    body: "Conditioned power for PA systems, DJs, bands, and speeches.",
    Icon: SoundIcon,
  },
  {
    title: "Remote sites",
    body: "Power for beaches, ranch land, private estates, and off-grid locations.",
    Icon: RemoteIcon,
  },
  {
    title: "Backup power",
    body: "Redundant units and backup planning when the event cannot go dark.",
    Icon: BackupIcon,
  },
  {
    title: "Full builds",
    body: "Power, tenting, staging, and layout planned as one system.",
    Icon: FullBuildIcon,
  },
]

export default function GeneratorsPage() {
  return (
    <>
      <Nav solid />
      <main className="paper-bg">
        {/* Split hero — copy left, generator image right */}
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-32 md:pt-40 pb-16 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-6">
              <p className="eyebrow" style={{ color: "var(--coral)" }}>
                Power &amp; infrastructure
              </p>
              <h1
                className="font-display-light tight mt-5"
                style={{ fontSize: "clamp(34px, 4vw, 58px)", maxWidth: "13ch" }}
              >
                Event power, planned around the build.
              </h1>
              <p
                className="body mt-6"
                style={{ color: "var(--ink-soft)", maxWidth: "42ch" }}
              >
                Quiet, reliable power for tents, lighting, catering, sound, and
                remote Maui locations.
              </p>

              {/* Technical row */}
              <div
                className="mt-8 border-t pt-5"
                style={{ borderColor: "var(--line)" }}
              >
                <p className="label" style={{ color: "var(--ink-soft)" }}>
                  Load planning · Cable runs · Lighting · Backup power
                </p>
              </div>
            </div>

            {/* Right — generator image */}
            <div className="lg:col-span-6">
              <figure
                className="photo-frame crop-marks relative w-full"
                style={{ aspectRatio: "4/3" }}
              >
                <Image
                  src="/photos/wix/generator-power.png"
                  alt="Event power generators staged for a Maui build"
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  style={{ objectPosition: "center" }}
                />
              </figure>
            </div>
          </div>
        </section>

        {/* Cards */}
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-20">
          <p className="label mb-8">What we power</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {CARDS.map((c, i) => {
              const Icon = c.Icon
              return (
                <div key={c.title} className="frame-card p-7 md:p-8">
                  <div className="flex items-center justify-between">
                    <Icon />
                    <p className="label" style={{ color: "var(--coral)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <h2
                    className="display mt-5"
                    style={{ fontSize: "clamp(22px, 2.4vw, 30px)" }}
                  >
                    {c.title}
                  </h2>
                  <p
                    className="body mt-3"
                    style={{ color: "var(--ink-soft)", fontSize: "1rem" }}
                  >
                    {c.body}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-28">
          <div className="frame-card p-7 md:p-12 lg:p-16">
            <h2
              className="font-display-light tight"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", maxWidth: "20ch" }}
            >
              Tell us what you&apos;re powering.
            </h2>
            <p className="body mt-5 max-w-xl" style={{ color: "var(--ink-soft)" }}>
              Share the venue and the load, and we&apos;ll size the right power
              package for your day.
            </p>
            <a href="/build" className="btn btn-coral mt-8">
              Plan your event
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
