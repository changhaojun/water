var thingId="58734ea511b69c22b0afa990";
var globalurl="http://192.168.1.114";
window.accesstoken="58f433a2cadd44751040b8aa";
$(function(){
//	getToken();
	toolTips();
	alarmList();
})
//获取警告列表
function alarmList(){
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/alarms",
		dataType: 'JSON',
		type: 'get',
		data:{
			access_token:window.accesstoken
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			console.log(data);
			if(data.code==400005){
				window.getNewToken()
				alarmList();
			}else{
				var str="";
				for(var i=0;i<data.length;i++){
					str+='<div class="alarmList">'+
							'<div class="alarmTop">'+data[i].data_name+'</div>'+
							'<div class="alarmContent">'+
								'<span>'+data[i].data_value+'</span>'+
								'<span>'+data[i].data_time+'</span>'+
							'</div>'+
							'<div class="alarmFooter">'+
								'<ul><li>'+									
										'<div class="dataLeft">'+
											'<span class="dataMin">'+data[i].threshold.lower_value+'</span>~'+										
											'<span class="dataMax">'+data[i].threshold.upper_value+'</span>'+											
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-cog" data-toggle="tooltip" data-placement="top" title="修改" onclick="modify('+data[i].data_id+')"></i>'+
											'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="clear('+data[i].data_id+')"></i>'+
										'</div>'+						
									'</li>'+
									'<li>'+
										'<div class="dataLeft">'+
										
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData('+data[i].data_id+')"></i>'+
										'</div>'+							
									'</li>'+						
								'</ul>'+
							'</div>'+
						'</div>'
				}
				$(".alarmEntity").append(str);
			}	
		}
	});
};

//初始化提示框
function toolTips(){
	$('[data-toggle="tooltip"]').tooltip();
	topColor($(".alarmFooter ul li .fa"),"#effaf6","#1ab394");
}
function topColor(obj,color,fontcolor){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css({"background-color":color,"color":fontcolor});
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}
function addData(_id){
	layer.title("修改警告",2);
	layer.style(2, {
			  width: '450px',
			  top: '10px'
			}); 
	layer.alert('<input type="text" id="dataMin" placeholder="请输入最小值"/>  ~  <input type="text" id="dataMax" placeholder="请输入最大值"/>',{title: '修改警告',btn:"保存"}, function(index){	
		
		
		$(".layui-layer-btn0").html("保存")
		if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{
//			 data="{'lower_value':'"+$("#dataMin").val()+"','uuper_value':'"+$("#dataMax").val()+"'}";
//			 data={"threshold":data,"access_token":window.accesstoken,"data":_id};
//			 console.log(data)
//			$.ajax({
//				url:globalurl+"/v1/alarms",
//				data:data,
//				dataType: 'JSON',
//				type: 'POST',
//				crossDomain: true == !(document.all),
//				success: function(data) {
//					console.log(data);
//					if(data.code==400005){
//						  window.getNewToken()
//						  addEntity();
//					 }else if(data.code==200){
//						layer.msg(data.success, {
//							icon : 1
//						});
//						
//					}else{
//						layer.msg(data.success, {
//							icon : 2
//						});
//					}
//				},
//				error: function(data) {
//					console.log(data)
//					layer.msg("添加失败", {
//						icon : 2
//					});
//			    }
//			});
		}
		
	
	})
}























