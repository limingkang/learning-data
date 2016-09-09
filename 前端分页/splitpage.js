(function($,undefined){
	
	var buttonNum = 10;
    tkxtable = function(){
		this.table = null;
		this.template = null;
		this.title = null;
		this.tableid = "";
		this.templateid="";
		this.ajaxurl="";
		this.showdata = {};
		this.params = {};
		this.pagesize = 10;
		this.maxCount = 1;
		this.maxPage = 1;
		this.page = 1;

	}


	tkxtable.prototype.setMaxPage = function(maxCount,pagesize) {
		if(maxCount%pagesize!=0){
			this.maxPage = parseInt(maxCount/pagesize)+1;
		}else{
			this.maxPage = maxCount/pagesize;
		}
		console.log(this.maxPage);
		if( isNaN(this.maxPage)){
			this.maxPage = 1;
		}
	};

	tkxtable.prototype.init = function(tableid) {
		this.tableid = tableid;

		this.table = $("#"+tableid);
		this.title = $("#"+tableid).find("tr")[0];

		this.initPageBar();


	};

	tkxtable.prototype.getData = function(ajaxurl,templateid,data) {
		var page=0;
		var pagesize=0;
		if(data!=null){
			page = data.page?data.page:this.page;
			pagesize = data.pagesize?data.pagesize:this.pagesize;

		}
		
		var sendData = {"page":page,"pagesize":pagesize};
		var that = this;

		that.templateid = templateid;
		that.ajaxurl = ajaxurl;
		$.extend(sendData,data);
		that.params = sendData;

		$.getJSON(ajaxurl,sendData,function(data){
				that.page = page;
				that.pagesize = pagesize;
    	  		console.log(data);
        		that.maxCount = data.maxCount;
        		that.showdata = data.data;

        		that.setMaxPage(that.maxCount,that.pagesize);

        		
        		$("#"+that.templateid).tmpl(data.data).appendTo("#"+that.tableid);
        			$("#page_button .page").html(that.maxPage);
        			that.firstPageBar();

        		
        });
	};

	tkxtable.prototype.clearData = function() {
    	  $(this.table).find("tr").remove();

    	  $(this.table).append(this.title);
    	  this.showdata = {};
    	  //alert(1);
	};
	tkxtable.prototype.destory = function() {
		$(this.table).remove();
		this.prototype = null;
		
	};
	tkxtable.prototype.refreshData = function(data) {
		var that = this;
		that.clearData();
		
		
		var page = data.page?data.page:this.page;
		var pagesize = data.pagesize?data.pagesize:this.pagesize;
		var sendData = {"page":page,"pagesize":pagesize};
		var that = this;
		$.extend(that.params,data);	

		$.extend(sendData,that.params);

		$.getJSON(that.ajaxurl,sendData,function(data){
				that.page = page;
				that.pagesize = pagesize;
    	  		
        		that.maxCount = data.maxCount;
        		that.showdata = data.data;
        		that.setMaxPage(that.maxCount,that.pagesize);

        		$("#page_button .page").html(that.maxPage);
        		$("#"+that.templateid).tmpl(data.data).appendTo("#"+that.tableid);

                if(page==1){
        			 that.firstPageBar();
        		}else{
        			that.refreshPageBar();
        		}
        });

	};

	tkxtable.prototype.refreshPageButton = function() {
		var maxpage = this.maxPage;
		var pagesize = this.pagesize;
			$(".first_page").unbind();
 			$(".first_page").click(function(){
                if(maxpage>pagesize) {
	            	$(".mybutton").remove();
		            for(var i=1;i<pagesize+1;i++) {
			           $("#button_mark").append("<button class='mybutton'>"+i+"</button>");
		            }
	            }
			    $(".mybutton").each(function(){
				    if(1==$(this).text()) {
                        $(this).click();
				    }
			    });  
            });
            $(".last_page").unbind();
            $(".last_page").click(function(){
                if(maxpage>pagesize) {
	            	$(".mybutton").remove();
		            for(var i=maxpage-pagesize-1;i<maxpage+1;i++) {
			           $("#button_mark").append("<button class='mybutton'>"+i+"</button>");
		            }
	            }
			    $(".mybutton").each(function(){
				    if(maxpage==$(this).text()) {
                        $(this).click();
				    }
			    });  
            });

	};
	tkxtable.prototype.initPageBar = function() {

		var pagebar = "<div id='page_button'>" +
            	"<span>总共有<span class='page'></span>页</span>"+
            	"<button class='first_page'>第一页</button><button class='pre_page'>前一页</button>"+
            	"<div id='button_mark' style='display:inline-block'></div>"+
            	"<button class='next_page'>后一页</button><button class='last_page'>最后一页</button>"+
            	"</div>";

        $(this.table).after(pagebar);

        var that = this;
         //页面按钮的变化事件
            $(".pre_page").click(function(){    
                $("#active").prev().click();
            });
            $(".next_page").click(function(){    
                $("#active").next().click();
            });
        that.refreshPageButton();
           
        $(document).on("click",".mybutton",function(){
    			
                var current_page=$(this).text();
                var array=new Array();
			    var newarray=new Array();
                
			    var maxpage = that.maxPage;
			    var pagesize = that.pagesize;
                that.refreshData({"page":current_page});
                //$("#button_mark").empty();
                $(".mybutton").each(function(){
			        	array.push(Number($(this).text()));
			    });
                // 标签页的有无控制行
                if(current_page=="1") {
                	$("#page_button .first_page").css("display","none");
                    $("#page_button .pre_page").css("display","none");
                }
    		    if (current_page!="1") {
                    $("#page_button .first_page").css("display","inline-block");
                    $("#page_button .pre_page").css("display","inline-block");
			    }
			    if(current_page==maxpage) {
                	$("#page_button .last_page").css("display","none");
                    $("#page_button .next_page").css("display","none");
                }
    		    if (current_page!=maxpage) {
                    $("#page_button .last_page").css("display","inline-block");
                    $("#page_button .next_page").css("display","inline-block");
			    }

    		 
			    // 按钮数字的变化
			    if (array.length == buttonNum) {
                    // 后面按钮点击数字的变化
			    	if (array[array.length-1]!=maxpage) {
				        if (array[array.length-1]-current_page<4) {

					        $(".mybutton").remove();
					        var add=3;
					        if (array[array.length-1]+1==maxpage) {add=1;}
						    if (array[array.length-1]+2==maxpage) {add=2;}
					        for(var i=0;i<array.length;i++) {		              
			                        newarray[i]=array[i]+add;		                        
			                }

			                for(var i=0;i<newarray.length;i++) {    
					            $("#button_mark").append("<button class='mybutton'>"+newarray[i]+"</button>")
				            }
				        }
				    }
                    //前面按钮点击的数字变化
			        if (array[array.length-1]-current_page>6) {
			            if (array[0]!=1) { 
					        $(".mybutton").remove();
					        var temp=3;
					        if (array[0]-1==1) {temp=1;}
					        if (array[0]-2==1) {temp=2;}
					        for(var i=0;i<array.length;i++) { 
			                    newarray[i]=array[i]-temp;     
			                }
			                for(var i=0;i<newarray.length;i++) {    
					            $("#button_mark").append("<button class='mybutton'>"+newarray[i]+"</button>")
				            }
				        }
			        }  
			    }
                
       
    			     
    		});

	};

	tkxtable.prototype.refreshPageBar = function() {
			var current_page = this.page;
			var maxpage  = this.maxPage;
			var page = this.page;


		  	// if (maxpage<buttonNum+1) {
		   //      for(var i=1;i<maxpage+1;i++) {
		   //          $("#button_mark").append("<button class='mybutton'>"+i+"</button>")
		   //      }
		   //  } else {
		   //      for(var i=1;i<buttonNum+1;i++) {
		   //          $("#button_mark").append("<button class='mybutton'>"+i+"</button>")
		   //      }
		   //  }

		    $(".mybutton").attr("id","");
		    $(".mybutton").each(function(){
		        if(current_page==$(this).text()) {
                    
		        	$(this).attr("id","active");
		        }
		    });
    
		     this.refreshPageButton();
	};


	tkxtable.prototype.firstPageBar = function() {
		var maxpage  = this.maxPage;
		$("#button_mark").empty();
	  	if (maxpage<buttonNum+1) {
	        for(var i=1;i<maxpage+1;i++) {
	            $("#button_mark").append("<button class='mybutton'>"+i+"</button>")
	        }
	    } else { 
	        for(var i=1;i<buttonNum+1;i++) {
	            $("#button_mark").append("<button class='mybutton'>"+i+"</button>")
	        }
	    }

        $(".mybutton").each(function(){
            if(1==$(this).text()) {
                $(this).attr("id","active");
            }
        });
	};

})(jQuery)