"use client"

import { Reveal } from "./reveal"

const SKILLS = [
  {
    title: "Sailcloth peaks",
    body: "The signature — translucent canvas that glows at dusk. I cut, sew, and finish them by hand. The peaks catch every breath of trade wind. Nothing else holds the light the same way.",
    detail: "20 ft to 88 ft peak heights. Custom flag.",
  },
  {
    title: "Clearspan structures",
    body: "When you need wide open floor — no center poles in the dance, no obstructed sightlines for the ceremony. I size the span to your layout, not the other way around.",
    detail: "Up to 120 ft clear. Glass walls optional.",
  },
  {
    title: "Frame tents that breathe",
    body: "Open sides, closed sides, half-and-half. Built to take the leeward sun and the windward gusts in the same afternoon. Configurable up to the last hour before the cocktail.",
    detail: "20×20 to 60×140. Quick reset.",
  },
  {
    title: "Engineering for trade winds",
    body: "Anchor systems sized to your site. Soil-tested guy-line angles. The thing has to stand up when the trades pick up at 3 pm. I&apos;ve been doing this on this island for thirty-five years. It stands up.",
    detail: "Wind-rated to local code. Permitted when permits are needed.",
  },
  {
    title: "Custom canvas work",
    body: "If you want it longer, taller, narrower, a different roof line, a different door — I can sew it. I have the machines and the patterns and the time.",
    detail: "Bespoke patterns. No catalog walls.",
  },
  {
    title: "We leave the site clean",
    body: "The last thing I want you to see of me is no trace at all. We pull guy-lines, we sweep stakes, we rake the grass back. The yard looks like nothing happened. The photos look like everything happened.",
    detail: "Clean breakdown. Same crew that set it up.",
  },
]

export function What() {
  return (
    <section id="what" className="relative py-32 md:py-48">
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        <Reveal>
          <p className="label">What I can do for you</p>
        </Reveal>
        <Reveal delay={120}>
          <h2
            className="display mt-6"
            style={{
              fontSize: "clamp(40px, 6vw, 88px)",
              maxWidth: "20ch",
            }}
          >
            Six things I&apos;m{" "}
            <span className="display-italic" style={{ color: "var(--coral)" }}>
              actually good at.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={220}>
          <p
            className="body mt-8"
            style={{ color: "var(--ink-soft)", maxWidth: "52ch" }}
          >
            Not a catalog. The things I can do that other tent companies can&apos;t
            or won&apos;t. Read what fits the day you&apos;re planning. The rest you
            don&apos;t need.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SKILLS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80} className="h-full">
              <article
                className="soft-card h-full p-8 lg:p-10 flex flex-col gap-4 transition-shadow duration-500 hover:shadow-[0_30px_80px_-40px_rgba(31,42,48,0.25)]"
              >
                <p className="label">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className="display"
                  style={{ fontSize: "clamp(28px, 3vw, 38px)" }}
                >
                  {s.title}
                </h3>
                <p className="body" style={{ color: "var(--ink-soft)" }}>
                  {s.body}
                </p>
                <p
                  className="label mt-auto pt-2"
                  style={{ color: "var(--coral)" }}
                >
                  {s.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
