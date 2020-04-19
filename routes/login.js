const router = require("express").Router();
const   passport = require("passport");
const   flash = require("connect-flash");

router.get('/login', function(req, res){
    res.render('login');
})
router.post("/login", passport.authenticate("local",
	{
		failureRedirect: "/",
		failureFlash: true,
		successFlash: true
	}), function(req, res){
		req.flash("success", "Successfully logged in!");
		res.redirect("/events")
});

module.exports = router;
