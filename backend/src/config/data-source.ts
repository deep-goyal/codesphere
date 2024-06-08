import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import { config } from "dotenv";

//setup dotenv vars
config();

//data source for app using postgres
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User],
  synchronize: true,
  logging: "all",
});
