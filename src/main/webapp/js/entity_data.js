var thingId=$('#thingId').val()//获取实体的id
var dataLike;
var dataId=[];

$(function(){
	getToken(); //刷新令牌
	selectData();
	selectId();
	dataList(); //加载数据列表
	toolTip();
	showDisplay();
})
var searchBox=new Vue({
	el:'.search',
	data:{
		searchId:''
	} 
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

			$(".dataContent").html("");
			if(data.length==0){
				$(".dataContent").html("<p style='padding-left:20px;'>暂无数据</p>");
			}
			for(var i=0;i<data.length;i++){
				data[i].title=data[i].device_name+"-"+data[i].data_name		
				listData(data,i)
				dataId.push(data[i].data_id)
				colorBg(data[i].status,i);
			}
			dataLike=data
			if($("#searchId").val()!=""){
				searchThing($("#searchId"))
			}
			toolTip();
			MQTTconnect(dataId);
		}
	})
}
//数据列表
function listData(data,i){
	var str='';
	//已关注，已设封面
	if(selectedId.indexOf(data[i].data_id)!=-1 && selectedData.indexOf(data[i].data_id)!=-1){
		str='<div class="dataList" id="'+data[i].data_id+'" >'+
			'<div class="listTop normal" >'+
				'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
				'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
				'<span class="fa fa-list-alt disabledLi cover" data-toggle="tooltip" data-placement="top"  title="已设封面"></span>'+
			'</div>'+
			'<div class="listHr"></div>'+
			'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+data[i].data_id+'&apos;)">'+
				'<div class="contentTop">'+
					'<div class="Itext">'+	
						'<span class="dataValue">'+data[i].data_value+'</span>'+
						'<span>'+data[i].data_unit+'</span>'+
					'</div>'+						
				'</div>'+
				'<div class="contentBottom">'+
					'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
				'</div>'+
			'</div>'+			
		'</div>'
		$(".dataContent").append(str);
		//已关注，没设封面
	}else if(selectedId.indexOf(data[i].data_id)!=-1 && selectedData.indexOf(data[i].data_id)==-1){
		str='<div class="dataList" id="'+data[i].data_id+'" >'+
			'<div class="listTop normal">'+
				'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
				'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
				'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top" title="设封面"></span>'+
			'</div>'+
			'<div class="listHr"></div>'+
			'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+data[i].data_id+'&apos;)">'+
				'<div class="contentTop">'+
					'<div class="Itext">'+
						'<span class="dataValue">'+data[i].data_value+'</span>'+
						'<span>'+data[i].data_unit+'</span>'+
					'</div>'+						
				'</div>'+
				'<div class="contentBottom">'+
					'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
				'</div>'+
			'</div>'+			
		'</div>'
		$(".dataContent").append(str);
		//没关注，已设封面
	}else if(selectedId.indexOf(data[i].data_id)==-1 && selectedData.indexOf(data[i].data_id)!=-1){
		str='<div class="dataList" id="'+data[i].data_id+'" >'+
			'<div class="listTop normal">'+
				'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
				'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="关注"></span>'+
				'<span class="fa fa-list-alt disabledLi cover" data-toggle="tooltip" data-placement="top" title="已设封面"></span>'+
			'</div>'+
			'<div class="listHr"></div>'+
			'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+data[i].data_id+'&apos;)">'+
				'<div class="contentTop">'+
					'<div class="Itext">'+
						'<span class="dataValue">'+data[i].data_value+'</span>'+
						'<span>'+data[i].data_unit+'</span>'+
					'</div>'+						
				'</div>'+
				'<div class="contentBottom">'+
					'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
				'</div>'+
			'</div>'+			
		'</div>'
		$(".dataContent").append(str);
	}
	//没关注，没设封面
	else{
		str='<div class="dataList" id="'+data[i].data_id+'" >'+
			'<div class="listTop normal">'+
				'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
				'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="关注"></span>'+
				'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top" title="设封面"></span>'+
			'</div>'+
			'<div class="listHr"></div>'+
			'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+data[i].data_id+'&apos;)">'+
				'<div class="contentTop">'+
					'<div class="Itext">'+
						'<span class="dataValue">'+data[i].data_value+'</span>'+
						'<span>'+data[i].data_unit+'</span>'+
					'</div>'+						
				'</div>'+
				'<div class="contentBottom">'+
					'<span class="fa fa-clock-o dataTime">'+data[i].data_time+'</span>'+
				'</div>'+
			'</div>'+			
		'</div>'
		$(".dataContent").append(str);
		showDisplay()
	}
}

