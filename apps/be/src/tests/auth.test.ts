import { expect, test, describe, mock, beforeAll } from "bun:test";
import app from "../index.js";

// Mocking the query module
mock.module("../query/user.js", () => {
  return {
    getUserByEmail: async (email: string) => {
      if (email === "exists@example.com") {
        return {
          id: "1",
          email: "exists@example.com",
          passwordHash: await Bun.password.hash("password123"),
          role: "customer",
        };
      }
      return null;
    },
    createUser: async (data: any) => {
      return {
        id: "2",
        email: data.email,
        name: data.name,
        role: data.role,
      };
    },
  };
});

describe("Auth API", () => {
  test("POST /api/auth/register - success", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
          role: "customer",
        }),
      })
    );
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    expect(body.data.email).toBe("john@example.com");
  });

  test("POST /api/auth/register - already exists", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "John Doe",
          email: "exists@example.com",
          password: "password123",
          role: "customer",
        }),
      })
    );
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe("User already exists");
  });

  test("POST /api/auth/login - success", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "exists@example.com",
          password: "password123",
        }),
      })
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.token).toBeDefined();
  });

  test("POST /api/auth/login - invalid credentials", async () => {
    const res = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "exists@example.com",
          password: "wrongpassword",
        }),
      })
    );
    const body = await res.json();
    expect(res.status).toBe(401);
    expect(body.success).toBe(false);
  });
});

describe("Middleware", () => {
  test("GET /api/protected - unauthorized", async () => {
    const res = await app.fetch(new Request("http://localhost/api/protected"));
    expect(res.status).toBe(401);
  });

  test("GET /api/organizer - forbidden for customer", async () => {
    // Login first to get token
    const loginRes = await app.fetch(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "exists@example.com",
          password: "password123",
        }),
      })
    );
    const { data } = await loginRes.json();
    
    const res = await app.fetch(
      new Request("http://localhost/api/organizer", {
        headers: { Authorization: `Bearer ${data.token}` },
      })
    );
    expect(res.status).toBe(403);
  });
});
