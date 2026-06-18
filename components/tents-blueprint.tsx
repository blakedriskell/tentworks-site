"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/* ----------------------------------------------------------------------
 * Tents — the catalog as architectural blueprints.
 *
 * Three typologies (sailcloth peak, clearspan, frame) rendered as
 * detailed SVG line drawings with dimension witness lines, callouts,
 * and engineering annotations. Sharp-cornered "blueprint-card" surfaces
 * — this is the section where the BLUEPRINT identity carries.
 *
 * On scroll into view, the SVG paths draw themselves.
 * ------------------------------------------------------------------- */

type TentSpec = {
  slug: string
  name: string
  size: string
  peak: string
  spec: string
  desc: string
}

const TENTS: TentSpec[] = [
  {
    slug: "sailcloth",
    name: "Sailcloth Peak",
    size: "44' × 83'",
    peak: "28'-6\"",
    spec: "Hand-stitched canvas · Apex flag · 4-pole standard",
    desc: "The signature. Translucent canvas glows at dusk. Catches every breath of trade wind.",
  },
  {
    slug: "clearspan",
    name: "Clearspan",
    size: "60' × 100'",
    peak: "18'-0\"",
    spec: "Aluminum truss · No center poles · Glass walls optional",
    desc: "Wide open floor. Configurable for ceremonies, banquets, dance, or all three.",
  },
  {
    slug: "frame",
    name: "Frame Tent",
    size: "40' × 60'",
    peak: "16'-0\"",
    spec: "Open or closed sides · Quick reset · Up to 8 hr setup",
    desc: "The workhorse. Clean geometry, fast install, endlessly reconfigurable.",
  },
]