//获取已关注的数据
var selectedId=[];
function selectData(){
	$.ajax({
		type:'get',
		url: globalurl+"/v1/desktops",
		dataType:'JSON',
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
		    fields:"data_id",
		    filter:JSON.stringify({"thing_id":thingId,"is_chart":0})
		},
		success:function(data){
			for(var i=0;i<data.length;i++){
				selectedId.push(data[i].data_id)
			}
		}
	})
}
//获取已设封面的数据
var selectedData=[];
function selectId(){
	$.ajax({
		type:'get',
		url: globalurl+"/v1/things/"+thingId,
		dataType:'JSON',
		async: false,
		crossDomain: true == !(document.all),
		data:{
		  access_token: accesstoken,
		},
		success:function(data){
			selectedData.push(data.data_id)
		}
	})
}
//设封面
$('.dataContent').delegate('.cover','click',function(){
	var id=$(this).parent().parent().attr('id');
	if($(this).hasClass('disabledLi')){
		layer.msg('已设封面',{icon:2})
	}else{
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
				layer.msg('封面设置成功',{icon:1,time:1000})
			}
		})
		$('.dataContent .cover').removeClass('disabledLi')
		$(this).addClass('disabledLi')
	}
})
//设关注
$('.dataContent').delegate('.focus1','click',function(){
	var id=$(this).parent().parent().attr('id');
	if($(this).hasClass('disabledLi')){
		layer.msg('已关注',{icon:2})
	}else{
		$.ajax({
			type:'post',
			url: globalurl+"/v1/desktops",
			dataType: "JSON",
			async: false,
			crossDomain: true == !(document.all),
			data:{
				access_token: accesstoken,
				data:'{"data_id":'+Number(id)+',"thing_id":"'+thingId+'"}'		
			},
			success:function(data){
				layer.msg('关注成功',{icon:1,time:1000})
			}
		})
		$(this).addClass('disabledLi')
	}
})
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
	 topColor($('.fa'),'orange')
}
function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}
//查看数据
function look(dataId){
	self.location.href="/runData/getCharts/"+dataId+"-"+thingId
}
//查询
function searchThing(obj){
	for(var i=0;i<dataLike.length;i++){
		if(dataLike[i].title.search(obj.val())==-1){
			$('#'+dataLike[i].data_id).hide(500)
		}else{
			$('#'+dataLike[i].data_id).show(500)
		}
		dataId.push(dataLike[i].data_id)
	}
	toolTip()
}
//告警颜色设置
function colorBg(data,index){
	if(data==0){
		$('.dataList').eq(index).addClass('grayBg')
	}else if(data==1){
		$('.dataList').eq(index).addClass('greenBg')
	}else{
		$('.dataList').eq(index).addClass('redBg')
	}
}

//订阅
var client; 
var topic;
var data;
function MQTTconnect(dataIds) {
    var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	 topic="mqtt_alarm_currentdata";
	  client = new Paho.MQTT.Client(mqttHost, Number(portNum), "server" + parseInt(Math.random() * 100, 10));
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
//	  console.log("订阅第"+i+"个主题");
//	  console.log(data[i]);
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
}
function showDisplay(){
	$(".dataList").hover(function(){
		console.log(123)
		$(this).find(".focus1").css("display","inline-block");
		$(this).find(".cover").css("display","inline-block");
	},function(){
		$(this).find(".focus1").css("display","none");
		$(this).find(".cover").css("display","none");
	})
}

