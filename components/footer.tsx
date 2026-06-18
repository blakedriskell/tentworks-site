import { Logo } from "./logo"

// Minimal thin-line contact icons — inline SVG, no library. Shown on mobile
// only (desktop contact block is right-aligned, where leading icons don't fit).
function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

function PhoneIcon() {
  return (
    <ContactIcon>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 1.7 2z" />
    </ContactIcon>
  )
}

function MailIcon() {
  return (
    <ContactIcon>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="M3 6.5 12 13l9-6.5" />
    </ContactIcon>
  )
}

function PinIcon() {
  return (
    <ContactIcon>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="2.6" />
    </ContactIcon>
  )
}

export function Footer() {
  return (
    <footer
      className="relative py-16 md:py-20"
      style={{ background: "var(--ink)", color: "var(--cream)" }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        {/* Top — left: logo + since line + closing headline.
            Right: contact block, bottom-aligned. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-16 items-end">
          <div className="md:col-span-7">
            <div className="origin-top-left scale-[0.78] md:scale-100">
              <Logo variant="light" height={56} />
            </div>
            <p className="label mt-5 md:mt-8" style={{ color: "var(--coral)" }}>
              Maui-built event infrastructure
            </p>
            <h3
              className="display mt-4 max-w-[15ch] md:max-w-none"
              style={{ fontSize: "clamp(26px, 5vw, 64px)", color: "var(--cream)" }}
            >
              Built by hand.{" "}
              <span className="display-italic" style={{ color: "var(--sun)" }}>
                Held by the island.
              </span>
            </h3>
          </div>

          <div
            className="md:col-span-5 md:text-right border-t pt-6 md:border-t-0 md:pt-0"
            style={{ borderTopColor: "rgba(252, 248, 240, 0.12)" }}
          >
            <p
              className="label flex items-center gap-2 md:block"
              style={{ color: "rgba(252, 248, 240, 0.5)" }}
            >
              <span
                className="h-2 w-2 shrink-0 md:hidden"
                style={{ background: "var(--coral)" }}
                aria-hidden
              />
              Contact
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="tel:+18084444407"
                className="flex items-center gap-3 md:block opacity-90 transition-opacity duration-200 hover:opacity-100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 2.8vw, 38px)",
                  letterSpacing: "-0.02em",
                  color: "var(--cream)",
                }}
              >
                <span className="shrink-0 md:hidden" style={{ color: "rgba(252, 248, 240, 0.4)" }}>
                  <PhoneIcon />
                </span>
                808 · 444 · 4407
              </a>
              <a
                href="mailto:joe@mauitentworks.com"
                className="flex items-center gap-3 md:block body opacity-90 transition-opacity duration-200 hover:opacity-100"
                style={{ color: "rgba(252, 248, 240, 0.85)" }}
              >
                <span className="shrink-0 md:hidden" style={{ color: "rgba(252, 248, 240, 0.4)" }}>
                  <MailIcon />
                </span>
                joe@mauitentworks.com
              </a>
              <p
                className="flex items-center gap-3 md:block body"
                style={{ color: "rgba(252, 248, 240, 0.55)" }}
              >
                <span className="shrink-0 md:hidden" style={{ color: "rgba(252, 248, 240, 0.4)" }}>
                  <PinIcon />
                </span>
                Maui, Hawaii
              </p>
            </div>
          </div>
        </div>

        <div className="rule mt-8 md:mt-14">
          <span className="dot" />
        </div>

        {/* Bottom — copyright + simple site note */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <p className="label" style={{ color: "rgba(252, 248, 240, 0.45)" }}>
            © 2026 Tentworks
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline">Hand-built since 1989</span>
          </p>
          <p className="label hidden sm:block" style={{ color: "rgba(252, 248, 240, 0.35)" }}>
            No tracking
          </p>
        </div>
      </div>
    </footer>
  )
}
