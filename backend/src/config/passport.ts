import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import { AppDataSource } from "./data-source";
import { User } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

interface ExtendedGitHubProfile extends GitHubProfile {
  _json: {
    avatar_url: string;
    bio: string;
  };
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5001/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: ExtendedGitHubProfile,
      done: Function
    ) => {
      const userRepository = AppDataSource.getRepository(User);
      let user = await userRepository.findOneBy({ githubId: profile.id });

      if (!user) {
        user = userRepository.create({
          githubId: profile.id,
          username: profile.username,
          email: profile.emails?.[0].value,
          avatarUrl: profile._json.avatar_url,
        });
        await userRepository.save(user);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ id });
  done(null, user);
});

export default passport;
