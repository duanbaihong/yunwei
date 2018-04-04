var md5 = require('md5');
var request=require('request');
var errormsg =  require('./msgtypes');
var {thirtyhttpoption,hemumysqloption} =  require('../initconfig');
request.debug = true

request = request.defaults({jar: true})

function login(req,res,next) {
  // body...
  req.getConnection((err,conn)=>{
    if(err){
      return res.send({
            resultCode: "12003",
            resultMsg: errormsg['12003']
            })
    }else{
      sign=md5(md5(req.body.UserName)+req.body.PassWord+"yunwei");
      sql='select loginuser,username,token,department,createtime,lastloginip,logintime from t_user_info where token="'+sign+'";';
      updatesql='update t_user_info set logintime="'+'",lastloginip="'+req._remoteAddress.split(':')
      conn.query(sql,[],(err,results)=>{
        if (err){
          return res.send({
            resultCode: "12003",
            resultMsg: errormsg['12003']
            })
        }
        if(!err && typeof(results) !== undefined && results.length==1){
          req.session.token=results[0].token
          req.session.userinfo=results[0]
          res.send({
            resultCode: "10000",
            resultMsg: errormsg['10000'],
            userInfo:results[0]
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

function posturl(url,params){
  return new Promise((resolve, reject)=>{
    request.post(url,{form:params}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body))
      }else{
        reject(body)
      }
    })
  })
}

function querydevinfo(req,res,next){
  if (req.session.hasOwnProperty('token') && req.session.token == req.body.Token){
    queryparams={};
    where="where "
    if(req.body.hasOwnProperty('phone')){
      queryparams['email']=req.body.phone;
      where+=' f.phone_num="'+req.body.phone+'"';
      // where+='b.phone_number="'+req.body.phone+'" OR f.phone_num="'+req.body.phone+'"';
    }else if(req.body.hasOwnProperty('macimei')){
       queryparams['deviceId']='xxxxS_'+req.body.macimei;
       if(req.body.macimei.length===16){
        where+='a.cam_imei="'+req.body.macimei+'"'
       }else{
        where+='a.cam_sn="'+req.body.macimei+'"'
       }
    }else{
      return res.send({resultCode: "11006",resultMsg: errormsg['11006']});
    }
    // 启用COOKIE
    // new Promise
    let resultData={dh1data:[]}
    devQuery=new Promise((resolve, reject)=>{
      var mysql      = require('mysql');
      var connection = mysql.createConnection(hemumysqloption);
      connection.connect((err)=>{ if(err) console.log(err) })
      sql='SELECT  a.cam_sn,\
                   a.cam_imei,\
                   a.`cam_model`,\
                   a.`cam_name`,\
                   a.online,\
                   d.`area_name`,\
                   a.`cam_model`,\
                   a.`cam_version`,\
                   a.`app_version`,\
                   h.access_region region,\
                   f.phone_num,\
                   c.name,\
                   b.`package_code`,\
                   ifnull(e.`bind_time`,"") bind_time,\
                   ifnull(b.`create_time`,"") create_time,\
                   ifnull(b.`effective_time`,"") effective_time,\
                   ifnull(b.`failure_time`,"") failure_time,\
                   a.`description`\
            FROM t_camera_info a \
            LEFT JOIN t_order_table b ON cam_sn=b.dev_sn AND (b.failure_time is null or b.failure_time >=unix_timestamp(curdate()))\
            LEFT JOIN t_package_info c ON b.`package_code`=c.`code`\
            LEFT JOIN t_sys_area d ON a.`cam_area_code`=d.`area_code`\
            LEFT JOIN t_user_camera_relation e on a.cam_sn=e.cam_sn \
            LEFT JOIN t_user_info f on e.user_id=f.user_id \
            LEFT JOIN t_mac_storage_relation h on h.cam_mac=a.cam_sn ';
      sql=sql.replace(/\s+/g,' ')+where;
      console.log(sql);
      connection.query(sql,(err,rows)=>{
        if(!err){
          if(rows.length>0){
            resolve(rows)
          }else{
             return res.send({resultCode:"12004",resultMsg:errormsg['12004']});
          }
        }else{
          return res.send({resultCode:"12002",resultMsg:errormsg['12002']});
        }
      })
    })      
    devQuery.then((platdata)=>{
      // 异步登陆
      resultData['platdata']=platdata;
      if(!req.session.isdhlogin){
        loginurl=thirtyhttpoption.url+thirtyhttpoption.loginuri
        loginparams={
              username: thirtyhttpoption.username,
              password: thirtyhttpoption.password
              }
        return posturl(loginurl,loginparams);
      }
    }).then((data)=>{
      if(data){
        req.session.isdhlogin=true;
      }
      queryurl=thirtyhttpoption.url+thirtyhttpoption.devqueryuri
      return posturl(queryurl,queryparams);
    }).then((data)=>{
      if(data && data.success){
        resultData['dhdata']=data.result.rows;
        devqueryconfiguri=thirtyhttpoption.url+thirtyhttpoption.devqueryconfiguri
        promiseAll=data.result.rows.map((n)=>{
          params={
            deviceId: n.deviceid,
            productKey: n.productKey,
            userId: n.uid
          }
          return posturl(devqueryconfiguri,params)
        })
        return  Promise.all(promiseAll)
      }else{
        req.session.isdhlogin=false;
      }
    }).then((data)=>{
      if(data){
        var parseString = require('xml2js').parseString;
        data.map((n)=>{
          parseString(n.result.context,{explicitArray : false},(err,result)=>{
            let tmpdata={};
            tmpdata['mac']=result.profile.general.macAddress._
            tmpdata['imei']=result.profile.general.deviceId._
            tmpdata['devtype']=result.profile.general.deviceType
            resultData['dh1data'].push(tmpdata)
          })     
        })     
      }
      return res.send({resultCode:"10000",resultData:resultData});
    }).catch((error)=>{
      console.log(error);
      return res.send({resultCode:"13001",resultMsg: errormsg['13001']});
    });
  }else{
    return res.send({resultCode: "22222",resultMsg: errormsg['22222']});
  } 
}
/**
 * [querybuyreportinfo description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */

function querybuyreportinfo(req,res,next){
  if (req.session.hasOwnProperty('userinfo') && req.session.hasOwnProperty('token') ){
    let where="where "
    if(req.body.hasOwnProperty('orderno')){
      where+='order_serial_number like "%'+req.body.orderno+'%"'
    }else if(req.body.hasOwnProperty('phone')){
      where+='message_body like "%'+req.body.phone+'%"'
    }else if(req.body.hasOwnProperty('macimei')){
      where+='message_body like "%'+req.body.macimei+'%"'
    }else{
      return res.send({resultCode:"99997",resultMsg: errormsg['99997']})
    }
    pkgReportQuery=new Promise((resolve, reject)=>{
      var mysql      = require('mysql');
      var connection = mysql.createConnection(hemumysqloption);
      connection.connect((err)=>{ if(err) console.log(err) })
      sql='SELECT order_serial_number serialnumber,\
                   message_body msgbody,\
                   handle_result_desc result,\
                   verify_result verifyresult,\
                   `time`\
            FROM t_boss_data_log_table\
            '+where+' \
            ORDER BY TIME DESC LIMIT 0,40';
      sql=sql.replace(/\s+/g,' ');
      console.log(sql);
      connection.query(sql,(err,rows)=>{
        if(!err){
          if(rows.length>0){
            resolve(rows)
          }else{
             return res.send({resultCode:"12004",resultMsg:errormsg['12004']});
          }
        }else{
          return res.send({resultCode:"12002",resultMsg:errormsg['12002']});
        }
      })
    }).then((data)=>{
      res.send({resultCode:"10000",resultData:{reports: data}})
    })
  }else{
    return res.send({resultCode: "22222",resultMsg: errormsg['22222']});
  }
}

module.exports={checklogin,login,loginout,changepass,querydevinfo,querybuyreportinfo}
