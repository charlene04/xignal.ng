function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.username === req.params.user){
		return next();
	}
	req.flash("error", "Unauthorised access!");
	res.redirect("/login");
}

module.exports = isAdmin;