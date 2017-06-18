// @type model
// @name limingakng
// @time 2016/7/14
// @desc 读静态文件的配置信息，之后给下面调用，让它来构造mysql的配置
var fs=require('fs'),
	sys=require('util');
exports.read_config=function(fileName,key){
	var configJson={};
	try{
		var str=fs.readFileSync(fileName,'utf-8');
		configJson=JSON.parse(str);
	}catch(e){
		sys.debug("json parse fails");
	}
	return configJson[key];
}



















