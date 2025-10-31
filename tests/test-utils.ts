import request from "supertest";
import app from "../src/app";
import { User } from "@prisma/client";

interface AuthResult {
    token: string;
    userId: string;
    user: Partial<User>;
}

/**
 * Registers and logs in a new, unique user to get a valid JWT for testing.
 * Each call creates a new user to ensure test isolation.
 */
export const getAuthToken = async (): Promise<AuthResult> => {
    const email = `testuser_${Date.now()}@example.com`;
    const password = "password123";

    await request(app)
        .post("/api/users/register")
        .send({ email, password, name: "Test User" });
    
    const loginRes = await request(app)
        .post("/api/users/login")
        .send({ email, password });

    if (loginRes.body.token) {
        const token = loginRes.body.token;
        const profileRes = await request(app).get("/api/users/profile").set("Authorization", `Bearer ${token}`);
        return { token, userId: profileRes.body.user.id, user: profileRes.body.user };
    }

    throw new Error("Could not get auth token for tests");
};
