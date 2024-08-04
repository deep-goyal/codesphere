import express from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

const router = express.Router();

// Login or Register with Name
router.post("/login", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const userRepository = AppDataSource.getRepository(User);

  // Check if user exists
  let user = await userRepository.findOneBy({ name });

  if (!user) {
    // Create a new user
    user = userRepository.create({ name });
    await userRepository.save(user);
  }

  return res.status(200).json({ token: user.token });
});

// Login with Token
router.post("/token-login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  const userRepository = AppDataSource.getRepository(User);

  // Check if user exists with the given token
  const user = await userRepository.findOneBy({ token });

  if (!user) {
    return res.status(404).json({ message: "Invalid token" });
  }

  return res.status(200).json({ message: "Logged in successfully", user });
});

export default router;
