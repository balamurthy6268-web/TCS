import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Type definition matching the JSON schema
// ---------------------------------------------------------------------------
interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  active: boolean;
  age: number;
}

// ---------------------------------------------------------------------------
// Helper – load JSON from disk
// ---------------------------------------------------------------------------
function loadUsers(filePath: string): User[] {
  const absolutePath = path.resolve(filePath);
  const raw = fs.readFileSync(absolutePath, "utf-8");
  return JSON.parse(raw) as User[];
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
test.describe("JSON Data Validation – First Dataset (users[0])", () => {
  let users: User[];
  let firstUser: User;

  test.beforeAll(() => {
    // Adjust the path to wherever your JSON file lives relative to this spec
    users = loadUsers("data/Users.json");
    firstUser = users[0];
  });

  // ── File-level checks ────────────────────────────────────────────────────

  test("JSON file loads successfully and is not empty", () => {
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  // ── Field presence ───────────────────────────────────────────────────────

  test("First record contains all required fields", () => {
    const requiredFields: (keyof User)[] = [
      "id",
      "name",
      "email",
      "role",
      "active",
      "age",
    ];
    for (const field of requiredFields) {
      expect(firstUser).toHaveProperty(field);
    }
  });

  // ── Type checks ──────────────────────────────────────────────────────────

  test("id is a positive integer", () => {
    expect(typeof firstUser.id).toBe("number");
    expect(Number.isInteger(firstUser.id)).toBe(true);
    expect(firstUser.id).toBeGreaterThan(0);
  });

  test("name is a non-empty string", () => {
    expect(typeof firstUser.name).toBe("string");
    expect(firstUser.name.trim().length).toBeGreaterThan(0);
  });

  test("email is a valid format", () => {
    expect(typeof firstUser.email).toBe("string");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(firstUser.email)).toBe(true);
  });

  test("role is one of the allowed values", () => {
    const allowedRoles: User["role"][] = ["admin", "user"];
    expect(allowedRoles).toContain(firstUser.role);
  });

  test("active is a boolean", () => {
    expect(typeof firstUser.active).toBe("boolean");
  });

  test("age is a positive integer within a realistic range", () => {
    expect(typeof firstUser.age).toBe("number");
    expect(Number.isInteger(firstUser.age)).toBe(true);
    expect(firstUser.age).toBeGreaterThanOrEqual(18);
    expect(firstUser.age).toBeLessThanOrEqual(100);
  });

  // ── Value checks (first record-specific) ────────────────────────────────

  test("First record has expected id value of 1", () => {
    expect(firstUser.id).toBe(1);
  });

  test("First record name matches expected value", () => {
    expect(firstUser.name).toBe("Alice Johnson");
  });

  test("First record email matches expected value", () => {
    expect(firstUser.email).toBe("alice.johnson@example.com");
  });

  test("First record role is admin", () => {
    expect(firstUser.role).toBe("admin");
  });

  test("First record active status is true", () => {
    expect(firstUser.active).toBe(true);
  });

  test("First record age matches expected value", () => {
    expect(firstUser.age).toBe(30);
  });
});
