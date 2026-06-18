import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist, Inter, JetBrains_Mono } from "next/font/google"
import { SmoothScrollProvider } from "@/components/smooth-scroll"
import "./globals.css"

// Display — geometric architectural sans. v0's identity restored.
const display = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display-actual",
  display: "swap",
})

// Body — Inter (v0 used Inter for body)
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body-actual",
  display: "swap",
})

// Mono — engineering labels, dimension annotations
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-actual",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Tentworks — Maui Event Infrastructure",
  description:
    "Tent rentals, staging, generators, and event infrastructure for Maui weddings, private gatherings, and large-scale events.",
  generator: "v13",
  openGraph: {
    title: "Tentworks — Maui Event Infrastructure",
    description:
      "Tent rentals, staging, generators, and event infrastructure for Maui weddings, private gatherings, and large-scale events.",
    images: [
      {
        url: "/og/tentworks-og.png",
        width: 1200,
        height: 630,
        alt: "Tentworks — Maui Event Infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tentworks — Maui Event Infrastructure",
    description:
      "Tent rentals, staging, generators, and event infrastructure for Maui weddings, private gatherings, and large-scale events.",
    images: ["/og/tentworks-og.png"],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="paper-bg grain relative min-h-screen">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  )
}
