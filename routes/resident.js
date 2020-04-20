const router = require("express").Router();
const User = require("../models/Users");

router.get('/resident', function(req, res){
    res.render('resident');
})


router.post('/resident', function(req, res){
   User.find({code: req.body.access_code}, function(err, foundUser){
       if(err){
        req.flash("error", "Something went wrong. Please try again.")
        res.redirect("/");
       }else{
        if(foundUser.length == 0){
            req.flash("error","Wrong access code. Please contact your locality's administration.")
            res.redirect("/resident")
        }else{
            var residents = {address: req.body.address};
            User.findOneAndUpdate({code: req.body.access_code}, {$push: {residents: residents}}, {new: true},function(err, addedNewResident){
             if(err){
                 req.flash("error", "Something went wrong. Please try again.")
                 res.redirect("/resident");
             }else{
                 req.flash("success", "Details recorded successfully.")
                 res.redirect("/");
             }
         })
        }
       }
      
   })
})


module.exports = router;