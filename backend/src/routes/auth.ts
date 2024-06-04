import express from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

//init router
const router = express.Router();

//register route
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({ username, email, password });

    await userRepository.save(user);
    res.status(201).json({ message: "user registered successfully!" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

//login route
router.post("/login", (req, res) => {
  res.send("This is the login endpoint");
});

export default router;
