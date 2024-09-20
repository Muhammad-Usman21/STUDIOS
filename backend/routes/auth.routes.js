import express from "express";
import passport from "passport";
import User from "../models/user.model.js";

const router = express.Router();

// Route to start Google authentication
router.get(
  "/google-signin",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
  })
);

// Callback route for Google to redirect to after login
router.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    // Get user details from the authenticated Google profile
    const { id, displayName, emails, photos } = req.user.profile;

    try {
      // Check if the user already exists in the database
      let user = await User.findOne({ googleId: id });

      if (!user) {
        // If user doesn't exist, create a new user
        user = new User({
          googleId: id,
          name: displayName,
          email: emails[0].value,
          profilePicture: photos[0].value,
        });
        await user.save();
      }

      // Redirect the user to the frontend after successful login
      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Error storing user in database:", error);
      res.redirect("/"); // Redirect on error
    }
  }
);

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
