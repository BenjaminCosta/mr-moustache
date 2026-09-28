export type SquareEnvironment = "sandbox" | "production";

export function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function optionalEnv(name: string) {
  return process.env[name]?.trim() || undefined;
}

export function booleanEnv(name: string, fallback = false) {
  const value = optionalEnv(name);

  if (!value) return fallback;
  return value.toLowerCase() === "true";
}

export function positiveIntegerEnv(name: string, fallback: number) {
  const value = optionalEnv(name);
  if (!value) return fallback;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsed;
}

export function squareEnvironment(): SquareEnvironment {
  const value = optionalEnv("SQUARE_ENVIRONMENT") || "sandbox";

  if (value !== "sandbox" && value !== "production") {
    throw new Error("SQUARE_ENVIRONMENT must be sandbox or production");
  }

  return value;
}

export function productionSiteUrl() {
  const value =
    optionalEnv("NEXT_PUBLIC_SITE_URL") ||
    optionalEnv("VERCEL_PROJECT_PRODUCTION_URL") ||
    "https://mr-moustache.vercel.app";
  const absolute = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return new URL(absolute).origin;
}
