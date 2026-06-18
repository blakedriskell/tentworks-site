"use client"

import { useEffect, useRef, useState } from "react"

const SKILLS = [
  {
    title: "Sailcloth peaks",
    body: "The signature. Translucent canvas that glows at dusk. Cut, sewn, and finished by hand. The peaks catch every breath of trade wind.",
    detail: "20 ft — 88 ft peak heights",
  },
  {
    title: "Clearspan structures",
    body: "When you need wide open floor — no center poles in the dance, no obstructed sightlines. I size the span to your layout, not the other way around.",
    detail: "Up to 120 ft clear. Glass walls optional.",
  },
  {
    title: "Frame tents that breathe",
    body: "Open sides, closed sides, half-and-half. Built to take the leeward sun and the windward gusts in the same afternoon. Configurable up to the last hour.",
    detail: "20×20 to 60×140. Quick reset.",
  },
  {
    title: "Engineering for trade winds",
    body: "Anchor systems sized to your site. Soil-tested guy-line angles. The thing stands up when the trades pick up at 3 pm. Thirty-five years of standing up.",
    detail: "Wind-rated. Permitted when needed.",
  },
  {
    title: "Generators & lighting",
    body: "Power, lighting, and clean runs planned around the tent layout, catering, sound, and remote site needs.",
    detail: "POWER · LIGHTING · REMOTE SITES",
  },
  {
    title: "Staging",
    body: "Stable platforms for ceremonies, performances, speakers, and private event moments that need elevation and focus.",
    detail: "STAGING · PLATFORMS · PRESENTATIONS",
  },
]

const DWELL_MS = 3600
const PAUSE_AFTER_CLICK_MS = 6000

/* ----------------------------------------------------------------------
 * Service marks — minimal inline line icons drawn in the same thin-stroke,
 * blueprint vocabulary as the tent drawings. One per service, shown beside
 * the active card label so each card carries its own technical glyph.
 * ------------------------------------------------------------------- */
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
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

// Sailcloth peaks — twin canvas peaks over a ground line.
function PeaksIcon() {
  return (
    <IconFrame>
      <path d="M2 17 L8 7 L12 13 L16 7 L22 17" />
      <path d="M2 17 H22" opacity="0.4" />
    </IconFrame>
  )
}

// Clearspan — open arched span on two legs, no center pole.
function ClearspanIcon() {
  return (
    <IconFrame>
      <path d="M4 18 V11" />
      <path d="M20 18 V11" />
      <path d="M4 11 Q12 4 20 11" />
      <path d="M3 18 H21" opacity="0.4" />
    </IconFrame>
  )
}

// Frame tent — modular frame with an airflow line passing through.
function FrameIcon() {
  return (
    <IconFrame>
      <path d="M4 18 V8 H20 V18" />
      <path d="M6 13 Q9 11 12 13 T18 13" opacity="0.7" />
    </IconFrame>
  )
}

// Trade winds — directional wind streaks curling at the ends.
function WindIcon() {
  return (
    <IconFrame>
      <path d="M2 8 H14 Q18 8 18 5" />
      <path d="M2 12 H18 Q22 12 22 9" />
      <path d="M2 16 H11 Q15 16 15 19" opacity="0.7" />
    </IconFrame>
  )
}

// Generators & lighting — power bolt.
function BoltIcon() {
  return (
    <IconFrame>
      <path d="M13 2 L6 13 H11 L10 22 L18 9 H12 L13 2 Z" />
    </IconFrame>
  )
}

// Staging — raised platform / riser.
function StageIcon() {
  return (
    <IconFrame>
      <path d="M3 18 H21" opacity="0.4" />
      <path d="M6 18 V13 H18 V18" />
      <path d="M9 13 V10 H18" opacity="0.7" />
    </IconFrame>
  )
}

// Parallel to SKILLS — index i gets ICONS[i].
const ICONS = [
  PeaksIcon,
  ClearspanIcon,
  FrameIcon,
  WindIcon,
  BoltIcon,
  StageIcon,
]

/* Vertical selector-wheel geometry. The wheel animates with transforms and
 * opacity only (fixed row height) so it never reflows. The list is repeated
 * REPEAT times and the position teleports by one copy at each transition end,
 * giving a seamless, single-direction wrap with no rewind. */
const N = SKILLS.length
const ROW_H = 58 // px per row
const VISIBLE = 5 // odd — active centered, two above + two below
const VIEWPORT_H = ROW_H * VISIBLE
const REPEAT = 5
const MID = Math.floor(REPEAT / 2) * N // centered in the middle copy
const LOOP = Array.from({ length: N * REPEAT }, (_, k) => k)

