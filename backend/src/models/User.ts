import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  githubId!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts!: Post[];
}
