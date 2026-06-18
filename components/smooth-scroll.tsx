"use client"

import { useEffect, useRef, type ReactNode } from "react"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis smooth-scroll + GSAP ScrollTrigger sync.
 * - Lenis owns the scroll loop (RAF-driven).
 * - On each lenis scroll tick, ScrollTrigger.update() runs.
 * - Other components subscribe via the "lenis:scroll" CustomEvent on window,
 *   payload = { scroll, progress, velocity }. This is how the shader hero
 *   stays in step with the smoothed scroll instead of stale window.scrollY.
 *
 * `prefers-reduced-motion: reduce` — disable Lenis entirely, native scroll.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reduce) {
      // Honor user preference: skip Lenis entirely, native scroll.
      // Components can still listen for lenis:scroll and fall back to
      // window.scrollY when Lenis isn't running.
      const onNative = () => {
        const evt = new CustomEvent("lenis:scroll", {
          detail: {
            scroll: window.scrollY,
            limit: document.body.scrollHeight - window.innerHeight,
            progress:
              window.scrollY /
              Math.max(1, document.body.scrollHeight - window.innerHeight),
            velocity: 0,
          },
        })
        window.dispatchEvent(evt)
        ScrollTrigger.update()
      }
      window.addEventListener("scroll", onNative, { passive: true })
      onNative()
      return () => window.removeEventListener("scroll", onNative)
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    // Broadcast scroll state for any component that wants to subscribe.
    lenis.on(
      "scroll",
      ({
        scroll,
        limit,
        velocity,
        progress,
      }: {
        scroll: number
        limit: number
        velocity: number
        progress: number
      }) => {
        const evt = new CustomEvent("lenis:scroll", {
          detail: { scroll, limit, progress, velocity },
        })
        window.dispatchEvent(evt)
        ScrollTrigger.update()
      }
    )

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Refresh ScrollTrigger once fonts are ready — pin positions depend on
    // measured heights, which change once Cormorant + Newsreader land.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((st) => st.kill())
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}

/**
 * Hook for subscribing to the Lenis (or native fallback) scroll stream.
 * Payload: { scroll, limit, progress, velocity }
 */
export type LenisScrollDetail = {
  scroll: number
  limit: number
  progress: number
  velocity: number
}
