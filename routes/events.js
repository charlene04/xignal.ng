const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/Users");

router.get('/events', isLoggedIn, function(req, res){
    User.find({username: req.user.username}, function(err, foundUser){
        if(err){
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/");
        }else{
            user = foundUser.slice()[0];
            res.render("events", {user: user});
        }
    })
})

module.exports = router;