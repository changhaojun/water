$.taskData = {
	task:[],
	access_token:'',	//访问令牌
	process_name:'',	//工艺名称和
	companyId:'',		//公司ID
	isEditTechnology:false,		//是否时编辑工艺
	domString: {
		layerInput: '<input type="text" id="addTechnologyName" placeholder="请输入工艺名称"/>',
		stepBox: '<div class="stepBox"></div>',
		ruleNode: '<div class="taskTree-greenNode"></div>',
		stepText:'<div class="stepText"></div>',
		technologyName: '<div class="technologyName"><div class="technologyName-greenBorder"></div><div class="technologyName-line"></div></div>',
		technologyTools:'<div class="technologyTools tools"><span class="fa fa-wrench toolsEdit" data-toggle="tooltip" data-placement="top" title="修改工艺名称"></span><span class="fa fa-trash-o toolsDelete" data-toggle="tooltip" data-placement="top" title="删除工艺"></span></div>',
		missionBox:'<div class="missionBox row"></div>',
		missionTools:'<span class="missionTools tools"><span class="fa fa-wrench missionToolsEdit" data-toggle="tooltip" data-placement="top" title="修改"></span><span class="fa fa-trash-o missionToolsDelete" data-toggle="tooltip" data-placement="top" title="删除"></span></span>',
		addConditionBox:'<div class="addEventBox"><div class="row"><div class="col-xs-6">实体名称：<input class="controls conditionThing" placeholder="请输入触发条件的实体名" /><ul class="conditionThingList" hidden="hidden"></ul></div><div class="col-xs-6">采集端口：<select class="controls conditionTag" ></select></div><span class="closeBox" data-toggle="tooltip" data-placement="top" title="删除">x</span></div><div class="row"><div class="col-xs-6">比较符：&nbsp;&nbsp;<select class="controls compareOper"><option value="gt">></option><option value="lt"><</option><option value="eq">=</option></select></div></div><div class="row"><div class="col-xs-6">实体名称：<input class="controls compareThing" placeholder="请输入触发条件的实体名" /><ul class="compareThingList" hidden="hidden"></ul></div><div class="col-xs-6">采集端口：<select class="controls compareTag" >	</select></div></div><hr /></div>'
	},
	selectTaskId:'',		//点击工艺后获取该工艺的ID
	stepNum:'1',			//工艺名称上自增的数字
	selectEventThing:'',	//选择事件触发的实体
	selectEventTag:'',		//选择事件触发的端口
	compare_oper:'gt',		//比较符初始化
	compare_value:'',		//基准值
	trigger_type:'58ef46b543929a10708f2b08',		//事件类型
	trigger_typeStr:'',
	selectControlThing:'',	//选择控制的实体
	selectControlTag:'',	//选择控制的端口
	controlTagList:{},		//控制端口的集合
	selectControlTagActuion:0,	//模拟量端口下发动作的初始值
	inputCheck:true,			//input框验证是否通过
	selectCheck:true,			//select框验证是否通过
	processDom:'',				//工艺窗口DOM对象
	ruleBox:{					//规则窗口
		mission_id:'',
		mission_name:'',
		trigger_type:'58ef46b543929a10708f2b08',
		target_thing_id:'',
		target_thing_name:'',
		target_data_id:'',
		target_data_name:'',
	},
	processBox:{
		process_name:'',
		trigger_type:'58ef46b543929a10708f2b08',
		company_id:$("#companyId").val(),
		status:1,
		is_remind:0,
		trigger_conditions:[],
		action_times:1
	},
	ruleIndexBox:[],
	selectEventProcess:''
};

