import type { Metadata } from "next"
import Image from "next/image"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Staging for Maui events — Tentworks",
  description:
    "Clean, stable platforms for ceremonies, performances, presentations, and private events across Maui.",
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

// Ceremonies — arch over a platform
function CeremonyIcon() {
  return (
    <IconFrame>
      <path d="M5 19 V11 A7 7 0 0 1 19 11 V19" />
      <path d="M3 19 H21" opacity="0.5" />
    </IconFrame>
  )
}

// Live music — paired notes
function MusicIcon() {
  return (
    <IconFrame>
      <path d="M10 18 V6 L18 4 V15" />
      <circle cx="7.5" cy="18" r="2.5" />
      <circle cx="15.5" cy="15" r="2.5" />
    </IconFrame>
  )
}

// Speakers & presentations — screen on a stand
function PresentationIcon() {
  return (
    <IconFrame>
      <rect x="4" y="4" width="16" height="11" rx="1" />
      <path d="M12 15 V19" />
      <path d="M9 19 H15" />
    </IconFrame>
  )
}

// Corporate events — award
function AwardIcon() {
  return (
    <IconFrame>
      <path d="M8 4 H16 V7.5 A4 4 0 0 1 8 7.5 Z" />
      <path d="M12 11.5 V15" />
      <path d="M8.5 20 A3.5 4 0 0 1 15.5 20 Z" />
    </IconFrame>
  )
}

// Elevated platforms — tiered riser
function RiserIcon() {
  return (
    <IconFrame>
      <path d="M3 19 H21" opacity="0.5" />
      <path d="M5 19 V14 H12 V19" />
      <path d="M12 14 V9.5 H18 V19" />
    </IconFrame>
  )
}

const CARDS = [
  {
    title: "Ceremonies",
    body: "Low, level platforms that lift the moment without stealing from it.",
    Icon: CeremonyIcon,
  },
  {
    title: "Live music",
    body: "Road-tested decks for bands, DJs, backline, and monitors.",
    Icon: MusicIcon,
  },
  {
    title: "Speakers & presentations",
    body: "Clean presentation stages with safe sightlines and cable management.",
    Icon: PresentationIcon,
  },
  {
    title: "Corporate events",
    body: "Polished staging for launches, galas, award nights, and branded gatherings.",
    Icon: AwardIcon,
  },
  {
    title: "Elevated platforms",
    body: "Raised decks and risers for head tables, DJ booths, and photo positions.",
    Icon: RiserIcon,
  },
]

export default function StagingPage() {
  return (
    <>
      <Nav solid />
      <main className="paper-bg">
        {/* Split hero — copy left, staging image right */}
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pt-24 md:pt-40 pb-10 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-6">
              <p className="eyebrow" style={{ color: "var(--coral)" }}>
                Staging &amp; platforms
              </p>
              <h1
                className="font-display-light tight mt-5"
                style={{ fontSize: "clamp(34px, 4vw, 58px)", maxWidth: "13ch" }}
              >
                Staging built around the moment.
              </h1>
              <p
                className="body mt-6"
                style={{ color: "var(--ink-soft)", maxWidth: "42ch" }}
              >
                Clean, stable platforms for ceremonies, performances,
                presentations, and private events across Maui.
              </p>

              {/* Technical row */}
              <div
                className="mt-8 border-t pt-5"
                style={{ borderColor: "var(--line)" }}
              >
                <p className="label" style={{ color: "var(--ink-soft)" }}>
                  Ceremonies · Live music · Presentations · Elevated platforms
                </p>
              </div>
            </div>

            {/* Right — staging image */}
            <div className="lg:col-span-6">
              <figure className="photo-frame crop-marks relative w-full aspect-[16/10] md:aspect-[4/3]">
                <Image
                  src="/photos/wix/staging-platform.png"
                  alt="Event stage and raised platform set for a Maui gathering"
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
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-12 md:pb-20">
          <p className="label mb-5 lg:mb-8">What we stage</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
            {CARDS.map((c, i) => {
              const Icon = c.Icon
              return (
                <div
                  key={c.title}
                  className="frame-card relative p-4 md:p-8 flex items-start gap-4 md:block"
                >
                  {/* Number — top-right on mobile and desktop */}
                  <p
                    className="label absolute top-4 right-4 md:top-8 md:right-8"
                    style={{ color: "var(--coral)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  {/* Icon — left column on mobile, top on desktop */}
                  <span className="shrink-0">
                    <Icon />
                  </span>
                  {/* Text — title + copy */}
                  <div className="flex-1 min-w-0 pr-6 md:pr-0">
                    <h2
                      className="display md:mt-5"
                      style={{ fontSize: "clamp(19px, 2.4vw, 30px)" }}
                    >
                      {c.title}
                    </h2>
                    <p
                      className="mt-1 md:mt-3 text-sm leading-snug md:text-base md:leading-[1.7]"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {c.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA — compact */}
        <section className="mx-auto max-w-[1100px] px-6 lg:px-10 pb-20 md:pb-24">
          <div className="frame-card p-6 md:p-10">
            <h2
              className="font-display-light tight"
              style={{ fontSize: "clamp(22px, 3vw, 40px)", maxWidth: "20ch" }}
            >
              Plan the stage around the event.
            </h2>
            <p
              className="mt-3 md:mt-4 max-w-xl text-sm leading-snug md:text-base md:leading-[1.7]"
              style={{ color: "var(--ink-soft)" }}
            >
              Share the venue, guest flow, and program. We&apos;ll help shape
              the platform, layout, and timing.
            </p>
            <a href="/build" className="btn btn-coral mt-6 md:mt-7">
              Plan your event
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
