import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Repository } from "./Repository";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  //users can like multiple repos
  @ManyToOne(() => User, (user) => user.likes)
  user!: User;

  //repos can have multiple likes
  @ManyToOne(() => Repository, (repository) => repository.likes)
  repository!: Repository;
}
