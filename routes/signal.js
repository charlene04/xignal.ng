const router = require("express").Router();
const axios = require("axios");
const User = require("../models/Users");
var schedule = require("node-schedule");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

router.get('/signal', function (req, res) {
    res.render('signal');
})



router.post('/signal', function (req, res) {
    User.find({ 'residents.address': req.body.home }, function (err, user) {
        console.log(user);
        if (err) {
            req.flash("error", "Something went wrong. Please try again.");
            res.redirect("/signal");
        } else if (user.length == 0) {
            req.flash("error", `Your residence is not registered. Please register your residence correctly to use this service.`)
            res.redirect("/signal");
        } else if (user.slice()[0].authorised === false) {
            req.flash("error", "Sorry, subscription has expired. Contact administration.");
            res.redirect("/");
        } else {
            var distress = { title: req.body.title, description: req.body.description, address: req.body.home };
            User.findOneAndUpdate({ code: user.slice()[0].code }, { $push: { distress: distress } }, { new: true }, function (err, distressUpdate) {
                if (err) {
                    req.flash("error", "Something went wrong. Please try again.")
                    res.redirect("/signal");
                } else {
                    let signalTime = new Date(Date.now());
                    let deleteSignal = new Date(signalTime.getTime() + 172800000);
                    let title = req.body.title;
                    schedule.scheduleJob(deleteSignal, function () {
                        var content = distressUpdate.distress.find(item => item.title === title);
                        var index = distressUpdate.distress.indexOf(content);
                        index = parseInt(index);
                        if (index !== -1) {
                            distressUpdate.distress.splice(index, 1);
                            distressUpdate.save();
                        }
                    })
                    const msg = {
                        to: user.slice()[0].email,
                        from: 'developmenthub123@gmail.com',
                        subject: 'Hello! We\'ve got a situation!',
                        html: '<strong>' + req.body.title + '<p>@' + req.body.home + '</p></strong><p>Desc:</p>' + req.body.description + '<br/><br/><p><b>PLEASE RESPOND<b></p>'
                    };
                    sgMail.send(msg).then(() => {
                        req.flash("success", "Signal sent!");
                        res.redirect("/");
                    }).catch(error => {
                        req.flash("error", "Error processing request");
                        res.redirect("/signal");
                        console.log(error.toString());
                        const { message, code, response } = error;
                        const { header, body } = response;
                    })



                }
            });
        }
    });

});





module.exports = router;