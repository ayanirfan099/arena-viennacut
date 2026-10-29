import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
const cookieName = "vc-owner";
function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32)
    throw new Error("SESSION_SECRET must be at least 32 characters");
  return s;
}
export function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}
export async function createOwnerSession() {
  const expiry = Date.now() + 8 * 60 * 60 * 1000,
    payload = `owner:${expiry}`,
    token = `${Buffer.from(payload).toString("base64url")}.${sign(payload)}`;
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
}
export async function isOwner() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token) return false;
    const [encoded, sig] = token.split(".");
    const payload = Buffer.from(encoded, "base64url").toString();
    const expected = sign(payload);
    if (
      !sig ||
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    )
      return false;
    const [role, expiry] = payload.split(":");
    return role === "owner" && Number(expiry) > Date.now();
  } catch {
    return false;
  }
}
export async function clearOwnerSession() {
  (await cookies()).delete(cookieName);
}
