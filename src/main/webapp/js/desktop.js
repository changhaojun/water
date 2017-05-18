var dataId=[];
var chartData=[];
var series=[];
var objData=[];
var thingName;
var legendData=[];


$(function(){
	getToken(); //刷新令牌
	getCharts()//获取图表
})
var listData=[];
function getCharts(){
	$.ajax({
		type:'get',
		url: globalurl+"/v1/desktops",
		dataType:'JSON',
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken
		},
		success:function(data){
			console.log(data)
			if(data.length==0){
				$(".desktopContent").html("<p>暂无数据</p>");
			}else{
				var  str=''
				for(var i=0;i<data.length;i++){
					if(data[i].is_chart==1){
						chartData=data[i].chart_data
						thingName=data[i].thing_name
						console.log(thingName)
						console.log(chartData)
						
//							console.log(chartData[0].dataTimes)
//							console.log(chartData[0].dataValues)
//							console.log(chartData[0].data_unit)
						str='<div id="chartContent"></div>';
						$('.desktopContent').append(str);
						chartInfo()
						alert(1)
					}else if(data[i].is_chart==0){
						console.log(data[i].status)
						listData.push(data[i])
						console.log(listData)
						var data=listData;
						for(var i=0;i<listData.length;i++){
							str='<div class="dataList" id="'+data[i].data_id+'">'+
									'<div class="listTop">'+
										'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
										'<span class="fa fa-remove" data-toggle="tooltip" data-placement="top" onclick="cancel(&apos;'+data[i]._id+'&apos;)" title="删除"></span>'+
									'</div>'+
									'<div class="listHr"></div>'+
									'<div class="listContent">'+
										'<div class="contentTop">'+
											'<div class="Itext dataValue">'+data[i].data_value+data[i].data_unit+						
											'</div>'+
										'</div>'+
										'<div class="contentBottom">'+
											'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
										'</div>'+
									'</div>'+			
								'</div>';
								$('.desktopContent').append(str);
								dataId.push(data[i].data_id)
								console.log(dataId)
								colorBg(data[i].status,i)
						}
							
					}
				}
				MQTTconnect(dataId);		
			}
				
		}
	})
}
//告警颜色设置
function colorBg(data,index){
	if(data==1){
		
		$('.dataList').eq(index).addClass('greenBg')
	}else if(data==0){
//		console.log(listData.length)
		
		$('.dataList').eq(index).addClass('grayBg');
	}else{
		$('.dataList').addClass('redBg')
	}
}
//获取图表配置项
function chartInfo(){
	series=[];objData=[];legendData=[];
	for(var j=0;j<chartData.length;j++){
		objData.push(chartData[j].dataValues)
		legendData.push(chartData[j].device_name+'-'+chartData[j].data_name)
		
		series.push({
			type: 'line',
			name:legendData[j],
            data: objData[j],
		})
	}
	console.log(legendData)
	var option={
			title:{
				text:thingName,
				textStyle:{
					color:'#999',
					fontSize:'16px'
				}
				
			},
			tooltip:{
				trigger:'axis'
			},
			legend:{
				data:legendData
			},
			grid: {
				left: '8%',
				right: '5%',
				top: '20%',
				bottom: '8%',
				containLabel: true
			},
			xAxis:{
				type: 'category',
	        	boundaryGap: false,
	        	data:chartData[0].dataTimes,
	        	axisLine:{
	                lineStyle:{
	                    color:'#1ab394',
	                    width:2,//这里是为了突出显示加上的，可以去掉
	                }
            	}
			},
			yAxis:{
				type:'value',
				splitLine: { show: false }, //去除网格中的坐标线
				axisLabel: {
					formatter: '{value}'
				},
				axisLine:{
	                lineStyle:{
	                    color:'#1ab394',
	                    width:2,//这里是为了突出显示加上的，可以去掉
	                }
	        	}
			},
			series:series
		}
	var mychart=echarts.init(document.getElementById('chartContent'))
	mychart.setOption(option)
}

//初始化提示框
$(function () { $("[data-toggle='tooltip']").tooltip(); });

//取消关注
function cancel(id){
	$.ajax({
		type:'delete',
		url:globalurl+'/v1/desktops/'+id+'?access_token='+window.accesstoken,
		dataType:'JSON',
		async: false,
		crossDomain: true == !(document.all),
		success:function(data){
//			console.log(data)
			location.reload()
		}
	})
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