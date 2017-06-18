// 解析xml格式的文件，xml2js的解析效率不及htmlparser2,它是用java写的，但是xml2js对node友好，用起来更方便
var fs=require('fs');
var XML_TMP_DATA;
module.exports={
	parse:function(xmlPath,pathName,callback){
		var retInfo={};
		var cacheData=getCache(xmlPath,pathName)；

		if (cacheData) {
			retInfo['code']=0;
			retInfo['data']=cacheData;
			callback(retInfo);
			return;
		}

		var xml2js=require('xml2js');
		var parseString=xml2js.parseString;
		fs.exists(xmlPath,function(existBool){
			if (existBool) {
				var xmlInfo=fs.readFileSync(xmlPath);
				parseString(xmlInfo,function(err,result){
					if (err) {
						retInfo['code']=-1;
					}else{
						retInfo['code']=0;
						retInfo['data']=result;
						cacheXml(xmlPath,pathName,result);
					}
					callback(retInfo);
					return;
				});
			}else{
				retInfo['code']=-2;
				retInfo['data']={};
				callback(retInfo);
			}
		});
	}
}

// 添加缓存信息
function cacheXml(filePath,fileName,data){
	var stat=fs.statSync(filePath);
	var timestamp=Date.parse(stat['mtime']);
	if (data) {
		XML_TMP_DATA[fileName+timestamp]=data;
	}
}

// 获取缓存数据
function getCache(filePath,fileName,key){
	var stat=fs.statSync(filePath);
	var timestamp=Date.parse(stat['mtime']);
	if (XML_TMP_DATA[fileName+timestamp]) {
		return XML_TMP_DATA[fileName+timestamp][key]?XML_TMP_DATA[fileName+timestamp][key]:XML_TMP_DATA[fileName+timestamp];
	}
	return null;
}


// 例如数据格式是这样的：
// <?xml version="1.0" encoding="UTF-8" ?>
// <business>
//     <company>Code Blog</company>
//     <owner>Nic Raboy</owner>
//     <employee>
//         <firstname>Nic</firstname>
//         <lastname>Raboy</lastname>
//     </employee>
//     <employee>
//         <firstname>Maria</firstname>
//         <lastname>Campos</lastname>
//     </employee>
// </business>
// 解析出来之后就是：
// {
//     "business": {
//         "company": [ "Code Blog" ],
//         "owner": [ "Nic Raboy" ],
//         "employee": [
//             {
//                 "firstname": [ "Nic" ],
//                 "lastname": [ "Raboy" ]
//             },
//             {
//                 "firstname": [ "Maria" ],
//                 "lastname": [ "Campos" ]
//             }
//         ]
//     }
// }
// 是的返回来的有数组，可以加参数变对象xml2js.parseString(xmlStr, { explicitArray : false}, callbackMethod);


// 上面的方法，返回的是不带属性的xml，如果哪个有上面有属性的话，返回的值基本还是不变的，只是在访问到有属性的xml结构的时候，
// 返回的是"lastname": [{_:"Campos",'$':{'attribute':'first'}}]，数组里面的东西会变成一个对象，第一个键是下划线值为结构内的值，第二个$键的值为结构上所有属性的集合，注意这两个键只能叫这个名字


















