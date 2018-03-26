var express = require('express');
var router = express.Router();

/* GET users listing. */
let errormsg={
  "00000": "请求成功！",
  "99999": "请求报文非法，或格式不正确！",
  "11001": "报文格式不正确"}

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
  switch(req.body.MsgType){
    case 'ACTION_USER_LOGIN':
      sendMsg ={
          userToken: "adfsdfasdfasdfdsafas",
          resultCode: "10001",
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
