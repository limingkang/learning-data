(function($,undefined){
    tkxform_input=function(){
         this.temporary="";       //不停的保存当前选中的框
         this.inputclass="";      //得到每个框的class
         this.input=null;         //选中每个对应class的框$(this.input)
         this.checkurl="";        //查重地址
         this.submiturl="";       //提交地址
         this.submitid="";        //得到提交按钮的id
         this.submit=null;        //$(this.submit)
         this.whether=false;      //判断能否提交
    };

    tkxform_input.prototype.init=function(inputclass,submitid,value) {
        this.inputclass=inputclass;  
        this.input=$("."+this.inputclass);
        this.submitid=submitid;
        this.submit=$("#"+this.submitid);

        $(this.submit).attr("tkx_lmk","submit");
        $(this.input).attr("tkx_lmk","false");
        $(this.input).after("<span></span>");

        this.initvalue(value);
    };
    
    tkxform_input.prototype.initvalue=function(value) {
        $(this.input).val(value);
    };

    tkxform_input.prototype.sumcheck=function(checkurl){ 
        var that=this;     
        $(this.input).blur(function(){
            that.temporary=this;
            if($(this).val()=="") {
                that.checkspace();
            } else {
                that.checkrepeat(checkurl);
            }
        });
    };

    tkxform_input.prototype.checkspace=function(){
          $(this.temporary).next().html("输入值不能为空");
          $(this.temporary).next().css("color","red");
    };

    tkxform_input.prototype.checkrepeat=function(checkurl){
          this.checkurl=checkurl;
          var that=this;
          $.ajax({
              type:"get",
              data:{value:$(that.temporary).val(),name:$(that.temporary).attr("name")},
              url:that.checkurl,
              success:function(msg){
                  if(msg==true) {
                    that.checkrepeat_true();
                  } else{
                    that.checkrepeat_false();
                  }
              }
          });
    };

    tkxform_input.prototype.checkrepeat_true=function(){
        $(this.temporary).attr("tkx_lmk","true");
        $(this.temporary).next().html("正确");
        $(this.temporary).next().css("color","green");
    };

    tkxform_input.prototype.checkrepeat_false=function(){
        $(this.temporary).attr("tkx_lmk","false");
        $(this.temporary).next().html("该用户已经注册");
        $(this.temporary).next().css("color","red");
    };
    
    tkxform_input.prototype.mysubmit=function(submiturl){
        this.submiturl=submiturl;
        var that=this;
        $(this.submit).click(function(){ 
               that.whethersubmit();
               if(that.whether==false) {
                  alert(3);
               } else{
                    var senddata=that.getdata(); 
                    $.ajax({
                        type:"get",
                        data:senddata,
                        url:that.submiturl,
                        success:function(msg){
                          // dosomething();
                        },
                    });  
               }
        });
    };

    tkxform_input.prototype.whethersubmit=function(){
        var that=this;
        var whether=[];
        $(this.input).each(function(){
            whether.push($(this).attr("tkx_lmk"));
        });
        for(var i=0;i<whether.length;i++) {
            if(whether[i]=="false") {
                that.whether=false;
                break;
            } else {
                that.whether=true;
            } 
        }
    };
    

    tkxform_input.prototype.getdata=function(){
         var senddata="";
         $(this.input).each(function(){
             senddata=senddata+$(this).attr("name")+":"+$(this).val()+",";
         });
         senddata="{"+senddata+"}";
         return senddata;
    };


})(jQuery)








        
        
        
        