function BlueprintSVG({
  type,
  className,
  drawRef,
}: {
  type: TentSpec["slug"]
  className?: string
  drawRef: (paths: SVGPathElement[]) => void
}) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const paths = Array.from(svgRef.current.querySelectorAll<SVGPathElement>(".d"))
    drawRef(paths)
  }, [drawRef])

  if (type === "sailcloth") {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className={className}
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        {/* Ground */}
        <path className="d" d="M 20 250 L 380 250" strokeWidth="1.5" />
        {/* Stakes */}
        <path className="d" d="M 30 250 L 38 262" strokeWidth="0.6" opacity="0.5" />
        <path className="d" d="M 370 250 L 378 262" strokeWidth="0.6" opacity="0.5" />
        {/* Poles */}
        <path className="d" d="M 90 250 L 90 190" strokeWidth="1.5" />
        <path className="d" d="M 200 250 L 200 60" strokeWidth="1.5" />
        <path className="d" d="M 310 250 L 310 190" strokeWidth="1.5" />
        {/* Peak canvas */}
        <path className="d" d="M 40 210 L 90 190 L 200 60 L 310 190 L 360 210" strokeWidth="1.8" />
        {/* Side drape */}
        <path className="d" d="M 40 210 L 40 250" strokeWidth="1" opacity="0.7" />
        <path className="d" d="M 360 210 L 360 250" strokeWidth="1" opacity="0.7" />
        {/* Guy lines */}
        <path className="d" d="M 200 60 L 140 30" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.6" />
        <path className="d" d="M 200 60 L 260 30" strokeWidth="0.6" strokeDasharray="4 2" opacity="0.6" />
        {/* Flag */}
        <path className="d" d="M 200 60 L 200 42" strokeWidth="0.8" />
        <path className="d" d="M 200 42 L 214 48 L 200 54" strokeWidth="0.8" />
        {/* Dimension — height */}
        <path className="d" d="M 14 60 L 14 250" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 10 60 L 18 60" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 10 250 L 18 250" strokeWidth="0.5" opacity="0.4" />
        {/* Dimension — width */}
        <path className="d" d="M 40 274 L 360 274" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 40 270 L 40 278" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 360 270 L 360 278" strokeWidth="0.5" opacity="0.4" />
        {/* Callout: APEX FLAG */}
        <path
          className="d"
          d="M 214 48 L 280 25"
          strokeWidth="0.5"
          opacity="0.7"
          stroke="var(--coral)"
        />
        <text x="282" y="22" fontSize="7" letterSpacing="1.5" fill="var(--coral)" fontFamily="ui-monospace,monospace">APEX FLAG</text>
        {/* Dim labels */}
        <text x="6" y="158" fontSize="7" transform="rotate(-90, 6, 158)" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">PEAK 28&apos;-6&quot;</text>
        <text x="200" y="290" fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">44&apos; × 83&apos;</text>
      </svg>
    )
  }

  if (type === "clearspan") {
    return (
      <svg
        ref={svgRef}
        viewBox="0 0 400 300"
        className={className}
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        {/* Ground */}
        <path className="d" d="M 20 250 L 380 250" strokeWidth="1.5" />
        {/* Verticals */}
        <path className="d" d="M 70 250 L 70 130" strokeWidth="1.8" />
        <path className="d" d="M 330 250 L 330 130" strokeWidth="1.8" />
        {/* Internal frames */}
        <path className="d" d="M 140 250 L 140 145" strokeWidth="0.8" opacity="0.55" />
        <path className="d" d="M 200 250 L 200 100" strokeWidth="0.8" opacity="0.55" />
        <path className="d" d="M 260 250 L 260 145" strokeWidth="0.8" opacity="0.55" />
        {/* Curved truss */}
        <path className="d" d="M 70 130 Q 200 60 330 130" strokeWidth="1.8" />
        {/* Truss bracing */}
        <path className="d" d="M 70 130 L 200 100" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 2" />
        <path className="d" d="M 200 100 L 330 130" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 2" />
        {/* Glass wall hints */}
        <path className="d" d="M 80 250 L 80 140" strokeWidth="0.4" opacity="0.3" />
        <path className="d" d="M 120 250 L 120 145" strokeWidth="0.4" opacity="0.3" />
        <path className="d" d="M 280 250 L 280 145" strokeWidth="0.4" opacity="0.3" />
        <path className="d" d="M 320 250 L 320 140" strokeWidth="0.4" opacity="0.3" />
        {/* Dimension — height */}
        <path className="d" d="M 14 70 L 14 250" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 10 70 L 18 70" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 10 250 L 18 250" strokeWidth="0.5" opacity="0.4" />
        {/* Dimension — width */}
        <path className="d" d="M 70 274 L 330 274" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 70 270 L 70 278" strokeWidth="0.5" opacity="0.4" />
        <path className="d" d="M 330 270 L 330 278" strokeWidth="0.5" opacity="0.4" />
        {/* Callout: GLASS WALLS OPT. */}
        <path
          className="d"
          d="M 320 200 L 380 175"
          strokeWidth="0.5"
          opacity="0.7"
          stroke="var(--coral)"
        />
        <text x="298" y="170" fontSize="6" letterSpacing="1.2" fill="var(--coral)" fontFamily="ui-monospace,monospace" textAnchor="end">GLASS WALLS OPT.</text>
        <text x="6" y="160" fontSize="7" transform="rotate(-90, 6, 160)" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">PEAK 18&apos;-0&quot;</text>
        <text x="200" y="290" fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">60&apos; × 100&apos;</text>
      </svg>
    )
  }

  // frame
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      {/* Ground */}
      <path className="d" d="M 20 250 L 380 250" strokeWidth="1.5" />
      {/* Stake circles */}
      <circle cx="30" cy="160" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="370" cy="160" r="2" fill="currentColor" opacity="0.5" />
      {/* Corner verticals */}
      <path className="d" d="M 70 250 L 70 150" strokeWidth="1.5" />
      <path className="d" d="M 330 250 L 330 150" strokeWidth="1.5" />
      {/* Ridge */}
      <path className="d" d="M 70 150 L 200 100 L 330 150" strokeWidth="1.8" />
      {/* Mid posts */}
      <path className="d" d="M 130 250 L 130 130" strokeWidth="0.8" opacity="0.6" />
      <path className="d" d="M 200 250 L 200 100" strokeWidth="1.2" />
      <path className="d" d="M 270 250 L 270 130" strokeWidth="0.8" opacity="0.6" />
      {/* Eave overhang */}
      <path className="d" d="M 40 160 L 70 150" strokeWidth="0.6" opacity="0.5" />
      <path className="d" d="M 330 150 L 360 160" strokeWidth="0.6" opacity="0.5" />
      {/* Stake guy lines */}
      <path className="d" d="M 30 160 L 70 150" strokeWidth="0.4" opacity="0.4" strokeDasharray="3 2" />
      <path className="d" d="M 370 160 L 330 150" strokeWidth="0.4" opacity="0.4" strokeDasharray="3 2" />
      {/* Open side hint */}
      <path className="d" d="M 80 250 L 80 155" strokeWidth="0.3" opacity="0.25" />
      <path className="d" d="M 320 250 L 320 155" strokeWidth="0.3" opacity="0.25" />
      {/* Dimension — height */}
      <path className="d" d="M 14 100 L 14 250" strokeWidth="0.5" opacity="0.4" />
      <path className="d" d="M 10 100 L 18 100" strokeWidth="0.5" opacity="0.4" />
      <path className="d" d="M 10 250 L 18 250" strokeWidth="0.5" opacity="0.4" />
      {/* Dimension — width */}
      <path className="d" d="M 70 274 L 330 274" strokeWidth="0.5" opacity="0.4" />
      <path className="d" d="M 70 270 L 70 278" strokeWidth="0.5" opacity="0.4" />
      <path className="d" d="M 330 270 L 330 278" strokeWidth="0.5" opacity="0.4" />
      {/* Callout: OPEN SIDES */}
      <path
        className="d"
        d="M 30 220 L 70 215"
        strokeWidth="0.5"
        opacity="0.7"
        stroke="var(--coral)"
      />
      <text x="24" y="212" fontSize="6" letterSpacing="1.2" fill="var(--coral)" fontFamily="ui-monospace,monospace" textAnchor="end">OPEN SIDES</text>
      <text x="6" y="175" fontSize="7" transform="rotate(-90, 6, 175)" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">PEAK 16&apos;-0&quot;</text>
      <text x="200" y="290" fontSize="7" textAnchor="middle" fill="currentColor" opacity="0.6" fontFamily="ui-monospace,monospace">40&apos; × 60&apos;</text>
    </svg>
  )
}

