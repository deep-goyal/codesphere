import express from "express";
import { AppDataSource } from "../config/data-source";
import { Post } from "../models/Post";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Create a new post
router.post("/", authenticate, async (req, res) => {
  const { thoughts, repoLink } = req.body;

  try {
    const postRepository = AppDataSource.getRepository(Post);
    const post = postRepository.create({ user: req.user, thoughts, repoLink });
    await postRepository.save(post);
    res.status(201).json({ message: "Post created successfully", post });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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
