var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground")


router.get('/', function(req, res) {
        
        Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err)
            } else {
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        })
})



router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new.ejs')
})


router.post('/', isLoggedIn, function(req, res) {
    var name = req.body.name;
    var img= req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, img: img, description: description}
    
    Campground.create(newCampground, function(err, newlyCreated) {
        if(err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds')
        }
    })

})


router.get('/:id', function(req, res) {
    
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}

module.exports = router