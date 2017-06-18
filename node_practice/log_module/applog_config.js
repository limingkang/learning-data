// 将错误码作为一个文件模块，该文件模块中包含错误码，错误码对应的错误信息，以及日志对应的模块信息

//error num
var ERR_NUM={
	'RET_SUCC' : '0',
	'RET_ERR' : '-1'
} 

// error message
var ERR_MSG={
	'0' : 'success',
	'-1' : 'error'
}

// controller
var LOG_CONTR={
	'SERVER' : 'server',
	'API' : 'api',
	'CONTR' : 'controller',
	'DB' : 'database'
}

function getMsg(errorCode){
	return ERR_MSG[errorCode];
}

exports.ERR_NUM=ERR_NUM;
exports.ERR_MSG=ERR_MSG;
exports.LOG_CONTR=LOG_CONTR;
exports.getMsg=getMsg;
























