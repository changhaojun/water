var thingId=$("#thingId").val();
//var globalurl="http://192.168.1.114";

$(function(){
	getToken();
	toolTips();
	alarmList();
})
var searchBox=new Vue({
	el:'.search',
	data:{
		searchId:''
	} 
})
//获取警告列表
function alarmList(){
	$(".IContent").html("");
	if(searchBox.searchId==""){
		var data={access_token:window.accesstoken};
		doajax(data);
	}else{
		var data={access_token:window.accesstoken,like:"{'data_name':'"+searchBox.searchId+"'}"};
		doajax(data);
	}
};
function doajax(data){
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/alarms",
		dataType: 'JSON',
		type: 'get',
		data:data,
		crossDomain: true == !(document.all),
		success: function(data) {
			console.log(data)
			if(data.code==400005){
				window.getNewToken()
				alarmList();
				toolTips();				  
			}else{
				var str="";
				for(var i=0;i<data.length;i++){
					var oLi="";
					str='<div class="alarmList">'+
							'<div class="alarmTop">'+data[i].device_name+"-"+data[i].data_name+'</div>'+
							'<div class="alarmContent">'+
								'<span>'+data[i].data_value+data[i].data_unit+'</span>'+
								'<span>'+data[i].data_time+'</span>'+
							'</div>'+
							'<div class="alarmFooter">'+
								'<ul>'+						
								'</ul>'+
							'</div>'+
						'</div>'
					$(".IContent").append(str);			
						var oLi="";
						for(var j=0;j<2;j++){
							if(data[i].threshold==undefined||data[i].threshold[j]==undefined||(data[i].threshold[j].upper_value=="+∞"&&data[i].threshold[j].lower_value=="-∞")){
								
								oLi='<li>'+
										'<div class="dataLeft">未配置'+								
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData('+data[i].data_id+','+j+","+i+')"></i>'+
										'</div>'+							
									'</li>'
									
							}else{	
								if(data[i].threshold[j].lower_value=="-∞"){
									data[i].threshold[j].lower_value="'-∞'";
								}
								if(data[i].threshold[j].upper_value=="+∞"){
									data[i].threshold[j].upper_value="'+∞'";
								}
										oLi='<li>'+
										'<div class="dataLeft">'+
											'<span>'+data[i].threshold[j].lower_value+'</span>~'+
											'<span>'+data[i].threshold[j].upper_value+'</span>'+
										'</div>'+
										'<div class="dataRight">'+
											'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="modify('+data[i].data_id+","+data[i].threshold[j].lower_value+","+data[i].threshold[j].upper_value+","+j+","+i+')"></i>'+
											'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="alarmDel('+data[i].data_id+","+data[i].threshold[j].lower_value+","+data[i].threshold[j].upper_value+","+j+","+i+')"></i>'+
										'</div>'+							
									'</li>'
							}
							$(".alarmFooter ul").eq(i).append(oLi);						
						}	
					colorBg(data[i].status,i);
			}
			toolTips();		
			}	
		},
		error:function(data){
			console.log(data)
		}
	});
}
function colorBg(data,index){
	if(data==1){
		$(".alarmList").eq(index).addClass("greenBg");
	}else if(data==0){
		$(".alarmList").eq(index).addClass("grayBg");
	}else{
		$(".alarmList").eq(index).addClass("redBg");
	}
}
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
//添加数据
function addData(_id,Iindex,dataIndex){
	var Iindex=Iindex;
	var dataIndex=dataIndex;
	layer.alert('<input type="text" id="dataMin" placeholder="请输入最小值" onkeyup="if(event.keyCode==32){space($(this))}"/>  ~ '+
	'<input type="text" id="dataMax" placeholder="请输入最大值" onkeyup="if(event.keyCode==32){space($(this))}"/>',{title: '添加警告',btn:"保存",area: ['400px'],skin:'demo-class'}, function(index){
		var text=/\D/;
		if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else if(text.test($("#dataMin").val())||text.test($("#dataMax").val())){
			layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{
			if($("#dataMax").val()==""){
				var dataMax=JSON.stringify("");
			}else{
				dataMax=$("#dataMax").val();
			}
			if($("#dataMin").val()==""){
				var dataMin=JSON.stringify("");
			}else{
				dataMin=$("#dataMin").val()
			}
			if($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html()!="未配置"){
				var IdataMin=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
				var IdataMax=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();
			}else{
				IdataMin=JSON.stringify("");
				IdataMax=JSON.stringify("");
			}
			if(Iindex==1){
				var othreshold = "["+
				"{"+
					"lower_value: "+IdataMin+","+
					"upper_value: "+IdataMax+
				"},"+
				"{"+
					"lower_value: "+dataMin+","+
					"upper_value: "+dataMax+
				"}"+
				"]";
			}else{
				var othreshold = "["+
				"{"+
					"lower_value: "+dataMin+","+
					"upper_value: "+dataMax+
					
				"},"+
				"{"+
					"lower_value:"+IdataMin+","+
					"upper_value:"+IdataMax+
				"}"+
				"]";
			}				
			var data="{'threshold':"+othreshold+",'data_id':"+_id+"}"
			var data={"data":data,"access_token":window.accesstoken};
			ajax(data);
		}
		
	
	})
}
//修改数据

function modify(_id,min,max,Iindex,dataIndex){
	var Iindex=Iindex;
	var dataIndex=dataIndex;
layer.alert('<input type="text" id="dataMin" value="'+min+'" onkeyup="if(event.keyCode==32){space($(this))}"/>  ~ '+ 
	'<input type="text" id="dataMax" value="'+max+'"  onkeyup="if(event.keyCode==32){space($(this))}"/>',{title: '修改警告',btn:"保存",area: ['400px'],btnAlign: 'c',skin:'demo-class'}, function(index){
		if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{	
			if($("#dataMax").val()==""){
				var dataMax=JSON.stringify("");
			}else{
				dataMax=$("#dataMax").val();
			}
			if($("#dataMin").val()==""){
				var dataMin=JSON.stringify("");
			}else{
				dataMin=$("#dataMin").val()
			}
			if($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html()!="未配置"){
				var IdataMin=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
				var IdataMax=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();
			}else{
				IdataMin=JSON.stringify("");
				IdataMax=JSON.stringify("");
			}
			if(Iindex==1){
				var othreshold = "["+
				"{"+
					"lower_value: "+IdataMin+","+
					"upper_value: "+IdataMax+
				"},"+
				"{"+
					"lower_value: "+dataMin+","+
					"upper_value: "+dataMax+
				"}"+
				"]";
			}else{
				var othreshold = "["+
				"{"+
					"lower_value: "+dataMin+","+
					"upper_value: "+dataMax+
					
				"},"+
				"{"+
					"lower_value:"+IdataMin+","+
					"upper_value:"+IdataMax+
				"}"+
				"]";
			}				
			var data="{'threshold':"+othreshold+",'data_id':"+_id+"}"
			var data={"data":data,"access_token":window.accesstoken};
			console.log(data)
			ajax(data);
		}
		
	
})
}
//清除数据
function alarmDel(_id,min,max,Iindex,dataIndex){
	var Iindex=Iindex;
	var dataIndex=dataIndex;
	layer.confirm("<font size='2'>确定清除该数据？</font>", {icon:7,skin:'del-class'}, function(index){
		console.log($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html())
			if($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html()=="未配置"){
				var IdataMin=JSON.stringify("");
				var IdataMax=JSON.stringify("");
				
			}else{
				var IdataMin=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
				var IdataMax=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();
			}
		
			if(Iindex==1){
				var othreshold = "["+
				"{"+
					"lower_value: "+IdataMin+","+
					"upper_value: "+IdataMax+
				"},"+
				"{"+
					"lower_value: '',"+
					"upper_value: ''"+
				"}"+
				"]";
			}else{
				var othreshold = "["+
				"{"+
					"lower_value: '',"+
					"upper_value: ''"+
					
				"},"+
				"{"+
					"lower_value:"+IdataMin+","+
					"upper_value:"+IdataMax+
				"}"+
				"]";
			}				
			var data="{'threshold':"+othreshold+",'data_id':"+_id+"}"
			var data={"data":data,"access_token":window.accesstoken};
			ajax(data);
		});
	
}
function ajax(data){
	$.ajax({
				url:globalurl+"/v1/alarms",
				data:data,
				dataType: 'JSON',
				type: 'put',
				crossDomain: true == !(document.all),
				success: function(data) {
					if(data.code==400005){
						  window.getNewToken()
						  addEntity();
					 }else if(data.code==200){
						layer.msg(data.success, {
							icon : 1,
							time:1000
						},function(){
							alarmList();
						});						
					}else{
						layer.msg(data.success, {
							icon : 2,
							time:1000
						},function(){
							alarmList();
						});
					}
				},
				error: function(data) {
					layer.msg("添加失败", {
						icon : 2,
						time:1000
					},function(){
							alarmList();
						});
			    }
			});
}
//input禁止输入字母空格
function space(obj){
	obj.val("")
}
 (function ($) {
            $.fn.watch = function (callback) {
                return this.each(function () {
                    //缓存以前的值  
                    $.data(this, 'originVal', $(this).val());

                    //event  
                    $(this).on('keyup paste', function () {
                        var originVal = $.data(this, 'originVal');
                        var currentVal = $(this).val();

                        if (originVal !== currentVal) {
                            $.data(this, 'originVal', $(this).val());
                            callback(currentVal);
                        }
                    });
                });
            }
        })(jQuery);

 function letter(obj){
 	var text=/\D/;
 	if(text.test(obj.val())){
 		obj.val("")
 	}
 }


















