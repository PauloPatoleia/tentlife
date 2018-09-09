var mongoose = require("mongoose")
var Campground = require("./models/campground")
var Comment = require("./models/comment")

var data = [
    {
        name: 'Clouds Rest',
        img: 'https://source.unsplash.com/random/800x400',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    
    {
        name: 'Serra Iberica',
        img: 'https://source.unsplash.com/random/800x401',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    
    {
        name: 'Rocks Rest',
        img: 'https://source.unsplash.com/random/800x402',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
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