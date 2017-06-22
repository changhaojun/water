var boxId=$("#boxId").val();	//获取box的id
var type=$("#type").val();      //获取box类型
var deviceId,deviceName,dataName;
$(function(){
	getToken();//刷新令牌
	toolTip();//提示框
	listBox();//数据列表页
})
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
//初始化头部
if(type=="A"){
	$(".sensorTop .Itype").html("查看传感器  / ");
	$(".sensorTop .Etype").html("Look Sensor");
}else{
	$(".sensorTop .Itype").html("查看PLC  / ");
	$(".sensorTop .Etype").html("Look PLC");
}
//每隔十秒刷新一次
//var time=setInterval(listBox,10000)
//获取数据列表
function listBox(){
	$.ajax({
		type: "get",
		url: globalurl+"/v1/devices/"+boxId+"/datas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success: function(data) {
			$(".sensorContent").html("");
			if(data.code==400005){
		    		getNewToken();
		    		listBox();
		    }else{
		    	if(data.datas.length==0){
		    		$(".sensorContent").html("<p>暂无数据</p>");
		    	}
		    	deviceName=data.device.device_name
		    	deviceId=data.device._id
		    	for(var i=0;i<data.datas.length;i++){	    		
		    		//以开关展示
		    		if(data.datas[i].oper_type==2&&data.datas[i].data_type==3){
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)"></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="on-off">'+
											'<button type="button" class="Iopen Iopen'+i+' Iactive" onclick="Iopen('+i+','+data.datas[i].data_id+')">'+data.datas[i].onText+'</button>'+
											'<div class="off">'+
												'<div class="circle circle'+i+'">'+				
												'</div>'+
											'</div>'+
											'<button type="button" class="Iclose Iclose'+i+'" onclick="Iclose('+i+','+data.datas[i].data_id+')">'+data.datas[i].offText+'</button>'+
										'</div>'+							
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						if(data.datas[i].data_value==""||data.datas[i].data_value==0){
			    			$(".Iclose"+i+"").addClass("Iactive");
							$(".Iopen"+i+"").removeClass("Iactive");
							$(".circle"+i+"").css({"left":"25px"});
			    		}else{
			    			$(".Iopen"+i+"").addClass("Iactive");
							$(".Iclose"+i+"").removeClass("Iactive");
							$(".circle"+i+"").css({"left":"0px"});
			    		}
				//仪表盘展示
		    		}else if((type=="A"&&data.datas[i].oper_type==2&&data.datas[i].data_type==0)||(type=="A"&&data.datas[i].oper_type==2&&data.datas[i].data_type==1)||(type=="P"&&data.datas[i].oper_type==2)){
		    			if (data.datas[i].data_value===''||data.datas[i].data_value===null) {
		    				data.datas[i].data_value = 0;
		    			}
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="water">'+
											'<div class="board-ring board-ring'+i+'">'+
												'<canvas></canvas>'+
												'<input type="text" value="'+data.datas[i].data_value+'" class="dial"/>'+
											'</div>'+
											'<button type="button"id="give" onclick="give(&apos;'+data.datas[i].data_id+'&apos;)">下发</button>'+
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						new Finfosoft.Ring({
							el: '.board-ring'+i,
							startDeg: 150,
							endDeg: 30,
							lineWidth: 20,
					//		bgColor: '#0055ff',
							mainColor: '#1ab394'
					//		initVal: this.input.value
						});			
				//数据展示
		    		}else{
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="Itext">'+data.datas[i].data_value+data.datas[i].data_unit+						
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
		    		}
		    		if(data.datas[i].status==1||data.datas[i].status==undefined){
		    			$(".lookList").css({"border-left-color":"#1ab394","color":"#1ab394"});
		    		}else if(data.datas[i].status==0){
		    			$(".lookList").css({"border-left-color":"#acacac","color":"#acacac"});
		    		}else{
		    			$(".lookList").css({"border-left-color":"#a01f24","color":"#a01f24"});
		    		}
		    	}
		    	
		    }
		    toolTip();
		}
	})
}
//打开开关
function Iopen(i,id){
	
	clickBtn(id,1,i)	
}
//关闭开关
function Iclose(i,id){
	
	clickBtn(id,0,i)
}
//打开数据展示详情页
function show(value,dataName){
	layer.open({
	  type: 2,
	  title: '实时数据页面',
	  shadeClose: true,
	  shade: 0.8,
	  scrollbar: false,
	  area: ['873px', '65%'],
	  content: '/finfosoft-water/dataTag/dataChart/'+value+'-'+dataName+'-'+deviceId+'-'+deviceName
	}); 
}
/**
 * 本方法用于模拟量的下发
 * 在模拟量的下发按钮调用
 */
