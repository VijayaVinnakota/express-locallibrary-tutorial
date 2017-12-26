var Author = require('../models/author');
exports.save = function(authorDict, callback) {
        var author = new Author( {
            first_name: authorDict.first_name, 
            family_name: authorDict.family_name, 
            date_of_birth: authorDict.date_of_birth,
            date_of_death: authorDict.date_of_death
        });
    
        author.save(function (err,data) {
            callback(err,data)
    })
}
