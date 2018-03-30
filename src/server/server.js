var express = require('express');
var session = require('express-session');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var myconnect = require('express-myconnection');

var index = require('./router/index');
var api = require('./router/api');
var {mysqloption} =  require('./initconfig');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(session({
    secret: 'yunwei',
    name: 'yunwei.sid',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 30*60*1000 },  //即30分钟后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: false,
}));

app.use(myconnect(mysql,mysqloption));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../build')));
// log
let FileStreamRotator = require('file-stream-rotator')
let logDirectory = path.join(__dirname, '../../log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})
let errorLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'error-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

logger.format("combined","[:date[iso]] :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms");
app.use(logger('combined', {stream: accessLogStream}));

let ReqMsg=function(req,res,next){
    let reqmsg=JSON.stringify(req.body);
    console.log(reqmsg);
    next();
  }

app.use('/', index);
app.use('/api',ReqMsg,api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
  var meta = '[' + (new Date()).toISOString() + '] ' +req._remoteAddress +" "+ req.method +' '+req.url + '\n';
  errorLogStream.write(meta + err.stack + '\n');
});

module.exports = app;
