import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import { AppDataSource } from "./data-source";
import { User } from "../models/User";
import { config } from "dotenv";

config(); //dot env vars for jwt secret

//define options
const opts = {
  //extract jwt from the request
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "jwt secret to be revisited later on.", //secret
};

// * JWT strategy- for users without github account
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    //jwt strategy
    try {
      //fetch db
      const userRepository = AppDataSource.getRepository(User);
      //find the user
      const user = await userRepository.findOneBy({ id: jwtPayload.id });
      if (user) {
        //call the done callback function if found
        return done(null, user);
      } else {
        //done callback with false if not found
        return done(null, false);
      }
    } catch (error) {
      //done callback with error
      return done(error, false);
    }
  })
);

const githubOpts = {
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: "http://localhost:5001/api/auth/github/callback",
};

// * github oauth strategy
passport.use(
  new GitHubStrategy(
    githubOpts,
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const userRepository = AppDataSource.getRepository(User);
      try {
        // try extracting user by github id
        let user = await userRepository.findOneBy({ githubId: profile.id });
        if (!user) {
          //extract user info from github profile
          user = userRepository.create({
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0].value,
            bio: profile._json.bio,
            avatarUrl: profile._json.avatar_url,
          });
          await userRepository.save(user);
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOneBy({ id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
