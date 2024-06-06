import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./config/data-source";
import passport from "passport";

//load env vars
dotenv.config();

//init express framework
const app = express();

//connect db
AppDataSource.initialize()
  .then(() => {
    console.log("PostgreSQL connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database in index.ts", err);
  });

//init middleware
app.use(cors()); //cross origin resource sharing
app.use(bodyParser.json()); //to parse jsons
app.use(passport.initialize()); //to authenticate the routes

//auth routes
app.use("/api/auth", authRoutes);

//root path
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
