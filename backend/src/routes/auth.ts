import express from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import passport from "passport";

//init router
const router = express.Router();

//register route
router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userRepository = AppDataSource.getRepository(User);
      const user = userRepository.create({ username, email, password });

      await userRepository.save(user);
      res.status(201).json({ message: "User registered successfully." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
);

//login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    //get the database repo
    const userRepository = AppDataSource.getRepository(User);

    //find the user's email
    const user = await userRepository.findOneBy({ email });

    //email not found
    if (!user) return res.status(404).json({ message: "User not found." });

    //if found, try matching password
    const isMatch = await user.comparePassword(password);

    //password incorrect
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Credential authentication failed." });

    //if password match was successful, define the payload and generate a jwt token
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "jwt_secret --- revisit",
      { expiresIn: "1h" }
    );

    //send the token to the user
    res.status(200).json({ token });
  } catch (error: any) {
    //server error
    res.status(500).json({ error: error.message });
  }
});

//github auth route
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//github callback post auth
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    //get the user typecasted to User model
    const user = req.user as User;

    //define payload
    const payload = { id: user.id, username: user.username };

    //sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET ||
        "jwt-secret thing need to come back gahd damn it",
      { expiresIn: "1h" }
    );

    //send token with response code 200
    res.status(200).json({ token });
  }
);

export default router;
