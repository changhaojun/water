
var thingId=$('#thingId').val()//获取实体的id
	console.log("thing_id:"+$('#thingId').val());	
var dataLike;
var dataId=[];

$(function(){
	getToken(); //刷新令牌
	selectData();
	selectId();
	dataList(); //加载数据列表
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
				/*if(selectedId.indexOf(data[i].data_id)!=-1){
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
							'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top"  title="已设封面"></span>'+
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
				}else{
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
							'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top"  title="已设封面"></span>'+
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
				}
				*/
				//已关注，已设封面
				if(selectedId.indexOf(data[i].data_id)!=-1 && selectedData.indexOf(data[i].data_id)!=-1){
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
							'<span class="fa fa-list-alt disabledLi cover" data-toggle="tooltip" data-placement="top"  title="已设封面"></span>'+
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
					//已关注，没设封面
				}else if(selectedId.indexOf(data[i].data_id)!=-1 && selectedData.indexOf(data[i].data_id)==-1){
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
							'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top" title="设封面"></span>'+
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
					//没关注，已设封面
				}else if(selectedId.indexOf(data[i].data_id)==-1 && selectedData.indexOf(data[i].data_id)!=-1){
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="关注"></span>'+
							'<span class="fa fa-list-alt disabledLi cover" data-toggle="tooltip" data-placement="top" title="已设封面"></span>'+
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
				}
				//没关注，没设封面
				else{
					str='<div class="dataList" id="'+data[i].data_id+'" >'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+"-"+data[i].data_name+'</span>'+
							'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="关注"></span>'+
							'<span class="fa fa-list-alt cover" data-toggle="tooltip" data-placement="top" title="设封面"></span>'+
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
				}
				dataId.push(data[i].data_id)
				colorBg(data[i].status,i);
			}
			dataLike=data
			toolTip();
			MQTTconnect(dataId);
		}
	})
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
			console.log(selectedId)	
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
			console.log(data.data_id)
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
/*function cover(id,i){
	$('.fa-list-alt').removeClass('disabledLi')
	$('.fa-list-alt').eq(i).addClass('disabledLi')
	
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
				
			}	
		}
	})
}*/
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
}
//查看数据
function look(dataId){
	self.location.href="/finfosoft-water/runData/getCharts/"+dataId+"-"+thingId
}
//查询
function searchThing(obj){
	$(".dataContent").html("");
	for(var i=0;i<dataLike.length;i++){
				dataLike[i].title=dataLike[i].device_name+"-"+dataLike[i].data_name	
				if(dataLike[i].title.search(obj.val())!=-1){
					if(selectedId.indexOf(dataLike[i].data_id)!=-1){
						str='<div class="dataList" id="'+dataLike[i].data_id+'" >'+
							'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
								'<span>'+dataLike[i].device_name+"-"+dataLike[i].data_name+'</span>'+
								'<span class="fa fa-plus-square disabledLi focus1" data-toggle="tooltip" data-placement="top" title="已关注"></span>'+
								'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top" onclick="cover(&apos;'+data[i].data_id+'&apos;)"  title="已设封面"></span>'+
							'</div>'+
							'<div class="listHr"></div>'+
							'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+dataLike[i].data_id+'&apos;)">'+
								'<div class="contentTop">'+
									'<div class="Itext dataValue">'+dataLike[i].data_value+dataLike[i].data_unit+						
									'</div>'+						
								'</div>'+
								'<div class="contentBottom">'+
									'<span class="fa fa-clock-o dataTime">'+dataLike[i].data_time+'</span>'+
								'</div>'+
							'</div>'+			
						'</div>'
						$(".dataContent").append(str);
					}else{
						str='<div class="dataList" id="'+dataLike[i].data_id+'" >'+
							'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
								'<span>'+dataLike[i].device_name+"-"+dataLike[i].data_name+'</span>'+
								'<span class="fa fa-plus-square focus1" data-toggle="tooltip" data-placement="top" title="关注"></span>'+
								'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top" onclick="cover(&apos;'+data[i].data_id+'&apos;)"  title="设封面"></span>'+
							'</div>'+
							'<div class="listHr"></div>'+
							'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+dataLike[i].data_id+'&apos;)">'+
								'<div class="contentTop">'+
									'<div class="Itext dataValue">'+dataLike[i].data_value+dataLike[i].data_unit+						
									'</div>'+						
								'</div>'+
								'<div class="contentBottom">'+
									'<span class="fa fa-clock-o dataTime">'+dataLike[i].data_time+'</span>'+
								'</div>'+
							'</div>'+			
						'</div>'
						$(".dataContent").append(str);
					}
				}
				dataId.push(dataLike[i].data_id)
				colorBg(dataLike[i].status,i);
			}
	/*for(var i=0;i<dataLike.length;i++){
		if(dataLike[i].title.search(obj.val())!=-1){	
			
			/*var str='';
					str='<div class="dataList" id="'+dataLike[i].data_id+'">'+
						'<div class="listTop normal" >'+
							'<span>'+dataLike[i].device_name+"-"+dataLike[i].data_name+'</span>'+
							'<span class="fa fa-plus-square" data-toggle="tooltip" data-placement="top" onclick="focus1('+dataLike[i].data_id+','+i+')"  title="关注"></span>'+
						'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top" onclick="cover('+dataLike[i].data_id+','+i+')"  title="设封面"></span>'+
						'</div>'+
						'<div class="listHr"></div>'+
						'<div class="listContent" style="cursor:pointer;" onclick="look(&apos;'+dataLike[i].data_id+'&apos;)">'+
							'<div class="contentTop">'+
								'<div class="Itext">'+dataLike[i].data_value+dataLike[i].data_unit+						
								'</div>'+						
							'</div>'+
							'<div class="contentBottom">'+
								'<span class="fa fa-clock-o">'+dataLike[i].data_time+'</span>'+
							'</div>'+
						'</div>'+			
					'</div>'
					$(".dataContent").append(str);	*/
			
//		}
//		colorBg(dataLike[i].status,i)
//		dataId.push(dataLike[i].data_id)	
//	}
	MQTTconnect(dataId);
}

//告警颜色设置
function colorBg(data,index){
	if(data==1){
		$('.dataList').eq(index).addClass('greenBg')
	}else if(data==0){
		$('.dataList').eq(index).addClass('grayBg')
	}else{
		$('.dataList').eq(index).addClass('redBg')
	}
}
function colorBg1(dataStatus){
	if(dataStatus==1){
		$(".dataList").addClass("greenBg");
	}else if(dataStatus==0){
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
