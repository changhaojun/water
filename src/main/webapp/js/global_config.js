var globalConfig={	//全局变量
	globalData:{
		receive_number:'',	//手机号码
		max_drop_time:'',	//最长掉线时间
		warn_time_interval:'',	//时间间隔
		smart_mode:0		//智能提醒
	},
	company_id:$('#companyId').val(),	//公司id
	access_token: '',	//访问令牌
	alarm_config_id:'',
	inputCheck:false
}

var $extend=$.fn.extend({
	smartModel:function(smart_mode){	//点击智能提醒后通过数据变更按钮样式
		var This;
		if(smart_mode==1){
			This=$('.btn-left')
		}else{
			This=$('.btn-right')
		}
		This.addClass('actionBTn');
		This.siblings().removeClass('actionBTn');
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
		globalConfig.inputCheck=true
		if($(this).val()==''){
			var This=$(this)
			$(this).focus();
			layer.tips(This.attr("placeholder"),This,{tips: [1,'#FE777A']})
			globalConfig.inputCheck=false
		}
		return globalConfig.inputCheck;
	},
	saveGlobal:function(){		//保存全局配置
		var  sendType;
		var sendData={};
		if(globalConfig.alarm_config_id!=''){
			sendType='put';
			delete globalConfig.globalData.company_id;
			sendData.alarm_config_id=globalConfig.alarm_config_id;
		}else{
			sendType='post';
			globalConfig.globalData.company_id=globalConfig.company_id;
		}
		sendData.access_token=globalConfig.access_token,
		sendData.data=JSON.stringify(globalConfig.globalData)
		$.ajax({
			type:sendType,
			url: globalurl+"/v1/globalAlarmConfigs",
			async:true,
			crossDomain: true == !(document.all),
			data:sendData ,
			success: function(data) {
				if(data.code==200){
					layer.msg(data.success,{icon:1})
				}else{
					layer.msg(data.error)
				}
			}
		});
	}
});
$.extend({
	init:function(){		//初始化
		var vmGlobalConfig=new Vue({
			el:'.globalContent',
			data:globalConfig,
			methods: $extend
		});
		
		getToken();
		globalConfig.access_token = accesstoken;
		$.smartModel(globalConfig.globalData.smart_mode)	//初始化智能提醒按钮样式，数据驱动
		$.getGlobalConfig();			//获取智能提醒数据
		$('.btn-group').find('button').click(function(){	//点击智能提醒按钮后改变数据
			if($(this).text()=='开启'){
				globalConfig.globalData.smart_mode=1;
			}else{
				globalConfig.globalData.smart_mode=0;
			}
			$.smartModel(globalConfig.globalData.smart_mode)		//通过数据变更按钮样式
		});
		$('input').limitSpacing();		//输入框去除空格
		$('input').filter('[num-limit=limit]').numOnly();		//数字限制输入
		$('input').filter('[num-limit=limit]').keyup(function(){
			globalConfig.globalData[$(this).attr('dataSource')]=globalConfig.globalData[$(this).attr('dataSource')].replace(/[^0-9-]/g, '')
		})
		$('.saveBtn').click(function(){	//点击保存按钮
			$('.globalMain input').each(function(){
				var overEach=$(this).formCheckFoo();
					if(overEach==false){
						return false;
					}
			})

			if(globalConfig.inputCheck){
				$(this).saveGlobal();
			}
		})
	},
	getGlobalConfig:function(){
		$.ajax({
			type:"get",
			url: globalurl+"/v1/globalAlarmConfigs",
			async:true,
			crossDomain: true == !(document.all),
			data: {
				access_token: globalConfig.access_token,
				filter:'{"company_id":"'+globalConfig.company_id+'"}',
			},
			success: function(data) {
				if(data._id!=undefined){
					globalConfig.alarm_config_id=data._id;
					delete data._id;
					globalConfig.globalData=data;
					$.smartModel(globalConfig.globalData.smart_mode);
				}
			}
		});
	},
	smartModel:function(smart_mode){
		var This;
		if(smart_mode==1){
			This=$('.btn-left')
		}else{
			This=$('.btn-right')
		}
		This.addClass('actionBTn');
		This.siblings().removeClass('actionBTn');
	}
});
$.init();
