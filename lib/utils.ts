export function validateSituation(situation: string): { valid: boolean } {
  if (situation.trim().length === 0) return { valid: false };
  return { valid: true };
}

export function extractIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (!forwarded) return "127.0.0.1";
  return forwarded.split(",")[0].trim();
}
