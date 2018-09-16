var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User = require("../models/user")
    
router.get("/", function(req, res) {
    res.render("landing")
})     
    

// AUTH

router.get("/register", function(req, res) {
    res.render("register")
}) 


router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err)
            return res.render('register')
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        })
    })
})


router.get("/login", function(req, res) {
    res.render("login")
})

// login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res) {
  
})

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}

module.exports = router