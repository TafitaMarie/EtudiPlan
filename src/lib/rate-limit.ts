const rateMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateMap.get(key);

  if (!record || now > record.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) return false;

  record.count++;
  return true;
}

export function rateLimitMiddleware(
  key: string,
  limit = 10,
  windowMs = 60_000
): { allowed: boolean; remaining: number; resetIn: number } {
  const record = rateMap.get(key);
  const now = Date.now();

  if (!record || now > record.resetTime) {
    rateMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count, resetIn: record.resetTime - now };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
