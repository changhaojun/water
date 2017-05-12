var thingId=$("#thingId").val();
var dataLike;
var dataId=[];
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
		Omission($(".alarmEntity .alarmTop .thingName"));
		var data={access_token:window.accesstoken};	
			doajax(data)
};
function doajax(data){
	$(".IContent").html("");
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/alarms",
		dataType: 'JSON',
		type: 'get',
		data:data,
		async:false,
		crossDomain: true == !(document.all),
		success: function(data) {
//			console.log(data)
			if(data.code==400005){
				window.getNewToken();
				alarmList();
				toolTips();				  
			}else{
				var str=""	;	
				for(var i=0;i<data.length;i++){
					data[i].title=data[i].device_name+"-"+data[i].data_name					
					Dom(data[i],i);//创建动态Dom	
					colorBg(data[i].status,i);
					dataId.push(data[i].data_id)
			}
			dataLike=data;
			if($("#searchId").val()!=""){
				searchThing($("#searchId"))
			}
			toolTips();
			MQTTconnect(dataId);
			
			}	
		},
		error:function(data){
			console.log(data)
		}
	});
}
//模糊查询
function searchThing(obj){
	$(".IContent").html("");
	var q=0;
	for(var i=0;i<dataLike.length;i++){
		if(dataLike[i].title.search(obj.val())!=-1){
			Dom(dataLike[i],q);		
			q++;
			colorBg1(dataLike[i].status);						
		}
		dataId.push(dataLike[i].data_id)
		
	}
	MQTTconnect(dataId);
}
//动态创建DOM拼接
function Dom(data,i){
	var oLi="";
	str='<div class="alarmList" id="'+data.data_id+'">'+
		'<div class="alarmTop">'+data.device_name+"-"+data.data_name+'</div>'+
		'<div class="alarmContent">'+
			'<span class="dataValue">'+data.data_value+data.data_unit+'</span>'+
			'<span class="dataTime">'+data.data_time+'</span>'+
		'</div>'+
		'<div class="alarmFooter">'+
			'<ul>'+						
			'</ul>'+
		'</div>'+
	'</div>'
$(".IContent").append(str);			
	var oLi="";
	for(var j=0;j<2;j++){
		if(data.threshold==undefined||data.threshold[j]==undefined||(data.threshold[j].upper_value=="+∞"&&data.threshold[j].lower_value=="-∞")||(data.threshold[j].upper_value==""&&data.threshold[j].lower_value=="")){
			
			oLi='<li>'+
					'<div class="dataLeft">未配置'+								
					'</div>'+
					'<div class="dataRight">'+
						'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData('+data.data_id+','+j+","+i+')"></i>'+
					'</div>'+							
				'</li>'
				
		}else{	
			if(data.threshold[j].lower_value=="-∞"){
				data.threshold[j].lower_value="'-∞'";
				
			}
			if(data.threshold[j].upper_value=="+∞"){
				data.threshold[j].upper_value="'+∞'";
			}
					oLi='<li>'+
					'<div class="dataLeft">'+
						'<span>'+(data.threshold[j].lower_value)+'</span>  ~  '+
						'<span>'+(data.threshold[j].upper_value)+'</span>'+
					'</div>'+
					'<div class="dataRight">'+
						'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="modify('+data.data_id+","+data.threshold[j].lower_value+","+data.threshold[j].upper_value+","+j+","+i+')"></i>'+
						'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="alarmDel('+data.data_id+","+data.threshold[j].lower_value+","+data.threshold[j].upper_value+","+j+","+i+')"></i>'+
					'</div>'+							
				'</li>'
		}
		$(".alarmFooter ul").eq(i).append(oLi);						
	}
}
//告警颜色设置
function colorBg(data,index){	
	if(data==1){
		$(".alarmList").eq(index).addClass("greenBg");
	}else if(data==0){
		$(".alarmList").eq(index).addClass("grayBg");
	}else{
		$(".alarmList").eq(index).addClass("redBg");
	}
}
function colorBg1(data){	
	if(data==1){
		$(".alarmList").addClass("greenBg");
	}else if(data==0){
		$(".alarmList").addClass("grayBg");
	}else{
		$(".alarmList").addClass("redBg");
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
		var text=/^[-+]?[0-9]+(\.[0-9]+)?$/;
		var sign=$("#dataMin").val().split("-")[1];
		 if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else if(text.test($("#dataMin").val())||text.test($("#dataMax").val())){ 
			if(($("#dataMin").val().indexOf("-")==-1&&$("#dataMax").val().indexOf("-")==-1&&Number($("#dataMin").val())>=Number($("#dataMax").val())&&$("#dataMax").val()!="")||($("#dataMin").val().indexOf("-")==0&&$("#dataMax").val().indexOf("-")==0&&Number($("#dataMin").val().split("-")[1])<=Number($("#dataMax").val().split("-")[1])&&$("#dataMax").val()!="")||($("#dataMin").val().indexOf("-")==-1&&$("#dataMax").val().indexOf("-")==0&&$("#dataMax").val()!=""&&$("#dataMin").val()!="")){
				console.log($("#dataMin").val()+$("#dataMax").val())
				layer.tips('最大值不能比最小值小', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
				});
			}else{
				var data="{'threshold':"+indexData(Iindex,dataIndex)+",'data_id':"+_id+"}"
				var data={"data":data,"access_token":window.accesstoken};
				ajax(data);
				varLike(_id,$("#dataMin").val(),$("#dataMax").val(),Iindex,dataIndex)
			}
			
		}else{
			console.log(111)
			layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});							
		}
	})
}
//点击添加或者修改设置Dom节点
function varLike(_id,min,max,Iindex,dataIndex){
	var dataLine=$(
				'<div class="dataLeft">'+
					'<span>'+min+'</span>  ~  '+
					'<span>'+max+'</span>'+
				'</div>'+
				'<div class="dataRight">'+
					'<i class="fa fa-cog " data-toggle="tooltip" data-placement="top" title="修改" onclick="modify('+_id+","+min+","+max+","+Iindex+","+dataIndex+')"></i>'+
					'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="清空" onclick="alarmDel('+_id+","+min+","+max+","+Iindex+","+dataIndex+')"></i>'+
				'</div>'					
			)
	$('#'+_id).find('li').eq(Iindex).empty();
	$('#'+_id).find('li').eq(Iindex).append(dataLine)
}
//判定最大值最小值是否为空
function  spaceData(){
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
	if(dataMax=="+∞"){
		dataMax="'+∞'";
	}
	if(dataMin=="-∞"){
		dataMin="'-∞'"
	}
	return [dataMin,dataMax]
}
//判定最大值最小值是否为未配置
function setData(Iindex,dataIndex){
	if($(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft").html()!="未配置"){
		var IdataMin=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(0).html();
		var IdataMax=$(".alarmFooter").eq(dataIndex).find("li").eq(!Iindex).find(".dataLeft span").eq(1).html();
		
	}else{
		IdataMin=JSON.stringify("");
		IdataMax=JSON.stringify("");
	}
	return [IdataMin,IdataMax]
}
//当前数据的第几个下标
function indexData(Iindex,dataIndex){
	if(Iindex==1){
				var othreshold = "["+
				"{"+
					"lower_value: "+setData(Iindex,dataIndex)[0]+","+
					"upper_value: "+setData(Iindex,dataIndex)[1]+
				"},"+
				"{"+
					"lower_value: "+spaceData()[0]+","+
					"upper_value: "+spaceData()[1]+
				"}"+
				"]";
			}else{
				var othreshold = "["+
				"{"+
					"lower_value: "+spaceData()[0]+","+
					"upper_value: "+spaceData()[1]+
					
				"},"+
				"{"+
					"lower_value:"+setData(Iindex,dataIndex)[0]+","+
					"upper_value:"+setData(Iindex,dataIndex)[1]+
				"}"+
				"]";
			}
		return othreshold;
}
//修改数据

function modify(_id,min,max,Iindex,dataIndex){
	var Iindex=Iindex;
	var dataIndex=dataIndex;
	
layer.alert('<input type="text" id="dataMin" value="'+min+'" onkeyup="if(event.keyCode==32){space($(this))}"/>  ~ '+ 
	'<input type="text" id="dataMax" value="'+max+'"  onkeyup="if(event.keyCode==32){space($(this))}"/>',{title: '修改警告',btn:"保存",area: ['400px'],btnAlign: 'c',skin:'demo-class'}, function(index){
	var text=/^[-+]?[0-9]+(\.[0-9]+)?$/;
		if($("#dataMin").val()==""&&$("#dataMax").val()==""){
			layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else if(text.test($("#dataMin").val())||text.test($("#dataMax").val())){
			if(($("#dataMin").val().indexOf("-")==-1&&$("#dataMax").val().indexOf("-")==-1&&Number($("#dataMin").val())>=Number($("#dataMax").val())&&$("#dataMax").val()!="")||($("#dataMin").val().indexOf("-")==0&&$("#dataMax").val().indexOf("-")==0&&Number($("#dataMin").val().split("-")[1])<=Number($("#dataMax").val().split("-")[1])&&$("#dataMax").val()!="")||($("#dataMin").val().indexOf("-")==-1&&$("#dataMax").val().indexOf("-")==0&&$("#dataMax").val()!=""&&$("#dataMin").val()!="")){
				console.log($("#dataMin").val()+$("#dataMax").val())
				layer.tips('最大值不能比最小值小', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
				});
			}else{
				var data="{'threshold':"+indexData(Iindex,dataIndex)+",'data_id':"+_id+"}"
				var data={"data":data,"access_token":window.accesstoken};
				ajax(data);
				varLike(_id,$("#dataMin").val(),$("#dataMax").val(),Iindex,dataIndex)
			}
		}else{						
			layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
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
			var dataLine=$(
							'<div class="dataLeft">未配置'+								
							'</div>'+
							'<div class="dataRight">'+
								'<i class="fa fa-plus-square-o " data-toggle="tooltip" data-placement="top" title="添加" onclick="addData('+_id+','+Iindex+","+dataIndex+')"></i>'+
							'</div>'					
							)
				$('#'+_id).find('li').eq(Iindex).empty();
				$('#'+_id).find('li').eq(Iindex).append(dataLine)
		});
	
}
//ajax函数的调用
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
					console.log(data)
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
	obj.val(obj.val().replace(/\s/g, ''))
}

//订阅
var client; 
var topic;
var data;
function MQTTconnect(dataIds) {
  console.log("订阅程序开始执行");
  var mqttHost = '139.129.231.31';
  var username="admin";
  var password="finfosoft123";
	 topic="mqtt_alarm_currentdata";
	  client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	 data = dataIds;  
	  var options = {
			  timeout: 1000,
			  onSuccess: onConnect,
			  onFailure: function (message) {
				  setTimeout(MQTTconnect, 10000000);
			  }
	  };	  
	  // set callback handlers
	  client.onConnectionLost = onConnectionLost;
	  client.onMessageArrived = onMessageArrived;
	  
	  if (username != null) {
		  options.userName = username;
		  options.password = password;
	  }
	  client.connect(options);  
	  // connect the clien	
	  
}

// called when the client connects
function onConnect() {
  console.log("onConnect");
  for(var i=0;i<data.length;i++){
	  console.log("订阅第"+i+"个主题");
	  console.log(data[i]);
	  topic=data[i]+"";
	  client.subscribe(topic);
  }
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  var topic = message.destinationName;
  var payload = message.payloadString;
  console.log(payload)
  var dataId=JSON.parse(message.payloadString)
  for(var i=0;i<$(".alarmList").length;i++){	
  		if(dataId.data_id==$(".alarmList").eq(i).attr("id")){
  			$("#"+dataId.data_id+"").find(".alarmContent .dataTime").html(dataId.data_time);
  			$("#"+dataId.data_id+"").find(".alarmContent .dataValue").html(dataId.data_value);
  			colorBg(dataId.status,i);
  		}
  }
}





//超出一行省略
function Omission(obj){
	if(obj.html().length>40){
		obj.css({
			"width":"140px",
			"overflow": "hidden",
			"white-space": "nowrap",
			"text-overflow": "ellipsis"
		})
	}
	
}










