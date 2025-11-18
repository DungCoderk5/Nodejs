var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

require('./mongo/model/category.model')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var categoriesRouter = require('./routes/category');
var productsRouter = require('./routes/product');
var cartRouter = require('./routes/cart');
var voucherRouter = require('./routes/voucher');
var orderRouter = require('./routes/order');
var cors=require('cors')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('view engine', 'ejs');

app.set('views', './views');  

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// kết nối database mongodb
mongoose.connect('mongodb://127.0.0.1:27017/ban_hang')
.then(() => console.log('kết nối thành công'))
.catch(err => console.log(err ,'Kết nối ko thành công'));
app.use('/', indexRouter);
app.use('/user', usersRouter);
// http://localhost:3000/category
app.use('/category',categoriesRouter);
app.use('/product',productsRouter);
app.use('/cart', cartRouter);
app.use('/voucher', voucherRouter);
app.use('/order', orderRouter);
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
