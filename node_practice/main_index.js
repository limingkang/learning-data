var  fs=require("fs"),
	 url=require("url");
exports.goIndex=function(res,req){
	var readPath=__dirname+'/'+url.parse('index.html').pathname;
	var indexpage=fs.readFileSync(readPath);
	res.end(indexpage);
}

