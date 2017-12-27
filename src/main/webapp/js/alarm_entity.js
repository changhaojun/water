var initData={
	//令牌
	access_token: "",
	thingId:$("#thingId").val(),
	alarmDatas:[],
	allTags:[],
	selsetTags:[],
	companyId:$("#companyId").val(),
	resultBox:"",
	Index:"",
	likeSearchData:"",
	alarmRangeBox:"",
	dataMin:"",
	dataMax:"",
	dataId:"",
	childIndex:"",
	off:"",
	deviceId:"",
	MqttDataId:[],
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
	//点击出现弹窗
	showLayer:function(index){
		initData.likeSearchData=""
		initData.Index=index;
		initData.resultBox = layer.open({
			type: 1,
			title: "选择数据标签",
			skin: 'layui-layer-molv',
			shadeClose: true,
			shade: 0.5,
			area: ['300px', '336px'],
			content: $('.confirmInfo')
		})
	},
	
	//新增分组标签
	addTag:function(){
		var vue = this;
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
						data.company_id = initData.companyId;
						initData.allTags.unshift(data);
						initData.selsetTags.unshift(data);
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
			url:globalurl+'/v1/tags/'+initData.allTags[index]._id+'?access_token='+initData.access_token,
			async:true,
			success:function(data){
				if(data.code==200){
					initData.allTags.splice(index,1)
					initData.selsetTags.splice(index,1)
					layer.msg(data.success,{icon:1,zIndex:99999999})
				}else{
					layer.msg(data.error,{icon:2,zIndex:99999999})
				}
			}
		});
	},
	//选择数据标签==》确定提交数据标签
	chioseTag:function(index,event){
		var vue = this
		var data={
			"tag_id":initData.selsetTags[index]._id,
			"tag_name":initData.selsetTags[index].tag_name,
			"data_id":initData.alarmDatas[initData.Index].data_id,
			"device_id":initData.alarmDatas[initData.Index].device_id
		}
		$.ajax({
				url:globalurl+"/v1/alarms",
				data:{
					"access_token":initData.access_token,
					data:JSON.stringify(data)
				},
				dataType: 'JSON',
				type: 'put',
				crossDomain: true == !(document.all),
				success: function(data) {
					if(data.code==200){
						vue.$set(vue.alarmDatas[initData.Index],'tag_name',initData.selsetTags[index].tag_name)
						layer.msg(data.success,{icon:1})
					}					
				}
		})
		layer.close(initData.resultBox);
	},
	//添加告警范围
	alarmRangeLayer:function(index,event,oindex,title){
		initData.Index=index;
//		initData.thingDataId=initData.alarmDatas[index].thing_data_id;
		initData.dataId=initData.alarmDatas[index].data_id;
		initData.deviceId=initData.alarmDatas[index].device_id;
		initData.childIndex=oindex;
		initData.off=title;
		if(initData.off=="修改"){
			initData.dataMin=initData.alarmDatas[initData.Index].threshold[initData.childIndex].lower_value;
			initData.dataMax=initData.alarmDatas[initData.Index].threshold[initData.childIndex].upper_value;
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
		var text=/^[0-9]+([.]{1}[0-9]{1,2})?$/;
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
					initData.alarmDatas[initData.Index].threshold[initData.childIndex].lower_value="-∞";
				}else{
					initData.alarmDatas[initData.Index].threshold[initData.childIndex].lower_value=Number(initData.dataMin);
				}
				if(initData.dataMax==""||initData.dataMax=="+∞"){
					initData.alarmDatas[initData.Index].threshold[initData.childIndex].upper_value="+∞";
				}else{
					initData.alarmDatas[initData.Index].threshold[initData.childIndex].upper_value=Number(initData.dataMax);
				}
				
				var data={
						"threshold":initData.alarmDatas[initData.Index].threshold,				
						"data_id":initData.dataId,
						"device_id":initData.deviceId
					}
				$.alarmDatasAjax(data);	
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
			initData.alarmDatas[index].threshold[oindex].lower_value="-";
			initData.alarmDatas[index].threshold[oindex].upper_value="-";
			initData.dataId=initData.alarmDatas[index].data_id;
			initData.deviceId=initData.alarmDatas[index].device_id;
			var data={
				"threshold":initData.alarmDatas[index].threshold,				
				"data_id":initData.dataId,
				"device_id":initData.deviceId
			}
			$.alarmDatasAjax(data);	
		})		
	},
	//模糊查询
	likeSearch:function(){
		initData.alarmDatas=[];
		for(var i=0;i<initData.likeAllData.length;i++){
			if(initData.likeAllData[i].title.search(initData.likeData)!=-1){				
				initData.alarmDatas.push(initData.likeAllData[i]);			
			}
			initData.MqttDataId.push(initData.likeAllData[i].data_id);		
		}
		if(initData.likeData==""){
			initData.alarmDatas=initData.likeAllData;
		}
	},
	
	searchLable:function(){
		initData.selsetTags.splice(0,initData.selsetTags.length);
		var tagLike = initData.likeSearchData;
		var thisTags = initData.allTags
		for(var i = 0; i < thisTags.length; i++){
			if(thisTags[i].tag_name.indexOf(tagLike)!=-1){
				initData.selsetTags.push(thisTags[i])
			}
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
		$.getAlarmListData();  //获取告警列表的数据
		$.selectLable();   //获取分组标签
	},
	//获取告警列表的数据
	getAlarmListData:function(){
		var loading=new Finfosoft.Loading({
			shade:['0.7','#ffffff'],
	        color:'#000000',
	        msg:'正在加载数据，请稍后。。。',
		})
		$.ajax({
			url:globalurl+"/v1/things/"+initData.thingId+"/alarms",
			dataType: 'JSON',
			type: 'get',
			data:{
				access_token:initData.access_token	
			},
			async:true,
			crossDomain: true == !(document.all),
			success: function(data) {
				loading.closeLoading();
				for(var i=0;i<data.length;i++){
					data[i].title=data[i].device_name+"-"+data[i].data_name	;					
					if(data[i].title.length>15){						
						 data[i].title=data[i].title.substring(0,15)+"...";//超出一行显示省略
					}
					initData.MqttDataId.push(data[i].data_id)
				}
				initData.alarmDatas=data;
				initData.likeAllData=data;
				$.MQTTconnect(initData.MqttDataId);
				
			}
		})
	},
	//获取分组标签
	selectLable:function(index){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/tags",
			async:true,
			data:{
					access_token:initData.access_token,
					filter:'{"company_id":"'+initData.companyId+'"}'
			},
			success:function(data){
				initData.allTags=JSON.parse(JSON.stringify(data.rows))
				initData.selsetTags =JSON.parse(JSON.stringify(data.rows))
			}
		});
	},
	//删除，添加，修改告警范围
	alarmDatasAjax:function(data){
		$.ajax({
				url:globalurl+"/v1/alarms",
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
						initData.alarmDatas[initData.Index].threshold[initData.childIndex].lower_value="-";
						initData.alarmDatas[initData.Index].threshold[initData.childIndex].upper_value="-";
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
				  	console.log("MQTT connection successful")
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
		console.log("MessageArrived!")
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
	  	for(var i=0;i<initData.alarmDatas.length;i++){
	  		if(initData.alarmDatas[i].data_id==dataId){
	  			initData.alarmDatas[i].data_value=dataValue;
	  			initData.alarmDatas[i].data_time=dataConfig.data_time;
	  			initData.alarmDatas[i].status=dataConfig.status;
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
