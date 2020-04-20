const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/Users");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);


router.get("/admin", function (req, res) {
    res.render("admin");
})

router.post('/admin', function (req, res) {
    if (req.body.password === process.env.ADMIN_KEY) {
        User.findOneAndUpdate({ username: req.body.code }, { authorised: true }, function (err, foundUser) {
            if (err) {
                req.flash("error", "Something went wrong. Please try again.");
                res.redirect("/");
            } else {
                let renewalTime = new Date(Date.now());
                let endSub = new Date(renewalTime.getTime() + 2628002880);
                let code1 = req.body.code;
                schedule.scheduleJob(endSub, function () {
                    User.findOneAndUpdate({ code: code1 }, { authorised: false }, function (err, foundUser) {
                        console.log("done");
                    })
                    const msg = {
                        to: foundUser.slice()[0].email,
                        from: 'charlesugbana04@gmail.com',
                        subject: 'Hello! Your subscription has been renewed.',
                        text: 'and easy to do anywhere, even with Node.js',
                        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                    };
                    sgMail.send(msg).then(() => {
                        req.flash("success", "Email has been sent to the user.")
                        res.redirect("/");
                    }).catch(error => {
                        req.flash("error", "Unable to process mailing request.");
                        res.redirect("/");
                        console.log(error.toString());
                        const { message, code, response } = error;
                        const { header, body } = response;
                    })
                });
            }
        })

    } else {
        req.flash("error", "Unauthorised access!")
        res.redirect("/");
    }
})


module.exports = router;