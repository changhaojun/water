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
var dataIndex=[];
var myChart;
var option;
var dragged,moveDom,mouseX,centerS,oldIndex,newIndex;	
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
			if(data.length==0){
				$(".desktopContent").html("<p>暂无数据</p>");
			}else{
				dataIndex=data
				var  str=''
				chartData=[];
				for(var i=0;i<data.length;i++){
					if(data[i].is_chart==1){
						chartData.push(data[i])
						console.log(chartData);
						thingName=data[i].thing_name
						console.log(thingName)
						str='<div class="charts dataBox" draggable="true">'+
								'<div id="'+data[i]._id+'" class="chartcontent"></div>'+
								'<div class="del">'+
									'<span class="fa fa-remove cancel" data-toggle="tooltip" data-placement="top" deleteId="'+data[i]._id+'" title="删除"></span>'+
								'</div>'+
							'</div>';
						$('.desktopContent').append(str);
						chartInfo(data,i)
					}else if(data[i].is_chart==0){
						str='<div class="dataList dataBox" draggable="true" id="'+data[i].data_id+'">'+
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
	for(var m=0;m<obj.length;m++){
		objData=[]; series=[];legendData=[];
		for(var n=0;n<obj[m].length;n++){
			objData.push(obj[m][n].dataValues)
			var ydata=objData[n]
			legendData.push(obj[m][n].device_name+'-'+obj[m][n].data_name)	
			xdata=obj[m][0].dataTimes
			series.push({
				type: 'line',
				name:legendData[n],
	            data: ydata,
			})
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
    var mqttHost = '121.42.253.149';
    var username="admin";
    var password="finfosoft123";
//	var mqttHost='192.168.1.114';
//  var username="admin";
//  var password="password";
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
	var dataConfig=JSON.parse(payload)
    var dataId=dataConfig.data_id
	$("#"+dataId).find('.dataTime').html(dataConfig.data_time)
	$("#"+dataId).find('.dataValue').html(dataConfig.data_value)
	if(dataConfig.status==1){
		$('#'+dataId).addClass("greenBg");
	}else if(data==0){
		$('#'+dataId).addClass("grayBg");
	}else{
		$('#'+dataId).addClass("redBg");
	}
	
	console.log(dataConfig.data_time)
	for(var k=0;k<objId.length;k++){
		for(var h=0;h<objId[k].length;h++){
			console.log(dataId)
			console.log(objId[k][h])
			
			var xdata3 = obj[k][h].dataValues;
			console.log(xdata3)
			
			if(dataId==objId[k][h]){
//				console.log("kk=------------"+k)
//				console.log("objoo===="+obj[k][0].dataTimes);
				var xdata2 = obj[k][0].dataTimes;
				console.log(xdata2)
				xdata2.shift();
				xdata2.push(dataConfig.data_time)
				console.log(xdata2)
				console.log(obj)
//				for(var g=0;g<obj[k].length;g++){
//					var ydata2=obj[k].dataValues
//					console.log(ydata2)
//
//				}

				var ydata2 = obj[k][h].dataValues;
				
				
				
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
/*下面开始拖动*/
$(document).delegate('.dataBox','dragstart',function(evetn){
//	dragged.addClass('grayBox');
	$(this).attr('dragged','dragged')
	oldIndex=$(this).index()
	dragged=$(this)
	event.dataTransfer.setData("Text", event.target.id);
})
document.addEventListener("dragover", function( event ) {
	var This=$(event.target)
	if(This[0].tagName=="CANVAS"){
		This=$(event.target).parent().parent().parent();
	}
	if(This.hasClass('dataValue')){
		This=This.parent().parent().parent();
	}
  	if(This.hasClass('dataBox')){
	  	moveDom=This
	  	mouseX=event.clientX;
	  	centerS=moveDom.offset().left+moveDom.width()/2;
	  	if(dragged.attr('dragged')!=moveDom.attr('dragged')){
	  		$('#arrow').show()
	  		$('#arrow').addClass('arrowDom')
	  		if(mouseX<centerS){
				$('#arrow').css('left',moveDom.offset().left-19)
				$('#arrow').css('top',moveDom.offset().top+5)
	  		}else{
	  			$('#arrow').css('left',moveDom.offset().left+moveDom.width()+3)
	  			$('#arrow').css('top',moveDom.offset().top+5)
	  		}
	  	}
  	}
  	event.preventDefault();
}, false);
document.addEventListener("drop", function( event ) {
	$('#arrow').removeClass('arrowDom')
  	$('#arrow').hide()
  	if(dragged.attr('dragged')!=moveDom.attr('dragged')){
  		if(mouseX<centerS){
  			dragged.insertBefore(moveDom)
  		}else{
  			dragged.insertAfter(moveDom)
  		}
  	}
  	newIndex=dragged.index()
  	var index={
  		'oldIndex':oldIndex,
  		'newIndex':newIndex
  	}
  	console.info(index)
	dragged.removeAttr('dragged');
})
function updataIndex(){
	
}