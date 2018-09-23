var express = require("express"),
    router  = express.Router(),
    Campground = require("../models/campground")


// 

router.get('/', function(req, res) {
        
        Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err)
            } else {
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        })
})

// 

router.get('/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new.ejs')
})

//EDIT CAMPGROUND ROUTE

router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
    
        Campground.findById(req.params.id, function(err, foundCampground) {
                res.render('campgrounds/edit', {campground: foundCampground});
        });
})

//UPDATE CAMPGROUND ROUTE

router.put("/:id", checkCampgroundOwnership, function(req, res) {
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
    
    
})

// DESTROY CAMPGROUND ROUTE 

router.delete("/:id", checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) {
            res.redirect("/campgrounds")
        } else {
             res.redirect("/campgrounds")
        }
    })
})

// 

router.post('/', isLoggedIn, function(req, res) {
    
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var desc = req.body.campground.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newCampground = {name: name, img: image, description: desc, author:author}
    
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

function checkCampgroundOwnership(req, res, next) {
    
     if(req.isAuthenticated()){
         
        Campground.findById(req.params.id, function(err, foundCampground){
            
           if(err){
               res.redirect("back")
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next()
                
            } else {
                res.redirect("back")
            }
           }
           
        });
        
    } else {
        res.redirect("/login")
    }

}

module.exports = router