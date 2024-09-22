export const getUser = (req, res) => {
	if (req.isAuthenticated()) {
		res.json({
			_id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			profilePicture: req.user.profilePicture,
			isStudio: req.user.isStudio,
		});
	} else {
		res.json(null);
	}
};
