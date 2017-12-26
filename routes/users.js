var express = require('express');
var router = express.Router();

var  a = 10;
var b = 15;
var c = a+b;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/vijaya', function(req,res, next) {
  res.send('Get call success');
})
router.post('/vijaya', function(req,res, next) {
  
res.send('post call send successfully')
})
module.exports = router;
