var initData={
	//令牌
	access_token: "",
	thingId:$("#thingId").val(),
	alarmData:[],
	tags:[],
	companyId:$("#companyId").val(),
	resultBox:"",
	Index:"",
	likeSearchData:"",
	thingDataId:"",
	alarmRangeBox:"",
	dataMin:"",
	dataMax:"",
	dataId:"",
	childIndex:"",
	off:"",
	deviceId:"",
	MqttDataId:[],
	//Mqtt
	client:"",
	topic:"",
	//模糊查询需要的数据
	likeAllData:{},
	likeData:""
}
var $extend=$.fn.extend({
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/\s/g, ''));
			eval('initData.'+$(this).attr('datasrc')+'=$(this).val()');
		});
	},
	//layer提示
	tooltips:function(){
		$(".tooltip-inner").css({"background-color":"#effaf6","color":"#1ab394"});
		$(".tooltip .top .tooltip-arrow").css("border-top-color","#effaf6");
		$('[data-toggle="tooltip"]').tooltip();
	},
	//获取告警列表的数据
	getAlarmListData:function(){
		
		$.ajax({
			url:globalurl+"/v1/things/"+initData.thingId+"/alarms",
			dataType: 'JSON',
			type: 'get',
			data:{
			access_token:initData.access_token	
			},
			async:false,
			crossDomain: true == !(document.all),
			success: function(data) {
				
				for(var i=0;i<data.length;i++){
					data[i].title=data[i].device_name+"-"+data[i].data_name	;					
					if(data[i].title.length>15){						
						 data[i].title=data[i].title.substring(0,15)+"...";//超出一行显示省略
					}
					initData.MqttDataId.push(data[i].data_id)
				}
				initData.alarmData=data;
				initData.likeAllData=data;
				$.MQTTconnect(initData.MqttDataId);
				
			}
		})
	},
	//点击出现弹窗
	showLayer:function(index){
		initData.likeSearchData=""
		initData.Index=index;
		initData.thingDataId=initData.alarmData[index].thing_data_id;
	
		initData.resultBox = layer.open({
			type: 1,
			title: "选择数据标签",
			skin: 'layui-layer-molv',
			shadeClose: true,
			shade: 0.5,
			area: ['300px', '336px'],
			content: $('.confirmInfo')
		})
		$(window).selectLable();
	},
	//获取分组标签
	selectLable:function(index){
		
		$.ajax({
			type:"get",
			url:globalurl+"/v1/tags",
			async:true,
			data:{
					access_token:initData.access_token,
					like:'{"tag_name":"'+initData.likeSearchData+'"}',
					filter:'{"company_id":"'+initData.companyId+'"}'
			},
			success:function(data){
				initData.tags=data.rows			
			}
		});
	},
	//新增分组标签
	addTag:function(){
		layer.prompt({
			title: '输入新的分组标签',
			formType: 0
		}, function(pass, index) {	
			$.ajax({
				type:"post",
				url:globalurl+"/v1/tags",
				async:true,
				data:{
					access_token:accesstoken,
					data:'{"company_id":"'+initData.companyId+'","tag_name":"'+pass+'"}'
				},
				success:function(data){
					if(data.code==200){
						layer.close(index);
						layer.msg('添加成功',{icon:1,zIndex:99999999});
						delete data.code;
						initData.tags.unshift(data)
					}else{
						layer.msg(data.error,{icon:2,zIndex:99999999});
					}
				}
			});
		});
	},
	//删除分组标签
	removeTag:function(index,event){
		event.stopPropagation();
		$.ajax({
			type:'delete',
			url:globalurl+'/v1/tags/'+initData.tags[index]._id+'?access_token='+initData.access_token,
			async:true,
			success:function(data){
				if(data.code==200){
					initData.tags.splice(index,1)
					layer.msg(data.success,{icon:1,zIndex:99999999})
				}else{
					layer.msg(data.error,{icon:2,zIndex:99999999})
				}
			}
		});
	},
	//选择数据标签==》确定提交数据标签
	chioseTag:function(index,event){
		initData.alarmData[initData.Index].tag_name=this.tags[index].tag_name
		var data={
			"tag_id":initData.tags[index]._id,
			"tag_name":initData.tags[index].tag_name
		}
		$.ajax({
				url:globalurl+"/v1/alarms/"+initData.thingDataId,
				data:{
					"access_token":initData.access_token,
					data:JSON.stringify(data)
				},
				dataType: 'JSON',
				type: 'put',
				crossDomain: true == !(document.all),
				success: function(data) {
					if(data.code==200){
						layer.msg(data.success,{icon:1})
					}					
				}
		})
		layer.close(initData.resultBox);
	},
	//添加告警范围
	alarmRangeLayer:function(index,event,oindex,title){
		initData.Index=index;
		initData.thingDataId=initData.alarmData[index].thing_data_id;
		initData.dataId=initData.alarmData[index].data_id;
		initData.deviceId=initData.alarmData[index].device_id;
		initData.childIndex=oindex;
		initData.off=title;
		if(initData.off=="修改"){
			
			initData.dataMin=initData.alarmData[initData.Index].threshold[initData.childIndex].lower_value;
			initData.dataMax=initData.alarmData[initData.Index].threshold[initData.childIndex].upper_value;
		}else{
			initData.dataMin="";
			initData.dataMax="";
		}
		initData.alarmRangeBox=layer.open({
			type: 1,
			title: "添加警告",
			skin: 'demo-class',
			shadeClose: false,
			shade: 0.5,
			area: ['411px', '166px'],
			content: $('.alarmRange')
		})
	},
	//添加提交告警范围判断，修改提交告警
	alarmRangeSave:function(){
		console.log(initData.dataMin+","+initData.dataMax)
		var text=/^[0-9]*$/;
		 if(initData.dataMin==""&&initData.dataMax==""){
			layer.tips('最大值或者最小值不能同时为空', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else if(text.test(initData.dataMin)&&text.test(initData.dataMax)){
			
			if((Number(initData.dataMin)>=Number(initData.dataMax)&&initData.dataMax!="")){
				layer.tips('最大值不能比最小值小', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
				});
			}else{
				if(initData.dataMin==""||initData.dataMin=="-∞"){
					initData.alarmData[initData.Index].threshold[initData.childIndex].lower_value="-∞";
				}else{
					initData.alarmData[initData.Index].threshold[initData.childIndex].lower_value=Number(initData.dataMin);
				}
				if(initData.dataMax==""||initData.dataMax=="+∞"){
					initData.alarmData[initData.Index].threshold[initData.childIndex].upper_value="+∞";
				}else{
					initData.alarmData[initData.Index].threshold[initData.childIndex].upper_value=Number(initData.dataMax);
				}
				
				var data={
						"threshold":initData.alarmData[initData.Index].threshold,				
						"data_id":initData.dataId,
						"device_id":initData.deviceId
					}
				$.alarmDataAjax(data);	
			}		
		}else{
			layer.tips('最大值或者最小值格式不正确', $("#dataMax"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});							
		}
		
	},
	//删除告警范围
	deleteAlarmData:function(index,ev,oindex){		
		layer.confirm("<font size='2'>确定清除该数据？</font>", {icon:7,skin:'del-class'}, function(){
			initData.alarmData[index].threshold[oindex].lower_value="-";
			initData.alarmData[index].threshold[oindex].upper_value="-";
			initData.dataId=initData.alarmData[index].data_id;
			initData.deviceId=initData.alarmData[index].device_id;
			var data={
				"threshold":initData.alarmData[index].threshold,				
				"data_id":initData.dataId,
				"device_id":initData.deviceId
			}
			$.alarmDataAjax(data);	
		})		
	},
	//模糊查询
	likeSearch:function(){
		initData.alarmData=[];
		for(var i=0;i<initData.likeAllData.length;i++){
			if(initData.likeAllData[i].title.search(initData.likeData)!=-1){				
				initData.alarmData.push(initData.likeAllData[i]);			
			}
			initData.MqttDataId.push(initData.likeAllData[i].data_id);		
		}
		if(initData.likeData==""){
			initData.alarmData=initData.likeAllData;
		}
	},
	
	
})
$.extend({
	init:function(){
		var alarmConfig = new Vue({
			el: '.oVue',
			data: initData,
			methods: $extend
		});
		getToken();		
		initData.access_token = accesstoken;
		$('input').limitSpacing();
		
		$(window).getAlarmListData();
		$(window).selectLable();
		
	},
	//删除，添加，修改告警范围
	alarmDataAjax:function(data){
		$.ajax({
				url:globalurl+"/v1/alarms/"+initData.thingDataId,
				data:{
					"access_token":initData.access_token,
					data:JSON.stringify(data)
				},
				dataType: 'JSON',
				type: 'put',
				crossDomain: true == !(document.all),
				success: function(data) {
					
					layer.close(initData.alarmRangeBox);
					initData.dataMin="";
					initData.dataMax="";
					if(data.code==200){
						layer.msg(data.success,{icon:1})
					}else{
						initData.alarmData[initData.Index].threshold[initData.childIndex].lower_value="-";
						initData.alarmData[initData.Index].threshold[initData.childIndex].upper_value="-";
						layer.msg("设置告警失败",{icon:1})
					}
				}
		})
	},
	//mqtt链接
	MQTTconnect:function(dataIds){
		var data;
		var mqttHost = mqttHostIP;
		var username = mqttName;
		var password = mqttWord;
		var client = new Paho.MQTT.Client(mqttHost, Number(portNum), "server" + parseInt(Math.random() * 100, 10));		
		  var options = {
				  timeout: 1000,
				  onSuccess:function() {
					  for(var i=0;i<dataIds.length;i++){
						  initData.topic=dataIds[i]+"";
						  client.subscribe(initData.topic);
					  }
					},
				  onFailure: function (message) {
					  setTimeout(MQTTconnect, 10000000);
				  }
		  };	  
		  // set callback handlers
		 client.onConnectionLost = $.onConnectionLost;
		 client.onMessageArrived = $.onMessageArrived;
		  
		  if (username != null) {
			  options.userName = username;
			  options.password = password;
		  }
		  client.connect(options);  
		  // connect the clien	
	},
	// called when the client loses its connection
	onConnectionLost:function (responseObject) {
		console.log(responseObject)
		if (responseObject.errorCode !== 0) {
		}
	},
	// called when a message arrives
	onMessageArrived:function (message) {
		
	  var topic = message.destinationName;
	  var payload = message.payloadString;	  
	  var dataConfig=JSON.parse(payload)
	  var dataId=dataConfig.data_id
	  var dataValue;
	  if(dataConfig.port_type=="DO"||dataConfig.port_type=="DI"){
	  	dataValue=dataConfig.battery.split('$')[dataConfig.data_value]
	  }else{
	  	dataValue=dataConfig.data_value
	  }
	  	for(var i=0;i<initData.alarmData.length;i++){
	  		if(initData.alarmData[i].data_id==dataId){
	  			initData.alarmData[i].data_value=dataValue;
	  			initData.alarmData[i].data_time=dataConfig.data_time;
	  			initData.alarmData[i].status=dataConfig.status;
	  		}
	  	}
		if(dataConfig.status==1){
			$('#'+dataId).removeClass("redBg grayBg").addClass("greenBg");
		}else if(dataConfig.status==0){
			$('#'+dataId).removeClass("greenBg redBg").addClass("grayBg");
		}else{
			$('#'+dataId).removeClass("greenBg grayBg").addClass("redBg");
		}
	}
	
})
$.init();
