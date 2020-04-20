const router = require("express").Router();
const User = require("../models/Users");
const isLoggedIn = require("../middleware/isLoggedIn");



router.post('/:user/add-receiver', isLoggedIn, function (req, res) {
    User.find({ username: req.params.user }, function (err, foundUser) {
        if (err) {
            req.flash("error", "Something went wrong. Please try again.")
            res.redirect("/");
        } else {
            if (foundUser.length == 0) {
                req.flash("error", "Unauthorised access!")
                res.redirect("/")
            } else {
                var phones = { phone: req.body.phone };
                if (foundUser.slice()[0].phones.length != 3) {
                    User.findOneAndUpdate({ username: req.params.user }, { $push: { phones: phones } }, { new: true }, function (err, addedNewOfficer) {
                        if (err) {
                            req.flash("error", "Something went wrong. Please try again.")
                            res.redirect("/events");
                        } else {
                            req.flash("success", "Officer added successfully!")
                            res.redirect("/events");
                        }
                    })
                } else {
                    req.flash("error", "You've reached maximum number of receivers.");
                    res.redirect("/events");
                }

            }
        }

    })
})


module.exports = router;