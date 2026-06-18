import { Logo } from "./logo"

export function Footer() {
  return (
    <footer
      className="relative py-16 md:py-20"
      style={{ background: "var(--ink)", color: "var(--cream)" }}
    >
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        {/* Top — left: logo + since line + closing headline.
            Right: contact block, bottom-aligned. */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="md:col-span-7">
            <Logo variant="light" height={56} />
            <p className="label mt-8" style={{ color: "var(--coral)" }}>
              Maui-built event infrastructure
            </p>
            <h3
              className="display mt-4"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", color: "var(--cream)" }}
            >
              Built by hand.{" "}
              <span className="display-italic" style={{ color: "var(--sun)" }}>
                Held by the island.
              </span>
            </h3>
          </div>

          <div className="md:col-span-5 md:text-right">
            <p className="label" style={{ color: "rgba(252, 248, 240, 0.5)" }}>
              Contact
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="tel:+18084444407"
                className="block opacity-90 transition-opacity duration-200 hover:opacity-100"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(26px, 2.8vw, 38px)",
                  letterSpacing: "-0.02em",
                  color: "var(--cream)",
                }}
              >
                808 · 444 · 4407
              </a>
              <a
                href="mailto:joe@mauitentworks.com"
                className="block body opacity-90 transition-opacity duration-200 hover:opacity-100"
                style={{ color: "rgba(252, 248, 240, 0.85)" }}
              >
                joe@mauitentworks.com
              </a>
              <p className="body" style={{ color: "rgba(252, 248, 240, 0.55)" }}>
                Maui, Hawaii
              </p>
            </div>
          </div>
        </div>

        <div className="rule mt-14">
          <span className="dot" />
        </div>

        {/* Bottom — copyright + simple site note */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="label" style={{ color: "rgba(252, 248, 240, 0.45)" }}>
            © 2026 Tentworks · Hand-built since 1989
          </p>
          <p className="label" style={{ color: "rgba(252, 248, 240, 0.35)" }}>
            No tracking
          </p>
        </div>
      </div>
    </footer>
  )
}
