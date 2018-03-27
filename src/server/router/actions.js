var md5 = require('md5');
var errormsg =  require('./msgtypes');

function login(req,res,next) {
	// body...
	req.getConnection((err,conn)=>{
		if(err){
			return next(err);
		}else{
			sign=md5(md5(req.body.UserName)+req.body.PassWord+"yunwei");
			sql='select loginuser,username,token,department,lastloginip,logintime from t_user_info where token="'+sign+'";';

			conn.query(sql,[],(err,results)=>{
				if (err){
					exit(err);
				}
				if(typeof(results) !== undefined && results.length==1){
					req.session.token=results[0].token
					req.session.userinfo=results[0]
					res.send({
						resultCode: "10000",
						resultMsg: errormsg['10000'],
						userinfo:results[0]
						})
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
		res.send({resultCode: "22222",resultMsg:"用户未登陆！"});
	}
	
}
function loginout(req,res,next) {
	// body..
	console.log(req.session)
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

module.exports={checklogin,login,loginout}
