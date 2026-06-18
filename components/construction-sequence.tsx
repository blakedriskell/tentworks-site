"use client"

// Ported from v0-tentworks. SVG build sequence:
// ground → poles → ridge → canvas → flag. Auto-plays once when the section
// scrolls into view (no scroll-scrub / pin). Two-column layout: text + CTA on
// the left, the building tent + a compact progress indicator on the right.
// Compatible with v11/v13 design tokens (--ink/--coral/--shell, .mono-label,
// .arch-grid, .font-display, .tight, .btn-soft, @keyframes buildPulse).

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ConstructionSequence() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const textColRef = useRef<HTMLDivElement>(null)
  const cursorBtnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const container = containerRef.current
    const svg = svgRef.current

    const phaseGroups: SVGPathElement[][] = [
      Array.from(svg.querySelectorAll(".p-ground")) as SVGPathElement[],
      Array.from(svg.querySelectorAll(".p-poles")) as SVGPathElement[],
      Array.from(svg.querySelectorAll(".p-ridge")) as SVGPathElement[],
      Array.from(svg.querySelectorAll(".p-canvas")) as SVGPathElement[],
      Array.from(svg.querySelectorAll(".p-flag")) as SVGPathElement[],
    ]

    phaseGroups.flat().forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Reduced-motion: render the finished structure immediately, no animation.
    if (reduce) {
      phaseGroups.flat().forEach((p) => gsap.set(p, { strokeDashoffset: 0 }))
      return
    }

    gsap.set(textColRef.current, { opacity: 0, y: 18 })

    const allPaths = phaseGroups.flat()

    // Return the drawing to its undrawn start — runs at each loop boundary
    // while the SVG is faded out, so the restart is never a visible snap.
    // Only stroke-dashoffset changes here: a paint property, never layout.
    const resetDrawing = () => {
      allPaths.forEach((p) => gsap.set(p, { strokeDashoffset: p.getTotalLength() }))
    }

    // Slower, clearly readable phases so the viewer can watch it build.
    const phaseDur = [1.8, 1.8, 2.2, 2.4, 1.6]
    const phasePos = [0.25, ">-0.15", ">-0.15", ">-0.15", ">-0.1"]

    // Looping build: fade in → build → hold the finished tent → fade out →
    // reset (hidden) → repeat. Only opacity + stroke-dashoffset animate, so
    // nothing triggers reflow and the section height stays fixed throughout.
    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
      defaults: { ease: "power2.inOut" },
      onRepeat: resetDrawing,
    })

    // Soft fade-in on every iteration (fromTo re-applies on each repeat)
    tl.fromTo(
      svg,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
      0
    )

    phaseGroups.forEach((group, i) => {
      // Draw this phase's strokes (stroke-dashoffset only — no reflow).
      tl.to(
        group,
        { strokeDashoffset: 0, duration: phaseDur[i], stagger: 0.08 },
        phasePos[i]
      )
    })

    // Hold the completed tent, then fade out smoothly before looping back.
    tl.to({}, { duration: 1.3 }, ">")
    tl.to(svg, { opacity: 0, duration: 0.6, ease: "power2.in" }, ">")

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 72%",
      once: true,
      onEnter: () => {
        // Gentle entrance for the copy, then loop the tent build alongside it.
        gsap.to(textColRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
        tl.play()
      },
    })

    return () => {
      trigger.kill()
      tl.kill()
    }
  }, [])

  // Magnetic button effect
  useEffect(() => {
    const btn = cursorBtnRef.current
    if (!btn) return
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const x = e.clientX - (rect.left + rect.width / 2)
      const y = e.clientY - (rect.top + rect.height / 2)
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.4, ease: "power3.out" })
    }
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" })
    }
    btn.addEventListener("mousemove", onMove)
    btn.addEventListener("mouseleave", onLeave)
    return () => {
      btn.removeEventListener("mousemove", onMove)
      btn.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden py-20 md:py-24"
      style={{ background: "var(--ink)", overflowAnchor: "none" }}
    >
      <div className="absolute inset-0 arch-grid opacity-[0.08]" aria-hidden />

      <div className="relative z-[2] mx-auto max-w-[1340px] px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-center">
        {/* LEFT — text content + CTA */}
        <div ref={textColRef} className="order-1 max-w-xl">
          <p className="mono-label" style={{ color: "var(--coral)" }}>
            BUILT AROUND THE EVENT
          </p>
          <h2
            className="font-display tight mt-4"
            style={{
              fontSize: "clamp(34px, 4.6vw, 60px)",
              color: "var(--shell)",
              lineHeight: 1.02,
              maxWidth: "16ch",
            }}
          >
            Structure, power, and staging planned as one system.
          </h2>
          <p
            className="mt-5 text-base leading-relaxed"
            style={{ color: "rgba(247,243,236,0.7)", maxWidth: "42ch" }}
          >
            From tent layout to power runs and staging needs, every piece is
            planned around the site, the weather, and the flow of the event.
          </p>
          <Link
            ref={cursorBtnRef}
            href="/build"
            className="mt-8 inline-flex items-center gap-3 px-9 py-4 font-medium transition-shadow duration-300 relative group btn-soft"
            style={{
              background: "var(--coral)",
              color: "var(--shell)",
              boxShadow: "0 0 0 0 rgba(232, 110, 86, 0.6)",
              animation: "buildPulse 2.2s ease-in-out infinite",
            }}
          >
            <span className="relative z-10">CUSTOMIZE YOUR TENT</span>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* RIGHT — the building tent, larger and visually dominant */}
        <div className="order-2 w-full flex justify-center lg:justify-end">
          {/* Fixed aspect-ratio box reserves the layout space up front, so the
              animation loop can never change the section height (no reflow). */}
          <div
            className="relative w-full max-w-[720px] lg:max-w-[820px]"
            style={{ aspectRatio: "800 / 458" }}
          >
          <svg
            ref={svgRef}
            viewBox="0 40 800 458"
            className="absolute inset-0 z-[2] w-full h-full"
            fill="none"
            stroke="currentColor"
            style={{ color: "var(--shell)" }}
            aria-hidden
          >
            {/* Faint echo ridge — a second tent outline set behind the main one
                for subtle layered depth. Static, very low opacity. */}
            <path
              d="M 30 348 L 128 300 L 400 92 L 672 300 L 770 348"
              strokeWidth="1"
              opacity="0.1"
            />

            {/* PHASE 1 — Ground line */}
            <path className="draw-path p-ground" d="M 60 420 L 740 420" strokeWidth="2" />
            <path className="draw-path p-ground" d="M 60 440 L 80 460" strokeWidth="1" opacity="0.5" />
            <path className="draw-path p-ground" d="M 200 440 L 220 460" strokeWidth="1" opacity="0.5" />
            <path className="draw-path p-ground" d="M 400 440 L 420 460" strokeWidth="1" opacity="0.5" />
            <path className="draw-path p-ground" d="M 600 440 L 620 460" strokeWidth="1" opacity="0.5" />
            <path className="draw-path p-ground" d="M 720 440 L 740 460" strokeWidth="1" opacity="0.5" />

            {/* PHASE 2 — Vertical poles */}
            <path className="draw-path p-poles" d="M 140 420 L 140 320" strokeWidth="2" />
            <path className="draw-path p-poles" d="M 400 420 L 400 120" strokeWidth="2" />
            <path className="draw-path p-poles" d="M 660 420 L 660 320" strokeWidth="2" />
            <path className="draw-path p-poles" d="M 144 420 L 158 420" strokeWidth="1" opacity="0.4" />
            <path className="draw-path p-poles" d="M 404 420 L 418 420" strokeWidth="1" opacity="0.4" />
            <path className="draw-path p-poles" d="M 664 420 L 678 420" strokeWidth="1" opacity="0.4" />

            {/* PHASE 3 — Ridge / peak structure */}
            <path className="draw-path p-ridge" d="M 60 360 L 140 320 L 400 120 L 660 320 L 740 360" strokeWidth="2.5" stroke="var(--coral)" />
            <path className="draw-path p-ridge" d="M 400 120 L 280 60" strokeWidth="0.75" opacity="0.6" strokeDasharray="6 3" />
            <path className="draw-path p-ridge" d="M 400 120 L 520 60" strokeWidth="0.75" opacity="0.6" strokeDasharray="6 3" />

            {/* PHASE 4 — Canvas drape */}
            <path className="draw-path p-canvas" d="M 60 360 L 60 420" strokeWidth="1.5" opacity="0.85" />
            <path className="draw-path p-canvas" d="M 740 360 L 740 420" strokeWidth="1.5" opacity="0.85" />
            <path className="draw-path p-canvas" d="M 140 320 L 260 240" strokeWidth="0.75" opacity="0.5" />
            <path className="draw-path p-canvas" d="M 260 240 L 400 120" strokeWidth="0.75" opacity="0.5" />
            <path className="draw-path p-canvas" d="M 400 120 L 540 240" strokeWidth="0.75" opacity="0.5" />
            <path className="draw-path p-canvas" d="M 540 240 L 660 320" strokeWidth="0.75" opacity="0.5" />
            <path className="draw-path p-canvas" d="M 140 320 L 400 240" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2" />
            <path className="draw-path p-canvas" d="M 660 320 L 400 240" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 2" />

            {/* PHASE 5 — Flag */}
            <path className="draw-path p-flag" d="M 400 120 L 400 80" strokeWidth="1.5" stroke="var(--coral)" />
            <path className="draw-path p-flag" d="M 400 80 L 432 92 L 400 104" strokeWidth="1.5" stroke="var(--coral)" />

            {/* Dimension annotations (drawn with flag phase) */}
            <path className="draw-path p-flag" d="M 40 120 L 40 420" strokeWidth="0.5" opacity="0.4" />
            <path className="draw-path p-flag" d="M 35 120 L 45 120" strokeWidth="0.5" opacity="0.4" />
            <path className="draw-path p-flag" d="M 35 420 L 45 420" strokeWidth="0.5" opacity="0.4" />
            <text x="25" y="275" fontSize="10" fill="var(--shell)" opacity="0.5" transform="rotate(-90, 25, 275)" fontFamily="ui-monospace, monospace">
              28&apos;-6&quot;
            </text>
            <path className="draw-path p-flag" d="M 60 470 L 740 470" strokeWidth="0.5" opacity="0.4" />
            <text x="400" y="488" fontSize="10" fill="var(--shell)" opacity="0.5" textAnchor="middle" fontFamily="ui-monospace, monospace">
              44&apos; × 83&apos;
            </text>
          </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
