"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

const STEPS = [
  {
    num: "01",
    label: "Talk",
    title: "We talk",
    body: "You tell me what you're holding, where, when. Twenty minutes. No quote calculator.",
    aside: "Same day, usually.",
  },
  {
    num: "02",
    label: "Sketch",
    title: "I sketch it",
    body: "I draw the footprint on the site. Walk it with you. You see where the dance floor lands.",
    aside: "Pencil on paper.",
  },
  {
    num: "03",
    label: "Build",
    title: "I build it",
    body: "My crew shows up the morning you tell us to. We work clean and quiet. By the time you walk through, it's a room.",
    aside: "Day before or morning of.",
  },
  {
    num: "04",
    label: "Gone",
    title: "You have the day",
    body: "We're gone. We come back when the last guest leaves. We pull the canvas, sweep the stakes, rake the grass.",
    aside: "Then no trace at all.",
  },
]

const DWELL_MS = 4500
const PAUSE_AFTER_CLICK_MS = 7000

export function HowCinema() {
  const sectionRef = useRef<HTMLElement>(null)
  // Tent SVG group refs — the build draws up to the active step.
  const groundRef = useRef<SVGPathElement>(null)
  const polesRef = useRef<SVGGElement>(null)
  const ridgeRef = useRef<SVGGElement>(null)
  const canvasRef = useRef<SVGGElement>(null)
  const flagRef = useRef<SVGGElement>(null)
  // Collected stroke paths { element, step it belongs to, total length }.
  const pathsRef = useRef<{ p: SVGPathElement; step: number; len: number }[]>([])
  const reducedRef = useRef(false)

  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false)
  const [interaction, setInteraction] = useState(0)
  const [entered, setEntered] = useState(true)

  const current = STEPS[active]

  // Honor reduced-motion (kept in a ref too, for the imperative tent effect).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => {
      setReduced(mq.matches)
      reducedRef.current = mq.matches
    }
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Measure the tent paths once; set them undrawn (or fully drawn for reduced).
  useEffect(() => {
    const arr: { p: SVGPathElement; step: number; len: number }[] = []
    const push = (nodes: SVGPathElement[], step: number) =>
      nodes.forEach((p) => arr.push({ p, step, len: p.getTotalLength() }))

    if (groundRef.current) push([groundRef.current], 0)
    if (polesRef.current)
      push(Array.from(polesRef.current.querySelectorAll("path")), 1)
    if (ridgeRef.current)
      push(Array.from(ridgeRef.current.querySelectorAll("path")), 2)
    if (canvasRef.current)
      push(Array.from(canvasRef.current.querySelectorAll("path")), 2)

    const drawn = reducedRef.current
    arr.forEach(({ p, len }) =>
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: drawn ? 0 : len })
    )
    if (flagRef.current) gsap.set(flagRef.current, { opacity: drawn ? 1 : 0 })
    pathsRef.current = arr
  }, [])

  // Start rotating only once the section is clearly in view.
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
  useEffect(() => {
    if (!inView || reduced || paused) return
    const id = window.setTimeout(
      () => setActive((a) => (a + 1) % STEPS.length),
      DWELL_MS
    )
    return () => window.clearTimeout(id)
  }, [active, inView, reduced, paused])

  // Resume auto-rotation a beat after the last click.
  useEffect(() => {
    if (!paused) return
    const id = window.setTimeout(() => setPaused(false), PAUSE_AFTER_CLICK_MS)
    return () => window.clearTimeout(id)
  }, [paused, interaction])

  // Re-trigger the copy's enter animation when the step changes.
  useEffect(() => {
    setEntered(false)
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [active])

  // Build the tent up to the active step. Holds undrawn until in view.
  useEffect(() => {
    if (reducedRef.current) return
    const paths = pathsRef.current
    if (!paths.length) return

    if (!inView) {
      paths.forEach(({ p, len }) => gsap.set(p, { strokeDashoffset: len }))
      if (flagRef.current) gsap.set(flagRef.current, { opacity: 0 })
      return
    }

    paths.forEach(({ p, step, len }) =>
      gsap.to(p, {
        strokeDashoffset: step <= active ? 0 : len,
        duration: 0.9,
        ease: "power2.out",
      })
    )
    if (flagRef.current)
      gsap.to(flagRef.current, {
        opacity: active >= 3 ? 1 : 0,
        duration: 0.6,
        ease: "power2.out",
      })
  }, [active, inView])

  // Click a step: jump to it, then pause auto-rotation briefly.
  const goTo = (i: number) => {
    setActive(i)
    setPaused(true)
    setInteraction((n) => n + 1)
  }

  const contentStyle: React.CSSProperties = {
    opacity: entered ? 1 : 0,
    transform: reduced ? "none" : entered ? "translateY(0)" : "translateY(12px)",
    transition: !entered
      ? "none"
      : reduced
      ? "opacity 250ms ease-out"
      : "opacity 520ms ease-out, transform 520ms cubic-bezier(0.2, 0.7, 0.2, 1)",
  }

  return (
    <section
      id="how"
      ref={sectionRef}
      className="relative pt-24 pb-12 md:py-20"
      style={{ background: "var(--paper)" }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        {/* Header — bold editorial heading left; live step counter holds the
            right negative space and ties the title to the rotation. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-9">
            <p className="mono-label">How I work</p>
            <h2
              className="display mt-5"
              style={{
                fontSize: "clamp(25px, 4.4vw, 64px)",
                lineHeight: 0.98,
                maxWidth: "15ch",
              }}
            >
              Four steps.{" "}
              <span
                className="font-display-light italic"
                style={{ color: "var(--coral)" }}
              >
                Then I disappear.
              </span>
            </h2>
          </div>
          <div className="hidden lg:flex lg:col-span-3 justify-end items-end">
            <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
              {String(active + 1).padStart(2, "0")} / 04
            </span>
          </div>
        </div>

        {/* Stage — asymmetric: copy holds the left, the tent commands the right.
            Top-aligned so the big number and the tent share a grid line, with
            deliberate negative space beneath the copy. */}
        <div className="mt-6 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center">
          {/* Left — step copy + the step navigation, stacked so copy, nav,
              and tent all fit in one viewport. */}
          <div className="lg:col-span-4">
            <div className="min-h-[170px]" style={contentStyle}>
              <span
                className="display block"
                style={{
                  fontSize: "clamp(42px, 7vw, 104px)",
                  color: "var(--coral)",
                  lineHeight: 0.82,
                }}
              >
                {current.num}
              </span>
              <h3
                className="display mt-3"
                style={{ fontSize: "clamp(26px, 2.8vw, 40px)", lineHeight: 1 }}
              >
                {current.title}
              </h3>
              <p
                className="mt-4 text-base leading-relaxed"
                style={{ color: "var(--ink-soft)", maxWidth: "38ch" }}
              >
                {current.body}
              </p>
              <p className="label mt-3" style={{ color: "var(--ocean)" }}>
                {current.aside}
              </p>
            </div>

            {/* Step navigation — designed timeline: progress track, then four
                steps each marked by a square node (filled coral when active). */}
            <div className="mt-6 lg:mt-10">
              <div
                className="relative h-px w-full"
                style={{ background: "var(--line)" }}
              >
                <div
                  className="absolute inset-y-0 left-0 w-full origin-left"
                  style={{
                    background: "var(--coral)",
                    transform: `scaleX(${(active + 1) / STEPS.length})`,
                    transition: "transform 520ms cubic-bezier(0.2, 0.7, 0.2, 1)",
                  }}
                />
              </div>

              <div className="mt-4 lg:mt-5 grid grid-cols-4 gap-3">
                {STEPS.map((s, i) => {
                  const on = i === active
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={on}
                      className="group text-left flex flex-col items-start gap-1.5 lg:gap-2.5"
                    >
                      <span
                        aria-hidden
                        className="block"
                        style={{
                          width: 11,
                          height: 11,
                          background: on ? "var(--coral)" : "transparent",
                          border: `1px solid ${
                            on ? "var(--coral)" : "var(--ink-soft)"
                          }`,
                          opacity: on ? 1 : 0.45,
                          transition:
                            "background 300ms ease, border-color 300ms ease, opacity 300ms ease",
                        }}
                      />
                      <span
                        className="font-mono text-xs tabular-nums transition-colors"
                        style={{
                          color: on ? "var(--coral)" : "var(--ink-soft)",
                          opacity: on ? 1 : 0.6,
                        }}
                      >
                        {s.num}
                      </span>
                      <span
                        className="font-display tight"
                        style={{
                          fontSize: on
                            ? "clamp(17px, 1.6vw, 23px)"
                            : "clamp(14px, 1.3vw, 18px)",
                          color: on ? "var(--ink)" : "var(--ink-soft)",
                          opacity: on ? 1 : 0.5,
                          transition:
                            "font-size 360ms cubic-bezier(0.2, 0.7, 0.2, 1), color 300ms ease, opacity 300ms ease",
                        }}
                      >
                        {s.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right — tent rising (its own clear space; scales, never cropped) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-auto max-h-[180px] md:max-h-[42vh]"
              fill="none"
              stroke="var(--ink)"
              aria-hidden
            >
              {/* Ground */}
              <path ref={groundRef} d="M 60 420 L 740 420" strokeWidth="2" />

              {/* Poles */}
              <g ref={polesRef}>
                <path d="M 140 420 L 140 320" strokeWidth="2" />
                <path d="M 400 420 L 400 120" strokeWidth="2.5" />
                <path d="M 660 420 L 660 320" strokeWidth="2" />
              </g>

              {/* Ridge / peak structure */}
              <g ref={ridgeRef}>
                <path
                  d="M 60 360 L 140 320 L 400 120 L 660 320 L 740 360"
                  strokeWidth="2.5"
                  stroke="var(--coral)"
                />
                <path
                  d="M 400 120 L 280 60"
                  strokeWidth="0.75"
                  opacity="0.6"
                  strokeDasharray="6 3"
                />
                <path
                  d="M 400 120 L 520 60"
                  strokeWidth="0.75"
                  opacity="0.6"
                  strokeDasharray="6 3"
                />
              </g>

              {/* Canvas drape */}
              <g ref={canvasRef}>
                <path d="M 60 360 L 60 420" strokeWidth="1.5" opacity="0.85" />
                <path d="M 740 360 L 740 420" strokeWidth="1.5" opacity="0.85" />
                <path
                  d="M 140 320 L 260 240 L 400 120 L 540 240 L 660 320"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
                <path
                  d="M 140 320 L 400 240"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="3 2"
                />
                <path
                  d="M 660 320 L 400 240"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="3 2"
                />
              </g>

              {/* Flag */}
              <g ref={flagRef}>
                <line x1="400" y1="120" x2="400" y2="80" stroke="var(--coral)" strokeWidth="2" />
                <path
                  d="M 400 80 L 432 92 L 400 104"
                  stroke="var(--coral)"
                  strokeWidth="2"
                  fill="var(--coral)"
                />
              </g>
            </svg>
          </div>
        </div>

      </div>
    </section>
  )
}
