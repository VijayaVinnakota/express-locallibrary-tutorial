var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');

// Display list of all Genre
exports.genre_list = function(req, res, next) {
    Genre.find().sort([['name', 'ascending']])
    .exec(function (err, list_genre) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('genre_list', { title: 'Genre List', genre_list: list_genre });
      });
};

// Display detail page for a specific Genre
exports.genre_detail = function(req, res) {
    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({'genre': req.params.id}).exec(callback);
        }
    }, function(err, results){
        if (err) next(err);
        if (results.genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.send({ title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books })
        // res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books } );
 
    })
};

// Display Genre create form on GET
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST
exports.genre_create_post = function(req, res, next) {
        //Check that the name field is not empty
        req.checkBody('name', 'Genre name required').notEmpty(); 
    
        //Trim and escape the name field. 
        req.sanitize('name').escape();
        req.sanitize('name').trim();
        
        //Run the validators
        var errors = req.validationErrors();
    
        //Create a genre object with escaped and trimmed data.
        var genre = new Genre(
          { name: req.body.name }
        );
        
        if (errors) {
            //If there are errors render the form again, passing the previously entered values and errors
            // res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors});
            // var err = new Error();
            // err.message = 'Genre name required';
            // return next(err);
            res.status(404);
            res.send(errors[0].msg);
        return;
        } 
        else {
            // Data from form is valid.
            //Check if Genre with same name already exists
            Genre.findOne({ 'name': req.body.name })
                .exec( function(err, found_genre) {
                     console.log('found_genre: ' + found_genre);
                     if (err) { return next(err); }
                     
                     if (found_genre) { 
                         //Genre exists, redirect to its detail page
                        //  res.redirect(found_genre.url);
                         res.send('Genre already exists.');

                     }
                     else {
                         
                         genre.save(function (err) {
                           if (err) { return next(err); }
                           //Genre saved. Redirect to genre detail page
                        //    res.redirect(genre.url);
                           res.send('Genre saved successfully');
                         });
                         
                     }
                     
                 });
        }
    
};    

// Display Genre delete form on GET
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};
