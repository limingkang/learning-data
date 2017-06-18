var http=require('http');
    // url=require("url");   
// var router=require('./router.js');
var formidable=require('formidable');
var util=require('util');
// var fs=require('fs');

// console.log(__dirname+'/'+url.parse('index.html?name=limingakng&me=shen').pathname);
var app=http.createServer(function(req,res){
	// var pathname=url.parse(req.url).pathname;
	// req.setEncoding("utf8");
	
	// console.log(router);
	// router.router(res,req,pathname);
	if(req.url=='/upload'&&req.method.toLowerCase()=='post'){
		var form=new formidable.IncomingForm();
		form.parse(req,function(err,fields,files){               //form.parse方法来处理提交过来的文件数据。第一个收到的请求数据，fields为传过来的值，files为文件的信息
			res.writeHead(200,{'Content-Type':'text/plain'});
			console.log(files.upload.name);   //其中upload为上传的时候文件对应的键值，这里也就是name值,还可以通过.path来得到文件再服务器暂时存放的地址，可以通过fs.rename将其该路径改名
			res.write('received upload:\n\n');
			res.end(util.inspect({fields:fields,files:files.upload.path}));   //util.inspect将json对象转换为字符串
		});
        return;
	}
	// var pathname=url.parse(req.url).pathname;
 //    var readpath=__dirname+'/'+pathname;
 //    // var indexpage=fs.readFileSync(readpath);
 //    if (pathname=='./favicon.ico') {
 //    	return;
 //    }else if(pathname=='/index'||pathname=='/'){
 //    	goindex(res,readpath);
 //    }else{
 //    	dealwith(pathname,readpath,res);
 //    }
	
	// res.end(indexpage);
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	res.write("woshishiren");
	res.write("woshishi");
	res.end(
        '<form action="/upload" enctype="multipart/form-data" method="post">'+
        '<input type="text" name="title"><br/>'+
        '<input type="file" name="upload" multiple="multiple"><br/>'+
        '<input type="submit" value="上传"><br/></form>'
	);
});
app.listen(3000,"127.0.0.1");
console.log("it's working!");

// function dealwith(pathname,readpath,res){
// 	fs.exists(readpath,function(exists){
// 		if(!exists){
// 			res.writeHead(200,{'Content-Type':'text/plain'});
// 			res.write("no resouce");
// 			res.end();
// 		}else{
// 			var point=pathname.lastIndexOf('.');
// 			var mimestring=pathname.substring(point+1);
// 			var mime="";
// 			switch(mimestring){
// 				case 'css' : mime="text/css";
// 				      break;
// 				default:
// 				    mime="text/plain";
// 			}
// 			fs.readFile(readpath,"binary",function(err,file){
// 				if(err){
// 					res.writeHead(200,{'Content-Type':'text/plain'});
// 			        res.write(err);
// 				}else{
// 					res.writeHead(200,{'Content-Type':mime});
// 			        res.write(file,"binary");
// 			        res.end();
// 				}
// 			})
// 		}
// 	})
// }
// function goindex(res,readpath){
// 	readpath=readpath+"index.html";
//      var indexpage=fs.readFileSync(readpath);
//      res.writeHead(200,{'Content-Type':'text/html'});
//      res.end(indexpage);
// }
// var io=require('socket.io').listen(app);
// io.sockets.on("connection",function(socket){console.log(socket);
// 	socket.emit('news',{hello:'word'});
// 	socket.on('my other event',function(data){
// 		console.log(data);
// 	});
// });


// var util=require('util');
// var events=require('events');

// function mystream(){
// 	events.EventEmitter.call(this);    //用来初始化events模块的变量看起源码就知道
// }
// util.inherits(mystream, events.EventEmitter);
// mystream.prototype.write=function(data){
// 	this.emit("data",data);
// }

// var stream=new mystream();

// console.log(stream instanceof events.EventEmitter);
// console.log(mystream.super_===events.EventEmitter);
// stream.on("data",function(data){
// 	console.log('received data'+data);
// })
// stream.write("it's works");





// udp服务器的搭建
// var dgram=require('dgram');
// var server=dgram.createSocket("udp4");
// server.on("message",function(msg,rinfo){
// 	console.log("server get"+msg+"from"+rinfo.address+":"+rinfo.port);
// 	var message=new Buffer("wo lai shi shi");
// 	server.send(message,0,message.length,rinfo.port,rinfo.address);
// });
// server.on("listening",function(){
// 	var address=server.address();
// 	console.log("server listening"+address.address+":"+address.port);
// });
// server.bind(3000);






