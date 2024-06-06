import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
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

//protect the token route
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

export default passport;
