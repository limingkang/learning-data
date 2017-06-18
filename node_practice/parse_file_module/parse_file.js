// 一个项目中包含多种配置文件，例如json格式，conf类型或者xml类型，对于这些类型都有相应的解析方式，本模块只介绍json格式h和conf类型的配置文件
global.CONFIG={};   //用于配置文件缓存
function get(){
    var fileName=arguments[0],
        type=arguments[1],
        key=arguments[2]?arguments[2]:"";
    var filePath='conf/'+fileName;
    var cacheData=getCache(filePath,fileName,key);
    if (cacheData) {
    	return cacheData;
    }
    switch(type){
    	case 'conf':
    	    return getConf(fileName,filePath,key);
    	break;
    	case 'json':
    	    return getJson(fileName,filePath,key);
    	break;
    }
}

function getConf(fileName,filePath,key){
	try{
		var r=[],
			q=require("querystring"),
			f=fs.readFileSync(filePath,"utf-8"),
			v=q.parse(f,'[',']'),        //使用[]解析配置文件
			t;
	}catch(err){
		console.log(err);
		return '';
	}
	for(var i in v){
		if (i!=''&&v[i]!='') {
			r={};
			t=q.parse(i,v[i],"=");
			for(var j in t){
				if (j!=''&&t[j]!='') r[j]=t[j];
			}
		}
	}
	cache(filePath,fileName,r);     //缓存配置文件内容
	return r[key]?r[key]:r;
}

function getJson(fileName,filePath,key){
	try{
		var str=fs.readFileSync(filePath,'utf-8');
		configJson=JSON.parse(str);
	}catch(err){
		console.log(err);
		return '';
	}
	cache(filePath,fileName,configJson);
	return configJson[key]?configJson[key]:configJson;
}

// 在写入缓存的全局变量的时候，加上文件最后改动的时间作为缓存键名，来解决更新的问题
function getCache(filePath,fileName,key){
	var stat=fs.statSync(filePath);    //该方法返回文件状态的对象，具体返回的对象查百度其中有个键mtime记录的是文件最后修改时间
	var timestamp=Date.parse(stat['mtime']);
	if (CONFIG[fileName+timestamp]) {
		return CONFIG[fileName+timestamp][key]?CONFIG[fileName+timestamp][key]:CONFIG[fileName+timestamp];
	}
	return null;
}

// 缓存函数
function cache(filePath,fileName,data){
	var stat=fs.statSync(filePath);
	var timestamp=Date.parse(stat['mtime']);
	if (data) {
		CONFIG[fileName+timestamp]=data;
	}
}

exports.get=get;
































