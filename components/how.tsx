"use client"

import { Reveal } from "./reveal"

const STEPS = [
  {
    num: "01",
    title: "We talk",
    body:
      "You tell me what you&apos;re holding, where, when. I ask the questions you didn&apos;t know to ask — wind direction, sunset angle, where the catering will stage. Twenty minutes. No quote calculator.",
    aside: "Same day, usually.",
  },
  {
    num: "02",
    title: "I sketch it",
    body:
      "I draw the footprint on the site. Walk it with you if you want. You see where the dance floor lands, where the bar is, where guests step in for the first time. Free to change anything until we&apos;re both sure.",
    aside: "Pencil on paper. Or on the iPad.",
  },
  {
    num: "03",
    title: "I build it",
    body:
      "My crew shows up the morning you tell us to. We work clean and quiet — most clients don&apos;t see us. Tent is up, lights are in, walls are tested by the time you want to walk through.",
    aside: "Day before or morning of.",
  },
  {
    num: "04",
    title: "You have the day",
    body:
      "We&apos;re gone. We come back when the last guest leaves. We pull the canvas, sweep the stakes, rake the grass. You don&apos;t see us again unless you want to.",
    aside: "Same-night or morning-after breakdown.",
  },
]

export function How() {
  return (
    <section id="how" className="relative py-32 md:py-48" style={{ background: "var(--paper)" }}>
      <div className="mx-auto max-w-[1340px] px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label">How I work</p>
            </Reveal>
            <Reveal delay={120}>
              <h2
                className="display mt-6"
                style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
              >
                Four steps.{" "}
                <span className="display-italic" style={{ color: "var(--coral)" }}>
                  Then I disappear.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={220}>
              <p
                className="body mt-8"
                style={{ color: "var(--ink-soft)" }}
              >
                I keep it short on purpose. You have a thousand decisions to
                make for this day. I shouldn&apos;t be one of them after the first
                phone call.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-10 soft-card p-8">
                <p className="quote-mark">&ldquo;</p>
                <p
                  className="display-italic mt-2"
                  style={{ fontSize: "clamp(22px, 2vw, 28px)", lineHeight: 1.35 }}
                >
                  &ldquo;The night of, you shouldn&apos;t be thinking about the
                  tent. You should be looking at the people in it.&rdquo;
                </p>
                <p className="label mt-6">— Joe</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ol className="space-y-6 lg:space-y-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.num} delay={i * 100}>
                  <li
                    className="soft-card p-8 lg:p-10 flex flex-col gap-3 transition-transform duration-500 hover:translate-x-1"
                  >
                    <div className="flex items-baseline gap-6">
                      <span
                        className="display"
                        style={{
                          fontSize: "clamp(56px, 8vw, 96px)",
                          color: "var(--coral)",
                          opacity: 0.7,
                          lineHeight: 1,
                        }}
                      >
                        {s.num}
                      </span>
                      <h3
                        className="display"
                        style={{ fontSize: "clamp(28px, 3vw, 42px)" }}
                      >
                        {s.title}
                      </h3>
                    </div>
                    <p
                      className="body"
                      style={{ color: "var(--ink-soft)" }}
                      dangerouslySetInnerHTML={{ __html: s.body }}
                    />
                    <p className="label" style={{ color: "var(--ocean)" }}>
                      {s.aside}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
