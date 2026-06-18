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
  title: "Tentworks — Joe, on Maui, since 1989",
  description:
    "Hand-built tents for Maui weddings, gatherings, and once-in-a-lifetime moments. Tell Joe what you're holding and he'll build the room for it.",
  generator: "v13",
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
