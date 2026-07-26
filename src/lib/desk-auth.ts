import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const DESK_COOKIE = "desk_session";

function secret(): string {
  return (
    process.env.DESK_SECRET ||
    process.env.DESK_PASSWORD ||
    "dev-only-change-me"
  );
}

export function signSession(password: string): string {
  return createHmac("sha256", secret()).update(`desk:${password}`).digest("hex");
}

export function expectedSession(): string | null {
  const pw = process.env.DESK_PASSWORD;
  if (!pw) return null;
  return signSession(pw);
}

export async function isDeskAuthed(): Promise<boolean> {
  const expected = expectedSession();
  if (!expected) {
    return process.env.NODE_ENV !== "production";
  }
  const jar = await cookies();
  const token = jar.get(DESK_COOKIE)?.value;
  if (!token) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
