import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app";

describe("Menu Module", () => {
  it("should list all menu items", async () => {
    const res = await request(app).get("/api/menu");
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toBeInstanceOf(Array);
  });
});
