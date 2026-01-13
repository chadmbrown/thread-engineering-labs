// LAB 6: These functions are missing JSDoc comments
// Trainee adds comprehensive JSDoc to all exports

export function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(query);

  for (const [key, value] of searchParams) {
    params[key] = value;
  }

  return params;
}

export function parseJsonSafe<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

export function parseIntSafe(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function parseFloatSafe(value: string, fallback: number): number {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function parseBooleanSafe(value: string): boolean {
  const truthy = ["true", "1", "yes", "on"];
  return truthy.includes(value.toLowerCase());
}

export function parseCommaSeparated(value: string): string[] {
  if (!value.trim()) return [];
  return value.split(",").map((item) => item.trim());
}

export function parseDateSafe(value: string, fallback: Date): Date {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}
