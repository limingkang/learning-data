(function($,undefined){

  /*
    <input id='' checkrepeat='' tkx='true' checkblank=false />  通过tkx='true'判断是否是要验重复或空，checkrepeat为空则不验重

  */
  var options = {
    "class":"tkx_input"
   // "type":"text"
  }

 // 查重返回值{errcode:0,errmsg:"要显示的字段"}

  tkxform_input = function(id,option){
     this.name = '';
     this.id = '';
     this.value = '';
     this.checkrepeat = '';
     this.checkblank = false;
     this.input = null;
     this.validate = false;      //是否提交的标示

     this._initTkx(id,option);

  }

  tkxform_input.prototype._initTkx=function(id,option) {
     $.extend(options,option);

     var input = $("#"+id);
     this.input = input;
     //配置基础属性
     this.name = input.attr("name");
     this.id = id;
     this.value = input.val();
     $(this.input).wrap("<div id='alarm'></div>");
     $("#alarm").append("<span></span>");
     this.checkrepeat = input.attr("checkrepeat")?input.attr("checkrepeat"):false;

     this.checkblank = input.attr("checkblank")?input.attr("checkblank"):false;
     //配置样式
     input.addClass(options.class);


     //初始化事件
     var that = this;
     input.blur(function(){
       that.checkValidate(function(data){

       },that);
     })

  };
  tkxform_input.prototype.getValue = function(){
    return $(this.input).val();
  };

  tkxform_input.prototype.getElement = function(){
    return $(this.input);
  };
 


  tkxform_input.prototype.checkBlank = function(){//校验空
    if(this.checkblank && this.getValue()==''){
      $("#alarm span").html("不可为空");
      return false;
    } else {
      $("#alarm span").empty();
      return true;
  }
  };
  tkxform_input.prototype.checkRepeat = function(callback){//校验重复
    // var dtd = $.Deferred();
    var that=this;
    if(this.checkrepeat!=''){       
      var url = this.checkrepeat;  
      var data = {"value":this.getValue()};
      $.getJSON(url,data,function(data){   
        if(data['errcode']==0){
             
          callback(true);
        }
        else {
          $("#alarm span").html(data['errmsg']); 
          callback(false);
        }
      });
    } else {
      callback(false);
    }

  };
  
  tkxform_input.prototype.checkValidate = function(callback,_self){//校验
    var that = _self?_self:this;

    if(!that.checkBlank()){ 
      callback(false);
    } else {
      that.checkRepeat(function(data){
          if(data) {  
              that.validate=true; 
              callback(true);
          } else {
              that.validate=false; 
              callback(false);
          }
      });
    }
    
  };
   
//    var dfd = $.Deferred(); 
// var dfd2 = $.Deferred();



// function fn1(d){
//     setTimeout( function(){
//        d.resolve('13');
//     }, 300);
// }
// function fn2(d){
//     setTimeout( function(){
//       d.resolve('2');
//     }, 200);
// }

// fn1(dfd);
// fn2(dfd2);

// $.when(dfd,dfd2).done(function(data1,data2){
//    console.log(data1);
//    console.log(data2);
//    console.log(3);
// }).fail(function(data1,data2){
//    console.log(data1);
//    console.log(data2);
//    console.log(4);
// });


// console.log(10);




})(jQuery)








        
        
        
        