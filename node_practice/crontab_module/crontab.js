// 有很多种任务模型，这里只考虑三个分别是函数任务，shell脚本任务，api任务即定时调用一个api接口
var TASK_ARR=[];
moudle.exports={
	// 定时任务原理就是每隔一秒去扫描一个任务表，如果当前时间点等于某条件任务执行时间点时，则根据任务模型来执行该任务，我们将所有要执行
	// 的任务列表，存储在本模块的一个全局变量TASK_ARR中
	time_task:function(){
		var time=arguments[0],
			task=arguments[1],
			splitArr=time.split(":"),
			hour=splitArr[0],
			minute=splitArr[1],
			sec=splitArr[2]?splitArr[2]:"00",
			taskObj={
				'hour':parseInt(hour),
				'minute':parseInt(minute),
				'sec':parseInt(sec),
				'task':task
			};
		TASK_ARR[TASK_ARR.length]=taskObj;
	},

	// 隔断时间任务
	circle_task:function(){
		var sec=arguments[0],
		    task=arguments[1];
		if (!sec || !task) {
			callback('');
		}
		// 如果是函数任务，则执行函数
		if (typeof task=='function') {
			setInterval(function(){
				task.call();
			},sec);
		}
		// 如果是字符类型，则执行当做shell脚本
		if (typeof task=='string') {
			setInterval(function(){
				var spawn=require('child_process').spawn;       //调用node的child_process模块来执行shell任务
				var shell=spawn(task);
				shell.stdout.on('data',function(data){    //捕获标准输出并将其打印到控制台
					console.log('stdout: '+data);
				});
			},sec);
		}
	}
}

// 每隔一秒去扫描任务列表，开始任务列表为空，调用上面方法就是向任务列表中加任务而已，之后让其扫描匹配执行
setInterval(function(){
	var now=new Date(),
		hour=now.getHours(),
		minute=now.getMinutes(),
		second=now.getSeconds();

	for (var i = 0; i < TASK_ARR.length; i++) {
		var timeTask=TASK_ARR[i];
		if (hour==timeTask['hour'] && minute==timeTask['minute'] && second==timeTask['sec']) {
			if (typeof timeTask['task']=='function') {
				timeTask['task'].call();
			}else if (typeof timeTask['task']=='string') {
				var spawn=require('child_process').spawn;       
				var shell=spawn(timeTask['task']);
				shell.stdout.setEncoding('utf-8');
				shell.stdout.on('data',function(data){    
					console.log('stdout: '+data);
				});
			};
		}
	};
},1000);
























