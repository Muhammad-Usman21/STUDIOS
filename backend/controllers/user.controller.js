export const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      name: req.user.profile.displayName,
      email: req.user.profile.emails[0].value,
      profilePicture: req.user.profile.photos[0].value,
    });
  } else {
    res.json(null);
  }
};