$.fn.extend({
	addTechnology:function(){	//添加工艺
		$.taskData.processBox.process_name='';
		$.taskData.processBox.trigger_type='58ef46b543929a10708f2b08';
		$.taskData.processBox.trigger_name='事件触发';
		$.taskData.processBox.status=1;
		$.taskData.processBox.trigger_conditions=[];
		$.taskData.processBox.action_times=1;
		var This = $(this);
		$('.addConditionBox').empty();
		$.taskData.isEditTechnology=false;
		var titleMsg='添加工艺'
		$.showAddProcessBox($.taskData.processBox,titleMsg)
		
	},
	showStepLine:function(){	//模拟点击工艺
		$.taskData.processDom=$(this);
		$.taskData.process_name=$(this).text();
		$(".technologyName").children("div.technologyName-line").css("display","none");
		$(this).children("div.technologyName-line").css("display","block");
		var marginTop = $(this).children(".technologyName-line").position().top;
		var taskScrollTop=$('.taskContent').scrollTop();
		$(".taskRule").css("display","block");
		$(".taskRule").css("margin-top",(marginTop+taskScrollTop-85)+'px');
		$('.taskContent').animate({scrollTop:(marginTop+taskScrollTop-145)},1000);
		$.taskData.selectTaskId=$(this).attr('id');
		$(this).getTriger()
		$(".ruleMain").getRuleList();
		return $(this);
	},
	getTriger:function(){
		var This=$(this); //$('.technologyName')
		var processId=This.attr('id');
		$.ajax({
				type:"get",
				url:globalurl+"/v1/processes?access_token="+$.taskData.access_token+"&process_id="+processId,
				async:false,
				success:function(data){
					$('.ruleTitle').showTriger(data.trigger_conditions,data.action_times,data.trigger_name,data.target_process_name);
				}
			})
	},
	showTriger:function(conditions,times,typeName,targetName){
		$(this).find('.content1').empty();
		$(this).find('.content2').empty();
		$(this).find('.content1').append('触发条件:&nbsp;&nbsp;&nbsp;&nbsp;')
		if(typeName=='事件触发'){
			if(conditions.length>0){
				for(var i=0;i<conditions.length;i++){
					var operStr;
					switch(conditions[i].compare_oper){
						case 'gt':
							operStr='大于';
							break;
						case 'lt':
							operStr='小于';
							break;
						default:
							operStr='等于';
					}
					$(this).find('.content1').append(conditions[i].thing_name+':'+conditions[i].data_name+'&nbsp;'+operStr+'&nbsp;'+conditions[i].compare_data_name+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
				}
			}
		}else if(typeName=='时间周期触发'){
			$(this).find('.content1').append('开始时间:'+conditions[0].begin_time+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;时间间隔:'+conditions[0].cycle_time+'秒')
		}else if(typeName=='定时触发'){
			var cycleStr='';
			if(conditions[0].cycle=='everyWeek'){
				var weekDay=conditions[0].cycle_week
				if(conditions[0].cycle_week=='0'){
					cycle_week='日'
				}
				cycleStr='每周'+weekDay
			}else{
				cycleStr='每日'
			}
			$(this).find('.content1').append(`触发周期:${cycleStr}&nbsp;${conditions[0].start_time}`)
		}else if(typeName=='异常处理'){
			$(this).find('.content1').append(targetName+typeName)
		}else{
			$(this).find('.content1').append('人工触发没有触发条件')
		}
		$(this).find('.content2').append('执行：'+times+'次')
	},
	getRuleList:function(){	//获取任务集合
		var This=$(this)
		This.empty();
		$.ajax({
			type:"GET",
			url:globalurl+"/v1/missions?access_token="+$.taskData.access_token,
			async:false,
			data:{
				filter:'{"process_id":"'+$.taskData.selectTaskId+'"}',
				sorts:'{"index":"asc"}'
			},
			success:function(data){
				if(data.rows.length>0){
					$.taskData.ruleIndexBox=data.rows;
					for(var i=0;i<data.rows.length;i++){
						This.showMissionsDom(data.rows[i]);
					}
//					$.dragMission();//拖动任务
					$('.missionBox').hover(function(){
						$(this).showTools();
					},function(){
						$(this).hideTools();
					})
					
					$('[data-toggle="tooltip"]').tooltip();
					
					$('.missionToolsDelete').click(function(){
						$(this).deleteMission();
					})
					
					$('.missionToolsEdit').click(function(){
						$(this).editMission();
					})
				}
			}
		})
	},
	showMissionsDom:function(thisMIssion){		//右侧显示该工艺下的任务列表
		var action_str;
		if(thisMIssion.action_str!=undefined){
			action_str=thisMIssion.action_str;
		}else{
			action_str=thisMIssion.action;
		}
		var missionBox=$($.taskData.domString.missionBox)
		$(this).append(missionBox);
		missionBox.attr('id',thisMIssion._id);
		missionBox.append('<div class="content1">'+thisMIssion.mission_name+'</div>')
		missionBox.append('<div class="content2">'+thisMIssion.target_thing_name+'：'+thisMIssion.target_data_name+'  '+action_str+'</div>');
		missionBox.append('<div class="content3">等待'+thisMIssion.wait_time+'秒</div>');
		missionBox.append($($.taskData.domString.missionTools));
	},
	saveTechnologyName:function(isEdit,name,technologyId){		//保存工艺名称
		$('input').limitSpacing();		//输入框去除空格
		$('#addTechnologyName').formCheckFoo();
		if($.taskData.inputCheck){
			var sendData={};
				sendData.process_name=name
				sendData.company_id=$.taskData.companyId;
			var sendType;
			var sendUrl;
			if(isEdit){
				sendType="PUT";
				sendData={data:JSON.stringify(sendData),process_id:technologyId};
			}
			else{
				sendType="POST";
				sendData={data:JSON.stringify(sendData)};
			}
			$.ajax({
				type:sendType,
				url:globalurl+"/v1/processes?access_token="+$.taskData.access_token,
				async:false,
				data:sendData,
				success:function(data){
					if(!isEdit){
						var process={};
						process.process_name=$.taskData.process_name;
						process._id=data.process_id;
						$.taskData.selectTaskId=data.process_id;
						$.creatStepBox(process);
						$.taskData.task.push(process);
					}
				}
			});
		}
		return $.taskData.inputCheck;
	},
	editTechnology:function(){
			$.taskData.isEditTechnology=true;
			var This=$(this)
			var technologyId=$(this).parent().parent().attr('id')
			$.ajax({
				type:"get",
				url:globalurl+"/v1/processes?access_token="+$.taskData.access_token+"&process_id="+technologyId,
				async:false,
				success:function(data){
					var titleMsg='修改工艺';
					$('.addConditionBox').empty();
					$.taskData.processBox=data;
					$.taskData.selectEventProcess=data.target_process_id
					$.showAddProcessBox(data,titleMsg);
				}
			});
			event.stopPropagation();
	},
	setTriggerType:function(triggerType){		//设置触发类型
		$.taskData.trigger_type=triggerType[0]._id;
		for(var i=0;i<triggerType.length;i++){
			$(this).append('<option value='+triggerType[i]._id+'>'+triggerType[i].trigger_name+'</option>');
		}
	},
	openAddRuleBox:function(ruleBoxData,titleMsg){		//打开添加动作的窗口
		$("#ruleName").val(ruleBoxData.mission_name);
		$('#controlThing').val(ruleBoxData.target_thing_name);
		$('#controlTag').val(ruleBoxData.target_data_id);
		$('#waitTime').val(ruleBoxData.wait_time);
		$.lyAddRuleBox=layer.open({
			  type: 1,
			  title: titleMsg,
			  shadeClose: false,
			  shade: 0.8,
			  area: ['680px'],
			  content: $('.addRuleBox') //iframe的url
		})
	},
	changeTriggerType:function(){	//选择触发类型
		var selectType=$(this).find("option:selected").text();
		$(this).changeTriggerTypeAction(selectType);
		var contentHeight=$(this).parent().parent().parent().parent().height()+42;
		$('.layui-layer').css('height',contentHeight+'px');
	},
	changeTriggerTypeAction:function(selectType){	//选择触发类型后执行
		$.taskData.trigger_type=$(this).val();
		$.taskData.processBox.trigger_type=$(this).val();
		$(".addRuleMain").show();
		if(selectType=="事件触发"){
			$(".eventBox").show();
			$(".addEventBox").show();
			$('.andOr').show();
			$('.timingBox').hide();
			$('.triggerText').show();
			$('.addConditionBtn').show();
			$('.targetProcess').hide();
			$('.targetProcess').addCustomAttr();
			$('.timing').hide();
			$('.timing').addCustomAttr();
			$('.timingBox').addCustomAttr();
			$(".eventBox").removeCustomAttr();
			$('.addConditionBox').removeCustomAttr();
		}else if(selectType=="时间周期触发"){
			$('.timingBox').show();
			$(".addEventBox").hide();
			$(".eventBox").hide();
			$('.andOr').hide();
			$('.triggerText').show();
			$('.addConditionBtn').hide();
			$('.targetProcess').hide();
			$('.targetProcess').addCustomAttr();
			$('.timing').hide()
			$('.timing').addCustomAttr()
			$(".eventBox").addCustomAttr();
			$('.addConditionBox').addCustomAttr();
			$('.timingBox').removeCustomAttr();
		}else if(selectType=="人工触发"){
			$(".eventBox").hide();
			$('.andOr').hide();
			$(".addEventBox").hide();
			$('.timingBox').hide();
			$('.triggerText').hide();
			$('.addConditionBtn').hide();
			$('.targetProcess').hide();
			$('.targetProcess').addCustomAttr();
			$('.timing').hide()
			$('.timing').addCustomAttr()
			$(".eventBox").addCustomAttr();
			$('.addConditionBox').addCustomAttr();
			$('.timingBox').addCustomAttr();
		}else if(selectType=='定时触发'){
			$(".eventBox").hide();
			$(".addEventBox").hide();
			$('.andOr').hide();
			$('.timingBox').hide();
			$('.triggerText').hide();
			$('.addConditionBtn').hide();
			$('.targetProcess').hide();
			$('.targetProcess').addCustomAttr();
			$('.timing').show();
			$('.timing').removeCustomAttr();
			$(".eventBox").addCustomAttr();
			$('.addConditionBox').addCustomAttr();
			$('.timingBox').addCustomAttr();
		}else if(selectType=='异常处理'){
			$(".eventBox").hide();
			$('.andOr').hide();
			$(".addEventBox").hide();
			$('.timingBox').hide();
			$('.triggerText').hide();
			$('.addConditionBtn').hide();
			$('.targetProcess').show();
			$('.targetProcess').removeCustomAttr();
			$('.timing').hide()
			$('.timing').addCustomAttr()
			$('.timingBox').addCustomAttr();
			$(".eventBox").addCustomAttr();
			$('.addConditionBox').addCustomAttr();
		}
		layer.iframeAuto($.lyAddRuleBox);
	},
	addCustomAttr:function(){
		$(this).find('input').each(function(){
			$(this).attr("isCheck","false");
		})
	},
	removeCustomAttr:function(){
		$(this).find('input').each(function(){
			$(this).attr("isCheck","true");
		})
	},
	getTargetProcess:function(){
		var selectUl=$(this).next();
		$.ajax({
			type:"get",
			url:globalurl+"/v1/processes?access_token="+$.taskData.access_token,
			async:true,
			data:{
				like:'{"process_name":"'+$(this).val()+'"}'
			},
			success:function(data){
				selectUl.show();
				selectUl.empty();
				if(data.rows.length>0){
					for(var i=0;i<data.rows.length;i++){
						selectUl.append($('<li class="processLi" value="'+data.rows[i]._id+'">'+data.rows[i].process_name+'</li>'));
					}
					selectUl.css("border-color","#E7E7E7");
				}else{
					selectUl.append($('<li class="processLi" value=0>未查询到工艺！</li>'));
					selectUl.css("border-color","red");
				}
			}
		});
	},
	changeConditionProcess:function(){		//再工艺列表中选择工艺
		var parent=$(this).parent();
		var parentInput=parent.prev();
		var classType=$(this).attr('class');
		if(classType=="processLi"){
			$.taskData.selectEventProcess=$(this).attr("value");
			parent.attr('process_id',$(this).attr("value"));
			if($(this).attr("value")!=0){
				parentInput.val($(this).text());
				parent.empty();
				parent.hide();
			}
		}
	},
	getThing:function(){		//获取触发条件的实体列表
		var selectUl=$(this).next();
		$.ajax({
			type:"get",
			url:globalurl+"/v1/things?access_token="+$.taskData.access_token,
			async:false,
			data:{
				like:'{"thing_name":"'+$(this).val()+'"}'
			},
			success:function(data){
				selectUl.show();
				selectUl.empty();
				if(data.rows.length>0){
					for(var i=0;i<data.rows.length;i++){
						selectUl.append($('<li class="thingLi" value="'+data.rows[i]._id+'">'+data.rows[i].thing_name+'</li>'));
					}
					selectUl.css("border-color","#E7E7E7");
				}else{
					selectUl.append($('<li class="thingLi" value=0>未查询到该实体！</li>'));
					selectUl.css("border-color","red");
				}
			}
		});
	},
	changeConditionThing:function(){	//选择实体后执行
		var parent=$(this).parent();
		var parentInput=parent.prev();
		var classType=$(this).attr('class');
		if(classType=="thingLi"){
			if(parent.attr("class")=="conditionThingList"){
				$.taskData.selectEventThing=$(this).attr("value");
				parent.attr('thing_id',$(this).attr("value"));
			}else if(parent.attr("id")=="controlThingList"){
				$.taskData.selectControlThing=$(this).attr("value");
			}else if(parent.attr('class')=='compareThingList'){
				parent.attr('thing_id',$(this).attr("value"));
			}
			if($(this).attr("value")!=0){
				parent.getConditionTagList();
				parentInput.val($(this).text());
				parent.empty();
				parent.hide();
			}
		}
	},
	getConditionTagList:function(){		//选择实体后获取该实体下标签的列表
		var tagSelect,sendFilter;
		if($(this).is('UL')){
			tagSelect=$(this).parent().next().find("select");
		}else{
			tagSelect=$(this).parent().parent().next().find("select");
		}
		var thingId,operType;
		if(tagSelect.attr("class")=="controls conditionTag"){
			thingId=$(this).attr('thing_id');
			operType=1;
			sendFilter='{"oper_type":'+operType+'}'
		}else if(tagSelect.attr("id")=="controlTag"){
			thingId=$.taskData.selectControlThing;
			operType=2;
			sendFilter='{"oper_type":'+operType+'}'
		}else if(tagSelect.hasClass('compareTag')){
			thingId=$(this).attr('thing_id');
			sendFilter='{"port_type":"CD","port_type_1":"MO"}'
		}
		$.ajax({
			type:"get",
			url:globalurl+"/v1/missionDataTags?access_token="+$.taskData.access_token+"&thing_id="+thingId,
			async:false,
			data:{
				filter:sendFilter
			},success:function(data){
				tagSelect.empty();
				if(data.length>0){
					for(var i=0;i<data.length;i++){
						tagSelect.append($('<option class="tagLi" value="'+data[i].data_id+'">'+data[i].data_name+'</option>'));
						if(tagSelect.attr("id")=="controlTag"){
							var thisId=data[i].data_id;
							$.taskData.controlTagList[thisId]=data[i];
							$("#controlTag").change();
						}
					}
				}else{
					tagSelect.append($('<option class="tagLi" value=0>该实体下没有符合的数据端口</option>'))
				}
			}
		});
	},
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/\s/g, ''));
		});
	},
	//非数字限制输入
	numOnly: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/[^0-9-]/g, ''));
		});
	},
	formCheckFoo:function(){
		$.taskData.inputCheck=true
		if($(this).val()==''){
			var This=$(this)
			$(this).focus();
			layer.tips(This.attr("placeholder"),This,{tips: [1,'#FE777A']})
			$.taskData.inputCheck=false
		}
		return $.taskData.inputCheck;
	},
	showTools:function(){	//显示工具栏
		$(this).find(".tools").css("display","block");
	},
	hideTools:function(){	//隐藏工具栏
		$(this).find(".tools").css("display","none");
	},
	deleteTechnology:function(){
		var This=$(this)
			$.layerConfirm=layer.confirm('删除工艺同时会删除该工艺下所有的任务，是否删除？', {
					title:"删除工艺",
			  		btn: ['删除'] //按钮
			},function(){
				var technologyId=This.parent().parent().attr('id')
				$.ajax({
					type:"delete",
					url:globalurl+"/v1/processes?access_token="+$.taskData.access_token+"&process_id="+technologyId,
					async:true,
					//data:sendData,
					success:function(data){
						if(data.code==200){
							layer.close($.layerConfirm)
							layer.msg(data.success,{
								icon:1,
								time:2000
							},function(){
								location.reload();
							})
						}else if(data.code==400018){
						  	layer.msg(data.error,{icon:2})
						}
					}
				});
			}
			);
			event.stopPropagation();
		
	},
	deleteMission:function(){
		var missionId=$(this).parent().parent().attr('id');
		$.layerConfirm=layer.confirm('是否删除该任务？', {
					title:"删除任务",
			  		btn: ['删除'] //按钮
			},function(){
					$.ajax({
					type:"delete",
					url:globalurl+"/v1/missions?access_token="+$.taskData.access_token+"&mission_id="+missionId,
					async:true,
					success:function(data){
						if(data.code==200){
							layer.msg(data.success,{
								icon:1,
								time:2000
							})
							$('#'+$.taskData.selectTaskId).showStepLine();
							$.saveMissionIndex($.taskData.ruleIndexBox);
						}else if(data.code==400003){
							layer.close($.layerConfirm)
							layer.msg(data.error,{
								icon:2,
								time:2000,
							})
						}else{
							layer.close($.layerConfirm)
							layer.msg(data.error,{
								icon:2,
								time:2000,
							})
						}
						
					}
				});
				}
			);
			event.stopPropagation();
	},
	editMission:function(){
		var missionId=$(this).parent().parent().attr('id');
		$.ajax({
			type:"get",
			url:globalurl+"/v1/missions?access_token="+$.taskData.access_token+"&mission_id="+missionId,
			async:true,
			success:function(data){
				$.taskData.ruleBox.action=data.action;
				$.taskData.ruleBox.mission_name=data.mission_name;
				$.taskData.ruleBox.target_thing_id=data.target_thing_id;
				$.taskData.ruleBox.target_data_id=data.target_data_id;
				$.taskData.selectControlThing=data.target_thing_id;
				$.taskData.ruleBox.target_thing_name=data.target_thing_name;
				$.taskData.ruleBox.wait_time=data.wait_time;
				$('#controlThingList').getConditionTagList();
				$(this).openAddRuleBox($.taskData.ruleBox,titleMsg);
				$("#controlTag").change();
				$.taskData.ruleBox.mission_id=data._id;
				var titleMsg='修改任务';
				
			}
		});
		event.stopPropagation();
	},
	addCondition:function(){
		$('.addConditionBox').append($($.taskData.domString.addConditionBox));
		$('.layui-layer-content').css('height','inherit');
		$.conditionBox();
	},
	saveProcessData:function(){
		$.taskData.processBox.process_name=$('#addTechnologyName').val();
		$.taskData.processBox.action_times=Number($('.actionTimes').val());
		var conditionData={};
		$.taskData.processBox.trigger_conditions=[];
		if($('.eventBox').css('display')=='block'){
			$.taskData.processBox.is_or=$('#isOr').val();
			conditionData.thing_id=$('.eventBox').find('.conditionThingList').attr('thing_id');
			conditionData.data_id=Number($('.eventBox').find('.conditionTag').val());
			conditionData.compare_oper=$('.eventBox').find('.compareOper').val();
			conditionData.compare_data_id=Number($('.eventBox').find('.compareTag').val());
			conditionData.compare_thing_id=$('.compareThing').next().attr('thing_id');
			$.taskData.processBox.trigger_conditions.push(conditionData);
			$('.addConditionBox .addEventBox').each(function(){
				conditionData={};
				conditionData.thing_id=$(this).find('.conditionThingList').attr('thing_id');
				conditionData.data_id=Number($(this).find('.conditionTag').val());
				conditionData.compare_oper=$(this).find('.compareOper').val();
				conditionData.compare_data_id=Number($(this).find('.compareTag').val());
				conditionData.compare_thing_id=$(this).find('.compareThing').next().attr('thing_id');
				$.taskData.processBox.trigger_conditions.push(conditionData);
			})
		}else if($('.timingBox').css('display')=='block'){
			conditionData={};
			conditionData.begin_time=$('#datetimepicker').val();
			conditionData.cycle_time=Number($('#timeInterval').val());
			$.taskData.processBox.trigger_conditions.push(conditionData);
		}else if($('.timing').css('display')=='block'){
			conditionData={};
			conditionData.cycle=$('.chioceCycle').val();
			if($('.chioceCycle').val()=='everyWeek'){
				conditionData.cycle_week=$('.weekList').val()
			}
			conditionData.start_time=$('.startTime').val();
			$.taskData.processBox.trigger_conditions.push(conditionData)
		}
		
		if($('.targetProcess').css('display')=='block'){
			$.taskData.processBox.target_process_id=$.taskData.selectEventProcess;
		}
		delete $.taskData.processBox.trigger_name;
		var sendData,sendType;
		if($.taskData.isEditTechnology){
			var processId=$.taskData.processBox._id
			delete $.taskData.processBox._id;
//			delete $.taskData.processBox.trigger_name;
			sendType='PUT'
			sendData={data:JSON.stringify($.taskData.processBox),process_id:processId}
		}else{
			sendType='post'
			sendData={data:JSON.stringify($.taskData.processBox)}
		}
		$.ajax({
			type:sendType,
			url:globalurl+"/v1/processes?access_token="+$.taskData.access_token,
			async:false,
			data:sendData,
			success:function(data){
				if(data.code==200){
					layer.msg(data.success,{
						icon:1,
						time:2000
					},function(){
						location.reload();
					})
				}else{
					layer.msg(data.error,{icon:2})
				}
			}
		});
	},
	dragMissionFn:function(callBack){
		var parent = $(this);
		$(this).css({
			'position': 'relative',
			'top': 0
		});
		var singleHeight = $(this).children().outerHeight(true);
		$(this).delegate('.missionBox','mousedown',function(ev) {
			parent.children().css({
			    'position': 'relative',
			    'top': 0
			});
			var son = $(this);
			var start = parseInt($(this).css('top'));
			var dis = ev.pageY;
			var oldIndex = $(this).index();
			var index = null;
			var direction = null;
			$(this).css('zIndex',99999);
			$(document).mousemove(function(ev) {
				var currentTop = start+ev.pageY-dis;
				index = Math.round(currentTop/singleHeight) + oldIndex;
				if (index<0) {
					index = 0;
				} else if (index>=parent.children().length-1) {
					index = parent.children().length-1;
				}
				parent.children().css('border','none');
				if (index>oldIndex) {
					direction = 'down';
					parent.children().eq(index).css({
						'borderBottomColor': '#ff0000',
						'borderBottomStyle': 'solid',
						'borderBottomWidth': '2px'
					});
				} else {
					direction = 'up';
					parent.children().eq(index).css({
						'borderTopColor': '#ff0000',
						'borderTopStyle': 'solid',
						'borderTopWidth': '2px'
					});
				}
				son.css('top', currentTop);
				return false;
			});
			$(document).mouseup(function(ev) {
				$(document).unbind();
				if (direction=='down') {
					son.insertAfter(parent.children().eq(index));
				} else if (direction=='up') {
					son.insertBefore(parent.children().eq(index));
				}
				parent.children().css({
				    'position': '',
				    'top': 0,
				    'border': 'none',
				    'zIndex': 0
				});
				var sendIndex = {
					oldIndex: oldIndex,
					newIndex: son.index()
				};
				start = 0;
				dis = 0;
				oldIndex = null;
				index = null;
				direction = null;
				callBack && callBack(sendIndex);
			});
		})
	},
	showWeek:function(){
		if($(this).val()=='everyWeek'){
			$(this).parent().next().css('display','block');
		}else{
			$(this).parent().next().css('display','none');
		}
	},
	timeBox:function(){
		var This=$(this)
		return {
			showBox:function(){
				This.next().css('display','block')
			},
			hideBox:function(){
				This.next().css('display','none')
			}
		}
	},
	saveTime:function(){
		var startTime=$($(this).siblings('input')[0]).val()+':'+$($(this).siblings('input')[1]).val()
		$('.startTime').val(startTime)
		$(this).parent().parent().css('display','none')
	},
	remindBtnStatus:function(){
		$(this).addClass('greenBtn');
		$(this).removeClass('grayBtn');
		$(this).siblings().addClass('grayBtn');
		$(this).siblings().removeClass('greenBtn');
		$.taskData.processBox.is_remind=$(this).attr('value')
	}
});

