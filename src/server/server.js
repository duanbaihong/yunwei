var express = require('express');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./router/index');
var api = require('./router/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../build')));
// log
var FileStreamRotator = require('file-stream-rotator')
var logDirectory = path.join(__dirname, '../../log')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'Access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})
var errorLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'Error-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

logger.format("combined","[:date[iso]] :remote-addr :method :url HTTP/:http-version :status :res[content-length] - :response-time ms");
app.use(logger('combined', {stream: accessLogStream}));

app.use('/', index);
app.use('/api', api);

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
