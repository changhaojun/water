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
		missionTools:'<span class="missionTools tools"><span class="fa fa-wrench missionToolsEdit" data-toggle="tooltip" data-placement="top" title="修改"></span><span class="fa fa-trash-o missionToolsDelete" data-toggle="tooltip" data-placement="top" title="删除"></span></span>'
	},
	selectTaskId:'',		//点击工艺后获取该工艺的ID
	stepNum:'1',			//工艺名称上自增的数字
	selectEventThing:'',	//选择事件触发的实体
	selectEventTag:'',		//选择事件触发的端口
	compare_oper:'gt',		//比较符初始化
	compare_value:'',		//基准值
	trigger_type:'',		//事件类型
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
		thing_id:'',
		thing_name:'',
		data_id:'',
		data_name:'',
		compare_oper:'gt',
		compare_value:'',
		target_thing_id:'',
		target_thing_name:'',
		target_data_id:'',
		target_data_name:'',
		action:'',
		action_times:''
	}
};

$.fn.extend({
	addTechnology:function(){	//添加工艺
		var This = $(this);
		$.taskData.isEditTechnology=false
		$.layerConfirm=layer.confirm($.taskData.domString.layerInput, {
				title:"添加工艺",
			  	btn: ['保存'] //按钮
			},function(){
				$.taskData.process_name=$("#addTechnologyName").val();
				var isOk=This.saveTechnologyName($.taskData.isEditTechnology,$.taskData.process_name);
				if(isOk){
					layer.close($.layerConfirm);
					$(".technologyName:last").showStepLine();	//添加工艺后模拟点击
				}
			}
		);
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
		$(".ruleMain").getRuleList();
		return $(this);
	},
	getRuleList:function(){	//获取任务集合
		var This=$(this)
		This.empty();
		$.ajax({
			type:"GET",
			url:globalurl+"/v1/missions?access_token="+$.taskData.access_token,
			async:true,
			data:{
				filter:'{"process_id":"'+$.taskData.selectTaskId+'"}'
			},
			success:function(data){
				if(data.length>0){
					for(var i=0;i<data.length;i++){
						This.showMissionsDom(data[i]);
					}
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
		var compare_oper_str;
		var action_str;
		switch (thisMIssion.compare_oper){
			case 'gt':
				compare_oper_str='>'
				break;
			case 'lt':
				compare_oper_str='<'
				break;
			default:
				compare_oper_str='='
				break;
		}
		if(thisMIssion.action_str!=undefined){
			action_str=thisMIssion.action_str;
		}else{
			action_str=thisMIssion.action;
		}
		var missionBox=$($.taskData.domString.missionBox)
		$(this).append(missionBox);
		missionBox.attr('id',thisMIssion._id);
		missionBox.append('<div class="content1">'+thisMIssion.trigger_name+'</div>');
		if(thisMIssion.trigger_name=='事件触发'){
			missionBox.append('<div class="content2">'+thisMIssion.thing_name+'：'+thisMIssion.data_name+'</div>');
			missionBox.append('<div class="content3">'+compare_oper_str+thisMIssion.compare_value+'</div>');
		}else if(thisMIssion.trigger_name=='时间周期触发'){
			missionBox.append('<div class="content2"><span class="timeTitle">开始时间：</span>'+thisMIssion.start_time+'</div>');
			missionBox.append('<div class="content3"><span class="timeTitle">时间间隔：</span>'+thisMIssion.time_interval+'分钟</div>')	;
		}else{
			missionBox.append('<div class="content2">        </div>');
			missionBox.append('<div class="content3">        </div>');
		}
		missionBox.append('<div class="content4">'+thisMIssion.target_thing_name+'：'+thisMIssion.target_data_name+'  '+action_str+'</div>');
		missionBox.append('<div class="content5">执行'+thisMIssion.action_times+'次</div>');
		missionBox.append($($.taskData.domString.missionTools));
	},
	saveTechnologyName:function(isEdit,name,technologyId){		//保存工艺名称
		$('input').limitSpacing();		//输入框去除空格
		$('#addTechnologyName').formCheckFoo()
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
			var technologyName=$(this).parent().prev().prev().text()
			$.layerConfirm=layer.confirm('<input type="text" value='+technologyName+' id="addTechnologyName" placeholder="请输入工艺名称"/>', {
					title:"修改工艺名称",
			  		btn: ['保存'] //按钮
				},function(){
					$.taskData.process_name=$("#addTechnologyName").val();
					var isOk=This.saveTechnologyName($.taskData.isEditTechnology,$.taskData.process_name,technologyId);
					if(isOk){
						This.parent().prev().prev().html($("#addTechnologyName").val())
						layer.close($.layerConfirm);
					}
				}
			);
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
		$('#triggerType').val(ruleBoxData.trigger_type);
		$('#conditionThing').val(ruleBoxData.thing_name);
		$('#conditionTag').val(ruleBoxData.data_id);
		$('#compareOper').val(ruleBoxData.compare_oper);
		$('#compareValue').val(ruleBoxData.compare_value);
		$('#controlThing').val(ruleBoxData.target_thing_name);
		$('#controlTag').val(ruleBoxData.target_data_id);
		$('.actionTimes').val(ruleBoxData.action_times);
		$('#datetimepicker').val(ruleBoxData.start_time);
		$('#timeInterval').val(ruleBoxData.time_interval);
		$("#triggerType").changeTriggerType();
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
		$(".addRuleMain").show();
		if(selectType=="事件触发"){
			$(".eventBox").show();
			$('.timingBox').hide();
			$('.timingBox').addCustomAttr();
			$(".eventBox").removeCustomAttr();
			//$('.layui-layer-content').height('450px');
		}else if(selectType=="时间周期触发"){
			$('.timingBox').show();
			$(".eventBox").hide();
			$(".eventBox").addCustomAttr();
			$('.timingBox').removeCustomAttr();
		}else if(selectType=="人工触发"){
			$(".eventBox").hide();
			$('.timingBox').hide();
			$(".eventBox").addCustomAttr();
			$('.timingBox').addCustomAttr();
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
			if(parent.attr("id")=="conditionThingList"){
				$.taskData.selectEventThing=$(this).attr("value");
			}else if(parent.attr("id")=="controlThingList"){
				$.taskData.selectControlThing=$(this).attr("value");
			}
			if($(this).attr("value")!=0){
				$(this).getConditionTagList();
				parentInput.val($(this).text());
				parent.empty();
				parent.hide();
			}
		}
	},
	getConditionTagList:function(){		//选择实体后获取该实体下标签的列表
		var tagSelect;
		if($(this).is('UL')){
			tagSelect=$(this).parent().next().find("select");
		}else{
			tagSelect=$(this).parent().parent().next().find("select");
		}
		var thingId,operType;
		if(tagSelect.attr("id")=="conditionTag"){
			thingId=$.taskData.selectEventThing;
			operType=1;
		}else if(tagSelect.attr("id")=="controlTag"){
			thingId=$.taskData.selectControlThing;
			operType=2;
		}
		$.ajax({
			type:"get",
			url:globalurl+"/v1/missionDataTags?access_token="+$.taskData.access_token,
			async:false,
			data:{
				filter:'{"oper_type":'+operType+'}',
				thing_id:thingId
			},success:function(data){
				tagSelect.empty();
				if(data.length>0){
					for(var i=0;i<data.length;i++){
						tagSelect.append($('<option class="tagLi" value="'+data[i].data_id+'">'+data[i].data_name+'</option>'));
						if(tagSelect.attr("id")=="controlTag"){
							var thisId=data[i].data_id;
							$.taskData.controlTagList[thisId]=data[i];
						}
					}
					if(tagSelect.attr("id")=="conditionTag"){
						if($.taskData.ruleBox.data_id==''){
							$.taskData.selectEventTag=parseInt(data[0].data_id);
						}else{
							$.taskData.selectEventTag=$.taskData.ruleBox.data_id;
						}
					}else if(tagSelect.attr("id")=="controlTag"){
						if($.taskData.ruleBox.target_data_id==''){
							$.taskData.selectControlTag=parseInt(data[0].data_id);
							$("#controlTag").change();
						}else{
							$.taskData.selectControlTag=$.taskData.ruleBox.target_data_id;
							$("#controlTag").val($.taskData.selectControlTag);
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
				$.taskData.ruleBox.action_times=data.action_times;
				$.taskData.ruleBox.compare_oper=data.compare_oper;
				$.taskData.ruleBox.compare_value=data.compare_value;
				$.taskData.ruleBox.thing_id=data.thing_id;
				$.taskData.ruleBox.data_id=data.data_id;
				$.taskData.selectEventThing=data.thing_id;
				$('#conditionThingList').getConditionTagList();
				$.taskData.ruleBox.thing_name=data.thing_name;
				$.taskData.ruleBox.mission_name=data.mission_name;
				$.taskData.ruleBox.trigger_type=data.trigger_type;
				$.taskData.ruleBox.target_thing_id=data.target_thing_id;
				$.taskData.ruleBox.target_data_id=data.target_data_id;
				$.taskData.selectControlThing=data.target_thing_id;
				$.taskData.ruleBox.target_thing_name=data.target_thing_name;
				$.taskData.ruleBox.start_time=data.start_time;
				$.taskData.ruleBox.time_interval=data.time_interval;
				$('#controlThingList').getConditionTagList();
				$(this).openAddRuleBox($.taskData.ruleBox,titleMsg);
				$("#controlTag").change();
				$.taskData.ruleBox.mission_id=data._id;
				var titleMsg='修改任务';
				
			}
		});
		event.stopPropagation();
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
		$.clickTingLi();		//列表中选择实体
		$.changeCompareOper();	//变更比较符
		$.saveRule();		//保存规则
		$('input').limitSpacing();		//输入框去除空格
		$('input').filter('[num-limit=limit]').numOnly();		//数字限制输入
 		$('[data-toggle="tooltip"]').tooltip();
 		$('#datetimepicker').datetimepicker({
 			language:'zh-CN',
 			format: "yyyy-M-dd  hh:ii",
	        autoclose: true,
	        todayBtn: true,
	        pickerPosition: "bottom-left"
 		});
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
			technologyName.find(".technologyName-greenBorder").html(receiveData.process_name);
			$(".technologyName").hover(function(){
				$(this).showTools();
			},function(){
				$(this).hideTools();
			});
			$('[data-toggle="tooltip"]').tooltip();
			$(".toolsEdit").click(function(){	//修改工艺名称
				$(this).editTechnology();
			});
			$('.toolsDelete').click(function(){
				$(this).deleteTechnology();
			})
			$.taskData.stepNum++;		//step 数字自增
	},
	getProcess:function(){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/processes?access_token="+$.taskData.access_token,
			async:false,
			success:function(data){
				$.taskData.task=data.rows;
				for(var i=0;i<$.taskData.task.length;i++){
					$.creatStepBox($.taskData.task[i]);
				}
				$(".technologyName").eq(0).showStepLine();	//页面初始化时模拟点击第一个工艺
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
		})
	},
	selectTriggerType:function(){		//选择触发类型
		$("#triggerType").change(function(){
			$(this).changeTriggerType();
		})
	},
	setConditionThing:function(){		//设置实体
		$("#conditionThing").keyup(function(){
			$.taskData.selectEventThing=0;
			$(this).getThing();
		});
		
		$("#conditionThing").blur(function(){
			if($.taskData.selectEventThing!=0&&$(this).val()==""){
				$("#conditionThingList").empty();
				$("#conditionThingList").hide();
			}
		});
		
		$("#conditionTag").change(function(){
			$.taskData.selectEventTag=$(this).val();
		});
		
		$("#controlTag").change(function(){
			$.taskData.selectControlTag=$(this).val();
			var thisId=$(this).val();
			if($(this).val()!=0&&$(this).val()!=''){
				if(($.taskData.controlTagList[thisId].low_battery==undefined)||($.taskData.controlTagList[thisId].low_battery=='')){
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
		
		$("#controlThing").keyup(function(){	//实体名称输入框keyUp
			$.taskData.selectControlThing=0;
			$.taskData.ruleBox.target_data_id=''
			$(this).getThing();
		});
		
		$(".technologyName").hover(function(){
			$(this).showTools();
		},function(){
			$(this).hideTools();
		});
		
		$(".toolsEdit").click(function(){	//修改工艺名称
			$(this).editTechnology();
		});
		$('.toolsDelete').click(function(){
			$(this).deleteTechnology();
		})
	},
	clickTingLi:function(){	//点击触发条件实体名
		$("ul").delegate("li","click",function(){
			$(this).changeConditionThing();
		});
	},
	changeCompareOper:function(){	//切换比较符
		$("#compareOper").change(function(){
			$.taskData.compare_oper=$(this).val();
		})
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
				sendeData.trigger_type=$.taskData.trigger_type;
				sendeData.process_id=$.taskData.selectTaskId;
				if($('.eventBox').css('display')=='block'){
					sendeData.thing_id=$.taskData.selectEventThing;
					sendeData.data_id=parseInt($.taskData.selectEventTag)+'';
					sendeData.compare_oper=$.taskData.compare_oper;
					sendeData.compare_value=parseInt($('#compareValue').val())+'';
				}
				if($('.timingBox').css('display')=='block'){
					sendeData.start_time=$("#datetimepicker").val();
					sendeData.time_interval=$("#timeInterval").val();
				}
				sendeData.target_data_id=parseInt($.taskData.selectControlTag)+'';
				sendeData.target_thing_id=$.taskData.selectControlThing;
				if($('.ioAction').css('display')!='block'){
					sendeData.action=$('.portAction').val();
				}else{
					sendeData.action=$('#inputAction').val();
				}
				sendeData.action_times=$('.actionTimes').val();
				
				var sendType;
				if($.taskData.ruleBox.mission_id==''){
					sendType='post';
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
						}
					}
				})
			}
		})
	}
});
$.init();

