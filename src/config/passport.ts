import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userModel } from "../schema/userSchema";
import userSchema from "../schema/userSchema";
import bcrypt from "bcryptjs";
// Configure Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        // Find user by email
        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // Check password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id?.toString?.() ?? user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userModel.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error as Error);
  }
});

export default passport;
