import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Comment } from "./Comment";

@Entity()
export class Repository {
  //unique id automatically generated for all shared repos
  @PrimaryGeneratedColumn()
  id!: number;

  //users can have multiple repos
  @ManyToOne(() => User, (user) => user.repositories, { onDelete: "CASCADE" })
  user!: User;

  //user's thoughts on repo
  @Column("text")
  thoughts!: string;

  //created at date
  @CreateDateColumn()
  createdAt!: Date;

  //array of comments
  @OneToMany(() => Comment, (comment) => comment.repository)
  comments!: Comment[];

  //array of likes
  @OneToMany(() => Like, (like) => like.repository)
  likes!: Like[];
}