$.extend({
	init:function(){
		getToken();		//获取令牌
		$.taskData.access_token = accesstoken;
		$.addNode();	//增加工艺节点
		$.getProcess();		//获取任务List
		$.taskData.companyId=$("#companyId").val();		//全局变量公司ID
		$.getTriggerType();		//获取触发类型List
		$.addRule();		//添加规则
		$.selectTriggerType();	//选择触发类型
		$.setConditionThing();	//输入条件实体名称，模糊查询
		$.saveRule();		//保存规则
		$('input').limitSpacing();		//输入框去除空格
		$('input').filter('[num-limit=limit]').numOnly();		//数字限制输入
 		$('[data-toggle="tooltip"]').tooltip();
 		$.saveProcess();
 		$.isRemind();      //短信提醒
 		$('.remindBtn').find('.activeBtn').remindBtnStatus();
 		$('#datetimepicker').datetimepicker({
 			language:'zh-CN',
 			format: "yyyy-MM-dd hh:ii",
	        autoclose: true,
	        todayBtn: true,
	        pickerPosition: "bottom-left"
 		});
 		$.conditionBox();	//控制条件BOX
   		$.dragMission();
	},
	addNode:function(){
		$(".taskTree-add").click(function(){
			$(this).addTechnology();
		});
	},
	creatStepBox:function(receiveData) {	//创建工艺DOM节点
			$.taskData.process_name = receiveData.process_name;
			var stepBox=$($.taskData.domString.stepBox);
			var ruleNode=$($.taskData.domString.ruleNode);
			var stepText=$($.taskData.domString.stepText);
			var technologyName=$($.taskData.domString.technologyName);
			var technologyTools=$($.taskData.domString.technologyTools);
			technologyName.append(technologyTools);
			technologyName.attr("id",receiveData._id);
			technologyName.click(function(){	//绑定点击事件
				$(this).showStepLine();
			})
			ruleNode.append(stepText);
			ruleNode.append(technologyName);
			stepBox.append(ruleNode);
			$(".taskTree-add").before(stepBox);
			stepText.html("step"+$.taskData.stepNum);
			technologyName.find(".technologyName-greenBorder").html(receiveData.process_name+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+receiveData.trigger_name);
			$(".technologyName").hover(function(){
				$(this).showTools();
			},function(){
				$(this).hideTools();
			});
			$.taskData.stepNum++;		//step 数字自增
	},
	getProcess:function(){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/processes?access_token="+$.taskData.access_token,
			async:false,
			success:function(data){
				if(data.rows.length>0){
					$.taskData.task=data.rows;
					for(var i=0;i<$.taskData.task.length;i++){
						$.creatStepBox($.taskData.task[i]);
					}
					$(".toolsEdit").click(function(){	//修改工艺名称
						$(this).editTechnology();
					});
					$('.toolsDelete').click(function(){
						$(this).deleteTechnology();
					})
					$('[data-toggle="tooltip"]').tooltip();
					$(".technologyName").eq(0).showStepLine();	//页面初始化时模拟点击第一个工艺
				}
			}
		})
	},
	getTriggerType:function(){	//获取触发类型
		$.ajax({
			type:"get",
			url:globalurl+"/v1/triggerTypes?access_token="+$.taskData.access_token,
			async:false,
			success:function(data){
				$("#triggerType").setTriggerType(data);
			}
		})
	},
	showAddProcessBox:function(processData,titleMsg){
		$('#addTechnologyName').val(processData.process_name);
		$('#triggerType').val(processData.trigger_type);
		$('.actionTimes').val(processData.action_times);
		$('.remindBtn').find('span').filter('[value='+processData.is_remind+']').click()
		if(processData.trigger_name=="事件触发"){
			$('#isOr').val(processData.is_or)
			if(processData.trigger_conditions.length>0){
				$.showEventBoxData(processData)
			}
		}else if(processData.trigger_name=="时间周期触发"){
			$('.timingBox').show();
			$('.eventBox').hide();
			if(processData.trigger_conditions.length>0){
				$('#datetimepicker').val(processData.trigger_conditions[0].begin_time);
				$('#timeInterval').val(processData.trigger_conditions[0].cycle_time);
			}
		}else if(processData.trigger_name=="定时触发"){
			if(processData.trigger_conditions.length>0){
				$('.chioceCycle').val(processData.trigger_conditions[0].cycle)
				if(processData.trigger_conditions[0].cycle_week){
					$('.chioceCycle').showWeek();
					$('.weekList').val(processData.trigger_conditions[0].cycle_week)
				}
				$('.startTime').val(processData.trigger_conditions[0].start_time)
			}
		}else if(processData.trigger_name=="异常处理"){
			$('.targetProcessName').val(processData.target_process_name)
//			if(processData.trigger_conditions.length>0){
//				$.showEventBoxData(processData)
//			}
		}
		$('#triggerType').changeTriggerTypeAction(processData.trigger_name);
		$.addProcessBox=layer.open({
			type: 1,
			title: titleMsg,
			shadeClose: false,
			shade: 0.8,
			area: ['680px'],
			content: $('.addProcess') //iframe的url
		})
	},
	isRemind:function(){
		$('.remindBtn span').each(function(){
			$(this).click(function(){
				$(this).remindBtnStatus()
			})
		})
	}
	,
	showEventBoxData:function(processData){
			var thing_name=processData.trigger_conditions[0].thing_name;
				var compare_thing_name=processData.trigger_conditions[0].compare_thing_name;
				$('.eventBox').find('.conditionThing').val(thing_name);
				$('.eventBox').find('.conditionThingList').attr('thing_id',processData.trigger_conditions[0].thing_id);
				$('.eventBox').find('.conditionThingList').getConditionTagList();
				$('.eventBox').find('.conditionTag').val(processData.trigger_conditions[0].data_id);
				$('.eventBox').find('.compareOper').val(processData.trigger_conditions[0].compare_oper);
				$('.eventBox').find('.compareThing').val(compare_thing_name);
				$('.eventBox').find('.compareThingList').attr('thing_id',processData.trigger_conditions[0].compare_thing_id)
				$('.eventBox').find('.compareThingList').getConditionTagList();
				$('.eventBox').find('.compareTag').val(processData.trigger_conditions[0].compare_data_id)
				for(var i=1;i<processData.trigger_conditions.length;i++){
					$('.addConditionBtn').click();
					var thing_name=processData.trigger_conditions[i].thing_name;
					$('.addEventBox').eq(i-1).find('.conditionThing').val(thing_name);
					$('.addEventBox').eq(i-1).find('.conditionThingList').attr('thing_id',processData.trigger_conditions[i].thing_id);
					$('.addEventBox').eq(i-1).find('.conditionThingList').getConditionTagList();
					$('.addEventBox').eq(i-1).find('.conditionTag').val(processData.trigger_conditions[i].data_id);
					$('.addEventBox').eq(i-1).find('.compareOper').val(processData.trigger_conditions[i].compare_oper);
					$('.addEventBox').eq(i-1).find('.compareThing').val(compare_thing_name);
					$('.addEventBox').eq(i-1).find('.compareThingList').attr('thing_id',processData.trigger_conditions[i].compare_thing_id)
					$('.addEventBox').eq(i-1).find('.compareThingList').getConditionTagList();
					$('.addEventBox').eq(i-1).find('.compareTag').val(processData.trigger_conditions[i].compare_data_id)
				}
	},
	addRule:function(){	//点击添加动作时弹窗
		$(".addRule").click(function(){
			$.taskData.ruleBox.action='';
			$.taskData.ruleBox.action_times=1;
			$.taskData.ruleBox.compare_oper='gt';
			$.taskData.ruleBox.compare_value='';
			$.taskData.ruleBox.data_id='';
			$.taskData.ruleBox.data_name='';
			$.taskData.ruleBox.mission_id='';
			$.taskData.ruleBox.mission_name='';
			$.taskData.ruleBox.target_data_id='';
			$.taskData.ruleBox.target_data_name='';
			$.taskData.ruleBox.target_thing_id='';
			$.taskData.ruleBox.target_thing_name='';
			$.taskData.ruleBox.thing_id='';
			$.taskData.ruleBox.thing_name='';
			$.taskData.ruleBox.trigger_type='58ef46b543929a10708f2b08';
			var titleMsg='添加新的任务';
			$('#conditionTag').empty();
			$('#controlTag').empty();
			$('.portAction').empty();
			$(this).openAddRuleBox($.taskData.ruleBox,titleMsg);
		});
	},
	selectTriggerType:function(){		//选择触发类型
		$("#triggerType").change(function(){
			$(this).changeTriggerType();
		});
	},
	dragMission:function(){
		$('.ruleMain').dragMissionFn(function(index) {
			if(index.oldIndex!=index.newIndex){
				$.changeOrder($.taskData.ruleIndexBox,index,$.saveMissionIndex)
			}
		});
	},
	changeOrder:function(ruleDatas,index,callBack){
		var thisData=ruleDatas[index.oldIndex];
		if(index.oldIndex>index.newIndex){
			ruleDatas.splice(index.newIndex,0,thisData);
			ruleDatas.splice(index.oldIndex+1, 1);
		}else{
			ruleDatas.splice(index.newIndex+1,0,thisData);
			ruleDatas.splice(index.oldIndex, 1);
		}
		callBack && callBack(ruleDatas);
	},
	saveMissionIndex:function(arr){
		for(var i=0;i<arr.length;i++){
			var thisData=arr[i];
			delete thisData.target_thing_name;
			delete thisData.target_data_name;
			delete thisData.action_str;
			thisData.index=i+1;
			$.sendChanged(thisData,thisData._id)
		}
		
	},
	sendChanged:function(data,missionId){
		var sendeData={data:JSON.stringify(data)}
		$.ajax({
			type:'put',
			url:globalurl+"/v1/missions?access_token="+$.taskData.access_token+'&mission_id='+missionId,
			dataType:'JSON',
			data:sendeData,
			async:true,
			success:function(data){
			}
		})
	},
	setConditionThing:function(){		//任务列表的绑定事件
		$("#controlTag").change(function(){
			$.taskData.selectControlTag=$(this).val();
			var thisId=$(this).val();
			if($(this).val()!=0&&$(this).val()!=''){
				if(($.taskData.controlTagList[thisId].low_battery==undefined)||($.taskData.controlTagList[thisId].low_battery=='')||($.taskData.controlTagList[thisId].low_battery=='-')){
					$('.ioAction').show();
					if($.taskData.ruleBox.target_data_id!=''){
						$('#inputAction').val($.taskData.ruleBox.action);
					}
					$('.selectAction').hide();
					$('.selectAction').addCustomAttr();
					$('.ioAction').removeCustomAttr();
				}else{
					$('.portAction').empty();
					
					$('.selectAction').show();
						$('.portAction').append('<option value=0>'+$.taskData.controlTagList[thisId].low_battery+'</option>');
						$('.portAction').append('<option value=1>'+$.taskData.controlTagList[thisId].high_battery+'</option>');
						if($.taskData.ruleBox.target_data_id!=''){
							$('.portAction').val($.taskData.ruleBox.action);
						}
					$('.ioAction').hide();
					$('.ioAction').addCustomAttr();
					$('.selectAction').removeCustomAttr();
				}
			}
		});
		$('.addConditionBtn ').click(function(){
			$(this).addCondition();
		});
		$("#controlThing").keyup(function(){	//实体名称输入框keyUp
			$.taskData.selectControlThing=0;
			$.taskData.ruleBox.target_data_id='';
			$(this).getThing();
		});
		
		$(".technologyName").hover(function(){
			$(this).showTools();
		},function(){
			$(this).hideTools();
		});
		$('.toolsDelete').click(function(){
			$(this).deleteTechnology();
		})
	},
	saveProcess:function(){
		$('.saveProcessBtn').click(function(){
			$('.addProcessContent input').each(function(){
				if($(this).attr("isCheck")!="false"){
					var overEach=$(this).formCheckFoo();
					if(overEach==false){
						return false;
					}
				}
			});
			if($.taskData.inputCheck){
				if($('#isOr').val()==null||$('#isOr').val()==undefined){
					layer.tips('请选择条件关系！',$('#isOr'),{tips: [1,'#FE777A']})
					$.taskData.inputCheck=false
				}
			}
			if($.taskData.inputCheck){
				$(this).saveProcessData();
			}
		});
	},
	conditionBox:function(){
		$(".conditionThing").keyup(function(){
			$.taskData.selectEventThing=0;
			$(this).getThing();
		});
		
		$(".conditionThing").blur(function(){
			if($.taskData.selectEventThing!=0&&$(this).val()==""){
				$(this).next().empty();
				$(this).next().hide();
			}
		});
		
		$(".conditionTag").change(function(){
			$.taskData.selectEventTag=$(this).val();
		});
		
		$("ul").delegate("li","click",function(){
			$(this).changeConditionThing();
		});
		
		$('.startTime').focus(function(){
			$(this).timeBox().showBox()
		})
		
		$('.saveTime').click(function(){
			$('.timeBox input').each(function(){
				if($(this).attr("isCheck")!="false"){
					var overEach=$(this).formCheckFoo();
					if(overEach==false){
						return false;
					}
				}
			})
			
			if($.taskData.inputCheck){
				$(this).saveTime()
			}
		})
		
		$(".compareThing").keyup(function(){
			$.taskData.selectEventThing=0;
			$(this).getThing();
		});
		
		$(".compareThing").blur(function(){
			if($.taskData.selectEventThing!=0&&$(this).val()==""){
				$(this).next().empty();
				$(this).next().hide();
			}
		});
		$(".compareTag").change(function(){
			$.taskData.selectEventTag=$(this).val();
		});
		
		$('.chioceCycle').change(function(){
			$(this).showWeek()
		})
		
		$("#compareOper").change(function(){
			$.taskData.compare_oper=$(this).val();
		});
		$('.closeBox').click(function(){
			$(this).parent().parent().remove();
			$('.layui-layer-content').css('height','inherit');
		});
		
		$(".targetProcessName").keyup(function(){
			$.taskData.selectEventProcess=0;
			$(this).getTargetProcess();
		});
		
		$(".targetProcessName").blur(function(){
			if($.taskData.selectEventProcess!=0&&$(this).val()==""){
				$(this).next().empty();
				$(this).next().hide();
			}
		});
		$("ul").delegate("li","click",function(){
			$(this).changeConditionProcess();
		});
		
		$('[data-toggle="tooltip"]').tooltip();
	},
	saveRule:function(){		//点击保存规则
		$(".saveRuleBtn").click(function(){
			$('.addRuleBox input').each(function(){
				if($(this).attr("isCheck")!="false"){
					var overEach=$(this).formCheckFoo();
					if(overEach==false){
						return false;
					}
				}
			})
	if($.taskData.inputCheck){
				var sendeData={};
				sendeData.mission_name=$('#ruleName').val();
				sendeData.process_id=$.taskData.selectTaskId;
				sendeData.target_data_id=parseInt($.taskData.selectControlTag)+'';
				sendeData.target_thing_id=$.taskData.selectControlThing;
				if($('.ioAction').css('display')!='block'){
					sendeData.action=$('.portAction').val();
				}else{
					sendeData.action=$('#inputAction').val();
				}
				sendeData.wait_time=$('#waitTime').val();
				
				var sendType;
				if($.taskData.ruleBox.mission_id==''){
					sendType='post';
					sendeData.index=$.taskData.ruleIndexBox.length+1;
					sendeData={data:JSON.stringify(sendeData)};
				}else{
					sendType='put';
					sendeData={data:JSON.stringify(sendeData),mission_id:$.taskData.ruleBox.mission_id};
				}
				$.ajax({
					type:sendType,
					url:globalurl+"/v1/missions?access_token="+$.taskData.access_token,
					dataType:'JSON',
					data:sendeData,
					success:function(data){
						if(data.code==200){
							$.taskData.processDom.showStepLine()
							layer.msg(data.success,{icon:1})
							layer.close($.lyAddRuleBox);
						}else if(data.code==400003){
							layer.close($.layerConfirm)
							layer.msg(data.error,{
								icon:2,
							})
							layer.close($.lyAddRuleBox);
							$.taskData.processDom.showStepLine()
						}else{
							layer.msg(data.error,{icon:2})
						}
					}
				})
			}
		})
	}
});
$.init();