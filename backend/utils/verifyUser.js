import { errorHandler } from "./error.js";

export const verifyUser = (req, res, next) => {
	
	if (!req.isAuthenticated()) {
		return next(errorHandler(401, "Unauthorized"));
	}
	next();
};
