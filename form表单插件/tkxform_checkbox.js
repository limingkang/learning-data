(function($,undefined){

    tkxform_checkbox=function(){
       this.class=$(".tkx_checkbox");
       this.firstid="";
       this.sumvalue="";
       this.content=null;
       this.senddata={};
       this.initcheckbox();
    }

    tkxform_checkbox.prototype.initcheckbox=function(){
        
        this.content=this.class.find("input"); 
        for (var i = 1;i<this.content.length;i++) {
            this.sumvalue+=( $(this.content[i]).val()+",");
        };
        this.content.eq(0).val(this.sumvalue);
        this.firstid=this.content.eq(0).attr("id");
        this.initclick();
    };

    tkxform_checkbox.prototype.initclick=function(){
        var that=this;
        this.class.click(function(event){
            // 判断是否是全部这个按钮
            if($(event.target).attr("id")==that.firstid) {    
                if($(event.target).is(":checked")) {
                    that.content.prop("checked",true);
                } else {
                    that.content.removeAttr("checked");
                }
            }else {
                // 点击其他选项时候，判断全选按钮的有无
                that.content.eq(0).prop("checked",true);
                for (var i = 1;i<that.content.length;i++) {    
                    if(!$(that.content[i]).is(":checked")) {
                        that.content.eq(0).removeAttr("checked");
                        break;
                    }
                }     
            }
            // 刷新要发送的数据
            that.freshsenddata();  
        });
    };

    tkxform_checkbox.prototype.freshsenddata=function(){
        // 清除以前的数据
        this.senddata={};

        if(this.content.eq(0).is(":checked")) {
            this.senddata[this.firstid]=this.content.eq(0).val();
        } else {
            for (var i = 1;i<this.content.length;i++) {    
                if($(this.content[i]).is(":checked")) {
                    this.senddata[$(this.content[i]).attr("id")] = $(this.content[i]).val();
                }
            } 
        }
        // console.log(this.senddata);
    };

})(jQuery)






        
        
        
        