import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

//load env vars
dotenv.config();

//init express framework
const app = express();

//init middleware
app.use(cors()); //cross origin resource sharing
app.use(bodyParser.json()); //to parse jsons

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
