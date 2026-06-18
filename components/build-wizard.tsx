"use client"

// Conversational multi-step build planner. Two-column configurator: the left
// rail holds the hero copy, progress, and a tent that builds itself stage by
// stage as you advance; the right column holds the active question / form.
// Submit posts to the local /api/quote route handler.

import { useEffect, useState, useTransition } from "react"

type Choice = { value: string; label: string; hint?: string }

const STEPS = [
  {
    key: "event_type",
    prompt: "What kind of gathering is this?",
    sub: "Event first, footprint second — every tent starts with the feeling.",
    choices: [
      { value: "wedding", label: "A wedding", hint: "Ceremony, reception, or both" },
      { value: "luau", label: "A lu'au / family gathering", hint: "Kalua, hula, the whole island" },
      { value: "corporate", label: "Corporate / gala", hint: "Resort lawns, awards, brand" },
      { value: "festival", label: "Festival / public event", hint: "Multi-day, multi-tent" },
      { value: "backyard", label: "A backyard celebration", hint: "Birthdays, anniversaries, just because" },
      { value: "other", label: "Something else", hint: "We've probably done it" },
    ] as Choice[],
  },
  {
    key: "guest_count",
    prompt: "Roughly how many friends?",
    sub: "A best guess is fine — we'll sharpen it on the call.",
    choices: [
      { value: "under-50", label: "Under 50", hint: "Intimate, single peak" },
      { value: "50-120", label: "50–120", hint: "Sailcloth or frame" },
      { value: "120-250", label: "120–250", hint: "Multi-peak or small clearspan" },
      { value: "250-450", label: "250–450", hint: "Clearspan pavilion" },
      { value: "450+", label: "450+", hint: "The full pavilion treatment" },
    ] as Choice[],
  },
  {
    key: "tent_style",
    prompt: "What feeling are you after?",
    sub: "Pick the closest — we'll refine it on the walk.",
    choices: [
      { value: "sailcloth", label: "Romantic, glowing", hint: "Sailcloth peaks" },
      { value: "clearspan", label: "Architectural, open", hint: "Clearspan pavilion" },
      { value: "frame", label: "Intimate, garden-tucked", hint: "Frame & garden" },
      { value: "pole", label: "Classic, iconic", hint: "High-peak pole" },
      { value: "unsure", label: "Not sure yet", hint: "That's what we're here for" },
    ] as Choice[],
  },
  {
    key: "surface_type",
    prompt: "What's the ground like?",
    sub: "Surface decides anchoring. We've staked tents into everything but lava.",
    choices: [
      { value: "grass", label: "Grass / lawn" },
      { value: "sand", label: "Sand / beach" },
      { value: "concrete", label: "Concrete / pavers" },
      { value: "mixed", label: "A mix" },
      { value: "tbd", label: "Still scouting" },
    ] as Choice[],
  },
  {
    key: "event_date",
    prompt: "When (or a rough window)?",
    sub: "Even a season helps. Trade-wind weeks matter.",
    input: true,
  },
] as const

const STAGE_NAMES = [
  "Ground line",
  "Side poles",
  "Center pole",
  "Roof lines",
  "Canvas",
  "Complete",
]

/* ----------------------------------------------------------------------
 * Answer icons — minimal blueprint-style line glyphs, one per question.
 * `currentColor` so each card can tint them (ink → coral when active).
 * ------------------------------------------------------------------- */
function IconFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

// Gathering — two figures
function GatheringIcon() {
  return (
    <IconFrame>
      <circle cx="8" cy="8" r="2.6" />
      <circle cx="16" cy="8" r="2.6" />
      <path d="M3.5 19 A4.5 4.5 0 0 1 12.5 19" />
      <path d="M11.5 19 A4.5 4.5 0 0 1 20.5 19" />
    </IconFrame>
  )
}

// Guest count — grouped dots
function GuestsIcon() {
  return (
    <IconFrame>
      {[6.5, 12, 17.5].map((x) => (
        <circle key={`a${x}`} cx={x} cy="8.5" r="1.3" fill="currentColor" stroke="none" />
      ))}
      {[6.5, 12, 17.5].map((x) => (
        <circle key={`b${x}`} cx={x} cy="14.5" r="1.3" fill="currentColor" stroke="none" />
      ))}
    </IconFrame>
  )
}

