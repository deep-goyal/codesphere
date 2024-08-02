import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user!: User;

  @Column("text")
  thoughts!: string;

  @Column()
  repoLink!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
