import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Repository } from "./Repository";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.comments)
  user!: User;

  @ManyToOne(() => Repository, (repository) => repository.comments)
  repository!: Repository;

  @Column("text")
  comment!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
