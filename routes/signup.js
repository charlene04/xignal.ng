var router = require("express").Router();
var mongoose = require("mongoose"),
    flash = require("connect-flash"),
    User = require("../models/Users"),
    bodyParser = require("body-parser"),
    passport = require("passport");
	
	mongoose.set('debug', true);
	mongoose.set('useCreateIndex', true);
	mongoose.set('useUnifiedTopology', true);
	mongoose.set('useFindAndModify', false);

// ==========SIGN UP===================================
router.get("/register", function(req, res){
	res.render("signup");
});

router.post("/register", function(req, res){ 
	var newUser= new User({
		username: req.body.username,
        email: req.body.email.toLowerCase(),
		street: req.body.street,
		code: req.body.key
	});
 User.find({code: req.body.key}, function(err, foundUser){
	if(err){
		req.flash("error", "Something went wrong. Please try again.");
		res.redirect("/register");
	}else if(foundUser.length != 0){
		req.flash("error", "Access code is already taken. Please try something else.");
		res.redirect("/register");
	}else{
		User.register(newUser, req.body.password, function(err, user){
			if(err){
				req.flash("error", "Something went wrong!");
				res.redirect("/register");
			}else{
			var phones = {phone: req.body.phone};
			User.findOneAndUpdate({code: user.code}, {$push: {phones: phones}}, {new: true},function(err, updatedUser){
				if(err){
					req.flash("error", "Something went wrong. Please try again.")
					res.redirect("/resident");
				}else{
					passport.authenticate("local")(req, res, function(){
					req.flash("success", "Details recorded successfully.")
					res.redirect("/events");
			});
				}
			})
			
			
			}
		});
	}
 })
	
});

module.exports = router;