export function TentsBlueprint() {
  const sectionRef = useRef<HTMLElement>(null)
  const pathsByCard = useRef<SVGPathElement[][]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    pathsByCard.current.forEach((paths, i) => {
      if (!paths || paths.length === 0) return
      const card = section.querySelectorAll("[data-blueprint-card]")[i] as HTMLElement
      if (!card) return

      if (reduce) {
        // Static: just draw everything
        paths.forEach((p) =>
          gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 })
        )
        return
      }

      paths.forEach((p) => {
        const len = p.getTotalLength()
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
      })

      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2.8,
        stagger: 0.12,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tents"
      className="relative py-24 md:py-32 arch-grid"
      style={{ background: "var(--shell)", scrollMarginTop: "7rem" }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="label">Catalog · The three I build most</p>
          <h2
            className="display mt-6"
            style={{ fontSize: "clamp(40px, 6vw, 80px)", lineHeight: 0.98 }}
          >
            Three shapes,{" "}
            <span className="display-italic" style={{ color: "var(--coral)" }}>
              built for the trades.
            </span>
          </h2>
          <p
            className="body mt-8"
            style={{ color: "var(--ink-soft)", maxWidth: "52ch" }}
          >
            Engineered drawings of the tent typologies. Dimensions and specs
            are starting points — every build is sized to the site, the
            weather, and the guest count.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {TENTS.map((tent, i) => (
            <article
              key={tent.slug}
              data-blueprint-card
              className="blueprint-card p-8 lg:p-10 flex flex-col gap-5"
              style={{ color: "var(--ink)" }}
            >
              {/* Specification header — pure monospace, engineered */}
              <div
                className="flex items-start justify-between gap-4 pb-4 border-b"
                style={{ borderColor: "var(--ink)" }}
              >
                <div>
                  <p
                    className="label"
                    style={{ color: "var(--coral)", fontSize: 10 }}
                  >
                    DWG · {String(i + 1).padStart(2, "0")} / 03
                  </p>
                  <h3
                    className="display mt-2"
                    style={{ fontSize: "clamp(26px, 2.4vw, 34px)", lineHeight: 1 }}
                  >
                    {tent.name}
                  </h3>
                </div>
                <div className="text-right">
                  <p
                    className="label"
                    style={{ color: "var(--ink-soft)", fontSize: 9 }}
                  >
                    PEAK
                  </p>
                  <p
                    className="label mt-1"
                    style={{ color: "var(--ink)", fontSize: 11 }}
                  >
                    {tent.peak}
                  </p>
                </div>
              </div>

              {/* The blueprint itself */}
              <div
                className="relative w-full"
                style={{
                  aspectRatio: "4/3",
                  background: "var(--cream)",
                  border: "1px dashed var(--line)",
                }}
              >
                <BlueprintSVG
                  type={tent.slug}
                  className="absolute inset-0 w-full h-full p-2"
                  drawRef={(paths) => {
                    pathsByCard.current[i] = paths
                  }}
                />
              </div>

              {/* Spec strip */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <p
                    className="label"
                    style={{ color: "var(--ink-soft)", fontSize: 9 }}
                  >
                    FOOTPRINT
                  </p>
                  <p
                    className="label mt-1"
                    style={{ color: "var(--ink)", fontSize: 11 }}
                  >
                    {tent.size}
                  </p>
                </div>
                <div>
                  <p
                    className="label"
                    style={{ color: "var(--ink-soft)", fontSize: 9 }}
                  >
                    NOTES
                  </p>
                  <p
                    className="label mt-1"
                    style={{ color: "var(--ink)", fontSize: 10 }}
                  >
                    {tent.spec}
                  </p>
                </div>
              </div>

              {/* Description — switches register: serif body */}
              <p
                className="body pt-3"
                style={{
                  color: "var(--ink-soft)",
                  fontSize: "1rem",
                  lineHeight: 1.55,
                  borderTop: "1px solid var(--line)",
                }}
              >
                {tent.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
