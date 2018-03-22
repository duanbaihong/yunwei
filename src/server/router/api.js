var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  let b ={
  		userToken: "adfsdfasdfasdfdsafas",
  		resultCode: "10000",
  		login: "成功",
  	};
  res.send('a');
});

module.exports = router;
