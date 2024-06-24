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
  @Column({ unique: true })
  email!: string;

  //hashed password
  @Column()
  password!: string;

  //user bio --profile
  @Column({ nullable: true })
  bio?: string;

  //url or base64 encoded image
  @Column({ nullable: true })
  avatarUrl?: string;

  //repos
  @OneToMany(() => Repository, (repo) => repo.user)
  repositories!: Repository[];

  //comments
  @OneToMany(() => Comment, (comment) => comment.user)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  //function to hash password before inserting into the table
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  //function to compare hashed password
  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