export function WhatCinema() {
  const sectionRef = useRef<HTMLElement>(null)
  const wheelRef = useRef<HTMLUListElement>(null)
  // `step` is the wheel's centered row in LOOP coordinates. Starts on 01
  // "Sailcloth peaks" (MID) and holds there until the section is in view.
  const [step, setStep] = useState(MID)
  const [withT, setWithT] = useState(true) // transition on (off during teleport)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false) // brief pause after a click
  const [interaction, setInteraction] = useState(0)
  const [entered, setEntered] = useState(true)

  const active = ((step % N) + N) % N
  const current = SKILLS[active]
  const ActiveIcon = ICONS[active]
  const animate = withT && !reduced

  // Honor reduced-motion — no auto-advance, minimal transition.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Only start rotating once the section is clearly in view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Auto-rotation — gated on visibility, not reduced-motion, and not paused.
  // Advances one row at a time; the wheel always moves the same direction.
  useEffect(() => {
    if (!inView || reduced || paused) return
    const id = window.setTimeout(() => {
      setWithT(true)
      setStep((s) => s + 1)
    }, DWELL_MS)
    return () => window.clearTimeout(id)
  }, [step, inView, reduced, paused])

  // Re-enable the transition one frame after a teleport (no-anim reposition).
  useEffect(() => {
    if (withT) return
    const id = requestAnimationFrame(() => setWithT(true))
    return () => cancelAnimationFrame(id)
  }, [withT])

  // Resume auto-rotation a beat after the last click.
  useEffect(() => {
    if (!paused) return
    const id = window.setTimeout(() => setPaused(false), PAUSE_AFTER_CLICK_MS)
    return () => window.clearTimeout(id)
  }, [paused, interaction])

  // Re-trigger the card's enter animation when the active service changes.
  useEffect(() => {
    setEntered(false)
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [active])

  // Click a service: travel the shortest direction to it, then pause briefly.
  const goTo = (i: number) => {
    let delta = i - active
    if (delta > N / 2) delta -= N
    if (delta < -N / 2) delta += N
    setWithT(true)
    setStep((s) => s + delta)
    setPaused(true)
    setInteraction((n) => n + 1)
  }

  // Seamless wrap: once the slide settles, teleport back one copy (same item
  // stays centered, so it's invisible) to keep `step` bounded with no rewind.
  const onWheelTransitionEnd = (e: React.TransitionEvent<HTMLUListElement>) => {
    if (e.target !== wheelRef.current || e.propertyName !== "transform") return
    if (step >= MID + N) {
      setWithT(false)
      setStep(step - N)
    } else if (step < MID) {
      setWithT(false)
      setStep(step + N)
    }
  }

  const translateY = VIEWPORT_H / 2 - (step + 0.5) * ROW_H

  const contentStyle: React.CSSProperties = {
    opacity: entered ? 1 : 0,
    transform: reduced ? "none" : entered ? "translateY(0)" : "translateY(10px)",
    transition: !entered
      ? "none"
      : reduced
      ? "opacity 250ms ease-out"
      : "opacity 520ms ease-out, transform 520ms cubic-bezier(0.2, 0.7, 0.2, 1)",
  }

  return (
    <section
      ref={sectionRef}
      id="what"
      className="relative py-28 md:py-40"
      style={{ background: "var(--shell)" }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        {/* Header — eyebrow carries a subtle kinetic index that ticks with the
            wheel, tying the heading to the rotation. */}
        <div className="max-w-2xl">
          <p className="mono-label">
            What I can do for you{" "}
            <span style={{ color: "var(--coral)" }}>
              · {String(active + 1).padStart(2, "0")} / 06
            </span>
          </p>
          <h2
            className="display mt-6"
            style={{
              fontSize: "clamp(40px, 5.5vw, 80px)",
              lineHeight: 0.98,
              maxWidth: "16ch",
            }}
          >
            What we bring{" "}
            <span
              className="font-display-light italic"
              style={{ color: "var(--coral)" }}
            >
              to the build.
            </span>
          </h2>
        </div>

        {/* Stage — 12-col grid: wheel (1–4), an intentional empty gutter (5),
            card (6–12). Centered against each other so the index balances the
            taller card and the active row reads near the card's center. */}
        <div className="mt-16 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-20 items-center">
          {/* Left — vertical selector wheel. Desktop only; mobile uses dots. */}
          <div className="hidden lg:block lg:col-span-4">
            <div
              className="relative overflow-hidden"
              style={{ height: VIEWPORT_H }}
            >
              {/* Top / bottom fades — rows dissolve into the section background */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-10"
                style={{
                  height: ROW_H * 1.4,
                  background:
                    "linear-gradient(var(--shell), rgba(247,243,236,0))",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
                style={{
                  height: ROW_H * 1.4,
                  background:
                    "linear-gradient(rgba(247,243,236,0), var(--shell))",
                }}
              />

              <ul
                ref={wheelRef}
                onTransitionEnd={onWheelTransitionEnd}
                className="absolute inset-x-0 top-0"
                style={{
                  transform: `translateY(${translateY}px)`,
                  transition: animate
                    ? "transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1)"
                    : "none",
                  willChange: "transform",
                }}
              >
                {LOOP.map((k) => {
                  const idx = k % N
                  const s = SKILLS[idx]
                  const RowIcon = ICONS[idx]
                  const on = k === step
                  const d = Math.abs(k - step)
                  const opacity = d === 0 ? 1 : d === 1 ? 0.5 : d === 2 ? 0.26 : 0.1
                  const scale = d === 0 ? 1 : d === 1 ? 0.93 : d === 2 ? 0.86 : 0.82
                  return (
                    <li key={k} style={{ height: ROW_H }}>
                      <button
                        type="button"
                        onClick={() => goTo(idx)}
                        aria-current={on}
                        aria-label={`Show ${s.title}`}
                        className="group w-full h-full text-left flex items-center justify-between gap-4"
                        style={{
                          paddingLeft: 18,
                          paddingRight: 4,
                          borderLeft: `2px solid ${
                            on ? "var(--coral)" : "transparent"
                          }`,
                          opacity,
                          transform: `scale(${scale})`,
                          transformOrigin: "left center",
                          transition: animate
                            ? "opacity 620ms ease, transform 620ms cubic-bezier(0.22, 0.61, 0.36, 1), border-color 320ms ease"
                            : "none",
                        }}
                      >
                        <span className="flex items-baseline gap-5 min-w-0">
                          <span
                            className="font-mono text-sm tabular-nums shrink-0"
                            style={{
                              color: on ? "var(--coral)" : "var(--ink-soft)",
                            }}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span
                            className="font-display tight truncate"
                            style={{
                              fontSize: "clamp(20px, 1.9vw, 27px)",
                              color: on ? "var(--ink)" : "var(--ink-soft)",
                            }}
                          >
                            {s.title}
                          </span>
                        </span>
                        {/* Active accent — the service icon + connector arrow */}
                        <span
                          aria-hidden
                          className="flex items-center gap-3 shrink-0 transition-opacity duration-300"
                          style={{ opacity: on ? 1 : 0 }}
                        >
                          <RowIcon />
                          <span
                            className="font-mono text-base"
                            style={{ color: "var(--coral)" }}
                          >
                            →
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Right — featured card for the active service */}
          <div className="lg:col-span-7 lg:col-start-6">
            <article
              className="blueprint-card crop-marks crop-marks-dark relative p-10 md:p-12 lg:p-16 flex flex-col"
              style={{
                background: "var(--cream)",
                boxShadow: "0 30px 80px -40px rgba(31, 42, 48, 0.35)",
                minHeight: "clamp(380px, 44vh, 480px)",
              }}
            >
              <div style={contentStyle}>
                <div className="flex items-center gap-3">
                  <ActiveIcon />
                  <p className="mono-label" style={{ color: "var(--coral)" }}>
                    {String(active + 1).padStart(2, "0")} / 06
                  </p>
                </div>
                <h3
                  className="font-display tight mt-6"
                  style={{ fontSize: "clamp(34px, 4.5vw, 60px)", lineHeight: 1 }}
                >
                  {current.title}
                </h3>
                <p
                  className="text-base leading-relaxed mt-6"
                  style={{ color: "var(--ink-soft)", maxWidth: "46ch" }}
                >
                  {current.body}
                </p>
                <p className="label mt-8" style={{ color: "var(--coral)" }}>
                  {current.detail}
                </p>
              </div>
            </article>

            {/* Dot rail — mobile navigation + a clear "6 services" indicator */}
            <div className="flex lg:hidden items-center gap-2.5 mt-8">
              {SKILLS.map((s, i) => {
                const on = i === active
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show service ${i + 1}: ${s.title}`}
                    aria-current={on}
                    className="h-2 rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: on ? 30 : 8,
                      background: on ? "var(--coral)" : "var(--line)",
                      opacity: on ? 1 : 0.5,
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