// node.js操作数据库mysql例子
// var mysql=require('mysql');
// var connection=mysql.creatConnection({
// 	host:'example.org',       //连接的mysql的服务器
// 	user:'limingakng',        //连接的mysql的用户名
// 	password:'lmk12345',      //连接的密码
// });
// connection.connect(function(err){
// 	console.log(err);
// });
// // 注意这个查询是一个异步的过程
// connect.query('SELECT * FROM table',function(err,rows){
//     if (err) {
//     	console.log(err);
//     	return;
//     };
//     console.log(rows);
// });
// //用来关闭连接
// connection.destroy();  //这个可以强制关闭，一般用下面的来关闭，因为他有返回值
// connection.end(function(err){
// 	console.log("it's over");
// });


// // node.js操作数据库mongodb的例子
// var mongodb=require('mongodb');
// var server=new mongodb.Server("127.0.0.1",27017,{});
// //创建数据库操作对象
// var db=new mongodb.Db('test',server,{});   //创建一个名为test的数据库
// db.open(function(error,client){            //打开数据库
// 	client.Collection('test_collection',function(err,collection){   //在数据库中创建一个名为test_collection的表
// 		collection.insert({hello:'word'},{safe:true},function(err,objects){    //向数据库插入{hello:'word'}的json对象数据，数据插入后执行回调函数objects返回的是插入后的objectId,要想有回调函数必须加上{safe:true}这个配置参数对象
// 			if (err) {
// 				console.log(err.message);
// 			}else{
// 				console.log(objects);
// 			}
// 		});
// 		collection.update({hello:'word'},{$set:{hello:'newword'}},{safe:true},function(err){    //第一个参数是条件查询，第二个为要更新成为的数据，使用$set表示只更新hello这个key值的数据，不会修改其他数据，第三个表示有回调函数，第四个是回调函数
// 			if (err) {
// 				console.log(err.message);
// 			}else{
// 				console.log("成功更新了");
// 			}
// 		});
// 		collection.remove({'id':mongoId},function(err){    //删除id为mongoId的数据
// 			if (err) {
// 				console.log(err.message);
// 			}else{
// 				console.log("成功删除了");
// 			}
// 		});
// 		var cursor=collection.find(query,[fields],options);    //query是查询条件,fields是需要返回的字段，options参数和上面一样
// 		    cursor.sort(fields).limit(n).skip(m).       //设置数据库查询时sort排序以及数量限制        
// 			cursor.nextObject(function(err,doc){});
// 			cursor.each(function(err,doc){});         //获取查询结果
// 			cursor.toArray(function(err,docs){});     //将结果转化为数组
// 			cursor.rewind();     //重置cursor的初始状态
// 	})      
// });







//mysql数据库接口设计
// var BaseModel=require('./mysql/base_model.js');
// var baseModel=new BaseModel();
// var tableName="lmkone";
// var rowinfo={};
// rowinfo.name="node.modify";
// rowinfo.degree=23.23;
// var idJson={'id':4};
// baseModel.insert(tableName,rowinfo,function(ret){
// 	console.log(ret);
// });
// baseModel.findOneById(tableName,idJson,function(ret){
// 	console.log(ret);
// });
// baseModel.modify(tableName,idJson,rowinfo,function(ret){
// 	console.log(ret);
// });
// baseModel.remove(tableName,idJson,function(ret){
// 	console.log(ret);
// });

// 当个查询所需参数
// var whereJson={
// 	'and':[{'key':'id','opts':'=','value':10},
// 	       {'key':'name','opts':'=','value':'"lmkfirst"'}],
// 	'or':[{'key':'id','opts':'>','value':10}]
// };
// var fieldsArr=['id','name','degree'];
// var orderByJson={'key':'id','type':'desc'};
// var limitArr=[0,10];
// baseModel.find(tableName,whereJson,orderByJson,limitArr,fieldsArr,function(ret){
// 	console.log(ret);    //没查到则返回空数组
// }); 



// mongodb数据库接口设计测试
// var BaseModel=require('./mongodb/base_model.js'),
//     baseModel=new BaseModel(),
// 	tableName="lmkone",
// 	rowinfo={};
// rowinfo.name="limingkang";
// rowinfo.age=26;
// var id="578ca17748073d287c00e7b4";

