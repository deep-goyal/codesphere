import request from "supertest";
import { app } from "../index";
import { AppDataSource } from "../config/data-source";

let server: any; // to store the server instance

//initialize db and server first
beforeAll(async () => {
  await AppDataSource.initialize();
  if (!server) {
    server = app.listen(); // start the server
  }
});

//destroy after testing
afterAll(async () => {
  await AppDataSource.destroy(); // destroy the database connection
  if (server) {
    await server.close(); // close the server
  }
});

//user api endpoint tests
describe("User API", () => {
  let token: string;

  beforeAll(async () => {
    // register and login to get a token
    await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });

    //await the response
    const response = await request(app).post("/api/auth/login").send({
      email: "testuser@example.com",
      password: "password123",
    });

    //store the token from response
    token = response.body.token;
  });

  //test proper user profile retrieval
  it("should get the user profile", async () => {
    const response = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", "testuser");
    expect(response.body).toHaveProperty("email", "testuser@example.com");
  });

  //test proper updates
  it("should update the user profile", async () => {
    const response = await request(app)
      .put("/api/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .field("bio", "This is a test bio")
      .attach("avatar", Buffer.from("test"), "avatar.png");

    //test response code and body
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("bio", "This is a test bio");
    expect(response.body).toHaveProperty("avatarUrl");
  });
});
