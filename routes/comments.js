var express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    router  = express.Router({mergeParams: true})
    
    
// NEW COMMENT

router.get('/new', isLoggedIn, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            res.render('comments/new', {campground: foundCampground})
        }
    })
})

// POST NEW COMMENT

router.post('/', isLoggedIn, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    })
})

// EDIT COMMENT

router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    
    
     Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            
             Comment.findById(req.params.comment_id, function(err, foundComment) {
                 if(err) {
                     res.send(err)
                 } else {
                     res.render('comments/edit', {campground: foundCampground, comment: foundComment})
                 }
                  
             })
        }
    })
})

// POST EDITED COMMENT
router.put("/:comment_id", checkCommentOwnership, function(req, res) {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect('back')
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// REMOVE COMMENT

router.delete("/:comment_id", checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back")
        } else {
             res.redirect("/campgrounds/" + req.params.id)
        }
    })
})


// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/login")
    }
}

function checkCommentOwnership(req, res, next) {
    
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


module.exports = router