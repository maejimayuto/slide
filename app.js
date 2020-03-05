var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//ここから修正
var server = http.createServer(app);
 
server.listen(app.get('port'), function () { //add
  console.log("Express server listening on port " + app.get('port'));
});
 
var socketIO = require('socket.io');
//※1
var io = socketIO.listen(server);
 
io.sockets.on('connection', function (socket) {
  console.log("connection");
  //※2
  socket.on('showPicture', function (data) {
    io.sockets.emit('showPicture', { page: data.page});
  });
  socket.on('disconnect', function () {
    console.log("disconnect");
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
