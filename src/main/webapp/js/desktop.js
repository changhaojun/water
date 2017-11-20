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
var myChart=[];
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
				$(".desktopContent").html("<p style='padding-top:20px;'>暂无数据</p>");
			}else{
				dataIndex=data
				var  str=''
				chartData=[];
				for(var i=0;i<data.length;i++){
					if(data[i].is_chart==1){
						chartData.push(data[i])
						thingName=data[i].thing_name
						str='<div class="charts dataBox" draggable="true">'+
								'<div id="'+data[i]._id+'" class="chartcontent"></div>'+
								'<div class="del">'+
									'<span class=" cancel" data-toggle="tooltip" data-placement="top" deleteId="'+data[i]._id+'" title="取消关注">&times;</span>'+
								'</div>'+
							'</div>';
						$('.desktopContent').append(str);
						chartInfo(data,i)
					}else if(data[i].is_chart==0){
						str='<div class="dataList dataBox" draggable="true" id="'+data[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
									'<span class="cancel" data-toggle="tooltip" data-placement="top" deleteId="'+data[i]._id+'" title="取消关注">&times;</span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="Itext">'+
											'<span class="dataValue">'+data[i].data_value+'</span>'+
											'<span>'+(data[i].data_unit=='-'?'':data[i].data_unit)+'</span>'+
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
var aa=[]
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
			},
			x:'10px',
			padding:[20,0,0,10]
		},
		tooltip:{
			trigger:'axis'
		},
		legend:{
			data:legendData,
			padding:[20,0,0,0]
		},
		grid: {
			left: '6%',
			right: '2%',
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
//				formatter: '{value}',
				show:false
			},
			axisTick:{
				show:false
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
    myChart[i]=echarts.init(document.getElementById(data[i]._id))
	myChart[i].setOption(option)
	aa.push(myChart[i])
}

//初始化提示框
$(function () { $("[data-toggle='tooltip']").tooltip(); });

//取消关注
$('.desktopContent').delegate('.cancel','click',function(){
	var id=$(this).attr('deleteId');
	var This=$(this)
	dataIndex.splice(This.index(),1);
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
				saveDeskIndex(dataIndex)
			}
		}
	})
})

//订阅
var client,topic,data;
function MQTTconnect(dataIds) {
	console.log('开始订阅')
    var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	topic="mqtt_alarm_currentdata";
	 client = new Paho.MQTT.Client(mqttHost, Number(portNum), "server" + parseInt(Math.random() * 100, 10));
	 data = dataIds;  
	  var options = {
			  timeout: 1000,
			  onSuccess:onConnect,
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

//// called when the client connects
function onConnect() {

	for(var i=0;i<data.length;i++){
	   topic=data[i] + "";
	   console.log('MQTT connection successful!')
	   client.subscribe(topic);
	}
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
  
  }
}

// called when a message arrives
function onMessageArrived(message) {
    var topic = message.destinationName;
    var payload = message.payloadString;
	var dataConfig=JSON.parse(payload)
	console.log(dataConfig)
    var dataId=dataConfig.data_id
    //数据标签推送
    var dataValue;
	  if(dataConfig.port_type=='DI'){
	  	dataValue=dataConfig.battery.split('$')[dataConfig.data_value]
	  }else{
	  	dataValue=dataConfig.data_value
	  }
	$("#"+dataId).find('.dataTime').html(dataConfig.data_time)
	$("#"+dataId).find('.dataValue').html(dataValue)
	if(dataConfig.status==1){
		$('#'+dataId).removeClass('grayBg').addClass("greenBg");
	}else if(data==0){
		$('#'+dataId).addClass("grayBg");
	}else{
		$('#'+dataId).addClass("redBg");
	}
	//图表推送
	var series=[]
	for(var m=0;m<objId.length;m++){
		for(var n=0;n<objId[m].length;n++){
			var ydata3;var xdata2;
			if(dataId==objId[m][n]){	
				//给满足条件的data_id所在的图表删除dataTimes的第一个值并添加推送过来的data_time
				xdata2 = obj[m][0].dataTimes;
				xdata2.shift();
				xdata2.push(dataConfig.data_time)
				//删除满足条件的图表里面的所有的dataValues的第一个值
				for(var g=0;g<obj[m].length;g++){
					var ydata3=obj[m][g].dataValues;
					ydata3.shift();
					series.push({
						data:ydata3
					})
				}
				//给满足条件的data_id的dataValues添加推送过来的data_value
				ydata2 = obj[m][n].dataValues;
				ydata2.push(dataConfig.data_value)
				
				aa[m].setOption({
						xAxis:{
							data:xdata2
						},
						series:series
				})
			}
		}	
   }
}
/*下面开始拖动*/
$(document).delegate('.dataBox','dragstart',function(evetn){
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
  	changeOrder(dataIndex,index,saveDeskIndex)
	dragged.removeAttr('dragged');
})
function changeOrder(ruleDatas,index,callBack){
	var thisData=ruleDatas[index.oldIndex];
	if(index.oldIndex>index.newIndex){
		ruleDatas.splice(index.newIndex,0,thisData);
		ruleDatas.splice(index.oldIndex+1, 1);
	}else{
		ruleDatas.splice(index.newIndex+1,0,thisData);
		ruleDatas.splice(index.oldIndex, 1);
	}
	callBack && callBack(ruleDatas);
  }
function saveDeskIndex(arr){
	for(var i=0;i<arr.length;i++){
		delete arr[i].chart_data
		delete arr[i].data_id
		delete arr[i].index
		delete arr[i].is_chart
		delete arr[i].thing_name
		delete arr[i].data_name
		delete arr[i].data_unit
		delete arr[i].device_name
		delete arr[i].port_type
		delete arr[i].status
		delete arr[i].data_value
		delete arr[i].data_time
		if(arr[i]._id){
			arr[i].desktop_id=arr[i]._id
		}
		delete arr[i]._id
		arr[i].index=i+1
	}
	$.ajax({
		type:"put",
		url:globalurl+"/v1/desktops",
		async:true,
		data:{
			access_token:accesstoken,
			data:JSON.stringify(arr)
		},
		success:function(data){
		}
	});
}
