import express from "express";

//init router
const router = express.Router();

//register route
router.post("/register", (req, res) => {
  res.send("This is the register endpoint");
});

//login route
router.post("/login", (req, res) => {
  res.send("This is the login endpoint");
});

export default router;
