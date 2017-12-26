var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookInstance');
var author_controller = require('../controllers/authorController');
var authorSrvc = require('../services/author.js')
var async = require('async');



exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.count(callback);
        },
        book_instance_count: function(callback) {
            BookInstance.count(callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.count({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.count(callback);
        },
        genre_count: function(callback) {
            Genre.count(callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};


// Display list of all Books
exports.book_list = function(req, res, next) {

    Book.find({}, 'title author')
      .populate('author')
      .exec(function (err, list_books) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('book_list', { title: 'Book List', book_list: list_books });
      });
      
  };
  
// Display detail page for a specific book
exports.book_detail = function(req, res, next) {

    async.parallel({
        book: function(callback) {

            Book.findById(req.params.id)
              .populate('author')
              .populate('genre')
              .exec(callback);
        },
        book_instance: function(callback) {

          BookInstance.find({ 'book': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.send({ title: 'Title', book:  results.book, book_instances: results.book_instance } );
        // res.render('book_detail', { title: 'Title', book:  results.book, book_instances: results.book_instance } );

    });

};


// Handle book create on POST
exports.book_create_post = function(req, res) {
    var book = new Book(
        { title: req.body.title,
          author: req.body.author,
          summary: req.body.summary,
          isbn: req.body.isbn,
          genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre
         });
  
      console.log('BOOK: '+book);
  
      var errors = req.validationErrors();
      if (errors) {
          // Some problems so we need to re-render our book
          console.log('GENRE: '+req.body.genre);
  
          console.log('ERRORS: '+errors);
          //Get all authors and genres for form
          async.parallel({
              authors: function(callback) {
                  Author.find(callback);
              },
              genres: function(callback) {
                  Genre.find(callback);
              },
          }, function(err, results) {
              if (err) { 
                //   return next(err);
                res.send(err);
             }
  
              // Mark our selected genres as checked
              for (let i = 0; i < results.genres.length; i++) {
                  if (book.genre.indexOf(results.genres[i]._id) > -1) {
                      //console.log('IS_IN_GENRES: '+results.genres[i].name);
                      results.genres[i].checked='true';
                      //console.log('ADDED: '+results.genres[i]);
                  }
              }
              res.status(404);
              res.send(errors);
            //   res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors });
          });
  
      }
      else {
      // Data from form is valid.
      // We could check if book exists already, but lets just save.
        findAuthorAndCreate(book.author, function(err,data) {
            if (err) {
                res.status(404);
                res.send(err);
            } else {
                book.author = data;
                book.save(function (err) {
                    if (err) { 
                      //   return next(err);
                      res.status(404);
                      res.send(err);
                    }
                    res.send('book created successfully');
                });
            }
        })
      }  
};


function findAuthorAndCreate(author, callback) {
    Author.findOne({'name': author.family_name})
    .exec(function(err, found_author) {
      console.log('found_author: ' + found_author);
      if (err) { 
        callback(err,null); 
      controller }
      
      if (found_author) { 
         callback(null,found_author);
      }
      else {
          console.log("in")
        authorSrvc.save(author, function(err,data){
            console.log("in")
            console.log(data);
            callback(err,data);
        })
            
    }
    });
}
/*var Book = require('../models/book');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all books
exports.book_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Book list');
};

// Display detail page for a specific book
exports.book_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Book detail: ' + req.params.id);
};

// Display book create form on GET
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Display book delete form on GET
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};*/
