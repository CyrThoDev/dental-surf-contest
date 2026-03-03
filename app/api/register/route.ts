import { NextRequest, NextResponse } from "next/server"
import { registrationSchema } from "@/lib/validation"
import { sendRegistrationEmail } from "@/lib/mail"
import { ratelimit } from "@/lib/rate-limit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous"

  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const body = await req.json()

  const parsed = registrationSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }

  if (parsed.data.botField !== "") {
    return NextResponse.json({ ok: true }) // honeypot silently ignore
  }

  await sendRegistrationEmail(parsed.data)

  return NextResponse.json({ ok: true })
}