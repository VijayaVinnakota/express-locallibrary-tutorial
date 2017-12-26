var mongoose = require('mongoose');
var schema = mongoose.Schema;

var genreModel = new schema ({
    name: {type: String, minlength: 3, max: 100, required: true},
    // category: {type: String, enum: ['fiction', 'non-fiction','military history'] }
});

genreModel.virtual('url').get(function() {
    return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('Genre', genreModel);