// baseModel.insert(tableName,rowinfo,function(ret){
// 	console.log(ret);
// })

// baseModel.modify(tableName,id,rowinfo,function(ret){
// 	console.log(ret);
// })

// baseModel.findOneById(tableName,id,function(ret){
// 	console.log(ret);
// })

// baseModel.remove(tableName,id,function(ret){
// 	console.log(ret);
// })

//单个查询所需参数
// var whereJson={'name':'limingkang'};
// var fieldsJson={'age':1,'name':1};
// var orderByJson={'age':1};
// var limitJson={'skip':1};
// baseModel.find(tableName,whereJson,orderByJson,limitJson,fieldsJson,function(ret){
// 	console.log(ret);    //没查到则返回空数组
// }); 



// 对日志模块的应用
// var Log=require('./log_module/log.js');
// var log=new Log('limingkang','logs/');
// var appLog=require('./log_module/applog_config.js');

// log.info(appLog.ERR_NUM.RET_SUCC,appLog.LOG_CONTR.SERVER,{'data':'is ok'});



// 对配置文件以及其缓存的模块应用
// var config=require('./parse_file_module/parse_file.js');
// var testConf=config.get('test.json','json');
// console.log(testConf);






//对于聊天室mvc分层的想法
// module层设计，文件名叫user_model.js  类名叫做UserModel 方法名采用驼峰式
// function UserModel(){
// 	_self=this;
// 	// 根据用户名获取用户信息
// 	this.getUserByUsername=function(usename,callback){};
// 	// 根据用户名用户密码验证用户是否存在
// 	this.checkUser=function(usename,password,callback){};
// 	// 新增用户信息
// 	this.addNewUser=function(userParameters,callback){
// 		//可在函数里面调用继承的基类操作数据库增删改查
// 	};
// 	//修改用户信息
// 	this.updateUser=function(uid,userParameters,callback){};
// 	// 删除用户信息
// 	this.deleteUser=function(uid,callback){};
// 	// 搜索用户
// 	this.searchUser=function(useName,callback){};
// 	// 邮箱验证
// 	this.confirmEmailCode=function(verificationCode,callback){};
// 	// 验证邮箱是否已经存在
// 	this.searchExistEmail=function(userParameters,callback){};
// };
// UserModel.prototype= new BaseModel();   //继承以前写的数据库操作类
// global.UserModel=UserModel;

// controller层设计，他的实现需要两个逻辑类IndexController和PersonController，就是两个js文件
// index_controller.js如下设计想法
// function IndexController(){
// 	// 获取父类操作对象
// 	var _parent=Object.getPrototypeOf(this);
// 	var _self=this;
// 	this._obj=new UserModel();
// 	// 登录显示页面
// 	this.loginPageAct=function(){
// 		if (_parent._req.session.nickName) {//判断用户是否成功登陆，是否有session存在，有的话进入chat页面，没有的话进入登陆页面
// 			_parent.displayJade(VIEM+"chat",{username:_parent._req.session.nickName})
// 		}else{
// 			_parent.displayJade(VIEM+"main_view");
// 		}
// 	};
// 	// 登录主页信息显示
// 	this.toMainPageAct=function(){};
// 	// 登录操作接口
// 	this.loginAct=function(){};
// 	// 页面登出接口
// 	this.loginOutAct=function(){};
// 	// 页面注册接口
// 	this.signUpAct=function(){};
// 	// 注册页面展示
// 	this.signUpPageAct=function(){};
// 	// 邮箱验证页面
// 	this.emailPageAct=function(){};
// 	// 邮箱验证接口
// 	this.emailConfirmAct=function(){};
// }
// 对于一个操作逻辑来说，一般会包含两个操作接口，页面展示接口和逻辑处理接口

// person_controller.js设计如下
// function PersonController(){
// 	var _parent=Object.getPrototypeOf(this);
// 	var _self=this;
// 	this._obj=new UserModel();
// 	// 用户个人信息修改页面
// 	this.changeInfoPageAct=function(){};
// 	// 用户个人信息修改接口
// 	this.changeInfoAct=function(){};
// 	// 用户头像修改页面
// 	this.changeAtvatarPageAct=function(){};
// 	// 用户头像修改接口
// 	this.changeAtvatarAct=function(){};
// 	this.loginOutAct=function(){};
// }
































