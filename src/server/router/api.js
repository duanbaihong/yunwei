var express = require('express');
var router = express.Router();

/* GET users listing. */
function sessionHandle(req, res, next) {
  //请求session
  if (req.body.msgType == "REQ_USER_SESSION") {
    let _session = Object.assign({}, req.session);
    delete _session.cookie;
    _session.errorCode = "0";
    return res.send(_session);
  }

  loop:
      for (var key in req.body) {
        //添加sessionSet中包含字段的session,当request中字段值为"FROM_SESSION"时,用session值替换request.body中的值
        if (sessionSet.has(key)) {
          if (req.body[key] == "FROM_SESSION") {
            req.session[key] && (req.body[key] = req.session[key]);
          }
          else {
            req.session[key] = req.body[key];
          }
        }
        //特殊session处理
        if (sessionExcept.has(key)) {
          switch (key) {
            case "captcha":
              let sessionCaptcha = req.session[key];
              // if (req.body[key] != sessionCaptcha) {
              //   res.send({errorCode: "-9001", description: "验证码错误"});
              // }
              break loop;
            default:
              break;
          }
        }
      }
  next();
}
router.post('/', sessionHandle,function(req, res, next) {
  let b ={
  		userToken: "adfsdfasdfasdfdsafas",
  		resultCode: "10000",
  		login: "成功",
  	};
  res.send(b);
});

module.exports = router;
