import express from "express";
import passport from "passport";
import multer from "multer";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

//setup router
const router = express.Router();

//memory storage for custom avatars
const upload = multer({ storage: multer.memoryStorage() });

// get profile route
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    res.json(user);
  }
);

// update profile route
router.put(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  upload.single("avatar"),
  async (req, res) => {
    const { bio } = req.body;
    const file = req.file;
    const userRepository = AppDataSource.getRepository(User);
    const user = req.user as User;

    user.bio = bio;

    if (file) {
      // store base64 data or upload to a service and store the URL
      user.avatarUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
    }

    await userRepository.save(user);
    res.json(user);
  }
);

export default router;
