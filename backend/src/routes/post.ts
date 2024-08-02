import express from "express";
import { AppDataSource } from "../config/data-source";
import { Post } from "../models/Post";
import { User } from "../models/User";
import passport from "passport";

const router = express.Router();

// Create a new post
router.post(
  "/",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const { thoughts, repoLink } = req.body;

    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({ id: (req.user as any).id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const postRepository = AppDataSource.getRepository(Post);
      const post = postRepository.create({ user, thoughts, repoLink });

      await postRepository.save(post);
      res.status(201).json({ message: "Post created successfully", post });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Get all posts
router.get("/", async (req, res) => {
  try {
    const postRepository = AppDataSource.getRepository(Post);
    const posts = await postRepository.find({ relations: ["user"] });

    res.status(200).json(posts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
