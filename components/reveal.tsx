"use client"

import { useEffect, useRef, type ReactNode } from "react"

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode
  className?: string
  delay?: number
  as?: keyof React.JSX.IntrinsicElements
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -60px 0px" }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  // @ts-expect-error generic dynamic tag
  return <Tag ref={ref} className={`fade-up ${className}`}>{children}</Tag>
}
