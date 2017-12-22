var vue = new Vue({
	el:'#task',
	data:{
		access_token:'', //令牌
		processList:[],	//工艺列表
		cycles:{			//定期触发的两种周期
			everyDay:'每日',
			everyWeek :'每周'
		},
		weekList:['周日','周一','周二','周三','周四','周五','周六'],		//星期的范围   渲染使用
		comparison:{		//比较符   渲染使用
			gt:'>',
			lt:'<',
			eq:'='
		},
		process:{			//工艺对象,页面渲染使用
			company_id:$("#companyId").val(),
			process_name:'',
			trigger_type:'',
			action_times:1,
			is_or:0,
			trigger_conditions:[],
			status:1,
			is_remind:'0',
		},
		newProcess:{						//工艺对象,初始化数据使用
			company_id:$("#companyId").val(),
			process_name:'',
			trigger_type:'',
			action_times:1,
			trigger_conditions:[],
			is_or:0,
			status:1,
			is_remind:'0',
		},
		timing:{							//定时触发
			cycle:'everyDay',				//定期触发的周期
			cycle_week:'0',
			start_time:{
				hour:'',
				minute:''
			}
		},
		cycle:{		//时间周期触发
			start_time:'',
			cycle_time:''
		},
		trigger_conditions:[    			//触发条件,前端页面渲染
			{		
				data_id:0,
				thing_id:'',
				thing_name:'',
				dataList:[
					{
						data_id:0,
						data_name:'选择完实体后加载数据。。。'
					}
				],
				compare_oper:'lt',
				compare_data_id:0,
				compare_thing_id:'',
				compare_thing_name:'',
				compareDataList:[
					{
						data_id:0,
						data_name:'选择完实体后加载数据。。。'
					}
				]
			}
		],	//触发条件数组
		condition:{		//触发条件，初始化用
			data_id:0,
			thing_id:'',
			thing_name:'',
			dataList:[
				{
					data_id:0,
					data_name:'选择完实体后加载数据。。。'
				}
			],
			compare_oper:'lt',
			compare_data_id:0,
			compare_thing_id:'',
			compare_thing_name:'',
			compareDataList:[]
		},
		selectTriggerName:'人工触发',			//选择的触发类型的名称,只做渲染
	triggerTypeList:[],						//触发条件的列表
		targetProcessName:'',      		    //异常处理时渲染的工艺名称，不提交
		allThingList:[],					//全部的实体列表
		processEdit:false,					//新增工艺or修改工艺
		missionList:[],						//获取到的任务列表
		mission:{
			mission_name:'',
			target_thing_id:'',
			target_data_id:0,
			wait_time:0,
			action:0,
			index:1
		},
		newMission:{						//新任务数据的初始化
			mission_name:'',
			target_thing_id:'',
			target_data_id:0,
			wait_time:0,
			action:0,
			index:1
		},
		missionThingName:'',				//任务选择的实体名称  只做渲染
		controlData:{},						//选定的控制端口，只渲染
		controlDataList:[
			{
				data_id:0,
				data_name:'选择完实体后加载数据。。。'
			}
		],			//需要控制的端口列表，只渲染
		currentProcessIndex:'',		//临时存放工艺的下标
		drag:false,
		isAdopt:true			//必填字段的验证
	},
	methods:{
		getProcessList:function(){						//获取工艺列表
			var loading=new Finfosoft.Loading({
				shade:['0.7','#ffffff'],
		        color:'#000000',
		        msg:'正在获取工艺列表，请稍后。。。',
			})
			axios.get(globalurl+"/v1/processes?access_token="+this.access_token, {
				params: {
					filter:'{"company_id":"'+$("#companyId").val()+'"}'
					}
			}).then(response => {
				loading.closeLoading();
					this.formatProcessData(response.data.rows)
				}).catch(function (error) {
					console.log(error);
				});
			},
		formatProcessData:function(processList){		//针对定期触发的工艺做时间周期的汉字映射，用于页面渲染
			for(var i = 0; i < processList.length; i++){
				if(processList[i].trigger_name=='定时触发'){
					var conditions = processList[i].trigger_conditions[0];	//触发条件，定期触发只有一条
					conditions.cycle_str = this.cycles[conditions.cycle];
					if(conditions.cycle == 'everyWeek'){
						conditions.cycle_str += ('    '+this.weekList[conditions.cycle_week]);
					}
				}else if(processList[i].trigger_name=='事件触发' || processList[i].trigger_name=='异常处理'){
					var conditions = processList[i].trigger_conditions;
					for(var j = 0; j < conditions.length; j++){
						conditions[j].compare_oper_str = this.comparison[conditions[j].compare_oper];
					}
				}
			}
			this.processList = processList
			this.getMission(0)
		},
		shrinkConditions:function(index,evetn){			//工艺列表内触发条件框的收缩
			event.stopPropagation();
			var processBox = document.getElementsByClassName('processBox')[index];
			var dl = processBox.getElementsByTagName('dl')[0];
			var parentWidth = dl.parentNode.offsetWidth;
			dl.style.width = parentWidth+'px'
			var spanClassLsit = dl.getElementsByTagName('span')[0].classList;
			if(spanClassLsit[2] == 'fa-caret-down'){
				spanClassLsit.remove('fa-caret-down')
				spanClassLsit.add('fa-caret-up')
				dl.classList.add('showDlPlane');
			}else{
				spanClassLsit.remove('fa-caret-up')
				spanClassLsit.add('fa-caret-down')
				dl.classList.remove('showDlPlane');
			}
		},
		addProcess:function(){							//新增工艺
			/**新增工艺数据初始化**/
			this.process = JSON.parse(JSON.stringify(this.newProcess));
			this.selectTriggerName='人工触发';
			this.process.trigger_type = this.triggerTypeList[2]._id;
			this.timing = {					//定时触发
					cycle:'everyDay',		//定期触发的周期
					cycle_week:'0',
					start_time:{
						hour:'',
						minute:''
					}
			}
			this.cycle={		//时间周期触发
					start_time:'',
					cycle_time:''
			}
			this.processEdit = false;
			this.showProcessBox('新增工艺');
			console.log(this.process)
		},
		editProcess:function(index,event){					//修改工艺
			var divList = event.path;
			var processBox ;
			for(var i = 0; i< divList.length; i++){
				if(divList[i].classList){
					if(divList[i].classList[0] == 'processBox'){
						processBox = divList[i]
					}
				}
			}
			if(processBox.offsetHeight != 55){
				event.stopPropagation();
			}
			
			this.process = this.processList[index];
			this.selectTriggerName = this.process.trigger_name
			var conditions = this.process.trigger_conditions;
			if(conditions.length>0){
				this.trigger_conditions = conditions;
				this.getDataList(null,'dataList',0,conditions);
			}
			this.processEdit = true;
			this.showProcessBox('修改工艺');
		},
		showProcessBox:function(messag){
			layer.open({
				type: 1,
				title: messag,
				shadeClose: false,
				shade: [0.7,'#ffffff'],
				area: '680px',
				content: $('.addProcess') //iframe的url
			})
		},
		getTriggerType:function(){						//获取触发类型列表
			axios.get(globalurl+"/v1/triggerTypes?access_token="+this.access_token)
				.then(response => {
					if(response.data.length>0){
						this.triggerTypeList = response.data;
						this.process.trigger_type = this.triggerTypeList[2]._id;	//触发类型默认值
						this.selectTriggerName = this.triggerTypeList[2].trigger_name	
					}
				})
				.catch(function (error) {
						console.log(error);
				});
		},
		getTriggerName:function(){						//切换触发类型时获取类型的名称
			var triggers = this.triggerTypeList;
			for(var i=0; i<triggers.length; i++){
				var triggerId = triggers[i]._id;
				if(triggerId == this.process.trigger_type){
					this.selectTriggerName = triggers[i].trigger_name;
				}
			}
		},
		getTargetProcess:function(event){				//获取需要异常处理关联的工艺
			if(event.keyCode==13){
				var processList = this.processList
				var targetProcessList = [];
				var searchName = this.targetProcessName
				for(var i = 0;i < processList.length;i++){
					if(processList[i].process_name.indexOf(searchName)>-1){
						targetProcessList.push(processList[i])
					}
				}
				var thingUl = document.getElementById("thingList");
//				var thingUl = document.getElementById("targetThingList");
				if(thingUl.getElementsByTagName('div')[0]){
					thingUl.removeChild(thingUl.getElementsByTagName('div')[0])
				}
				var thisInput = event.target;
				/*  渲染实体列表 */
				new Finfosoft.Selecter({
					el : "#thingList",                              
					initVal : [targetProcessList,'process_name'],
					layoutCount : 5,
					textIndent : 30,
					itemHeight : 30,
					optionBg : "#ffe1b6",
					barBg:"#ee712b",
					dragBg:"#8e3343",
					unfload : true,                              
					onChanged: function(index) {
						vue.targetProcessName = processList[index].process_name;
						vue.process.target_process_id = processList[index]._id
					}
				})
				var inputTop = thisInput.offsetTop;
				var inputLeft = thisInput.offsetLeft;
				thingUl.style.top = inputTop+34+'px';
				thingUl.style.left = inputLeft+'px';
			}
		},
		addCondition:function(){						//增加工艺的触发条件
			var condition = JSON.parse(JSON.stringify(this.condition));
			this.trigger_conditions.push(condition);
		},
		deleteCondition:function(index){				//删除触发条件
			this.trigger_conditions.splice(index,1);
		},
		getThing:function(){							//获取该公司下所有的实体
			axios.get(globalurl+"/v1/things?access_token="+this.access_token, {
				params: {
					filter:'{"company_id":"'+$("#companyId").val()+'"}'
					}
			})
			.then(response =>{
				this.allThingList = response.data.rows;
			})
			.catch(error =>{
				console.log(error)
			})
		},
		searchThing:function(conditionIndex,event){		//通过模糊查询过滤实体列表
			if(event.keyCode==13){						//回车键触发搜索
				var thingUl,elDiv;
				if(conditionIndex !=null){
					thingUl = document.getElementById("thingList");
					elDiv = '#thingList'
				}else{
					thingUl = document.getElementById("controlThingList");
					elDiv = '#controlThingList'
				}
				if(thingUl.getElementsByTagName('div')[0]){
					thingUl.removeChild(thingUl.getElementsByTagName('div')[0])
				}
				var thisInput = event.target;
				var thingList = this.allThingList;
				var showThingList=[];
				for(var i = 0; i < thingList.length; i++){
					if(thingList[i].thing_name.indexOf(thisInput.value)>-1){
						showThingList.push(thingList[i])
					}
				}
				var type = thisInput.getAttribute('keyName');
				
				/* 获取当前input对应的数据标签的下拉框*/
				var dataSelect = thisInput.parentNode.nextElementSibling.getElementsByTagName('select')[0];
				var dataType = dataSelect.getAttribute('keyName');
				
				/*  渲染实体列表 */
				new Finfosoft.Selecter({
					el : elDiv,                              
					initVal : [showThingList,'thing_name'],
					layoutCount : 5,
					textIndent : 30,
					itemHeight : 30,
					optionBg : "#ffe1b6",
					barBg:"#ee712b",
					dragBg:"#8e3343",
					unfload : true,                              
					onChanged: function(index) {
						var thingId = showThingList[index]._id;
						if(type == 'thing_name'){
							vue.trigger_conditions[conditionIndex].thing_name = showThingList[index].thing_name;
							vue.trigger_conditions[conditionIndex].thing_id = thingId;
						}else if(type =='compare_thing_name'){
							vue.trigger_conditions[conditionIndex].compare_thing_name = showThingList[index].thing_name;
							vue.trigger_conditions[conditionIndex].compare_thing_id = thingId;	
						}else if(type =='target_thing_name'){
							vue.missionThingName = showThingList[index].thing_name;
							vue.mission.target_thing_id = thingId;
						}
						vue.getDataList(thingId,dataType,conditionIndex,null)
					}
				})
				
				var inputTop = thisInput.offsetTop;
				var inputLeft = thisInput.offsetLeft;
				thingUl.style.top = inputTop+34+'px';
				thingUl.style.left = inputLeft+'px';
			}
		},
		/**
		 * 
		 * @param {String} thingId:获取端口列表的实体ID
		 * @param {String} type:类型,工艺事件触发的采集端口(dataList),工艺事件触发的比较端口(compareDataList),任务配置的下发端口(targetDataList)
		 * @param {int} index 工艺配置中触发条件数组的下标 (任务配置中传null)
		 * @param {Object} conditions 工艺配置中触发条件数组 (只有编辑工艺时才传，其他传null)
		 */
		getDataList:function(thingId,type,index,conditions){	//选择实体后获取该实体下的标签列表
			var sendFilter;
			if(type !='targetDataList'){	//工艺的触发条件，只需要采集端口
				operType="['AI','DI','CD','MO']";
				sendFilter='{"port_type":'+operType+'}'
			}else{
				operType="['AO','DO']";		//任务配置的端口，只需要下发端口
				sendFilter='{"port_type":'+operType+'}'
			}
			
			if(thingId==null){			//thingId为空时为工艺编辑状态
				if(type == 'dataList'){
					thingId = conditions[index].thing_id;
				}else if(type == 'compareDataList'){
					thingId = conditions[index].compare_thing_id;
				}
			}
			axios.get(globalurl+"/v1/missionDataTags?access_token="+this.access_token+"&thing_id="+thingId, 				{
					params: {
						filter:sendFilter
					}
				})
				.then(response =>{
					if(type !='targetDataList'){	//配置工艺时
						vue.$set(this.trigger_conditions[index],type,response.data)
						if(conditions){
							if(type=='dataList'){	//工艺触发条件的第一个采集端口
								type = 'compareDataList';
								index = index ;
							}else if(type=='compareDataList'){	//工艺触发条件的对比端口
								type = 'dataList';
								index = index +1;
							}
							if(index < conditions.length){		//当为编辑状态，使用递归获取所有端口列表
								this.getDataList(null,type,index,conditions);
							}
						}
					}else{					//任务配置时
						vue.controlDataList = response.data
					}
				})
				.catch(error =>{
					console.log(error)
				})
		},
		chioceTargetData:function(){
			for(var i = 0; i<this.controlDataList.length;i++){
				if(this.controlDataList[i].data_id == this.mission.target_data_id){
					this.controlData = this.controlDataList[i];
				}
			}
			
		},
		remindBtn:function(ev){							//异常提醒按钮的点击事件
			var ev = ev || window.event;
		    var target = ev.target || ev.srcElement;
		    //alert(target.innerHTML);
		    if(target.nodeName.toLowerCase() == "span"){
		    	var value = target.getAttribute('value');
		    	this.process.is_remind = value;
		    	target.classList.add('greenBtn');
		    	if(target.nextSibling){
		    		target.nextElementSibling.setAttribute('class','');
		    	}else{
		    		target.previousElementSibling.setAttribute('class','');
		    	}
		    }
		},
		correctProcessData:function(){					//点击保存工艺后整合数据
			var parentNode = document.querySelector('.addProcess');
			this.provingMust(parentNode);
			if(this.isAdopt){
				var type = this.selectTriggerName;
				var process = this.process
				switch (type){	 //不同的触发类型会有不同的字段
					case '事件触发':
						if(process.target_process_id == '') {
							delete process.target_process_id
						}
						var conditions = this.trigger_conditions;
						for(var i = 0; i < conditions.length; i++){
							delete conditions[i].compareDataList
							delete conditions[i].dataList
							delete conditions[i].thing_name
							delete conditions[i].compare_thing_name
						}
						process.trigger_conditions = conditions;
						break;
					case '异常处理':
						if(process.is_or != undefined){
							delete process.is_or
						}
						break;
					case '时间周期触发':
						if(process.is_or != undefined){
							delete process.is_or
						}
						if(process.target_process_id == '') {
							delete process.target_process_id
						}
						var cycle = {};
						cycle.begin_time = this.cycle.start_time;
						cycle.cycle_time = this.cycle.cycle_time;
						process.trigger_conditions = [];
						process.trigger_conditions.push(cycle);
						break;
					case '人工触发':
						if(process.is_or != undefined){
							delete process.is_or
						}
						if(process.target_process_id == '') {
							delete process.target_process_id
						}
						break;
					case '定时触发':
						if(process.is_or != undefined){
							delete process.is_or
						}
						if(process.target_process_id == '') {
							delete process.target_process_id
						}
						var timing = {}
						timing.cycle = this.timing.cycle;
						if(timing.cycle == 'everyWeek'){
							timing.cycle_week = his.timing.cycle_week;
						}
						var start_time = this.timing.start_time.hour+':'+this.timing.start_time.minute
						timing.start_time = start_time
						process.trigger_conditions = [];
						process.trigger_conditions.push(timing)
						break;
				}
				this.saveProcess(process);
			}
		},
		saveProcess:function(process){			//保存工艺，发送请求
			var params = new URLSearchParams();
			params.append("data",JSON.stringify(process))

			var httpType;
			if(this.processEdit !=true){
				httpType = 'post'
			}else{
				var processId = process._id;
				httpType = 'put';
				params.append("process_id",processId)
				delete process._id
			}
			var loading=new Finfosoft.Loading({
				shade:['0.7','#ffffff'],
		        color:'#000000',
		        msg:'正在保存工艺，请稍后。。。',
			})
			axios({
			    method: httpType,
			    url: globalurl+"/v1/processes?access_token="+this.access_token,
			    data: params
			})
			.then(response =>{
				if(response.data.code == 200){
					loading.closeLoading();
					layer.msg(response.data.success,{
						icon:1,
						time:2000,
						end:function(){
							layer.closeAll();
						}
					})
					if(!this.processEdit){
						process._id = response.data.process_id; 
						process.trigger_name = this.selectTriggerName;
						this.processList.push(process);
						var index = this.processList.length - 1;
						this.getMission(index);
					}
				}
			})
			.catch(error =>{
				console.log(error)
			})
		},
		deleteProcess:function(index,event){			//删除工艺
			event.stopPropagation();
			var processId = this.processList[index]._id
	        this.$confirm('确定是否删除该工艺?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).then(() => {
	        	var loading=new Finfosoft.Loading({
					shade:['0.7','#ffffff'],
			        color:'#000000',
			        msg:'正在删除工艺，请稍后。。。',
				})
				axios.delete(globalurl+"/v1/processes?access_token="+this.access_token+"&process_id="+processId)
				.then(response =>{
					loading.closeLoading();
					if(response.data.code ==200){
						layer.msg(response.data.success,{
							icon:1
						})
						this.processList.splice(index,1)
					}
				})
	        }).catch(() => {
	                    
	        });
		},
		getMission:function(index,event){				//获取任务列表
			this.missionList = [];
			var loading=new Finfosoft.Loading({
					shade:['0.7','#ffffff'],
			        color:'#000000',
			        msg:'正在获取任务列表，请稍后。。。',
				})
			return axios.get(globalurl+"/v1/missions?access_token="+this.access_token,{
				params:{
					filter:'{"process_id":"'+this.processList[index]._id+'"}',
					sorts:'{"index":"asc"}'
				}
			})
			.then(response => {
				loading.closeLoading();
				if(response.data.rows.length>0){
					this.missionList = response.data.rows;
				}else{
					
				}
				var processListDom = document.querySelectorAll('.processBox');
				for(var i = 0; i< processListDom.length;i++){
					processListDom[i].style.height = '55px';
				}
				if(event){
					var divList = event.path;
					for(var i = 0; i< divList.length; i++){
						if(divList[i].classList){
							if(divList[i].classList[0] == 'processBox'){
								divList[i].style.height = "auto";
							}
						}
					}
				}else{
					processListDom[index].style.height = 'auto';
				}
			})
			.catch(error =>{
				console.log(error)
			});
		},
		addMission:function(index,event){							//添加任务
			var divList = event.path;
			var processBox;
			for(var i = 0; i< divList.length; i++){
				if(divList[i].classList){
					if(divList[i].classList[0] == 'processBox'){
						processBox = divList[i]
					}
				}
			}
			if(processBox.offsetHeight != 55){
				event.stopPropagation();
			}
			this.currentProcessIndex = index;
			this.mission = JSON.parse(JSON.stringify(this.newMission));
			this.missionThingName = '';
			this.controlDataList = [{
				data_id:0,
				data_name:'选择完实体后加载数据。。。'
			}];
			var msg = '新增任务';
			this.openMissionBox(msg);
		},
		editMission:function(index){					//修改任务
			var msg = '修改任务';
			this.mission = this.missionList[index];
			this.missionThingName = this.mission.target_thing_name;
			this.getDataList(this.mission.target_thing_id,'targetDataList',null,null);
			this.openMissionBox(msg);
		},
		openMissionBox:function(message){						//开打任务配置的弹窗
			layer.open({
				type: 1,
				title: '新增任务',
				shadeClose: false,
				shade: [0.7,'#ffffff'],
				area: '680px',
				content: $('.addMission') //iframe的url
			})
		},
		provingMust:function(parentNode){
			this.isAdopt = true;
			var provings = parentNode.querySelectorAll('.must');
			for(var i=0;i<provings.length;i++){
				var msg = provings[i].getAttribute('tipMsg');
				if(provings[i].tagName =='DIV'){
					proving= provings[i].getElementsByTagName('input')[0];
					if(proving.value == ''){
						this.isAdopt = false;
						proving.focus();
						layer.tips(msg,proving,{tips: [1,'#FE777A']})
						break;
					}
				}
				
				if(provings[i].tagName =='INPUT'){
					console.log(provings[i].value)
					if(provings[i].value == '' || provings[i].value == undefined){
						this.isAdopt = false;
						provings[i].focus();
						layer.tips(msg,provings[i],{tips: [1,'#FE777A']})
						break;
					}
				}else if(provings[i].tagName == 'SELECT'){
					if(provings[i].value == 0){
						this.isAdopt = false;
						provings[i].focus();
						layer.tips(msg,provings[i],{tips: [1,'#FE777A']})
						break;
					}
				}
			}
		},
		correctMissionData:function(){
			var parentNode = document.querySelector('.addMission');
			this.provingMust(parentNode);
			if(this.isAdopt){
				var httpType;
				var params = new URLSearchParams();
				if(this.mission._id){
					httpType='put';
					delete this.mission.target_data_name;
					delete this.mission.target_thing_name;
					delete this.mission.action_str;
					params.append('data',JSON.stringify(this.mission));
					params.append('mission_id',this.mission._id);
				}else{
					httpType = 'post';
					var missionIndex = this.missionList.length+1
					this.mission.index = missionIndex;
					this.mission.process_id = this.processList[this.currentProcessIndex]._id
	
					params.append("data",JSON.stringify(this.mission));
				}
				var loading=new Finfosoft.Loading({
						shade:['0.7','#ffffff'],
				        color:'#000000',
				        msg:'正在保存任务数据，请稍后。。。',
					})
				axios({
				    method: httpType,
				    url: globalurl+"/v1/missions?access_token="+this.access_token,
				    data: params
				})
				.then(response => {
					loading.closeLoading();
					if(response.data.code == 200){
						layer.msg(response.data.success,{
							icon:1,
							time:2000,
							end:function(){
								layer.closeAll();
							}
						})
						this.mission.target_thing_name = this.missionThingName
						this.mission.target_data_name = this.controlData.data_name
						if(this.controlData.port_type =='DO'){
							this.mission.action_str = (this.mission.action ==1?this.controlData.high_battery:this.controlData.low_battery);
						}
						if(httpType =='post'){
							this.mission._id = response.data._id
							this.missionList.push(this.mission)
						}else{
							var editIndex = this.mission.index - 1;
							vue.$set(this.missionList,editIndex,this.mission);
						}
					}else{
						layer.msg(response.data.error,{icon:2})
					}
				})
			}
		},
		deleteMission:function(index){					//删除任务
			var missionId = this.missionList[index]._id
			this.$confirm('确定是否删除该任务?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(() => {
	        	var loading=new Finfosoft.Loading({
					shade:['0.7','#ffffff'],
			        color:'#000000',
			        msg:'正在删除任务，请稍后。。。',
				})
				axios.delete(globalurl+"/v1/missions?access_token="+this.access_token+"&mission_id="+missionId)
				.then(response =>{
					loading.closeLoading();
					if(response.data.code ==200){
						layer.msg(response.data.success,{
							icon:1
						})
						var oldAllIndex = this.missionList.length-1;
						this.missionList.splice(index,1)
						if(index<oldAllIndex){
							this.sendMissionsIndex(this.missionList)
						}
					}else{
						layer.msg(response.data.error,{
							icon:2
						})
					}
				})
	        }).catch(() => {
	                    
	        });
		},
		updateIndex:function(index,event){					//修改任务执行顺序
			event.stopPropagation();
			if(!this.drag){
				event.target.classList.remove('fa-exchange');
				event.target.classList.add('fa-save')
				var divList = event.path;
				var processBox ;
				for(var i = 0; i< divList.length; i++){
					if(divList[i].classList){
						if(divList[i].classList[0] == 'processBox'){
							processBox = divList[i]
							break;
						}
					}
				}
				var missionBox = processBox.getElementsByClassName('missionBox')[0];
				this.drag = true;
				if(processBox.offsetHeight == 55){
					this.getMission(index).then(()=>{
						missionBox.querySelectorAll('.mission').forEach(mission => {
							mission.style.cssText = 'position:relative;cursor: move;'
						})
					})
				}else{
					missionBox.querySelectorAll('.mission').forEach(mission => {
						mission.style.cssText = 'position:relative;cursor: move;'
					})
				}
			}else{
				event.target.classList.remove('fa-save');
				event.target.classList.add('fa-exchange')
				this.drag = false;
				
				this.sendMissionsIndex(this.missionList);

				var missionBox = event.target.parentElement.parentElement.nextElementSibling;
				missionBox.querySelectorAll('.mission').forEach(mission => {
						mission.style.cssText = 'cursor: auto;'
				})
			}
			
		},
		dragStart:function(index,ev){
			if(this.drag){
				var missionNode,parentNode;
				for(var i=0;i<ev.path.length;i++){
					if(ev.path[i].classList){
						if(ev.path[i].classList[0]=='mission'){
							missionNode = ev.path[i];
						}
						if(ev.path[i].classList[0]=='missionBox'){
							parentNode = ev.path[i]
						}
					}
				}
				var missions = this.missionList;
				var oldIndex = index;		//抓起DOM的下标
				var direction = null;
				var thisIndex;	//悬浮的DOM下标
				var boxHeight = missionNode.offsetHeight;
				missionNode.classList.add('active');
				var start = ev.target.offsetTop;
				var dis = ev.pageY;
				document.onmousemove = _mouseMove;
				
				function _mouseMove(ev){
					ev.preventDefault();
					var currentTop = start+ev.pageY-dis;
					missionNode.style.top = currentTop+'px';
					thisIndex = Math.round(currentTop/boxHeight) + oldIndex;
					
					if (thisIndex<0) {
						thisIndex = 0;
					} else if (thisIndex >= missions.length-1) {
						thisIndex = missions.length-1;
					}
					parentNode.querySelectorAll('.mission').forEach(mission =>{
						mission.style.border = 'none';
					})
					if (thisIndex>oldIndex) {
						direction = 'down';
						parentNode.querySelectorAll('.mission')[thisIndex].style.borderBottom = '#ff0000 2px solid';

					} else {
						direction = 'up';
						parentNode.querySelectorAll('.mission')[thisIndex].style.borderTop = '#ff0000 2px solid';
					}
				}
				
				document.onmouseup = (ev) =>{
					_mouseUp(ev);
					document.onmousemove = document.onmouseup = null
				}
				function _mouseUp(ev){
					if (direction=='down') {
						missions.splice(thisIndex+1,0,missions[oldIndex]);
						missions.splice(oldIndex,1);
					} else if (direction=='up') {
						missions.splice(thisIndex,0,missions[oldIndex]);
						missions.splice(oldIndex+1,1);
					}
					parentNode.querySelectorAll('.mission').forEach(mission =>{
						mission.style.top = 0;
						mission.style.position = 'relative';
						mission.style.border = 'none';
						mission.style.borderBottom = '#EDEDED 1px solid';
					})
					missionNode.classList.remove('active');
				}
			}
		},
		sendMissionsIndex:function(missions){
			console.log(missions);
			
			var newMissionIndex = [];
			var newIndex = 1;
			for(mission of missions){
				var newMission= {};
				newMission._id = mission._id;
				newMission.index = newIndex;
				mission.index = newIndex;
				newMissionIndex.push(newMission)
				newIndex++
			}
			var loading=new Finfosoft.Loading({
					shade:['0.7','#ffffff'],
			        color:'#000000',
			        msg:'正在更新任务执行顺序，请稍后。。。',
				})
			var params = new URLSearchParams();
			params.append("data",JSON.stringify(newMissionIndex))
			axios.put(globalurl+"/v1/missions?access_token="+this.access_token,params)
			.then(response =>{
				loading.closeLoading();
				if(response.data.code==200){
					layer.msg(response.data.success,{
							icon:1
						})
				}else{
					layer.msg(response.data.error,{
							icon:2
						})
				}
			})
		}
	},
	beforeMount:function(){			
		getToken();										//获取令牌
		this.access_token = accesstoken;
	},
	mounted:function(){
		this.getProcessList();
		this.getTriggerType();
		this.getThing()
	}
})