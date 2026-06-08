// math.ts
export const PI = 3.14159;

export function add(a: number, b: number): number {
  return a + b;
}

export type MathResult = { value: number; error: string | null };