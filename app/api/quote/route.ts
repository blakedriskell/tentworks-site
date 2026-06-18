import { NextResponse } from "next/server"

// Real endpoint for the build wizard / quote form. Accepts the submission and
// returns ok. Ready to forward to Supabase or email — drop that integration in
// where noted. No external creds required to run locally.

export async function POST(req: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const name = String(payload.name || "").trim()
  const email = String(payload.email || "").trim()
  if (!name || !email) {
    return NextResponse.json(
      { ok: false, error: "Name and email are required." },
      { status: 422 },
    )
  }

  // Where Joe's lead lands. For now we log it server-side; wire one of these next:
  //   • Supabase insert into `quote_requests`
  //   • Resend/SendGrid email to joe@mauitentworks.com
  console.log("[v13/quote] new lead:", { ...payload, receivedAt: new Date().toISOString() })

  return NextResponse.json({ ok: true })
}
