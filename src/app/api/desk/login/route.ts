import { NextRequest, NextResponse } from "next/server";
import { DESK_COOKIE, signSession } from "@/lib/desk-auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  const expected = process.env.DESK_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "DESK_PASSWORD is not configured on the server." },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = signSession(password);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DESK_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DESK_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
