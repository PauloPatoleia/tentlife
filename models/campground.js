var mongoose      = require("mongoose")


var campgroundSchema = new mongoose.Schema({
    name: String,
    img: String,
    description: String
})


module.exports = mongoose.model('Campground', campgroundSchema)