(function($,undefined){

     // <select id="ceshi" url="?r=menu/park" tkxselect="true"></select>通过tkxselect='true'判断只要样式还是也要动态获取
     
    
    tkxform_select = function(select_id){
          this.id= null;
          this.temp=null;
          this.id_input=null;
          this.id_span=null;
          this.id_select=null;
          this.module="<div class='select_contain'><input paramid='' readonly><span class='open_close'><img src='/yii/static/default/finance/images/jiantou.png'></span><select multiple size='3'></select></div>";
          this.initurl="";
          this.showdata=[];
          this.senddata="";
          this.title="";
          this._initselect(select_id);
    }

    tkxform_select.prototype._initselect=function(select_id){
 
         this.temp=$("#" + select_id); 
         this.initurl=$(this.temp).attr("url");

         // 给新加的div以特定标示
         this.title=$(this.temp).find("option");
         var firstcontent=$(this.temp).find("option").eq(0).text();
         $(this.temp).after(this.module);
         $(this.temp).next().attr("id","temp");
         $(this.temp).remove();
         $("#temp").attr("id",select_id);

         //重新标记新的模版节点
         this.id=$("#" + select_id);
         this.id_input=$("#" + select_id).find("input");  
         this.id_span=$("#" + select_id).find("span");
         this.id_select=$("#" + select_id).find("select");

         var that=this;
         $(that.id_span).click(function (event) {                
              if ($(that.id).hasClass("lmkfocus")) {
                   $(that.id).removeClass("lmkfocus");
              } else {
                   $(that.id).addClass("lmkfocus");
              }

              // 阻止事件冒泡
              event.stopPropagation(); 
         })
                  
          // 点击页面其他地方框消失
          $("body").click(function(){
              $(".select_contain").removeClass("lmkfocus");
          });
          //select改变的事件
          $(this.id_select).change(function () {    
              $(that.id_input).val($(this).val());
              $(that.id_input).attr("paramid",$(this).find("option:selected").attr("paramid"));
              that.getselectvalue();
          })
          // 是否是需要动态获取option
         if ($(this.temp).attr("tkxselect")=="true") {     
              this.init_option();
          } else {
              $(this.id_select).append(this.title);
              $(this.id_input).val(firstcontent);
              that.getselectvalue();             
          }

    };

                // 需要的初始化数据格式
                // var array=[
                //     {id:"233",parkName:"钻河停车场",selected:false},
                //     {id:"23dfd3",parkName:"华远企业中心",selected:false},
                //     {id:"2f33",parkName:"西外停车场",selected:false},
                //     {id:"23df3",parkName:"我的停车场的车子",selected:false},
                // ];
  

    tkxform_select.prototype.init_option=function(){
          var that=this;  
          // that.initurl=initurl;
          $.ajax({
            
            type:"get",
            url:that.initurl,
            success:function(data){
                that.showdata=JSON.parse(data);
                var array=that.showdata;
                var all="";
                var temp=false;
                // 动态插入，并找到默认选择的车场
                for(var i in array){
                      if(array[i].selected){
                        $(that.id_input).val(array[i].parkName);
                        $(that.id_input).attr("paramid",array[i].id);
                        all +=array[i].id+",";
                        temp=true;
                      }
                      else {   
                        $(that.id_select).append("<option paramid='"+array[i].id+"'>"+array[i].parkName+"</option>");
                        all +=array[i].id+",";
                      }
                }
                   $(that.id_select).append("<option paramid='"+all+"'>"+'全部车场'+"</option>");
                // 确定全部车场的位置
                if(!temp) {
                  $(that.id_input).val("全部车场");
                  $(that.id_input).attr("paramid",all);
                }

                that.getselectvalue();
            },
          });
          
    };

    tkxform_select.prototype.getselectvalue=function(){    
         this.senddata=$(this.id_input).attr("paramid");
         // $.aja({
         //     data:senddata,
         //     type:"get",
         //     url:that.sendurl,
         //     success:function(data){
                
         //     },
         // });
    }
     

})(jQuery)


