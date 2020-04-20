const router = require("express").Router();

router.get('/', function (req, res) {
	res.render('home');
})
router.get('/terms', function (req, res) {
	res.render('terms');
})

router.get("/logout", function (req, res) {

	req.logout();
	req.flash("success", "Successfully logged out.");
	res.redirect("/");
})
module.exports = router;