import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  token!: string;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];

  @BeforeInsert()
  generateToken() {
    this.token = uuidv4();
  }
}
