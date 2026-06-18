"use client"

import { useEffect, useState } from "react"
import { Logo } from "./logo"

type NavItem =
  | { label: string; href: string }
  | { label: string; children: { label: string; href: string }[] }

const LINKS: NavItem[] = [
  { href: "/#what", label: "What I do" },
  { href: "/#how", label: "How I work" },
  {
    label: "Services",
    children: [
      { href: "/#tents", label: "Tents" },
      { href: "/generators", label: "Generators" },
      { href: "/staging", label: "Staging" },
    ],
  },
  { href: "/build", label: "Build a tent" },
  { href: "/#help", label: "Talk" },
]

// `solid` forces the opaque/dark treatment for pages without a dark hero (e.g. /build).
export function Nav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false)
  // Over the dark hero we want the light logo; once scrolled past, dark
  const [overHero, setOverHero] = useState(!solid)
  // Mobile menu open/closed
  const [menuOpen, setMenuOpen] = useState(false)
  // Desktop Services dropdown
  const [servicesOpen, setServicesOpen] = useState(false)
  // Mobile Services accordion
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  // Entrance animation + responsive logo sizing
  const [mounted, setMounted] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    if (solid) {
      setScrolled(true)
      setOverHero(false)
      return
    }
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      setOverHero(window.scrollY < window.innerHeight * 0.85)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [solid])

  // Close the menu on Escape, and lock body scroll while it's open
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // Close the desktop dropdown on Escape
  useEffect(() => {
    if (!servicesOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [servicesOpen])

  // Reset the mobile accordion whenever the mobile menu closes
  useEffect(() => {
    if (!menuOpen) setMobileServicesOpen(false)
  }, [menuOpen])

  // Trigger the one-time entrance animation after first paint
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  // Honor reduced-motion, and track the desktop breakpoint for logo proportion
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const desk = window.matchMedia("(min-width: 768px)")
    const sync = () => {
      setReduced(motion.matches)
      setIsDesktop(desk.matches)
    }
    sync()
    motion.addEventListener("change", sync)
    desk.addEventListener("change", sync)
    return () => {
      motion.removeEventListener("change", sync)
      desk.removeEventListener("change", sync)
    }
  }, [])

  // The menu panel is always on light paper, so its bars/links read dark.
  // The header hamburger itself adapts to whatever it sits over.
  const iconColor = menuOpen
    ? "var(--ink)"
    : overHero
    ? "#fcf8f0"
    : "var(--ink)"

  // Opaque paper bar once scrolled off the hero, or while the menu is open.
  const showSolidBar = (scrolled && !overHero) || menuOpen

  const linkColor = overHero ? "#fcf8f0" : "var(--ink-soft)"

  // Mobile hamburger — a bordered control that adapts to the header context
  // (glassy/light over the dark hero, subtle dark-on-cream once solid).
  const overDarkHeader = !menuOpen && overHero
  const burgerBorder = overDarkHeader
    ? "rgba(252, 248, 240, 0.34)"
    : "rgba(22, 29, 36, 0.16)"
  const burgerBg = overDarkHeader
    ? "rgba(252, 248, 240, 0.06)"
    : "rgba(250, 246, 238, 0.6)"

  // Calm staggered fade/slide for mobile-menu items as the panel opens.
  const itemStyle = (i: number): React.CSSProperties =>
    reduced
      ? {
          opacity: menuOpen ? 1 : 0,
          transition: `opacity 300ms ease ${menuOpen ? 60 + i * 40 : 0}ms`,
        }
      : {
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? "translateY(0)" : "translateY(6px)",
          transition: `opacity 420ms ease ${
            menuOpen ? 70 + i * 45 : 0
          }ms, transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1) ${
            menuOpen ? 70 + i * 45 : 0
          }ms`,
        }

  // Larger, proportional logo on desktop; gently shrinks once scrolled.
  const logoHeight = isDesktop ? (scrolled ? 60 : 76) : scrolled ? 44 : 52

  // Nav cluster entrance: gentle fade + slight slide-down, following the logo.
  // Suppressed for reduced-motion users.
  const entranceStyle: React.CSSProperties = {
    opacity: mounted ? 1 : 0,
    transform: !reduced && !mounted ? "translateY(-8px)" : "translateY(0)",
    transition: reduced
      ? "opacity 600ms ease-out 220ms"
      : "opacity 800ms ease-out 240ms, transform 800ms cubic-bezier(0.2, 0.7, 0.2, 1) 240ms",
    willChange: "opacity, transform",
  }

  // Logo entrance — leads the cascade: it fades, settles up into place, and the
  // tent/mountain mark wipes in left-to-right like it's drawing itself.
  const logoStyle: React.CSSProperties = reduced
    ? { opacity: mounted ? 1 : 0, transition: "opacity 700ms ease-out 80ms" }
    : {
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(9px)",
        clipPath: mounted ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
        transition:
          "opacity 900ms ease-out 100ms, transform 900ms cubic-bezier(0.2, 0.7, 0.2, 1) 100ms, clip-path 1200ms cubic-bezier(0.2, 0.7, 0.2, 1) 100ms",
        willChange: "opacity, transform, clip-path",
      }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
      style={{
        background: showSolidBar ? "rgba(250, 246, 238, 0.78)" : "transparent",
        backdropFilter: showSolidBar ? "blur(14px)" : "none",
        borderBottom: showSolidBar
          ? "1px solid rgba(221, 207, 177, 0.55)"
          : "1px solid transparent",
      }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10 flex items-center justify-between gap-6 lg:gap-10">
        <a
          href="/"
          className="flex items-center"
          aria-label="Tentworks home"
          onClick={() => setMenuOpen(false)}
          style={logoStyle}
        >
          <Logo
            variant={menuOpen || !overHero ? "dark" : "light"}
            height={logoHeight}
            className="transition-all duration-300"
          />
        </a>

        {/* Right cluster — desktop links sit flush right; hamburger on mobile */}
        <div className="flex items-center" style={entranceStyle}>
          <nav className="hidden md:flex items-center gap-9 lg:gap-11">
            {LINKS.map((l) =>
              "children" in l ? (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setServicesOpen(false)
                    }
                  }}
                >
                  <button
                    type="button"
                    className="text-sm tracking-wide opacity-80 transition-opacity duration-300 hover:opacity-100 inline-flex items-center gap-1.5"
                    style={{ color: linkColor }}
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                    onClick={() => setServicesOpen((o) => !o)}
                    onFocus={() => setServicesOpen(true)}
                  >
                    {l.label}
                    <svg
                      width="9"
                      height="9"
                      viewBox="0 0 10 10"
                      fill="none"
                      aria-hidden
                      className="transition-transform duration-300"
                      style={{
                        transform: servicesOpen ? "rotate(180deg)" : "none",
                      }}
                    >
                      <path
                        d="M1 3.5 5 7l4-3.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Dropdown panel — pt-3 forms a hover bridge to the trigger */}
                  <div
                    className="absolute left-0 top-full pt-3 transition-all duration-200"
                    style={{
                      opacity: servicesOpen ? 1 : 0,
                      transform: servicesOpen
                        ? "translateY(0)"
                        : "translateY(-6px)",
                      pointerEvents: servicesOpen ? "auto" : "none",
                    }}
                  >
                    <div
                      className="min-w-[210px] py-2"
                      style={{
                        background: "rgba(250, 246, 238, 0.97)",
                        backdropFilter: "blur(14px)",
                        border: "1px solid rgba(221, 207, 177, 0.55)",
                        boxShadow: "0 18px 40px -18px rgba(22, 29, 36, 0.35)",
                      }}
                    >
                      {l.children.map((c) => (
                        <a
                          key={c.href}
                          href={c.href}
                          className="block px-5 py-2.5 text-sm tracking-wide opacity-75 transition-opacity duration-200 hover:opacity-100"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm tracking-wide opacity-80 transition-opacity duration-300 hover:opacity-100"
                  style={{ color: linkColor }}
                >
                  {l.label}
                </a>
              )
            )}
          </nav>

          {/* Hamburger — mobile only, a bordered control that morphs to an X */}
          <button
            type="button"
            className="md:hidden relative inline-flex items-center justify-center w-11 h-11 rounded-full border transition-[transform,background-color,border-color] duration-300 active:scale-90"
            style={{
              borderColor: burgerBorder,
              background: burgerBg,
              backdropFilter: overDarkHeader ? "blur(6px)" : "none",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block w-5 h-3.5" aria-hidden>
              <span
                className="absolute left-0 block h-[2px] w-5 rounded-full transition-all duration-300"
                style={{
                  background: iconColor,
                  top: menuOpen ? "6px" : "0px",
                  transform: menuOpen ? "rotate(45deg)" : "none",
                }}
              />
              <span
                className="absolute left-0 top-[6px] block h-[2px] w-5 rounded-full transition-all duration-300"
                style={{ background: iconColor, opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="absolute left-0 block h-[2px] w-5 rounded-full transition-all duration-300"
                style={{
                  background: iconColor,
                  top: menuOpen ? "6px" : "12px",
                  transform: menuOpen ? "rotate(-45deg)" : "none",
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel — scrolls if the screen is short; no horizontal scroll */}
      <div
        id="mobile-menu"
        className="md:hidden overflow-y-auto overscroll-contain transition-[max-height,opacity] duration-400 ease-out"
        style={{
          maxHeight: menuOpen ? "80vh" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <nav className="mx-auto max-w-[1340px] px-6 pt-3 pb-8 flex flex-col">
          {/* Coral stamp — a small technical accent opening the panel */}
          <span
            className="block h-px w-10 mb-4"
            style={{ background: "var(--coral)", ...itemStyle(0) }}
            aria-hidden
          />

          {LINKS.map((l, i) =>
            "children" in l ? (
              <div key={l.label} style={itemStyle(i + 1)}>
                <button
                  type="button"
                  className="font-display w-full py-4 border-b flex items-center justify-between transition-colors"
                  style={{
                    color: mobileServicesOpen ? "var(--coral)" : "var(--ink)",
                    borderColor: "rgba(221, 207, 177, 0.5)",
                    fontSize: "1.45rem",
                  }}
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((o) => !o)}
                >
                  {l.label}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                    className="transition-transform duration-300"
                    style={{
                      transform: mobileServicesOpen ? "rotate(180deg)" : "none",
                    }}
                  >
                    <path
                      d="M1 3.5 5 7l4-3.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                  style={{
                    maxHeight: mobileServicesOpen ? "260px" : "0px",
                    opacity: mobileServicesOpen ? 1 : 0,
                  }}
                >
                  {/* Sub-links — grouped under a coral rail, larger tap area */}
                  <div
                    className="my-2 pl-5 flex flex-col"
                    style={{ borderLeft: "1px solid rgba(216, 90, 60, 0.4)" }}
                  >
                    {l.children.map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        onClick={() => setMenuOpen(false)}
                        className="font-display block py-3 transition-opacity hover:opacity-70"
                        style={{ color: "var(--ink-soft)", fontSize: "1.1rem" }}
                      >
                        {c.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="font-display py-4 border-b transition-opacity hover:opacity-70"
                style={{
                  color: "var(--ink)",
                  borderColor: "rgba(221, 207, 177, 0.5)",
                  fontSize: "1.45rem",
                  ...itemStyle(i + 1),
                }}
              >
                {l.label}
              </a>
            )
          )}

          {/* Contact / location row — calm closing line */}
          <p
            className="mono-label mt-7"
            style={{ color: "var(--ink-soft)", ...itemStyle(LINKS.length + 1) }}
          >
            Maui, Hawaii ·{" "}
            <a
              href="tel:+18084444407"
              onClick={() => setMenuOpen(false)}
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--coral)" }}
            >
              808 · 444 · 4407
            </a>
          </p>
        </nav>
      </div>
    </header>
  )
}
