// var parseDns = require('./parse_dns.js');
// var mainindex=require('./main_index.js');
// exports.router=function(res,req,pathname){
// 	switch (pathname) {
// 		case '/parse':
// 		    parseDns.parseDns(res,req);
// 		    break;
// 		default:
// 		    mainindex.goIndex(res,req);
// 	}
// };
// module.exports="test is success";
// module.exports="sdfsd";
// module.exports="test";
// module.exports.woshi="sdfds";
// exports.show=function(){
// 	console.log(54544);
// }

var dgram=require('dgram');
var client=dgram.createSocket("udp4");
var message=new Buffer("wo lai shi shi");

client.send(message,0,message.length,3000,"127.0.0.1");
client.on("message",function(msg,rinfo){
	console.log("server get"+msg+"from"+rinfo.address+":"+rinfo.port);
});
// client.close();



















