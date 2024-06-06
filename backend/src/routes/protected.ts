import express from "express";
import passport from "passport";

//new router
const router = express.Router();

//create a protected route for tokens through passport
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      message: "You have accessed a protected route!",
      user: req.user,
    });
  }
);

export default router;
