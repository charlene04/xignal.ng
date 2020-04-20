const router = require("express").Router();
const axios = require("axios");
const User = require("../models/Users");

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_KEY);

router.get('/signal', function(req, res){
    res.render('signal');
})



router.post('/signal', function(req, res){
   User.find({'residents.address': req.body.home}, function(err, user){
       console.log(user);
       if(err){
           req.flash("error", "Something went wrong. Please try again.");
           res.redirect("/signal");
       }else if(user.length == 0){
            req.flash("error", `Your residence is not registered. Please register your residence correctly to use this service.`)
            res.redirect("/signal");
       }else{
           var distress = {title: req.body.title, description: req.body.description, address: req.body.home};
           User.findOneAndUpdate({code: user.slice()[0].code}, {$push:{distress: distress}},{new: true}, function(err, distressUpdate){
               if(err){
                   req.flash("error", "Something went wrong. Please try again.")
                   res.redirect("/signal");
               }else{
                const msg = {
                    to: user.slice()[0].email,
                    from: 'charlesugbana04@gmail.com',
                    subject: 'Hello! We\'ve got a situation.',
                    text: 'and easy to do anywhere, even with Node.js',
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
                  };
                  sgMail.send(msg).then(()=>{
                    req.flash("success", "Signal sent!");
                    res.redirect("/");
                  }) .catch(error=>{
                    req.flash("error", "Something went wrong!");
                    res.redirect("/signal");
                      console.log(error.toString());
                      const{message, code, response}= error;
                      const{header, body}=response;
                  })
                   
                 
                  
               }
           });
       }
   });

});





module.exports = router;