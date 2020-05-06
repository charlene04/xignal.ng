var router = require("express").Router();
var mongoose = require("mongoose"),
	flash = require("connect-flash"),
	User = require("../models/Users"),
	bodyParser = require("body-parser"),
	passport = require("passport"),
	generator = require("generate-password"),
	schedule = require("node-schedule");
mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);
// ==========SIGN UP===================================
router.get("/register", function (req, res) {
	res.render("signup");
});

router.post("/register", function (req, res) {
	var access_key = generator.generate({
		length: 10,
		numbers: true,
		uppercase: false
	})
	var newUser = new User({
		username: req.body.username,
		email: req.body.email.toLowerCase(),
		street: req.body.street,
		code: access_key
	});
	User.find({ code: req.body.email }, function (err, foundUser) {
		if (err) {
			req.flash("error", "Something went wrong. Please try again.");
			res.redirect("/register");
		} else if (foundUser.length != 0) {
			req.flash("error", "Email already exists!");
			res.redirect("/register");
		} else {
			User.register(newUser, req.body.password, function (err, user) {
				if (err) {
					req.flash("error", "Username already exists.");
					res.redirect("/register");
				} else {
					var phones = { phone: req.body.phone };
					User.findOneAndUpdate({ code: user.code }, { $push: { phones: phones } }, { new: true }, function (err, updatedUser) {
						if (err) {
							req.flash("error", "Phone number was not registered. Add your phone number on the events page.")
							res.redirect("/events");
						} else {
							passport.authenticate("local")(req, res, function () {
								let registrationTime = new Date(Date.now());
								let endSub = new Date(registrationTime.getTime() + 2628002880);
								let code1 = access_key;
								schedule.scheduleJob(endSub, function () {
									User.findOneAndUpdate({ code: code1 }, { authorised: false }, function (err, foundUser) {
										const msg = {
											to: user.email,
											from: 'developmenthub123@gmail.com',
											subject: 'Your subscription has expired.',
											html: '<p><strong>Hello there!</strong></p><p>Trust you are keeping safe. Please <a href="">login</a> to your account and renew your subscription to continue using this service</p><p><i>Warm Regards!</i></p>'
										};
										sgMail.send(msg).then(() => {
											console.log("Subscription expired.")
										}).catch(error => {
											console.log("Subscription expired.") 
										})
									})
								});
								//
								const msg = {
									to: user.email,
									from: 'developmenthub123@gmail.com',
									subject: 'Hello! Welcome to xignal.NG',
									html: '<p>Safety begins at home, and we are glad to have you on board.</p><p>Here is your unique access code: <strong>'+user.code+'</strong></p><p><i>Please keep this code safe for reference purposes only</i></p><p>Stay Safe!</p>'
								
								};
								sgMail.send(msg).then(() => {
									req.flash("success", "Your unique access code has been sent to the mail.")
									res.redirect("/events");
								}).catch(error => {
									req.flash("error", "Unable to process request.");
									res.redirect("/events");
									console.log(error.toString());
									const { message, code, response } = error;
									const { header, body } = response;
								})

							});
						}
					})


				}
			});
		}
	})

});

module.exports = router;