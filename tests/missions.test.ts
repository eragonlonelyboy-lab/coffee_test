import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("Missions Module", () => {
  let token: string;

  beforeAll(async () => {
    const auth = await getAuthToken();
    token = auth.token;
  });

  it("should allow public access to GET /api/missions", async () => {
    const res = await request(app).get("/api/missions");
    expect(res.statusCode).toBe(200);
    expect(res.body.missions).toBeInstanceOf(Array);
  });

  it("should return 401 for GET /api/missions/me without a token", async () => {
    const res = await request(app).get("/api/missions/me");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for GET /api/missions/me with a token", async () => {
    const res = await request(app)
      .get("/api/missions/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.missions).toBeInstanceOf(Array);
  });
});

describe("Mission Completion Logic", () => {
  let auth: { token: string; userId: string };
  let testMission: any;

  beforeAll(async () => {
    auth = await getAuthToken();
    // Create a mission to test against
    testMission = await prisma.mission.create({
      data: {
        title: "Test Completion Mission",
        description: "A mission for testing completion",
        type: "PURCHASE",
        rewardPoints: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // Expires tomorrow
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.missionCompletion.deleteMany({ where: { missionId: testMission.id }});
    await prisma.mission.delete({ where: { id: testMission.id } });
  });

  it("should allow a user to complete a mission for the first time", async () => {
    const res = await request(app)
      .post(`/api/missions/${testMission.id}/claim`)
      .set("Authorization", `Bearer ${auth.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.pointsAwarded).toBe(50);

    // Verify the mission completion is recorded in the DB
    const completionRecord = await prisma.missionCompletion.findFirst({
      where: { userId: auth.userId, missionId: testMission.id },
    });
    expect(completionRecord).not.toBeNull();
  });

  it("should prevent completing an already completed mission", async () => {
    // This test runs after the previous one, so the completion record should exist
    const res = await request(app)
      .post(`/api/missions/${testMission.id}/claim`)
      .set("Authorization", `Bearer ${auth.token}`);
    
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Mission already completed.");
  });
});
