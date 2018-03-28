`use stract`

var express = require('express');
var md5 = require('md5');

var router = express.Router();
var errormsg =  require('./msgtypes');
var {login,checklogin,loginout,changepass} = require('./actions');
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
  switch(req.body.MsgType){
    case 'ACTION_USER_LOGIN':
      if(req.body.Sign != md5('ACTION_USER_LOGIN'+md5(req.body.UserName)+req.body.PassWord)){
        sendMsg={resultCode: 99998,
               resultMsg: errormsg['99998']}
        res.send(sendMsg)
        return true;
      }
      login(req,res,next);
      break;
    case 'ACTION_CHECK_USER_LOGIN':
      if(req.body.Sign != md5("ACTION_CHECK_USER_LOGIN"+"SIGN")){
        sendMsg={resultCode: 99998,
               resultMsg: errormsg['99998']}
        res.send(sendMsg)
        return true;
      }
      checklogin(req,res,next);
      break;
    case 'ACTION_USER_LOGOUT':
      if(req.body.Sign != md5("ACTION_USER_LOGOUT"+req.body.Token)){
        sendMsg={resultCode: 99998,
               resultMsg: errormsg['99998']}
        res.send(sendMsg)
        return true;
      }
      loginout(req,res,next);
      break;
    case 'ACTION_CHANGE_PASSWORD':
      if(req.body.Sign != md5(req.body.Token+req.body.oldpassword+req.body.newpassword+req.body.renewpassword)){
        sendMsg={resultCode: 99998,
               resultMsg: errormsg['99998']}
        res.send(sendMsg)
        return true;
      }
      changepass(req,res,next);
      break;
    default:
      sendMsg={resultCode: 99999,
               resultMsg: errormsg['99999']}
      res.send(sendMsg)
  }
});

module.exports = router;
