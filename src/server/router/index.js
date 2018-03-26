var express = require('express');
var router = express.Router();

/* GET home page. */
function sessionHandle(req, res, next) {
  //请求session
  let sessionSet=new Set([
  	"userToken",
  	"userName",
  	"userAvater",
  	"userPart",
  ])
  if (req.body.msgType == "REQ_USER_SESSION") {
    let _session = Object.assign({}, req.session);
    delete _session.cookie;
    _session.errorCode = "0";
    return res.send(_session);
  }
  console.log('aa')
  for (var i = 0; i < 1000000000; i++) {
    
  }
  next();
}

router.get('/',sessionHandle, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;