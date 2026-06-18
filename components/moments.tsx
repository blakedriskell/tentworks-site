"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

/**
 * Moments — real Tentworks event photography (mauitentworks.com).
 * One cinematic image feature with an attached caption/controls overlay.
 * Auto-advances slowly once in view; pauses briefly after any manual control.
 */

const PHOTOS = [
  {
    src: "/photos/wix/joe-panorama.jpg",
    alt: "White clearspan tents on a rock point over turquoise water",
    caption: "Oceanfront clearspan on the rocks",
    detail: "Glass walls open to the water",
  },
  {
    src: "/photos/wix/joe-tent-3.jpg",
    alt: "Clearspan tent in a tropical garden with bougainvillea",
    caption: "Garden ceremony",
    detail: "Walls open, bougainvillea in frame",
  },
  {
    src: "/photos/wix/joe-tent-2.jpg",
    alt: "Clearspan tent with palm-tree silhouettes at sunset",
    caption: "Sunset reception",
    detail: "Over the channel",
  },
  {
    src: "/photos/wix/joe-tall-legs.jpg",
    alt: "Tall-leg frame tent on a green lawn overlooking the ocean and a distant island",
    caption: "Upcountry lawn",
    detail: "Ocean and the island beyond",
  },
]

const DWELL_MS = 5000
const PAUSE_AFTER_CLICK_MS = 8000
const N = PHOTOS.length

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={dir === "left" ? "M15 5 L8 12 L15 19" : "M9 5 L16 12 L9 19"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Moments() {
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false)
  const [interaction, setInteraction] = useState(0)
  const [entered, setEntered] = useState(true)

  const current = PHOTOS[active]

  // Honor reduced-motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // Start auto-advancing only once the section is in view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Slow auto-advance — gated on visibility, not reduced-motion, not paused.
  useEffect(() => {
    if (!inView || reduced || paused) return
    const id = window.setTimeout(() => setActive((a) => (a + 1) % N), DWELL_MS)
    return () => window.clearTimeout(id)
  }, [active, inView, reduced, paused])

  // Resume auto-advance a beat after the last manual control.
  useEffect(() => {
    if (!paused) return
    const id = window.setTimeout(() => setPaused(false), PAUSE_AFTER_CLICK_MS)
    return () => window.clearTimeout(id)
  }, [paused, interaction])

  // Re-trigger the caption's fade when the slide changes.
  useEffect(() => {
    setEntered(false)
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [active])

  const pauseNow = () => {
    setPaused(true)
    setInteraction((n) => n + 1)
  }
  const go = (dir: number) => {
    setActive((a) => (a + dir + N) % N)
    pauseNow()
  }
  const jump = (i: number) => {
    setActive(i)
    pauseNow()
  }

  const captionStyle: React.CSSProperties = {
    opacity: entered ? 1 : 0,
    transform: reduced ? "none" : entered ? "translateY(0)" : "translateY(8px)",
    transition: !entered
      ? "none"
      : reduced
      ? "opacity 200ms ease-out"
      : "opacity 450ms ease-out, transform 450ms cubic-bezier(0.2, 0.7, 0.2, 1)",
  }

  const ctrlBtn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors"

  return (
    <section id="moments" ref={sectionRef} className="relative py-20 md:py-28">
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        {/* Compact header — headline left, supporting copy right, baseline-aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-5 items-end">
          <div className="lg:col-span-7">
            <p className="mono-label">Real events · Maui</p>
            <h2
              className="display mt-4"
              style={{
                fontSize: "clamp(34px, 4.6vw, 64px)",
                lineHeight: 0.98,
                maxWidth: "14ch",
              }}
            >
              Spaces made for{" "}
              <span className="display-italic" style={{ color: "var(--coral)" }}>
                the moment.
              </span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p
              className="text-base leading-relaxed"
              style={{ color: "var(--ink-soft)", maxWidth: "46ch" }}
            >
              From oceanfront clearspans to garden ceremonies, each build is
              shaped around the site, the weather, and the people inside it.
            </p>
          </div>
        </div>

        {/* Cinematic image feature — full width, strong crop, attached overlay */}
        <div
          className="photo-frame crop-marks relative w-full overflow-hidden mt-8 lg:mt-10"
          style={{ height: "clamp(360px, 62vh, 660px)" }}
        >
          {PHOTOS.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition: "center 45%",
                opacity: i === active ? 1 : 0,
                transition: reduced ? "none" : "opacity 800ms ease-in-out",
              }}
            />
          ))}

          {/* Scrim — keeps the overlay legible without flattening the image */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
            style={{
              height: "55%",
              background:
                "linear-gradient(180deg, rgba(12,18,22,0) 0%, rgba(12,18,22,0.62) 100%)",
            }}
          />

          {/* Caption + controls bar — attached to the image */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8 lg:p-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              {/* Caption */}
              <div style={captionStyle}>
                <p className="mono-label" style={{ color: "var(--coral)" }}>
                  {String(active + 1).padStart(2, "0")} /{" "}
                  {String(N).padStart(2, "0")}
                </p>
                <h3
                  className="display mt-3"
                  style={{
                    fontSize: "clamp(24px, 2.6vw, 38px)",
                    lineHeight: 1.04,
                    color: "#fcf8f0",
                  }}
                >
                  {current.caption}
                </h3>
                <p
                  className="label mt-2"
                  style={{ color: "rgba(252, 248, 240, 0.72)" }}
                >
                  {current.detail}
                </p>
              </div>

              {/* Controls — prev/next + progress dashes */}
              <div className="flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-2">
                  {PHOTOS.map((p, i) => {
                    const on = i === active
                    return (
                      <button
                        key={p.src}
                        type="button"
                        onClick={() => jump(i)}
                        aria-label={`Photo ${i + 1}: ${p.caption}`}
                        aria-current={on}
                        className="h-[2px] rounded-full transition-all duration-300 ease-out"
                        style={{
                          width: on ? 26 : 14,
                          background: on
                            ? "var(--coral)"
                            : "rgba(252, 248, 240, 0.5)",
                        }}
                      />
                    )
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous photo"
                    className={ctrlBtn}
                    style={{
                      border: "1px solid rgba(252, 248, 240, 0.45)",
                      color: "#fcf8f0",
                    }}
                  >
                    <Chevron dir="left" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next photo"
                    className={ctrlBtn}
                    style={{
                      border: "1px solid rgba(252, 248, 240, 0.45)",
                      color: "#fcf8f0",
                    }}
                  >
                    <Chevron dir="right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mono-label mt-4" style={{ opacity: 0.4 }}>
          mauitentworks.com
        </p>
      </div>
    </section>
  )
}
