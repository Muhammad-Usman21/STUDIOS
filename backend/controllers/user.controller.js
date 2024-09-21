export const getUser = (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.json({
      name: req.user.name,
      email: req.user.email,
      profilePicture: req.user.profilePicture,
    });
  } else {
    res.json(null);
  }
};
