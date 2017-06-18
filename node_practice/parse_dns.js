var querystring=require("querystring");
var dns=require("dns");
exports.parseDns=function(res,req){
	var postdata="";
	req.addListener("data",function(data){
		postdata+=data;
	})
	req.addListener("end",function(){
		var resdata=getDns(postdata,function(domain,addresses){
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.end(domain+"....."+ addresses[0]);
		})
	})
}

function getDns(postdata,callback){
	var domain=querystring.parse(postdata).search_dns;   //获取传来数据总键为search_dns的值
	dns.resolve(domain,function(err,addresses){
		if(!addresses){
			addresses=['不存在']
		}
		callback(domain,addresses);
	})
}