function give(id){
	onoff=$(".dial").val();
	var guid=guidGenerator();	
	layer.confirm("<font size='2'>确认下发？</font>", {icon:7},function(index){
		layer.close(index);
		data="{'data_id':"+id+",'data_value':"+onoff+",'guid':'"+guid+"'}";
		data={'data':data};
		$.ajax({
			url:globalurl+"/v1/homes?access_token="+accesstoken,
			data:data,
			dataType: 'JSON',
			type: 'POST',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
				getNewToken();
				contrastData()
			}else if(data.result==1){
					layer.msg('已下发', {
						icon : 1
					});
					MQTTconnect(guid)
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2
				});
		    }
		});
	});
}
//io调控触发

function clickBtn(id,dataValue,i){
	dataId=id;
	onoff=dataValue;	
	var guid=guidGenerator();
	layer.confirm("<font size='2'>确认下发？</font>",{icon:7},function(index){
		layer.close(index);
    	data="{'data_id':"+dataId+",'data_value':"+onoff+",'guid':'"+guid+"'}";    	 
		data={'data':data};	
		$.ajax({
			url:globalurl+"/v1/homes?access_token="+accesstoken,
			data:data,
			dataType: 'JSON',
			type: 'POST',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
					getNewToken();
					contrastData()
				}else if(data.result==1){
						layer.msg('已下发', {
						icon : 1
					});
						if(onoff){
							$(".Iopen"+i+"").addClass("Iactive");
							$(".Iclose"+i+"").removeClass("Iactive");
							$(".circle"+i+"").animate({"left":"0px"});
						}else{
							$(".Iclose"+i+"").addClass("Iactive");
							$(".Iopen"+i+"").removeClass("Iactive");
							$(".circle"+i+"").animate({"left":"25px"});
						}
						MQTTconnect(guid)
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2
				});
		    }

		});
	});
}
//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}			

//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
function space(obj){
	obj.val(obj.val().replace(/\s/g, ''))
}

function MQTTconnect(guid){
	var mqttHost = mqttHostIP;
	var username = mqttName;
	var password = mqttWord;
	var client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	var options = {
		timeout: 1000,
		onSuccess: function(){
			console.log("onConnect");
		   	topic = guid;
		    client.subscribe(topic);
		},
		onFailure: function(message) {
			setTimeout(MQTTconnect, 10000000);
		}
	};
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	
	if(username != null) {
		options.userName = username;
		options.password = password;
	}
	client.connect(options);
	// connect the clien
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
  var payload = JSON.parse(message.payloadString);
  var result='',iconR=2
  console.info(payload);
  for(var i=0;i<$(".lookList").length;i++){
	if((payload.data_id==$(".lookList").eq(i).attr("id"))&&(payload.result==0)){
		if(payload.port_type=='AO'){			
			$(".dial").val(payload.old_value);
			new Finfosoft.Ring({
				el: '.board-ring'+i,
				startDeg: 150,
				endDeg: 30,
				lineWidth: 20,
				mainColor: '#1ab394'
			});	
		}else if(payload.port_type=="DO"){
			if($(".circle"+i+"").css("left")=="0px"){
				$(".circle"+i+"").animate({"left":"25px"});
			}else{
				$(".circle"+i+"").animate({"left":"0px"});
			}
			if($(".circle"+i+"").css("left")=="25px"){
				$(".circle"+i+"").animate({"left":"0px"});
			}else{
				$(".circle"+i+"").animate({"left":"25px"});
			}
		}
		result='下发失败'
  		iconR=2
	}else if(payload.result==1){
		console.log(123)
		result='下发成功';
  		iconR=1
	}
}
layer.msg(payload.data_name+result,{
	icon:iconR
})
}