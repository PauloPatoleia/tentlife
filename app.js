var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),
    seedDB        = require("./seeds")
    
    
    



mongoose.connect('mongodb://localhost/yelp_camp')
app.use(bodyParser.urlencoded({extended: true, useNewUrlParser: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))

seedDB()

app.get('/', function(req, res) {
    res.render('landing')
})

app.get('/campgrounds', function(req, res) {
        
        Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err)
            } else {
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        })
})


app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new.ejs')
})


app.post('/campgrounds', function(req, res) {
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


app.get('/campgrounds/:id', function(req, res) {
    
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            res.render('campgrounds/show', {campground: foundCampground})
        }
    })
})

// =================
// COMMENT ROUTES 
// =================

app.get('/campgrounds/:id/comments/new', function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            res.render('comments/new', {campground: foundCampground})
        }
    })
})

app.post('/campgrounds/:id/comments', function(req, res) {
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/' + foundCampground._id);
                }
            })
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server running')
})