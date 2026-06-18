"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { LenisScrollDetail } from "@/components/smooth-scroll"

/* ----------------------------------------------------------------------
 * Hero — real Joe photography.
 *
 * A single full-bleed, ghosted photograph from mauitentworks.com with a
 * layered dark gradient. The Tentworks tent mark sits as a faint
 * architectural watermark that echoes the tents in the frame, and the
 * copy reveals in a slow, staggered cadence. A gentle scroll parallax —
 * wired into the site's Lenis scroll broadcast — keeps the image alive
 * without drawing attention to itself.
 *
 * Export name kept as `OceanHero` so the homepage import is unchanged.
 * ------------------------------------------------------------------- */

export function OceanHero({ children }: { children?: React.ReactNode }) {
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  // Fade the photo in only once it has decoded, so it never pops in raw.
  const [imgReady, setImgReady] = useState(false)

  // Trigger the entrance after first paint so elements animate *in*.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Fallback so the photo always reveals even if onLoad was missed (e.g. the
  // image was served from cache before the handler attached).
  useEffect(() => {
    if (imgReady) return
    const t = setTimeout(() => setImgReady(true), 1500)
    return () => clearTimeout(t)
  }, [imgReady])

  // Honor reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Subtle parallax — the image drifts slower than the scroll. Driven by the
  // SmoothScrollProvider's Lenis broadcast; the 1.12 overscan hides the edges.
  useEffect(() => {
    if (reduced) return
    const el = imageWrapRef.current
    if (!el) return
    const onScroll = (e: Event) => {
      const detail = (e as CustomEvent<LenisScrollDetail>).detail
      const y = Math.min(detail.scroll * 0.15, 140)
      el.style.transform = `scale(1.12) translateY(${y}px)`
    }
    window.addEventListener("lenis:scroll", onScroll)
    return () => window.removeEventListener("lenis:scroll", onScroll)
  }, [reduced])

  // Slow, staggered entrance. Reduced-motion users get a plain fade, no slide.
  const enter = (delay: number, dy = 18): React.CSSProperties =>
    reduced
      ? {
          opacity: mounted ? 1 : 0,
          transition: `opacity 600ms ease-out ${delay}ms`,
        }
      : {
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : `translateY(${dy}px)`,
          transition: `opacity 1100ms ease-out ${delay}ms, transform 1100ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms`,
        }

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", minHeight: "640px", background: "#0a1218" }}
    >
      {/* Full-bleed real photo background — ghosted and gently parallaxed.
          The 1.12 overscan gives the parallax room without exposing edges.
          Fades in on decode so it never flashes raw over the dark backdrop. */}
      <div
        ref={imageWrapRef}
        className="absolute inset-0"
        style={{
          transform: "scale(1.12)",
          willChange: "transform",
          opacity: imgReady ? 1 : 0,
          transition: "opacity 900ms ease-out",
        }}
      >
        <Image
          src="/photos/wix/joe-panorama.jpg"
          alt="White clearspan tents on a rock point over turquoise water, Maui"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setImgReady(true)}
          style={{
            objectPosition: "center 40%",
            filter: "brightness(0.6) contrast(0.85) saturate(0.85)",
          }}
        />
      </div>

      {/* Strong dark overlay — heavily ghosts the image and keeps the headline
          and CTAs legible across the full hero. */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,18,24,0.78) 0%, rgba(10,18,24,0.55) 30%, rgba(10,18,24,0.62) 60%, rgba(10,18,24,0.9) 100%)",
        }}
        aria-hidden
      />

      {/* Foreground content */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="relative h-full mx-auto max-w-[1340px] px-6 lg:px-10 flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16">
          {/* Top: label */}
          <p
            className="mono-label pointer-events-auto"
            style={{ color: "rgba(252, 248, 240, 0.7)", ...enter(80) }}
          >
            <span
              className="inline-block w-10 h-px align-middle mr-3"
              style={{ background: "var(--coral)" }}
            />
            Maui · Hawaii · Since 1989
          </p>

          {/* Middle: headline */}
          <div className="pointer-events-auto">
            <h1
              className="font-display tight"
              style={{
                fontSize: "clamp(40px, 7vw, 104px)",
                color: "#fcf8f0",
                textShadow: "0 6px 30px rgba(0,0,0,0.35)",
                lineHeight: 0.95,
                maxWidth: "16ch",
                ...enter(220),
              }}
            >
              Maui&rsquo;s premier event infrastructure partner.
            </h1>
            <p
              className="mt-8 text-base lg:text-lg leading-relaxed"
              style={{
                color: "rgba(252, 248, 240, 0.9)",
                textShadow: "0 4px 18px rgba(0,0,0,0.45)",
                maxWidth: "52ch",
                ...enter(380),
              }}
            >
              Exclusive tent rentals, staging, generators, and event
              infrastructure for Maui&rsquo;s most demanding gatherings.
            </p>
          </div>

          {/* Bottom: CTAs + scroll hint */}
          <div
            className="pointer-events-auto flex items-end justify-between gap-6"
            style={enter(540)}
          >
            <div className="flex flex-wrap items-center gap-4">
              <a href="#help" className="btn btn-coral pulse-soft">
                Start planning your event
              </a>
              <a
                href="#what"
                className="btn"
                style={{
                  border: "1px solid rgba(252, 248, 240, 0.4)",
                  color: "#fcf8f0",
                }}
              >
                See what I can do
              </a>
            </div>
            <p
              className="mono-label hidden sm:block"
              style={{ color: "rgba(252, 248, 240, 0.5)" }}
            >
              ↓ Scroll
            </p>
          </div>
        </div>
      </div>

      {children}
    </section>
  )
}
