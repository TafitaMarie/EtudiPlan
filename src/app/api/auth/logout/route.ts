import { NextResponse } from "next/server";

export async function POST() {
  const isProduction = process.env.NODE_ENV === "production";
  const secure = isProduction ? "Secure; " : "";

  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", `token=; HttpOnly; ${secure}Path=/; Max-Age=0; SameSite=Strict`);
  return res;
}
