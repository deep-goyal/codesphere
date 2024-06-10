import request from "supertest";
import { app } from "../index";
import { AppDataSource } from "../config/data-source";

//initialize database
beforeAll(async () => {
  await AppDataSource.initialize();
});

//destroy after tests
afterAll(async () => {
  await AppDataSource.destroy();
});

// user api endpoint tests
describe("User API", () => {
  let token: string;

  beforeAll(async () => {
    // register user
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    //login and capture token
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    token = response.body.token;
  });

  //test user profile retrieval
  it("should get the user profile", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    //expected behavior
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "testuser@example.com");
  });

  //test user detail updates
  it("should update the user profile", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .field("bio", "This is a test bio")
      .attach("avatar", Buffer.from("test"), "avatar.png");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bio", "This is a test bio");
    expect(response.body).toHaveProperty("avatarUrl");
  });
});
