var thingId=$("#thingId").val();
var globalurl="http://192.168.1.114";
//window.accesstoken="58f433a2cadd44751040b8aa";
$(function(){
	getToken();
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
				toolTips();
			}else{
				var str="";
				for(var i=0;i<data.length;i++){
					str+='<div class="alarmList">'+
							'<div class="alarmTop">'+data[i].device_name+"-"+data[i].data_name+'</div>'+
							'<div class="alarmContent">'+
								'<span>'+data[i].data_value+'</span>'+
								'<span>'+data[i].data_time+'</span>'+
							'</div>'+
							'<div class="alarmFooter">'+
								'<ul>'+						
								'</ul>'+
							'</div>'+
						'</div>'
								
						var oLi="";
						for(var j=0;j<2;j++){
							if(data[i].threshold==undefined){
								oLi+='<li>'+
										'<div class="dataLeft">未配置'+								
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData('+data[j].data_id+')"></i>'+
										'</div>'+							
									'</li>'
							}else{
								oLi+='<li>'+
										'<div class="dataLeft">'+
											'<span>'+data[i].threshold[j].upper_value+'</span>'+
											'<span>'+data[i].threshold[j].lower_value+'</span>'+
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="addData('+data[j].data_id+')"></i>'+
											'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="modify('+data[j].data_id+')"></i>'+
										'</div>'+							
									'</li>'
							}
						}
						
					}
				
				
				$(".alarmEntity").append(str);
				$(".alarmFooter ul").html(oLi)
			}
			toolTips();
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
	layer.alert('<input type="text" id="dataMin" placeholder="请输入最小值"/>  ~  <input type="text" id="dataMax" placeholder="请输入最大值"/>',{title: '添加警告',btn:"保存"}, function(index){	
		if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{
			 data=[{'lower_value':$("#dataMin").val(),'uuper_value':$("#dataMax").val()}];
			 data={"threshold":data,"access_token":window.accesstoken,"data":_id};
			 console.log(data);
			$.ajax({
				url:globalurl+"/v1/alarms",
				data:data,
				dataType: 'JSON',
				type: 'put',
				crossDomain: true == !(document.all),
				success: function(data) {
					console.log(data);
					if(data.code==400005){
						  window.getNewToken()
						  addEntity();
					 }else if(data.code==200){
						layer.msg(data.success, {
							icon : 1
						});
						alarmList();
					}else{
						layer.msg(data.success, {
							icon : 2
						});
					}
				},
				error: function(data) {
					console.log(data)
					layer.msg("添加失败", {
						icon : 2
					});
			    }
			});
		}
		
	
	})
}























