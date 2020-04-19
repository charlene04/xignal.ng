var express = require("express");
var app = express(),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    path = require("path"),
    favicon = require("serve-favicon"),
    flash = require("connect-flash"),
    session = require('express-session');
    require("./routes/prod")(app);
    require("dotenv").config();
const mongoose= require("mongoose");
      mongoose.connect("mongodb://localhost/policify", {useNewUrlParser: true, useUnifiedTopology:true});

app.set("view engine", "ejs");
mongoose.set('debug', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
app.use(session({
    resave: false,
	saveUninitialized: false,
    cookieName: 'session',
    secret: 'eg[isfd-8yf9-7GJG335{}+Ihdjhjh',
    duration: 31536000000,
    activeDuration: 31536000000,
    //httpOnly: true,
    //secure: true,
    ephemeral: false
}));
app.use(flash());
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(favicon(__dirname +'/public/favicon.ico'));

app.use(function(req, res, next){
    if(req.session && req.session.user){
        User.find({username: req.session.user.username}, function(err, user){
            if(user){
                req.user = user;
                delete req.user.password;
                req.session.user = user;
                res.locals.currentUser = user;
            }
            next();
        });
    }else{
        next();
    }
})
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
var indexRoutes = require("./routes/home"),
    registerRoutes = require("./routes/signup"),
    receiverRoutes = require("./routes/receiver"),
    eventsRoutes = require("./routes/events"),
    loginRoutes = require("./routes/login"),
    residentRoutes = require("./routes/resident"),
    signalRoutes = require("./routes/signal");

app.use('/', eventsRoutes);
app.use('/',  indexRoutes);
app.use('/',  receiverRoutes);
app.use('/',  residentRoutes);
app.use('/',  loginRoutes);
app.use('/',  registerRoutes);
app.use('/',  signalRoutes);


app.listen( '3000', function(){
	console.log("The server has started on port 3000");
});