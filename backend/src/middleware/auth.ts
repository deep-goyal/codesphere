import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/User";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }

  const userRepository = AppDataSource.getRepository(User);

  // Check if user exists with the given token
  const user = await userRepository.findOneBy({ token });

  if (!user) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = user;
  next();
};
