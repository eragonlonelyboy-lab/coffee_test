import { describe, it, expect, beforeAll } from "@jest/globals";
import request from "supertest";
import app from "../src/app";
import { getAuthToken } from "./test-utils";

describe("Referrals Module (Protected)", () => {
  let mainUser: { token: string; userId: string };
  let secondUser: { token: string; userId: string };

  beforeAll(async () => {
    mainUser = await getAuthToken();
    secondUser = await getAuthToken();
  });

  it("should return 401 for POST /api/referrals/generate without a token", async () => {
    const res = await request(app).post("/api/referrals/generate");
    expect(res.statusCode).toBe(401);
  });

  it("should return 200 for POST /api/referrals/generate with a token", async () => {
    const res = await request(app)
      .post("/api/referrals/generate")
      .set("Authorization", `Bearer ${mainUser.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.referral).toHaveProperty("code");
  });

  it("should return 401 for POST /api/referrals/use without a token", async () => {
    const res = await request(app)
      .post("/api/referrals/use")
      .send({ code: "SOMECODE" });
    expect(res.statusCode).toBe(401);
  });
  
  it("should fail when using an invalid referral code", async () => {
      const res = await request(app)
        .post("/api/referrals/use")
        .set("Authorization", `Bearer ${secondUser.token}`)
        .send({ code: "INVALIDCODE" });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Invalid referral");
  });

  it("should fail when a user tries to use their own referral code", async () => {
      const genRes = await request(app)
        .post("/api/referrals/generate")
        .set("Authorization", `Bearer ${mainUser.token}`);
      const myCode = genRes.body.referral.code;

      const useRes = await request(app)
        .post("/api/referrals/use")
        .set("Authorization", `Bearer ${mainUser.token}`)
        .send({ code: myCode });
      expect(useRes.statusCode).toBe(400);
      expect(useRes.body.message).toBe("You cannot use your own referral code");
  });

  it("should fail when a referral code has already been used", async () => {
      const genRes = await request(app)
        .post("/api/referrals/generate")
        .set("Authorization", `Bearer ${mainUser.token}`);
      const code = genRes.body.referral.code;

      // First user uses it successfully
      const firstUseRes = await request(app)
        .post("/api/referrals/use")
        .set("Authorization", `Bearer ${secondUser.token}`)
        .send({ code });
      expect(firstUseRes.statusCode).toBe(200);
      
      // Third user tries to use it again
      const thirdUser = await getAuthToken();
      const secondUseRes = await request(app)
        .post("/api/referrals/use")
        .set("Authorization", `Bearer ${thirdUser.token}`)
        .send({ code });

      expect(secondUseRes.statusCode).toBe(400);
      expect(secondUseRes.body.message).toBe("Referral already used");
  });
});
