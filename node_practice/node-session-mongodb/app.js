var express = require('express');
var app = express();
var path = require('path');
var mongoose = require("mongoose");

var bodyParser = require('body-parser');
var multer = require('multer');              //文件上传模块，用来处理http提交multipart/form-data
var session = require('express-session');

global.dbHelper = require( './common/dbHelper' );

global.db = mongoose.connect("mongodb://127.0.0.1:27017/reactNote");

app.use(session({
    resave: true,       //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false,    //saveUninitialized: 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    secret:'secret',
    cookie:{
        maxAge:1000*60*30      //过期时间
    }
}));

// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));


// 设定view engine变量，意为网页模板引擎
//app.set('view engine', 'ejs');
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// 设定静态文件目录，比如本地文件
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.user = req.session.user;            //res.locals是用来声明全局变量的，之后你再哪里直接可以取到user
    var err = req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});


require('./routes')(app);          //默认找到下面的index.js

app.get('/', function(req, res) {
    res.render('login');
});

app.listen(3000);


