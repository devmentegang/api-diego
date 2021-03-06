var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth.router');
var usersRouter = require('./routes/users.router');
var customersRouter = require('./routes/customers.router');
var companiesRouter = require('./routes/companies.router');
const mongoose = require('mongoose');


require('dotenv').config();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Para la conexión a db
 */
mongoose.connect(process.env.CONNECTION_STRING,{
  useNewUrlParser: true,
  useUnifiedTopology: true});
const connection = mongoose.connection;

connection.on('error',()=> {
  console.log('Error connection to database');
});

connection.once('open',()=>{
  console.log('connected to database...')
});



app.use('/', indexRouter);
// app.use('/auth', authRouter);
app.use('/api/users', usersRouter);
// app.use('/api/customers', customersRouter);
// app.use('/api/companies', companiesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'This endpoint does not exist'));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(
    {
      errorcode: err.status || 500,
      message: res.locals.message
    });
});

module.exports = app;
