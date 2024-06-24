import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { AppDataSource } from "./config/data-source";
import passport from "./config/passport";
import protectedRoutes from "./routes/protected";
import userRoutes from "./routes/user";
import session = require("express-session");

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
app.use(
  session({
    //to create sessions
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.session());

//auth routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/user", userRoutes);

//root path
app.get("/", (req, res) => {
  res.send("Hello World!");
});

function startServer() {
  const PORT = process.env.PORT || 5001;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

//start server
if (process.env.NODE_ENV !== "test") {
  startServer();
}

//export the server for testing
export { app, startServer };
