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

  @ManyToOne(() => User, (user) => user.repositories, { onDelete: "CASCADE" })
  user!: User;

  @Column("text")
  thoughts!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.repository)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.repository)
  likes!: Like[];
}
