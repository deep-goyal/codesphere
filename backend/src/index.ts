import "reflect-metadata";
import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import helmet from "helmet";
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

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

export default app;
