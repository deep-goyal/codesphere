import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";

dotenv.config();

const app = express();

AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;
