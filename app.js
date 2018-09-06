var express       = require('express'),
    app           = express(),
    bodyParser    = require('body-parser'),
    mongoose      = require("mongoose")



mongoose.connect('mongodb://localhost/yelp_camp')
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

// SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String
})

var Campground = mongoose.model('Campground', campgroundSchema)

app.get('/', function(req, res) {
    res.render('landing')
})

app.get('/campgrounds', function(req, res) {
        
        Campground.find({}, function(err, campgrounds) {
            if(err) {
                console.log(err)
            } else {
                res.render('index', {campgrounds: campgrounds});
            }
        })
})


app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs')
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
    
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            console.log(err)
        } else {
            res.render('show', {campground: foundCampground})
        }
    })
})


app.listen(process.env.PORT, process.env.IP, function(){
    console.log('server running')
})