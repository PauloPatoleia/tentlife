var express = require("express"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    router  = express.Router({mergeParams: true}),
    middleware = require("../middleware/index")
    
    
// NEW COMMENT

router.get('/new', middleware.isLoggedIn, function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", "Something went wrong!")
            console.log(err)
        } else {
            res.render('comments/new', {campground: foundCampground})
        }
    })
})

// POST NEW COMMENT

router.post('/', middleware.isLoggedIn, function(req, res) {
    
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
                    req.flash("Success", "Successfully created comment!")
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    })
})

// EDIT COMMENT

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    
    
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
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect('back')
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

// REMOVE COMMENT

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err) {
            res.redirect("back")
        } else {
            req.flash("success", "Comment removed!")
             res.redirect("/campgrounds/" + req.params.id)
        }
    })
})



module.exports = router