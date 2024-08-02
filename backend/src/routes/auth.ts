import express from "express";
import passport from "passport";

const router = express.Router();

// GitHub OAuth login
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/"); // Redirect to the home page after successful login
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.redirect("/");
  });
});

export default router;
