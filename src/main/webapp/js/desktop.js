var dataId=[];
var chartData=[];
var series=[];
var obj=[];
var thingName;
var legendData=[];
var objData=[];
var newData=[];
var objId=[];
var xdata;
var myChart;
var option;

$(function(){
	getToken(); //刷新令牌
	getCharts()//获取图表
})
var selecteData=[];
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
				chartData=[];
				for(var i=0;i<data.length;i++){
					if(data[i].is_chart==1){
						chartData.push(data[i])
						console.log(chartData);
						thingName=data[i].thing_name
						console.log(thingName)
						str='<div class="charts">'+
								'<div id="'+data[i]._id+'" class="chartcontent"></div>'+
								'<div class="del">'+
									'<span class="fa fa-remove cancel" data-toggle="tooltip" data-placement="top" deleteId="'+data[i]._id+'" title="删除"></span>'+
								'</div>'+
							'</div>';
						$('.desktopContent').append(str);
						chartInfo(data,i)
					}else if(data[i].is_chart==0){
						str='<div class="dataList" id="'+data[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
									'<span class="fa fa-remove cancel" data-toggle="tooltip" data-placement="top" deleteId="'+data[i]._id+'" title="删除"></span>'+
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
						dataId.push(data[i].data_id);
						colorBg(data[i].status,data[i].data_id);
					}
				}
				MQTTconnect(dataId);		
			}
				
		}
	})
}
//告警颜色设置
function colorBg(data,id){
	if(data==0){
		$('#'+id).addClass('grayBg')
	}else if(data==1){
		$('#'+id).addClass('greenBg')
	}else{
		$('#'+id).addClass('redBg')
	}
}

//图表配置项
function chartInfo(data,i){
	obj=[];objId=[];
	for(var j=0;j<chartData.length;j++){
		obj.push(chartData[j].chart_data);
		objId.push(chartData[j].data_id)
	}
	console.log(obj)
//	console.log(objId)
//	console.log(objId.length)
//	xdata=obj[0][0].dataTimes
	for(var m=0;m<obj.length;m++){
		objData=[]; series=[];legendData=[];
		for(var n=0;n<obj[m].length;n++){
			objData.push(obj[m][n].dataValues)
			var ydata=objData[n]
//			console.log(ydata)
			legendData.push(obj[m][n].device_name+'-'+obj[m][n].data_name)	
			xdata=obj[m][0].dataTimes
			series.push({
				type: 'line',
				name:legendData[n],
	            data: ydata,
			})
//			console.log(objData[n])
//			console.log(legendData[n])
		}
	}
    option={
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
        	data:xdata,
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
	//设置x轴标签文字换行个数
    /*option.xAxis.axisLabel={
        interval: 0,
        formatter : function(params){
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = 10;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }

            } else {
                newParamsName = params;
            }
            return newParamsName
        }
    }*/
	myChart=echarts.init(document.getElementById(data[i]._id))
	myChart.setOption(option)
}

//初始化提示框
$(function () { $("[data-toggle='tooltip']").tooltip(); });

//取消关注
$('.desktopContent').delegate('.cancel','click',function(){
	var id=$(this).attr('deleteId');
	var This=$(this)
	$.ajax({
		type:'delete',
		url:globalurl+'/v1/desktops/'+id+'?access_token='+window.accesstoken,
		dataType:'JSON',
		async: false,
		crossDomain: true == !(document.all),
		success:function(data){
			if(data.code==200){
				layer.msg(data.success,{icon:1})
				This.parent().parent().remove();
			}
		}
	})
})

//订阅
var client; 
var topic;
var data;
function MQTTconnect(dataIds) {
    console.log("订阅程序开始执行");
//  var mqttHost = '139.129.231.31';
//  var username="admin";
//  var password="finfosoft123";
	var mqttHost='192.168.1.114';
    var username="admin";
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
	var dataConfig=JSON.parse(payload)
    var dataId=dataConfig.data_id
	console.log(dataConfig)    
//	console.log(dataId)
	console.log(dataConfig.data_value)
//  for(var i=0;i<$(".dataList").length;i++){	
//		if(dataId.data_id==$(".dataList").eq(i).attr("id")){
//			$("#"+dataId.data_id+"").find(".listContent .dataTime").html(dataId.data_time);
//			$("#"+dataId.data_id+"").find(".listContent .dataValue").html(dataId.data_value);
//			colorBg(dataId.status,i);
//		}
//  }
	$("#"+dataId).find('.dataTime').html(dataConfig.data_time)
	$("#"+dataId).find('.dataValue').html(dataConfig.data_value)
	if(dataConfig.status==1){
		$('#'+dataId).addClass("greenBg");
	}else if(data==0){
		$('#'+dataId).addClass("grayBg");
	}else{
		$('#'+dataId).addClass("redBg");
	}
	console.log(obj)
	console.log(objId)
	for(var k=0;k<objId.length;k++){
		for(var h=0;h<objId[k].length;h++){
			console.log(dataId)
			console.log(objId[k][h])
			if(dataId==objId[k][h]){
				console.log("kk=------------"+k)
				console.log("objoo===="+obj[k][0].dataTimes);
				var xdata2 = obj[k][0].dataTimes;
				xdata2.shift();
				xdata2.push(dataConfig.data_time)
				for(var g=0;g<obj[k].length;g++){
					var ydata=obj[k]
				}
				
				
				
				var ydata2 = obj[k][h].dataValues;
//				console.log(xdata)
//				xdata.shift();
				
				console.log("xdata2===="+xdata2);
				console.log(k)
				console.log("ydata2之前===="+ydata2);
				ydata2.shift()
				ydata2.push(dataConfig.data_value); 	
			    console.log("ydata2-======"+ydata2);
			    
			    /*option.xAxis[j].data=xdata2
			    option.series[j].data=ydata2
				myChart.setOption(option)*/
			}
		}
		
    }
}