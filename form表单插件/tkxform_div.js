(function($,undefined){
	/*
		<div id='div' class = 'tkx-form' action = ''>
			 <input id='' checkrepeat='' tkx='true' checkblank=false />
			<select id="ceshi" url="?r=menu/park" tkxselect="true"></select>

		<div class="tkx_checkbox" id="parking">
             <span><input id="all" type="checkbox" name="tkxcheckbox" value="" />全部</span>   
             <span><input id="one" type="checkbox" name="tkxcheckbox" value="1" />今日话题 </span>   
             <span><input id="two" type="checkbox" name="tkxcheckbox" value="2" />视觉焦点</span>
             <span><input id="three" type="checkbox" name="tkxcheckbox" value="3" />财经<span>    
             <span><input id="fdour" type="checkbox" name="tkxcheckbox" value="4" />汽车<span>    
        </div>
			<button>提交</button>
		</div>
	*/

	/*
	后端返回 {errcode:0,errmsg:'success'}
	*/


	tkxform_div = function(id){
		this.div = null;
		this.input_child = {};
		this.select_child={};
		this.checkbox_child={};
		this.action = '';
		this.subbutton ='tkx_submit';
		this.params = {};
		this.method = 'POST';

		this._initTkx(id);

	}

	tkxform_div.prototype._initTkx = function(id) {
		this.div = $("#"+id);
		this.method = this.div.attr('method')?this.div.attr('method'):'POST';
        //获取所有input
		var inputs = this.div.find('input');
		for (var i = inputs.length - 1; i >= 0; i--) {
			var id = $(inputs[i]).attr('id');
			if($(inputs[i]).attr('tkx')=='true'){
				this.input_child[id] = new tkxform_input(id);
				
			}else if($(inputs[i]).attr('type')!='checkbox'){  
				 this.input_child[id] = $(inputs[i]);
				 $(inputs[i]).attr("class","tkx_input");
			}
			
		};
        // 获取所有checkbox
		var checkboxs=this.div.find(".tkx_checkbox");
		for (var i = checkboxs.length - 1; i >= 0; i--) {
			var id = $(checkboxs[i]).attr('id');
			this.checkbox_child[id] = new tkxform_checkbox();
		};
        // 获取所有select
		var selects = this.div.find('select'); 
		for (var i = selects.length - 1; i >= 0; i--) {
			var id = $(selects[i]).attr('id');
			this.select_child[id] = new tkxform_select(id);
		};
		this.initSubButton();

		
	};

	// tkxform_div.prototype.getChild = function(id) {
	// 	return $(this.child[id]);
	// };
	// 判断是否是dom元素，new出来的对象已经不是dom级元素 
	tkxform_div.prototype.isChildTkx = function(obj) {

		 var isDOM = ( typeof HTMLElement === 'object' )?
                function(obj){
                    return obj instanceof HTMLElement;
                }:
                function(obj){
                    return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
       	         }

		return isDOM(obj[0])?false:true;

	};
	tkxform_div.prototype.getParams = function() {
		var param={};
        // 获取所有type为text类的值
		var child_input_Elements = this.input_child;
		for(var key in child_input_Elements){
			param[key] = $("#"+key).val();
			
		}
        // 获取所有select的值
		var child_select_Elements =this.select_child;
		for(var key in child_select_Elements){
			param[key] = child_select_Elements[key].senddata;
			
		}
        // 获取所有checkbox的值
        var child_checkbox_Elements =this.checkbox_child;
		for(var key in child_checkbox_Elements){
			param[key] = child_checkbox_Elements[key].senddata;
			
		}

		return param;
		
	};
	tkxform_div.prototype.checkValidate = function() {
		var childElements = this.input_child;
		var that =this;
		for(var key in childElements){
			var elt = childElements[key];
            // input的判断
			if(that.isChildTkx(elt)) { 
				
				if(!elt.validate){
					return false;
				}else if(elt.checkblank == 'true' && !elt.checkBlank()){
					return false;
				}
				
			}
			
		}

		return true;
	};
	tkxform_div.prototype.initSubButton = function() {
		var that = this;        
		var button = this.div.find('button');
		$(button[0]).attr("id",that.subbutton);
		$(button[0]).click(function(){
            
			if(that.checkValidate()){  
				that.submit();     
			}else{
				// alert('未通过验证，表单提交失败');
				return false;
			}

		});
	};
	tkxform_div.prototype.submit = function() {
		var url = this.div.attr("action");
		var param = this.getParams();
		var that = this;
		if(this.method=='POST'){
			$.post(url,param,function(data){
				that.errorProcess(data);
			});
		}else{
			$.getJSON(url,param,function(data){
				that.errorProcess(data);
			});
		}
		
	};
	tkxform_div.prototype.errorProcess = function(data){
		console.log(data);
		if(data.errcode!=0){
			alert(data.errmsg);
		}
	
	}	


})(jQuery)