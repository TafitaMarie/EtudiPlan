import { cookies } from "next/headers";
import { verifyToken } from "./auth";

export async function getCurrentUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const payload = verifyToken(token);
    if (typeof payload === "string") return null;
    return (payload as { userId: number }).userId ?? null;
  } catch {
    return null;
  }
}

export async function requireUserId(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error("Non authentifié");
  return userId;
}
