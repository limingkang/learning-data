module.exports=function(app){
	app.get('/game', function (req, res) { 
	    if(req.session.user){
	        var score = req.session.user.score;       
	        res.render('game',{userscore:score});
	    }else{
	        req.session.error = "请先登录"
	        res.redirect('/login');
	    }      
    });
    app.post('/game', function (req, res) {
	    var User = global.dbHelper.getModel('user'),
	        uname = req.session.user.name,
	        score=req.body.score;
	    User.findOne({name: uname}, function (error, doc) {
	        if (error) {
	            res.send(500);
	            req.session.error = '网络异常错误！';
	        } else {
	        	if (score>doc.score) {
	        		User.update({"name":uname},{$set : { score : score}},function(error,doc){
	        			if(error){
	        				res.send(500);
	        			}else{
	        				res.send(200);
	        			}
	        		});
	        	}else{
                   res.send(200);
	        	}
	        }
	    });
	});
}