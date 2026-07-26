import { NextRequest, NextResponse } from "next/server";

/**
 * Pluggable newsletter provider via env.
 * BUTTONDOWN_API_KEY or RESEND_API_KEY + NEWSLETTER_AUDIENCE_ID
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const buttondown = process.env.BUTTONDOWN_API_KEY;
  if (buttondown) {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${buttondown}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email_address: email }),
    });
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json(
        { error: `Provider error: ${t.slice(0, 200)}` },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      message: "Subscribed via Buttondown.",
    });
  }

  // No provider configured — accept and log for local/dev
  console.info("[newsletter] signup (no provider):", email);
  return NextResponse.json({
    ok: true,
    message:
      "Thanks — signup recorded. Configure BUTTONDOWN_API_KEY for production delivery.",
  });
}