// Tent style — peak
function TentIcon() {
  return (
    <IconFrame>
      <path d="M3 18 L12 5 L21 18" />
      <path d="M3 18 H21" opacity="0.5" />
      <path d="M12 5 V18" opacity="0.6" />
    </IconFrame>
  )
}

// Surface — terrain contour
function TerrainIcon() {
  return (
    <IconFrame>
      <path d="M3 14 Q7 9 11 13 T21 12" />
      <path d="M3 18.5 H21" opacity="0.5" />
    </IconFrame>
  )
}

// Date — calendar
function DateIcon() {
  return (
    <IconFrame>
      <rect x="4" y="5.5" width="16" height="14" rx="1.5" />
      <path d="M4 9.5 H20" />
      <path d="M8.5 3.5 V6.5 M15.5 3.5 V6.5" />
    </IconFrame>
  )
}

const ICON_BY_KEY: Record<string, () => React.JSX.Element> = {
  event_type: GatheringIcon,
  guest_count: GuestsIcon,
  tent_style: TentIcon,
  surface_type: TerrainIcon,
  event_date: DateIcon,
}

// Tent that draws itself in stages, tied to the current step (0–5).
function TentBuild({ step, reduced }: { step: number; reduced: boolean }) {
  const draw = (stage: number, extra?: React.CSSProperties): React.CSSProperties => ({
    strokeDasharray: 1,
    strokeDashoffset: step >= stage ? 0 : 1,
    transition: reduced ? "none" : "stroke-dashoffset 800ms ease",
    ...extra,
  })
  return (
    <svg
      viewBox="0 0 300 185"
      className="w-full h-auto"
      style={{ maxWidth: 340 }}
      fill="none"
      stroke="var(--ink)"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* 0 — ground */}
      <path pathLength="1" d="M20 158 H280" strokeWidth="1.6" style={draw(0)} />
      {/* 1 — side poles */}
      <path pathLength="1" d="M70 158 V104" strokeWidth="1.6" style={draw(1)} />
      <path pathLength="1" d="M230 158 V104" strokeWidth="1.6" style={draw(1)} />
      {/* 2 — center pole */}
      <path pathLength="1" d="M150 158 V42" strokeWidth="2" style={draw(2)} />
      {/* 3 — roof lines (ridge) */}
      <path
        pathLength="1"
        d="M34 126 L70 104 L150 42 L230 104 L266 126"
        strokeWidth="2"
        stroke="var(--coral)"
        style={draw(3)}
      />
      {/* 4 — canvas drape */}
      <path pathLength="1" d="M34 126 V158" strokeWidth="1.4" style={draw(4, { opacity: 0.85 })} />
      <path pathLength="1" d="M266 126 V158" strokeWidth="1.4" style={draw(4, { opacity: 0.85 })} />
      {/* 5 — flag (complete) */}
      <g
        style={{
          opacity: step >= 5 ? 1 : 0,
          transition: reduced ? "none" : "opacity 600ms ease",
        }}
      >
        <path d="M150 42 V28" stroke="var(--coral)" strokeWidth="1.6" />
        <path d="M150 28 L168 34 L150 40 Z" fill="var(--coral)" stroke="var(--coral)" strokeWidth="1" />
      </g>
    </svg>
  )
}

