var md5 = require('md5');
var request=require('request');
var errormsg =  require('./msgtypes');
var {thirtyhttpoption} =  require('../initconfig');

function login(req,res,next) {
	// body...
	req.getConnection((err,conn)=>{
		if(err){
			return next(err);
		}else{
			sign=md5(md5(req.body.UserName)+req.body.PassWord+"yunwei");
			sql='select loginuser,username,token,department,createtime,lastloginip,logintime from t_user_info where token="'+sign+'";';
			updatesql='update t_user_info set logintime="'+'",lastloginip="'+req._remoteAddress.split(':')
			conn.query(sql,[],(err,results)=>{
				if (err){
					next(err);
				}
				console.log(results)
				if(typeof(results) !== undefined && results.length==1){
					req.session.token=results[0].token
					req.session.userinfo=results[0]
					res.send({
						resultCode: "10000",
						resultMsg: errormsg['10000'],
						userInfo:results[0]
						})
					console.log(req)
				}else{
					res.send({
						resultCode: "12001",
						resultMsg: errormsg['12001']
						})
				}
			})
		}
	})
}
function checklogin(req,res,next) {
	// body..
	if (req.session.hasOwnProperty('userinfo') && req.session.hasOwnProperty('token') ){
		res.send({
				resultCode: "10000",
				resultMsg: errormsg['10000'],
				userInfo: req.session.userinfo
				});
	}else{
		res.send({resultCode: "22222",resultMsg:errormsg['22222']});
	}
	
}
function loginout(req,res,next) {
	// body..
	if (req.session.hasOwnProperty('token')){
		delete req.session.token;
		delete req.session.userinfo;
		res.send({
				resultCode: "10001",
				resultMsg: errormsg['10001']
				});
	}else{
		res.send({resultCode: "22222",resultMsg: errormsg['22222']});
	}
	
}
function changepass(req,res,next) {
	// body..
	console.log(req.session);
	if (req.session.hasOwnProperty('token') && req.session.token == req.body.Token){
	  if(req.body.Sign!=md5(req.body.Token+req.body.oldpassword+req.body.newpassword+req.body.renewpassword)){
	  	res.send({resultCode: "99998",resultMsg: errormsg['99998']});
	  	return true;
	  }
	  if(req.body.oldpassword==req.body.newpassword){
	  	res.send({resultCode: "11003",resultMsg: errormsg['11003']});
	  	return true;
	  }
	  if(req.body.renewpassword!=req.body.newpassword){
	  	res.send({resultCode: "11002",resultMsg: errormsg['11002']});
	  	return true;
	  }
	  req.getConnection((err,conn)=>{
	  	if(err){
	  		next(err)
	  	}
  		let sql='update t_user_info set userpass="'+req.body.newpassword+'",token=md5(concat(md5(loginuser),"'+req.body.newpassword+'",saltpass)) where token="'+req.body.Token+'";'
  		console.log(sql)
	  	conn.query(sql,[],(err,results)=>{
	  		 if(err){
	  		 	res.send({resultCode: "11004",resultMsg: errormsg['11004']})
	  		 	return true;
	  		 }
	  		 if(results){
	  		 	res.send({resultCode: "10000",resultMsg: errormsg['11005']})
	  		 }
	  	})
	  })

	}else{
		res.send({resultCode: "22222",resultMsg: errormsg['22222']});
	}
	
}
function querydevinfo(req,res,next){
	if (req.session.hasOwnProperty('token') && req.session.token == req.body.Token){
    loginurl=thirtyhttpoption.url+thirtyhttpoption.loginuri
    loginparams={
      username: thirtyhttpoption.username,
      password: thirtyhttpoption.password
    }
    console.log(loginparams)
    // 启用COOKIE
    request = request.defaults({jar: true});
    request.debug = true
		request.post(loginurl,{form:loginparams}, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
        data=JSON.parse(body);
		    if(data.success){
          res.send(data);
        }
		  }
      if(response.statusCode=== 400){
        res.send(body)
      }
		})
	}else{
		res.send({resultCode: "22222",resultMsg: errormsg['22222']});
	}	
}
module.exports={checklogin,login,loginout,changepass,querydevinfo}
