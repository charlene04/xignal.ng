const router = require("express").Router();
const User = require("../models/Users");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);


router.get("/admin",  function (req, res) {
    res.render("admin");
})

router.post('/admin',  function (req, res) {
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
                        const msg = {
                            to: foundUser.slice()[0].email,
                            from: 'developmenthub123@gmail.com',
                            subject: 'Your subscription has expired.',
                            html: '<p><strong>Hello there!</strong></p><p>Trust you are keeping safe. Please renew your subscription to continue using this service</p><p><i>Warm Regards!</i></p>'
                        };
                        sgMail.send(msg).then(() => {
                            console.log("Subscription expired.")
                        }).catch(error => {
                            console.log("Subscription expired.") 
                        })
                    })
                    const msg = {
                        to: foundUser.slice()[0].email,
                        from: 'developmenthub123@gmail.com',
                        subject: 'Your subscription has been renewed.',
                        html: '<p>Thank you for using our services. We hope you are keeping safe and watching out for the safety of your environment.</p><p><i>Warm Regards!</i></p>'
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