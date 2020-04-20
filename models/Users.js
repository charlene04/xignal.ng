const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    phones: [{ phone: { type: Number, unique: true } }],
    distress: [{ title: String, description: String, address: String, created: { type: Date, default: Date.now } }],
    email: { type: String, unique: true },
    street: String,
    code: { type: String, unique: true },
    residents: [{ address: String }],
    authorised: { type: Boolean, default: true }
})

userSchema.plugin(passportLocalMongoose);
var User = mongoose.model("User", userSchema);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
passport.authenticate('local', { successFlash: 'Welcome!' });
module.exports = User = mongoose.model("User", userSchema);