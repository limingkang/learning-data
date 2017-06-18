实现功能：

1. 注册

2. 登录

3. 添加商品

4. 加入购物车和结算

使用说明：

1. 安装依赖之后启动mongodb；

2. 启动项目: 在命令行窗口 cd 到项目目录，输入: node app.js

然后就可以通过 http://localhost:3000 访问了。



虽然session与cookie是分开保存的.但是session中的数据经过加密处理后默认保存在一个cookie中,如果你没有设置的话默认的键为coomect.sid
app.use(express.session([options]));
	options参数的具体取值:

	key:字符串,用于指定用来保存session的cookie名称,默认为coomect.sid.

	store:属性值为一个用来保存session数据的第三方存储对象.

	fingerprint:属性值为一个自定义指纹生成函数.

	cookie:属性值为一个用来指定保存session数据的cookie设置的对象,默认值为{path:”/”,httpOnly:true,maxAge:14400000}.

	path是cookie保存路径.httpOnly是否只针对http保存cookie,

	maxAge用于指定cookie的过期时间,单位为毫秒.

	secret:字符串.用来对session数据进行加密的字符串.这个属性值为必须指定的属性


对于session你可以存储到不同的地方：    
	1：存储到内存中
	var session = require('express-session');
	app.use(session({
	    secret: configs.sysconfig.sessionsecret,
	    key: configs.sysconfig.sessionsid,
	    cookie: {
	        secret: true,
	        expires: false
	    },
	    resave: true,
	    saveUninitialized: true
	}));
	2：存储到redis
	app.use(session({
	 store: new RedisStore({
	 host: "127.0.0.1",
	 port: 6379,
	 db: "test_session"
	 }),
	 resave:false,
	 saveUninitialized:false,
	 secret: 'keyboard cat'
	 }))
	3：存储到mongodb
	app.use(session({
	    secret: config.session_opts.sessionsecret,
	    store: new MongoStore({
	        url: config.session_opts.db
	    }),
	    resave: true,
	    saveUninitialized: true
	}));
























