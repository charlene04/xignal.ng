const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    password: String,
    phones:[{phone:{type: Number, unique: true}}],
    distress:[{title: String, description: String, address:String, created:{type: Date, default: Date.now}}],
    email: {type: String, unique: true}, 
    street: String,
    code: String,
    residents: [{address: String}]
})

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

passport.authenticate('local', {failureFlash: 'Something went wrong. Please fill out the form again.'});
passport.authenticate('local', {successFlash: 'Welcome!'});
module.exports = User = mongoose.model("User", userSchema);