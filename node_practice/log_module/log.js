var appLog=require('./applog_config.js');
var log4js=require('log4js');
var loguser=user,
    logpath=path,
    dateStr=getDateTime(),
    logger=log4js.getLogger(loguser);

moudle.exports=function(loguser,logpath){
	// for error log
	this.error=function(errNum,controller,logInfo){
		var errType='error';
		log(errType,errNum,controller,logInfo);
	}

	// for info log
	this.info=function(errNum,controller,logInfo){
		var errType='info';
		log(errType,errNum,controller,logInfo);
	}

	// for warn log
	this.warn=function(errNum,controller,logInfo){
		var errType='warn';
		log(errType,errNum,controller,logInfo);
	}

	// for debug log
	this.debug=function(errNum,controller,logInfo){
		var errType='debug';
		log(errType,errNum,controller,logInfo);
	}

	function log(errType,errorCode,controller,otherInfo){
		var otherInfo=otherInfo?otherInfo:{};
		// 错误日志信息
		var errorMsg=appLog.getMsg(errorCode);
		// 记录日志的文件名
		var errorLog=getLogFileName(errType,controller);
		log4js.addAppender(lib.log4js.appenders.file(errorLog),loguser);

		var jsonStr=JSON.stringify(otherInfo);
		errorMsg='[code ' + errorCode + '] ' + '[msg ' + errorMsg + ']' +jsonStr;
		
		// 记录日志
		addLog(errType,errorMsg);
		log4js.clearAppenders();
	}

	function getLogFileName(errType,controller){
	    var logPrefix=logpath+'/'+dateStr+'/';      //logpath是你要放的日志文件的文件夹，dateStr为时间字符串，最后生成一个路径如log/20160723/server_error.log
	    try {
	    	fs.readdirSync(logPrefix);          //判断当前路径是否存在，如果不存在则创建文件路径
	    }catch(err){
	    	fs.mkdirSync(logPrefix);
	    }
	    switch(errType){                                   //根据不同的类型，为路径加上后缀
	    	case 'error' : return logPrefix+controller+'_error.log';
	    	break;
	    	case 'info' : return logPrefix+controller+'_info.log';
	    	break;
	    	case 'warn' : return logPrefix+controller+'_warn.log';
	    	break;
	    	case 'debug' : return logPrefix+controller+'_debug.log';
	    	break;
	    }
	}  

	function addLog(errType,errorMsg){
		switch(errType){
			case 'error' : logger.error(errorMsg);
			break;
			case 'info' : logger.info(errorMsg);
			break;
			case 'warn' : logger.warn(errorMsg);
			break;
			case 'debug' : logger.debug(errorMsg);
			break;
		}
	}
}

// 上面的dateStr为本模块的全局变量，其主要是将当前时间转化为时间字符串，实现如下：
function getDateTime(timestamp){
	var timeTamp = timestamp? new Date(timestamp):new Date(),
	    currentTime;
	var yy=timeTamp.getFullYear();
	var mm=(timeTamp.getMonth())++;
	var dd=timeTamp.getDate();

    mm<10?mm='0'.concat(mm):null;
    dd<10?dd='0'.concat(mm):null;

    return ''+ yy + mm + dd;
}










































