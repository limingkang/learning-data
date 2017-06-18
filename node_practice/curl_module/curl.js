var request=require('request');
var querystring=require('querystring');

module.exports={
	// 模拟get请求,方法都不限定参数，内部获取，这样调用的时候写参数自由一些
	get:function(){
		var url=arguments[0],
		    get=arguments[1],
		    callback=arguments[2];
		if (!callback && typeof get=='function') {
			get={};
			callback=arguments[1];
		}
		if (!url) {
			callback("");
		}

		var params={};
		if (get) {
			if (url.indexOf('?')>-1) {
				url=url+'&';
			}else{
				url=url+'?';
			}
		}
		url=encodeURI(url+querystring.stringify(get));     //对其进行编码，否则遇到特殊字符会出现访问异常
		params['url']=url;
		params['json']=true;
		request.get(params,function(error,response,result){
			if (error) {
				console.log(error);
				callback(result);
			}else{
				callback(result);
			}
		});

	},
	// 模拟post请求
	post:function(){
		var url=arguments[0],
		    post=arguments[1],
		    callback=arguments[2];
		if (!callback && typeof post=='function') {
			post={};
			callback=arguments[1];
		}
		if (!url) {
			callback("");
		}

		var params={};
		params['url']=url;
		params['json']=true;
		params['form']=post;               //request模块中的参数使用form为键值传递
		// request中的post方法可以有多种调用方式：
		//request.post({url:'url',json:'true',form:'object'},function(error,response,result){}) 
		// request.post('url',{form:'object'},function(error,response,result){})
		request.post(params,function(error,response,result){
			if (error) {
				console.log(error);
				callback(result);
			}else{
				callback(result);
			}
		});
	},
	// 模拟表单文件上传
	form_post:function(){
		var url=arguments[0],
		    data=arguments[1],
		    callback=arguments[2];
		if (!callback && typeof data=='function') {
			data={};
			callback=arguments[1];
		}
		if (!url) {
			callback("");
		}

		var request=request.post(url);
		var form=request.form();
		for(var key in data){
			form.append(key,data[key]);       //向form对象中append数据，其中的post文件需要使用fs对象读取数据，才能append到form中进行提交如：form.append('url_file',fs.createReadStream('wo.png'))
		}
	}
}







































