var Campground = require("../models/campground"),
    Comment = require("../models/comment")

var middlewareObj = {}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    
    if(req.isAuthenticated()) {
        
        Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err) {
            res.redirect('back')
        } else {
            // do you own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next()
            } else {
                res.send('no permition')
            }
        }
    })
        
    } else {
        res.redirect("/login")
    }
    
}


middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    
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


middlewareObj.isLoggedIn = function(req, res, next) {
    
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}



module.exports = middlewareObj