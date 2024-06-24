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
  //auto generate ids
  @PrimaryGeneratedColumn()
  id!: number;

  //many to one rel with user
  @ManyToOne(() => User, (user) => user.comments)
  user!: User;

  //repos can have multiple comments
  @ManyToOne(() => Repository, (repository) => repository.comments)
  repository!: Repository;

  //actual comment
  @Column("text")
  comment!: string;

  //created date
  @CreateDateColumn()
  createdAt!: Date;
}
