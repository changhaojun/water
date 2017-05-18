
var thingId=$('#thingId').val()//获取实体的id
	console.log("thing_id:"+$('#thingId').val());	
var dataLike;
var dataId=[];

$(function(){
	getToken(); //刷新令牌
	dataList() //加载数据列表
})

function dataList(){
	$.ajax({
		type: "get",
		url: globalurl+"/v1/things/"+thingId+"/alarms",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
			filter:JSON.stringify({"oper_type":1})
		},
		success:function(data){
			console.log(data);
			$(".dataContent").html("");
			if(data.length==0){
				$(".dataContent").html("<p>暂无数据</p>");
			}
			var str=''
			for(var i=0;i<data.length;i++){
				data[i].title=data[i].device_name+"-"+data[i].data_name		
				str='<div class="dataList" id="'+data[i].data_id+'" >'+
					'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
						'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
						'<span class="fa fa-plus-square" data-toggle="tooltip" data-placement="top" onclick="focus1('+data[i].data_id+','+i+')"  title="关注"></span>'+
						'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top" onclick="cover('+data[i].data_id+','+i+')"  title="设封面"></span>'+
					'</div>'+
					'<div class="listHr"></div>'+
					'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+data[i].data_id+'&apos;)">'+
						'<div class="contentTop">'+
							'<div class="Itext dataValue">'+data[i].data_value+data[i].data_unit+						
							'</div>'+						
						'</div>'+
						'<div class="contentBottom">'+
							'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
						'</div>'+
					'</div>'+			
				'</div>'
				$(".dataContent").append(str);
				dataId.push(data[i].data_id)
//				console.log(dataId)
				colorBg(data[i].status,i);
			}
			dataLike=data
			toolTip();
			MQTTconnect(dataId);
		}
	})
}
//设封面
function cover(id,i){
	$('.fa-list-alt').css('background','orange')
	$('.fa-list-alt').eq(i).css('background','#ccc')
//console.log(id)
console.log(thingId)
	$.ajax({
		type: "put",
		url: globalurl+"/v1/things/"+thingId,
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
			data:JSON.stringify({"data_id":Number(id)})	
		},
		success:function(data){
			console.log(data)
			if(data.code==200){
				layer.msg('封面设置成功', {
					icon: 1,
					time:2000,
				});
			}	
		}
	})
}
//设关注
function focus1(id,m){
	$('.fa-plus-square').eq(m).css('background','#ccc')
	$.ajax({
		type:'post',
		url: globalurl+"/v1/desktops",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
//			data:JSON.stringify({"data_id":Number(id)})
			data:'{"data_id":'+Number(id)+',"thing_id":"'+thingId+'"}'		
		},
		success:function(data){
			console.log(data)
			layer.msg('关注成功', {
				icon: 1,
				time:2000,
			});
		}
	})
}

//初始化提示框
//$(function () { $("[data-toggle='tooltip']").tooltip(); });
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
//查看数据
function look(dataId){
	self.location.href="/finfosoft-water/runData/getCharts/"+dataId+"-"+thingId
}
//查询
function searchThing(obj){
	$(".dataContent").html("");
	for(var i=0;i<dataLike.length;i++){
		if(dataLike[i].title.search(obj.val())!=-1){	
			var str='';
					str='<div class="dataList" id="'+data[i].data_id+'" style="cursor:pointer;">'+
						'<div class="listTop normal" >'+
							'<span>'+dataLike[i].device_name+"-"+dataLike[i].data_name+'</span>'+
							'<span class="fa fa-plus-square" data-toggle="tooltip" data-placement="top"  title="关注"></span>'+
							'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top"  title="设封面"></span>'+
						'</div>'+
						'<div class="listHr"></div>'+
						'<div class="listContent">'+
							'<div class="contentTop">'+
								'<div class="Itext">'+dataLike[i].data_value+dataLike[i].data_unit+						
								'</div>'+						
							'</div>'+
							'<div class="contentBottom">'+
								'<span class="fa fa-clock-o">'+dataLike[i].data_time+'</span>'+
							'</div>'+
						'</div>'+			
					'</div>'
					$(".dataContent").append(str);	
			colorBg1(dataLike[i].status)		
		}
		dataId.push(dataLike[i].data_id)	
	}
	MQTTconnect(dataId);
}

//告警颜色设置
function colorBg(data,index){
	if(data==1){
		$('.dataList').eq(index).addClass('greenBg')
	}else if(data==0){
		$('.dataList').eq(index).addClass('grayBg')
	}else{
		$('.dataList').addClass('redBg')
	}
}
function colorBg1(data){	
	if(data==1){
		$(".dataList").addClass("greenBg");
	}else if(data==0){
		$(".dataList").addClass("grayBg");
	}else{
		$(".dataList").addClass("redBg");
	}
}

//订阅
var client; 
var topic;
var data;
function MQTTconnect(dataIds) {
//  console.log("订阅程序开始执行");
    var mqttHost = '139.129.231.31';
//	var mqttHost='192.168.1.114';
    var username="admin";
//  var password="finfosoft123";
    var password="password";
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
  for(var i=0;i<$(".dataList").length;i++){	
  		if(dataId.data_id==$(".dataList").eq(i).attr("id")){
  			$("#"+dataId.data_id+"").find(".listContent .dataTime").html(dataId.data_time);
  			$("#"+dataId.data_id+"").find(".listContent .dataValue").html(dataId.data_value);
  			colorBg(dataId.status,i);
  		}
  }
}