export function BuildWizard({
  eyebrow,
  title,
  intro,
  note,
}: {
  eyebrow: string
  title: string
  intro: string
  note: string
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reduced, setReduced] = useState(false)
  const [pending, startTransition] = useTransition()

  const total = STEPS.length + 1 // last step is the contact form
  const isLast = step === STEPS.length
  const stepData = isLast ? null : STEPS[step]
  const StepIcon = stepData ? ICON_BY_KEY[stepData.key] : null
  const hasChoices = !!stepData && "choices" in stepData && !!stepData.choices

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  function choose(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }))
    // Let the selected state show briefly before advancing.
    setTimeout(() => setStep((s) => s + 1), 320)
  }

  function setInput(key: string, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }))
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || "") || null,
      event_type: answers.event_type || null,
      event_date: answers.event_date || null,
      guest_count: answers.guest_count || null,
      venue_location: String(fd.get("location") || "") || null,
      tent_style: answers.tent_style || null,
      surface_type: answers.surface_type || null,
      message: String(fd.get("message") || "") || null,
      source: `build-wizard:${JSON.stringify(answers)}`,
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.ok) setSubmitted(true)
        else setError(data.error || "Something went wrong. Call the workshop and we'll sort it.")
      } catch {
        setError("Network hiccup. Call the workshop at (808) 444-4407 and we'll sort it.")
      }
    })
  }

  if (submitted) {
    return (
      <div
        className="frame-card p-10 md:p-14 max-w-2xl"
        style={{ border: "1px solid var(--coral)" }}
      >
        <span className="mono-label" style={{ color: "var(--coral)" }}>
          Note received
        </span>
        <p
          className="font-display-light tight mt-4"
          style={{ fontSize: "clamp(30px, 4vw, 44px)", lineHeight: 1.05 }}
        >
          Got it. We&apos;ll write back
          <br />
          <span style={{ color: "var(--coral)" }}>before the next sunrise.</span>
        </p>
        <p className="mt-6 max-w-lg leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          We&apos;ll have a feasibility read, a structure recommendation, and any
          questions before we set a site walk. If your event is within two
          weeks, call the workshop directly at{" "}
          <a href="tel:+18084444407" className="link-underline" style={{ color: "var(--coral)" }}>
            (808) 444-4407
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
      {/* LEFT RAIL — hero, progress, building tent. Sticky on desktop. */}
      <aside className="lg:col-span-5 lg:sticky lg:top-28">
        <p className="eyebrow" style={{ color: "var(--coral)" }}>
          {eyebrow}
        </p>
        <h1
          className="font-display-light tight mt-4"
          style={{ fontSize: "clamp(32px, 4vw, 56px)", maxWidth: "14ch" }}
        >
          {title}
        </h1>
        <p className="body mt-5" style={{ color: "var(--ink-soft)", maxWidth: "40ch" }}>
          {intro}
        </p>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="mono-label">
              {isLast ? "Last step" : `Question ${String(step + 1).padStart(2, "0")}`}
            </span>
            <span className="mono-label" style={{ color: "var(--ink-soft)" }}>
              {String(Math.min(step + 1, total)).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className="h-px flex-1 transition-colors duration-500"
                style={{ background: i <= step ? "var(--coral)" : "var(--line)" }}
              />
            ))}
          </div>
        </div>

        {/* Tent builds with the question progress — desktop only; on mobile it
            would push the first question below the fold, so it's hidden there. */}
        <div className="mt-8 hidden lg:block">
          <TentBuild step={step} reduced={reduced} />
          <p className="mono-label mt-3" style={{ color: "var(--ink-soft)" }}>
            {STAGE_NAMES[Math.min(step, STAGE_NAMES.length - 1)]}
          </p>
        </div>

        <p className="mono-label mt-6" style={{ opacity: 0.5 }}>
          {note}
        </p>
      </aside>

      {/* RIGHT — active question / final form */}
      <div className="lg:col-span-7">
        <div className="frame-card p-7 md:p-9 lg:p-10">
          {stepData && (
            <div key={step} className="flex flex-col gap-8">
              <div>
                <p className="mono-label" style={{ color: "var(--coral)" }}>
                  Question {String(step + 1).padStart(2, "0")}
                </p>
                <h2
                  className="mt-3 font-display-light tight text-balance"
                  style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
                >
                  {stepData.prompt}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  {stepData.sub}
                </p>
                {/* Instruction line — makes the action explicit */}
                <p
                  className="mono-label mt-5 inline-flex items-center gap-2"
                  style={{ color: "var(--coral)" }}
                >
                  {hasChoices ? "Choose one to continue" : "Add a date or window, then continue"}
                  <span aria-hidden>→</span>
                </p>
              </div>

              {"choices" in stepData && stepData.choices ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stepData.choices.map((c) => {
                    const active = answers[stepData.key] === c.value
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => choose(stepData.key, c.value)}
                        aria-pressed={active}
                        className={`group flex items-center gap-4 text-left p-5 cursor-pointer border transition-all duration-200 hover:-translate-y-0.5 ${
                          active
                            ? "border-[color:var(--coral)] bg-[rgba(216,90,60,0.08)]"
                            : "border-[color:var(--line)] hover:border-[color:var(--coral)] hover:bg-[rgba(216,90,60,0.04)]"
                        }`}
                      >
                        <span
                          className="shrink-0 transition-colors duration-200"
                          style={{ color: active ? "var(--coral)" : "var(--ink)" }}
                        >
                          {StepIcon ? <StepIcon /> : null}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block font-display tight" style={{ fontSize: 19 }}>
                            {c.label}
                          </span>
                          {c.hint && (
                            <span
                              className="block mt-1 text-sm"
                              style={{ color: "var(--ink-soft)" }}
                            >
                              {c.hint}
                            </span>
                          )}
                        </span>
                        <span
                          aria-hidden
                          className={`shrink-0 text-lg transition-all duration-200 ${
                            active
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0"
                          }`}
                          style={{ color: "var(--coral)" }}
                        >
                          →
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 border-b"
                  style={{ borderColor: "var(--ink-line)" }}
                >
                  <span className="shrink-0" style={{ color: "var(--ink-soft)" }}>
                    {StepIcon ? <StepIcon /> : null}
                  </span>
                  <input
                    type="text"
                    autoFocus
                    defaultValue={answers[stepData.key] || ""}
                    onChange={(e) => setInput(stepData.key, e.target.value)}
                    placeholder="e.g. March 14, 2027 — or just 'late spring'"
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: 22,
                      padding: "14px 0",
                      outline: "none",
                      width: "100%",
                      color: "var(--ink)",
                      fontFamily: "var(--font-display), system-ui",
                    }}
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{
                    color: "var(--ink-soft)",
                    opacity: step === 0 ? 0 : 1,
                    pointerEvents: step === 0 ? "none" : "auto",
                  }}
                >
                  ← Back
                </button>
                {!hasChoices && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="inline-flex items-center gap-3 px-6 py-3 text-sm cursor-pointer"
                    style={{ background: "var(--ink)", color: "var(--shell)", letterSpacing: "0.06em" }}
                  >
                    Continue
                    <span aria-hidden>→</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {isLast && (
            <form onSubmit={onSubmit} className="flex flex-col gap-8">
              <div>
                <p className="mono-label" style={{ color: "var(--coral)" }}>
                  Last step
                </p>
                <h2
                  className="mt-3 font-display-light tight text-balance"
                  style={{ fontSize: "clamp(28px, 3.4vw, 44px)" }}
                >
                  How should we reach you?
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                  Add the basics below. We review every request and respond with
                  the best next step.
                </p>
              </div>

              {/* Summary chips */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([k, v]) => (
                  <span
                    key={k}
                    className="mono-label px-3 py-2"
                    style={{ border: "1px solid var(--line)" }}
                  >
                    {k.replace(/_/g, " ").toUpperCase()}: {v.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { id: "name", label: "Your name", required: true },
                  { id: "email", label: "Email", type: "email", required: true },
                  { id: "phone", label: "Phone (optional)", type: "tel" },
                  { id: "location", label: "Where on the island", placeholder: "e.g. Wailea, a backyard in Paia…" },
                ].map((f) => (
                  <div key={f.id} className="flex flex-col gap-2">
                    <label htmlFor={f.id} className="mono-label">
                      {f.label.toUpperCase()}
                    </label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type || "text"}
                      required={f.required}
                      placeholder={f.placeholder}
                      style={{
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--ink-line)",
                        fontSize: 17,
                        padding: "14px 0",
                        outline: "none",
                        color: "var(--ink)",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="mono-label">
                  ANYTHING ELSE WE SHOULD KNOW?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="The ground, the view, the vibe — anything tricky."
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--ink-line)",
                    fontSize: 17,
                    padding: "14px 0",
                    outline: "none",
                    color: "var(--ink)",
                  }}
                />
              </div>

              {error && <p style={{ color: "var(--coral)", fontSize: 14 }}>{error}</p>}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="text-sm transition-opacity hover:opacity-60"
                  style={{ color: "var(--ink-soft)" }}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-3 px-8 py-4 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  style={{
                    background: "var(--coral)",
                    color: "var(--shell)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: pending ? 0.7 : 1,
                  }}
                >
                  {pending ? "Sending…" : "Send it"}
                  <span aria-hidden>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
