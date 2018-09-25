var Campground = require("../models/campground"),
    Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    
    if(req.isAuthenticated()) {
        
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            req.flash("error", "Comment not found")
            res.redirect('back')
        } else {
            // do you own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next()
            } else {
               req.flash("error", "You don't have permition to do that ")
                res.redirect('back')
            }
        }
    })
        
    } else {
        req.flash("error", "You need to be logged in to do that!")
         res.redirect("/campgrounds")
    }
    
}


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    
     if(req.isAuthenticated()){
         
        Campground.findById(req.params.id, function(err, foundCampground){
            
           if(err){
               req.flash("error", "Campground not found");
               res.redirect("back")
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next()
                
            } else {
                 req.flash("error", "You don't have permition to do that ")
                res.redirect("/campgrounds")
            }
           }
           
        });
        
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("/login")
    }

}


middlewareObj.isLoggedIn = function(req, res, next) {
    
    if(req.isAuthenticated()) {
        return next()
    } else {
        req.flash("error", "You need to be logged in to do that!")
        res.redirect("/login")
    }
}



module.exports = middlewareObj