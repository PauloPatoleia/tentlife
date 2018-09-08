var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [
    {
        name: 'Clouds Rest',
        img: 'https://source.unsplash.com/random/300x300',
        description: 'Bla bla bla'
    },
    
    {
        name: 'Serra Iberica',
        img: 'https://source.unsplash.com/random/300x301',
        description: 'Bla bla bla'
    },
    
    {
        name: 'Rocks Rest',
        img: 'https://source.unsplash.com/random/300x302',
        description: 'Bla bla bla'
    }
]

function seedDB() {
    
    // REMOVE ALL CAMPGROUNDS
    
     Campground.remove({}, function(err) {
        if(err) {
            console.log('not sucessful')
        } else {
            // ADD CAMPGROUNDS
    
               data.forEach(function(seed) {
                   Campground.create(seed, function(err, campground) {
                       if(err) {
                           console.log(err)
                       } else {
                           console.log('Campground added')
                            // ADD COMMENTS
                
                Comment.create(
                    {
                        text: 'This place is great but it has not internet',
                        author: 'Carl'
                    }, function(err, comment) {
                        if(err) {
                            console.log(err)
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log('Created new comment')
                        }
                    }
                
                )
                       }
                   })
               })
               
               
    
        }
     })
     
    
   
}

module.exports = seedDB