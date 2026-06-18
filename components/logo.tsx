"use client"

/**
 * Tentworks logo — the real brand mark from mauitentworks.com:
 * three peaked tent ridges with flags + "TENTWORKS" wordmark + "Maui, Hawaii".
 * Source asset is 4024×1696, black on transparent.
 *
 * On dark backgrounds, invert via CSS filter to render white.
 */

const REAL_LOGO = "/brand/tentworks-real.png"
const ASPECT = 4024 / 1696

export function Logo({
  variant = "dark",
  height = 56,
  className = "",
}: {
  /** "dark" = black logo on light bg, "light" = inverted white on dark bg */
  variant?: "dark" | "light"
  height?: number
  className?: string
}) {
  return (
    <img
      src={REAL_LOGO}
      alt="Tentworks — Maui, Hawaii"
      width={height * ASPECT}
      height={height}
      className={className}
      style={{
        height,
        width: "auto",
        filter: variant === "light" ? "invert(1)" : "none",
      }}
      draggable={false}
    />
  )
}
