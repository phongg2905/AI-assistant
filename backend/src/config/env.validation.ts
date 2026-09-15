export function validateEnv(): void {
  const required: string[] = [];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(`[Config] Missing optional/recommended env variables: ${missing.join(', ')}`);
  }
}
