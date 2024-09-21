import express from "express";
import passport from "passport";

const router = express.Router();

// Route to start Google authentication
router.get(
  "/google-signin",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
    accessType: "offline",
    prompt: "consent",
  })
);

// Callback route for Google to redirect to after login
router.get(
  "/google-callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    // Redirect the user to the frontend after successful login
    res.redirect("http://localhost:5173/?login=true");
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
