"use client"

import { useEffect, useRef } from "react"

/**
 * Opener — generous, slow, painterly. Pure SVG (no photos, no WebGL).
 * Layered shapes drift, sun pulses, palm fronds sway via CSS transforms.
 * Reads as Maui-warm without resorting to stock imagery.
 */
export function Opener() {
  const ref = useRef<HTMLDivElement>(null)

  // Subtle parallax on scroll — the back layer drifts up slower than the front
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const el = ref.current
      if (!el) return
      const layers = el.querySelectorAll<HTMLElement>("[data-parallax]")
      layers.forEach((l) => {
        const speed = Number(l.dataset.parallax ?? "0")
        l.style.transform = `translate3d(0, ${y * speed}px, 0)`
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section id="top" ref={ref} className="relative min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden">
      {/* Soft horizon wash — back layer */}
      <div
        data-parallax="-0.15"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 28%, rgba(238,155,61,0.22), transparent 65%), radial-gradient(ellipse 80% 40% at 50% 65%, rgba(47,109,124,0.12), transparent 70%)",
        }}
      />

      {/* Mountains — far */}
      <svg
        data-parallax="-0.06"
        className="absolute inset-x-0 bottom-0 w-full pointer-events-none -z-10 drift-slow"
        viewBox="0 0 1440 360"
        preserveAspectRatio="none"
        style={{ height: "55vh", color: "var(--ocean)" }}
        aria-hidden
      >
        <path
          d="M 0 220 L 90 180 L 180 200 L 280 130 L 360 170 L 460 110 L 560 150 L 680 120 L 800 170 L 920 130 L 1040 180 L 1180 140 L 1300 200 L 1440 160 L 1440 360 L 0 360 Z"
          fill="currentColor"
          opacity="0.22"
        />
      </svg>

      {/* Mountains — middle, deeper */}
      <svg
        data-parallax="-0.03"
        className="absolute inset-x-0 bottom-0 w-full pointer-events-none -z-10"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: "42vh", color: "var(--deep)" }}
        aria-hidden
      >
        <path
          d="M 0 230 L 120 200 L 240 240 L 380 180 L 520 210 L 660 150 L 800 200 L 940 160 L 1080 220 L 1220 180 L 1440 200 L 1440 320 L 0 320 Z"
          fill="currentColor"
          opacity="0.18"
        />
      </svg>

      {/* Sun */}
      <div
        data-parallax="0.04"
        className="absolute"
        style={{
          right: "12%",
          top: "22%",
          width: "260px",
          height: "260px",
          background:
            "radial-gradient(circle, rgba(252,210,140,1) 0%, rgba(238,155,61,0.7) 35%, rgba(213,96,66,0.15) 60%, transparent 80%)",
          filter: "blur(2px)",
          borderRadius: "999px",
          mixBlendMode: "screen",
        }}
        aria-hidden
      />

      {/* Palm silhouette — left foreground */}
      <svg
        data-parallax="0.06"
        className="absolute pointer-events-none"
        style={{
          left: "-30px",
          bottom: "-20px",
          width: "300px",
          height: "560px",
          color: "var(--ink)",
          transformOrigin: "bottom center",
        }}
        viewBox="0 0 300 560"
        aria-hidden
      >
        <g style={{ animation: "drift 7s ease-in-out infinite", transformOrigin: "150px 540px" }}>
          {/* Trunk */}
          <path
            d="M 145 540 C 148 460 160 380 158 300 C 156 230 168 170 175 110"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          {/* Fronds */}
          {[-1, -0.55, -0.18, 0.2, 0.55, 0.95].map((r, i) => (
            <path
              key={i}
              d="M 175 110 Q 220 75 290 95 Q 240 100 175 130"
              fill="currentColor"
              opacity="0.92"
              transform={`rotate(${r * 55} 175 110)`}
            />
          ))}
        </g>
      </svg>

      {/* Palm silhouette — right foreground, smaller, further */}
      <svg
        data-parallax="0.03"
        className="absolute pointer-events-none"
        style={{
          right: "5%",
          bottom: "-40px",
          width: "180px",
          height: "380px",
          color: "var(--ink)",
          opacity: 0.85,
        }}
        viewBox="0 0 180 380"
        aria-hidden
      >
        <g style={{ animation: "drift 9s ease-in-out infinite reverse", transformOrigin: "90px 360px" }}>
          <path
            d="M 90 360 C 92 290 96 220 94 160 C 92 110 98 70 102 40"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {[-1, -0.5, -0.1, 0.3, 0.7].map((r, i) => (
            <path
              key={i}
              d="M 102 40 Q 135 18 175 32 Q 140 38 102 55"
              fill="currentColor"
              opacity="0.88"
              transform={`rotate(${r * 50} 102 40)`}
            />
          ))}
        </g>
      </svg>

      {/* Tent peak silhouette — foreground center-right */}
      <svg
        data-parallax="0.02"
        className="absolute pointer-events-none"
        style={{
          right: "20%",
          bottom: "10%",
          width: "320px",
          height: "200px",
          color: "var(--ink)",
        }}
        viewBox="0 0 320 200"
        aria-hidden
      >
        <path
          d="M 30 195 L 50 165 L 130 130 L 160 50 L 190 130 L 270 165 L 290 195 Z"
          fill="currentColor"
          opacity="0.92"
        />
        {/* Flag */}
        <line x1="160" y1="50" x2="160" y2="20" stroke="var(--coral)" strokeWidth="2.5" />
        <path d="M 160 20 L 180 28 L 160 36 Z" fill="var(--coral)" />
      </svg>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1340px] px-6 lg:px-10">
        <p className="label">
          <span className="line-grow inline-block w-10 h-px bg-current align-middle mr-3" />
          Maui · Hawaii · Since 1989
        </p>

        <h1
          className="display mt-8"
          style={{
            fontSize: "clamp(56px, 9vw, 132px)",
            maxWidth: "16ch",
          }}
        >
          Tell me what you&apos;re holding,{" "}
          <span className="display-italic" style={{ color: "var(--coral)" }}>
            and I&apos;ll build the room for it.
          </span>
        </h1>

        <p
          className="body mt-10"
          style={{
            color: "var(--ink-soft)",
            maxWidth: "44ch",
          }}
        >
          I&apos;m Joe. I&apos;ve been raising tents on this island for thirty-five
          years. Weddings under the trades, gatherings on the lawn, the
          once-in-a-lifetime stuff. Whatever it is, I build a room that holds
          it — and I get out of the way so you can be there with the people.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a href="#help" className="btn btn-coral pulse-soft">
            Tell Joe about the moment
          </a>
          <a href="#what" className="btn btn-ghost">
            Or see what I can do
          </a>
        </div>

        <p className="label mt-14" style={{ opacity: 0.7 }}>
          ↓ scroll · take your time
        </p>
      </div>
    </section>
  )
}
