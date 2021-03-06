`use stract`

var express = require('express');
var md5 = require('md5');
var multer=require('multer')
var router = express.Router();
var errormsg =  require('./msgtypes');
var {login,
  loginout,
  checklogin,
  changepass,
  querydevinfo,
  querybuyreportinfo,
  uploadavaterimg,
  proxyurl,
} = require('./actions');
/* GET users listing. */

let sendMsg=""
function logincheck(req,res,next){
  if (!req.session.hasOwnProperty('userinfo') && !req.session.hasOwnProperty('token') ){
    if(req.body.MsgType !== "ACTION_USER_LOGIN" && req.body.MsgType !== "ACTION_CHECK_USER_LOGIN"){
      return res.send({resultCode: "22222",resultMsg:errormsg['22222']});
    }
  }else{
    if(req.body.MsgType !== "ACTION_USER_LOGIN" && !req.body.MsgType !== "ACTION_CHECK_USER_LOGIN" && req.session.token !== req.body.Token){
      return res.send({resultCode: "22222",resultMsg:errormsg['22222']});
    }
  }
  next()
}
function sessionHandle(req, res, next) {
  //请求session
  if(!req.body.hasOwnProperty('MsgType') || !req.body.hasOwnProperty('Sign')){
    sendMsg={resultCode: 99999,
             resultMsg: errormsg['99999']}
    res.send(sendMsg)
    return true;
  }
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
    case 'ACTION_QUERY_PACKAGE_INFO':
      if(req.body.hasOwnProperty('phone') && req.body.phone!=""){
        sign=md5("ACTION_QUERY_PACKAGE_INFO"+req.body.Token+req.body.phone);
      }else if(req.body.hasOwnProperty('macimei') && req.body.macimei!=""){
        sign=md5("ACTION_QUERY_PACKAGE_INFO"+req.body.Token+req.body.macimei);
      }
      if(req.body.Sign !=sign){
        sendMsg={resultCode: 99998,
               resultMsg: errormsg['99998']}
        res.send(sendMsg)
        return true;
      }
      querydevinfo(req,res,next);
      break;
    case 'ACTION_QUERY_BUYREPORTS_INFO':
      if(((req.body.hasOwnProperty('phone') && req.body.phone!="")
        || (req.body.hasOwnProperty('macimei') && req.body.macimei!="") 
        || (req.body.hasOwnProperty('orderno') && req.body.orderno!=""))
        && req.body.hasOwnProperty('Sign'))
      {
        let oldSign=req.body.Sign;
        delete req.body.Sign;
        let tmpSign="",newSign="";
        Object.keys(req.body).sort().map((n)=>{
          tmpSign+=req.body[n];
        })
        newSign=md5(tmpSign)
        if(oldSign !=newSign){
          sendMsg={resultCode: 99998,
                 resultMsg: errormsg['99998']}
          res.send(sendMsg)
          return true;
        }
        querybuyreportinfo(req,res,next);
      }else{
        sendMsg={resultCode: 99999,
                 resultMsg: errormsg['99999']}
        res.send(sendMsg)
      }
      break;
    case 'ACTION_SEND_MESSAGE_REQ':
      if(((req.body.hasOwnProperty('Params') && req.body.Params!="")
        || (req.body.hasOwnProperty('ProxyUrl') && req.body.ProxyUrl!="") 
        || (req.body.hasOwnProperty('Token') && req.body.Token!=""))
        && req.body.hasOwnProperty('Sign'))
      {
        let oldSign=req.body.Sign;
        delete req.body.Sign;
        let tmpSign="",newSign="";
        Object.keys(req.body).sort().map((n)=>{
          tmpSign+=req.body[n];
        })
        newSign=md5(tmpSign)
        if(oldSign !=newSign){
          sendMsg={resultCode: 99998,
                 resultMsg: errormsg['99998']}
          res.send(sendMsg)
          return true;
        }
        proxyurl(req,res,next);
      }else{
        sendMsg={resultCode: 99999,
                 resultMsg: errormsg['99999']}
        res.send(sendMsg)
      }
      break;
    default:
      sendMsg={resultCode: 99999,
               resultMsg: errormsg['99999']}
      res.send(sendMsg)
  }
  next();
}
router.post('/', logincheck,sessionHandle,function(req,res,next){

});


// ===================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'build/uploads/')
  },
  filename: function (req, file, cb) {
    tmpFile=file.originalname.split(".")
    cb(null, md5(tmpFile[0] + '-' + Date.now())+"."+tmpFile[tmpFile.length-1])
  }
})
var fileFilter=(req,file,cb)=>{
  if(file.mimetype === 'image/gif'){
    cb(null,true);
  }else if(file.mimetype === 'image/jpg'){
    cb(null,true);
  }else if(file.mimetype === 'image/png'){
    cb(null,true);
  }else if(file.mimetype === 'image/jpeg'){
    cb(null,true);
  }else{
    cb(new Error(errormsg['30001']),false);
  }
}
var upload = multer({ 
    storage:storage,
    limits:{ 
      fileSize: 1000000
    },
    onFileSizeLimit: function(file){
      //如果大于100M,删除它
      if(file.size > 1000000) {
          fs.unlink('./' + file.path) // delete the partially written file
      }
    },
    fileFilter:fileFilter
  });

router.post('/upload',upload.single('file'),uploadavaterimg,function(req,res,next){
  
});

module.exports = router;
