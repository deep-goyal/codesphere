import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import bcrypt from "bcryptjs";
import { Repository } from "./Repository";
import { Comment } from "./Comment";
import { Like } from "./Like";

//user schema
@Entity()
export class User {
  // unique ID
  @PrimaryGeneratedColumn()
  id!: number;

  //github id
  @Column({ nullable: true })
  githubId!: string;

  //username
  @Column({ unique: true })
  username!: string;

  //email
  @Column({ unique: true, nullable: true })
  email!: string;

  //hashed password
  @Column({ nullable: true })
  password?: string;

  //user bio --profile
  @Column({ nullable: true })
  bio?: string;

  //url or base64 encoded image
  @Column({ nullable: true })
  avatarUrl?: string;

  //array of repos shared
  @OneToMany(() => Repository, (repo) => repo.user)
  repositories!: Repository[];

  //comments array
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  //likes array
  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  //function to hash password before inserting into the table
  @BeforeInsert()
  async hashPassword() {
    //ensure password is not undefined
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  //function to compare hashed password
  async comparePassword(password: string) {
    //handle undefined case
    if (!this.password) {
      throw new Error("password is not set");
    }
    return await bcrypt.compare(password, this.password);
  }
}
