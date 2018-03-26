var express = require('express');

var router = express.Router();
var errormsg =  require('./msgtypes');
/* GET users listing. */

let sendMsg=""
function sessionHandle(req, res, next) {
  //请求session
  if(!req.body.hasOwnProperty('MsgType') || !req.body.hasOwnProperty('Sign')){
    sendMsg={resultCode: 99999,
             resultMsg: errormsg['99999']}
    res.send(sendMsg)
    return true;
  }
  next();
}
router.post('/', sessionHandle,function(req, res, next) {
  console.log(req)
  switch(req.body.MsgType){
    case 'ACTION_USER_LOGIN':
      sendMsg ={
          userToken: "adfsdfasdfasdfdsafas",
          resultCode: "10000",
          resultMsg: "成功",
        };
      break;
    case 'ACTION_CHECK_USER_LOGIN':
      sendMsg ={
          userToken: "adfsdfasdfasdfdsafas",
          resultCode: "10000",
          resultMsg: "成功",
        };
      break;
    default:
      sendMsg={resultCode: 99999,
               resultMsg: errormsg['99999']}
  }
  res.send(sendMsg)
  return true;
});

module.exports = router;
