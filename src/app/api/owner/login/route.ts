import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { z } from "zod";
import { createOwnerSession } from "@/lib/auth";
export const runtime = "nodejs";
const schema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});
export async function POST(req: NextRequest) {
  const data = schema.safeParse(await req.json());
  if (!data.success)
    return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
  const email = process.env.OWNER_EMAIL,
    passwordHash = process.env.OWNER_PASSWORD_HASH;
  if (!email || !passwordHash)
    return NextResponse.json(
      { error: "owner_not_configured" },
      { status: 503 },
    );
  let passwordValid = false;
  try {
    passwordValid = await compare(data.data.password, passwordHash);
  } catch {
    return NextResponse.json(
      { error: "owner_not_configured" },
      { status: 503 },
    );
  }
  if (data.data.email.toLowerCase() !== email.toLowerCase() || !passwordValid)
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  try {
    await createOwnerSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "owner_not_configured" },
      { status: 503 },
    );
  }
}
