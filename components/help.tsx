"use client"

import { useState } from "react"
import { Reveal } from "./reveal"

const FAQS = [
  {
    q: "How far ahead should I call?",
    a: "Earlier is better. Six to nine months for a wedding is common; bigger structures want a year. But if the day is closer than that, call anyway — we&apos;ll tell you honestly whether it can be done.",
  },
  {
    q: "Do you do permits?",
    a: "Yes, when permits are needed. We handle the engineering paperwork and the local code work. You don&apos;t have to learn anything about it.",
  },
  {
    q: "What if the weather changes?",
    a: "It will. That&apos;s why we build for trade winds and salt air, not against them. We have sidewalls for rain, we have anchor systems for wind. The tent stands.",
  },
  {
    q: "Do you ship off-island?",
    a: "Sometimes. We&apos;ve worked on the mainland and the other islands. Tell us what you&apos;re thinking — if we can&apos;t do it, we&apos;ll point you to who can.",
  },
  {
    q: "What does it cost?",
    a: "Depends on the size, the site, the date, the canvas finish. There&apos;s no calculator — every event is its own thing. After we talk, you get a real number that doesn&apos;t change once we shake on it.",
  },
  {
    q: "Can I see references?",
    a: "Of course. After we&apos;ve talked once and we know what kind of event you&apos;re holding, we&apos;ll connect you with a couple of past clients running a similar room.",
  },
]

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            className="soft-card overflow-hidden transition-shadow duration-300"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-7 lg:px-9 py-6 flex items-center justify-between gap-4 hover:bg-[color:var(--paper)] transition-colors"
            >
              <span
                className="display"
                style={{ fontSize: "clamp(20px, 2vw, 26px)" }}
              >
                {f.q}
              </span>
              <span
                className="text-2xl transition-transform duration-300"
                style={{
                  color: "var(--coral)",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                }}
              >
                +
              </span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-500 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p
                  className="body px-7 lg:px-9 pb-7"
                  style={{ color: "var(--ink-soft)" }}
                  dangerouslySetInnerHTML={{ __html: f.a }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xbdeevdg"

function HelpForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    name: "",
    contact: "",
    date: "",
    location: "",
    moment: "",
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: "New message — Tentworks contact form",
          name: draft.name,
          "email or phone": draft.contact,
          when: draft.date,
          where: draft.location,
          "what they're holding": draft.moment,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(
          data?.errors?.[0]?.message ||
            "Something went wrong. Please call 808 · 444 · 4407."
        )
      }
    } catch {
      setError("Network hiccup. Please call 808 · 444 · 4407.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="soft-card p-10 lg:p-12">
        <p className="label" style={{ color: "var(--coral)" }}>
          Got it
        </p>
        <h3
          className="display mt-4"
          style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
        >
          We&apos;ll write back within a day.
        </h3>
        <p className="body mt-6" style={{ color: "var(--ink-soft)" }}>
          Every message is read. If it&apos;s urgent, the phone always
          works — <a href="tel:+18084444407" className="link">808 · 444 · 4407</a>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="soft-card p-8 lg:p-10 space-y-5">
      <div>
        <label className="label" htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          required
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          className="mt-2 w-full px-5 py-4 bg-transparent border focus:outline-none transition-colors"
          style={{
            borderRadius: 0,
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>
      <div>
        <label className="label" htmlFor="contact">Email or phone — either works</label>
        <input
          id="contact"
          type="text"
          required
          value={draft.contact}
          onChange={(e) => setDraft({ ...draft, contact: e.target.value })}
          className="mt-2 w-full px-5 py-4 bg-transparent border focus:outline-none transition-colors"
          style={{
            borderRadius: 0,
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="label" htmlFor="date">When (roughly)</label>
          <input
            id="date"
            type="text"
            placeholder="June 2026, or just a feeling"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            className="mt-2 w-full px-5 py-4 bg-transparent border focus:outline-none"
            style={{
              borderRadius: 0,
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>
        <div>
          <label className="label" htmlFor="location">Where</label>
          <input
            id="location"
            type="text"
            placeholder="The lawn at the inn, Honolua bluff, my backyard…"
            value={draft.location}
            onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            className="mt-2 w-full px-5 py-4 bg-transparent border focus:outline-none"
            style={{
              borderRadius: 0,
              borderColor: "var(--line)",
              color: "var(--ink)",
            }}
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="moment">What you&apos;re holding</label>
        <textarea
          id="moment"
          rows={5}
          required
          placeholder="Wedding, family reunion, gallery opening, memorial, doesn&apos;t-matter — just tell us a little about the day."
          value={draft.moment}
          onChange={(e) => setDraft({ ...draft, moment: e.target.value })}
          className="mt-2 w-full px-5 py-4 bg-transparent border focus:outline-none resize-none"
          style={{
            borderRadius: 0,
            borderColor: "var(--line)",
            color: "var(--ink)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="label" style={{ opacity: 0.7 }}>
          One reply. No newsletter. A real person writes you back.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-coral"
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Sending…" : "Send it →"}
        </button>
      </div>
      {error && (
        <p className="label" style={{ color: "var(--coral)" }}>
          {error}
        </p>
      )}
    </form>
  )
}

export function Help() {
  return (
    <section id="help" className="relative py-20 md:py-28" style={{ background: "var(--paper)" }}>
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label">Help, not sell</p>
            </Reveal>
            <Reveal delay={120}>
              <h2
                className="display mt-5"
                style={{ fontSize: "clamp(38px, 5vw, 68px)" }}
              >
                Talk to{" "}
                <span className="display-italic" style={{ color: "var(--coral)" }}>
                  Tentworks.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p
                className="body mt-5"
                style={{ color: "var(--ink-soft)" }}
              >
                Tell us what you&apos;re holding, where, and when. We&apos;ll help
                you figure out the structure, power, staging, and layout that
                fits the day.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8 space-y-3">
                <a
                  href="tel:+18084444407"
                  className="block soft-card p-6 hover:bg-[color:var(--cream)] transition-colors"
                >
                  <p className="label">Phone — most direct</p>
                  <p
                    className="display mt-2"
                    style={{ fontSize: "clamp(28px, 3vw, 40px)" }}
                  >
                    808 · 444 · 4407
                  </p>
                  <p className="label mt-2" style={{ opacity: 0.7 }}>
                    Hawaii time. Voicemail when we&apos;re on a build. We call back.
                  </p>
                </a>

                <a
                  href="mailto:joe@mauitentworks.com"
                  className="block soft-card p-6 hover:bg-[color:var(--cream)] transition-colors"
                >
                  <p className="label">Email</p>
                  <p
                    className="display mt-2"
                    style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}
                  >
                    joe@mauitentworks.com
                  </p>
                  <p className="label mt-2" style={{ opacity: 0.7 }}>
                    Read same day. Replies within one.
                  </p>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <HelpForm />
            </Reveal>
          </div>
        </div>

        {/* Questions — balanced two-column: intro left, accordion right */}
        <div className="mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label">Questions</p>
            </Reveal>
            <Reveal delay={120}>
              <h2
                className="display mt-5"
                style={{
                  fontSize: "clamp(28px, 3.4vw, 44px)",
                  lineHeight: 1.02,
                  maxWidth: "16ch",
                }}
              >
                Things people ask before a build.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p
                className="body mt-5"
                style={{ color: "var(--ink-soft)", maxWidth: "44ch" }}
              >
                Timelines, permits, weather, and cost all depend on the site.
                These answers cover the basics before we talk details.
              </p>
            </Reveal>
            <Reveal delay={280}>
              <a
                href="#help"
                className="inline-flex items-center gap-1.5 mt-8 text-base transition-opacity hover:opacity-70"
                style={{ color: "var(--coral)" }}
              >
                Still unsure? Talk to Tentworks <span aria-hidden>→</span>
              </a>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <Faq />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
