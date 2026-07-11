import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/?error=missing_token", req.url));
  }

  const user = await prisma.user.findFirst({
    where: { verifyToken: token },
  });

  if (!user) {
    return NextResponse.redirect(new URL("/?error=invalid_token", req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null },
  });

  return NextResponse.redirect(new URL("/parametres?verified=true", req.url));
}
