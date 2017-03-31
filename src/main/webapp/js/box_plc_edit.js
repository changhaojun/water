
//Vue页面总数据流
var initData = {
	//令牌
	access_token: "",
	deviceId: $('#deviceId').val(),
//	//采集器ID
	collectorData: [],
	//{ 设备信息, { 通讯参数 } }
	deviceData: {
		device_code: "",
		device_name: "",
		is_remind: 0,
		mobile: "",
		remind_interval: "",
		remind_delay: "",
		communication: {
			collect_interval: 120,
			collector_id: "",
			plc_id: 0,
			CRC_check: 0,
			baud_rate: 0,
			data_addr: 0,
			check_bit: 0,
			data_length: 100,
			stop_bit: 1,
			byte_oder: 0
		},
		protocal: "P", //无渲染
		status: 1, //无渲染
		company_id: "", //无渲染
		company_code: "" //无渲染
	},
	//新增端口接口
	newPort: {
		data_name: "",
		oper_type: 0,
		data_unit: "",
		data_type: 0,
		data_precision: "",
		data_addr: "",
		real_range_low: "",
		real_range_high: "",
		status: 1 //无渲染
	},
	//当前选中端口索引值
	portIndex: 0,
	//全部端口信息
	portData: []
};

var $extend = $.fn.extend({
	//聚焦失焦颜色变化
	changeBorderColor: function() {
		$(this).focus(function() {
			$(this).css('borderColor', '#1ab394');
		});
		$(this).blur(function() {
			$(this).css('borderColor', '#e5e6e7');
		});
	},
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/\s/g, ''));
			eval('initData.'+$(this).attr('datasrc')+'=$(this).val()');
		});
	},
	//非数字限制输入
	numOnly: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/[^0-9-]/g, ''));
			eval('initData.'+$(this).attr('datasrc')+'=$(this).val()');
		});
	},
	//居中位置计算
	setCenterPos: function() {
		$(this).css({
			'left': ($(window).width() - $(this).width()) / 2,
			'top': ($(window).height() - $(this).height()) / 2
		});
	},
	//改变窗口大小&&滚动 居中
	stayCenter: function() {
		var This = $(this);
		$(this).setCenterPos();
		$(window).resize(This.setCenterPos).scroll(This.setCenterPos);
	},
	//关闭窗口
	closeWindow: function(el, callBack) {
		$.each(el, function() {
			$(this).addClass('hidden');
		});
		callBack && callBack();
	},
	//打开窗口
	openWindow: function(el, ifCenter, callBack) {
		$.each(el, function() {
			$(this).removeClass('hidden');
			ifCenter && $(this).stayCenter();
		});
		callBack && callBack();
	},
	//提醒开关
	remindOnOff: function(index) {
		this.deviceData.is_remind = index;
	},
	//新增端口
	createPort: function() {
		//将原生DOM转化为jQueryDOM
		var $This = $(event.target);
		$This.openWindow([$('.newPort'), $('.pop-mask')], true);
		$.initNewPort();
	},
	//编辑端口
	editPort: function(index) {
		//将原生DOM转化为jQueryDOM
		var $This = $(event.target);
		this.portIndex = index;
		for (var key in this.portData[index]) {
			this.newPort[key] = this.portData[index][key];
		}
		$This.openWindow([$('.editPort'), $('.pop-mask')], true);
	},
	//新端口信息保存
	saveNewPort: function() {
		//将原生DOM转化为jQueryDOM
		var $This = $(event.target);
		$This.attr('isright','false');
		$.isEmpty($('.newPort'),$This);
		if ($This.attr('isright')==='false') return;
		$This.closeWindow([$('.pop'), $('.pop-mask')]);
		this.portData.unshift(this.newPort);
		$.initNewPort();
	},
	//编辑端口信息保存
	saveEditPort: function() {
		//将原生DOM转化为jQueryDOM
		var $This = $(event.target);
		$This.attr('isright','false');
		$.isEmpty($('.editPort'),$This);
		if ($This.attr('isright')==='false') return;
		$This.closeWindow([$('.pop'), $('.pop-mask')]);
		for (var key in this.newPort) {
			this.portData[this.portIndex][key] = this.newPort[key];
		}
	},
	//删除端口信息
	deletePort: function(index) {
		var $This = $(event.target);
		this.portIndex = index;
		this.portData.splice(this.portIndex, 1);
	},
	//请求采集器ID所对应的端口列表
	requestCollectorList: function() {
		var This = this;
		var $This = $(event.target);
		if (!this.deviceData.communication.collector_id&&this.deviceData.communication.collector_id!==0) {
			$This.siblings('ul').addClass('hidden');
			return;
		}
		$.ajax({
			type: "get",
			dataType: "json",
//			url: "http://192.168.1.37/v1/collectors", //test
			url: globalurl+"/v1/collectors",
			async:true,
			data: {
				access_token: initData.access_token,
				like: JSON.stringify({collector_id: This.deviceData.communication.collector_id})
			},	
			success: function(data) {
				if (data.code===400005) {
					getNewToken();
					initData.access_token = refreshToken;
					$This.requestCollectorList();
					return;
				}
				if (data.rows.length) {
					$This.siblings('ul').removeClass('hidden');
					This.collectorData = data.rows;
				} else {
					$This.siblings('ul').addClass('hidden');
				}
			}
		});
	},
	//选择采集器ID
	confirmId: function() {
		var $This = $(event.target);
		this.deviceData.communication.collector_id = $This.html();
		$This.parent().addClass('hidden');
	},
	//提交按钮状态相应
	changeTip: function(content) {
		$(this).html(content);
	},
	//数据提交
	mainSubmit: function() {
		$(this).click(function (){
			$(this).attr('isright','false');
			$.isEmpty($('.dataInfo'),$(this));
			if ($(this).attr('isright')==='false') {
				return;
			} else {
				$(this).attr('disabled',true);
			};
			$(this).changeTip('正在保存，请稍后...');
			$.doDeviceAjax();
			$.doPortAjax();
		});
	}
});

$.extend({
	//系统初始化
	init: function() {
		var device = new Vue({
			el: '#vue',
			data: initData,
			methods: $extend
		});
		getToken($.getInitData);
		//获取令牌
//		$.getInitData();
		$('input').changeBorderColor();
		$('input').limitSpacing();
		$('input').filter('[num-limit=limit]').numOnly();
		$('select').changeBorderColor();
		$('.pop-close').click(function() {
			$(this).closeWindow([$('.pop'), $('.pop-mask')]);
		});
		$('#main-submit').mainSubmit();
	},
	//新增端口信息初始化
	initNewPort: function() {
		initData.newPort = {
			data_name: "",
			oper_type: 1,
			data_unit: "",
			data_type: 0,
			data_precision: "",
			data_addr: "",
			real_range_low: "",
			real_range_high: "",
			status: 1 //无渲染
		}
	},
	//判断是否有未填写项目
	isEmpty: function(parent,target) {
		$.each(parent.find('input'),function() {
			if ($(this).attr('empty')) {
				$(this).focus();
				$(this).css('borderColor','#ff787b');
				target.attr('isright','false');
				return false;
			} else {
				target.attr('isright','true');
			}
		});
	},
	//保存设备请求
	doDeviceAjax: function() {
		$.ajax({
			type: "put",
			dataType: "json",
//			url: "http://192.168.1.37/v1/devices/"+initData.deviceId, //test
			url: globalurl+"/v1/devices/"+initData.deviceId,
			async: true,
			data: {
				access_token: initData.access_token,
				data: JSON.stringify(initData.deviceData)
			},
			success: function(data) {
				switch (data.code) {
					case 400005:
						getNewToken();
						initData.access_token = refreshToken;
						$.doDeviceAjax();
						return;
				}
			}
		});
	},
	//保存端口请求
	doPortAjax: function() {
		$.ajax({
			type: "put",
			dataType: "json",
//			url: "http://192.168.1.37/v1/devices/"+initData.deviceId+"/dataConfigs", //test
			url: globalurl+"/v1/devices/"+initData.deviceId+"/dataConfigs",
			async: true,
			data: {
				access_token: initData.access_token,
				data: JSON.stringify(initData.portData)
			},
			success: function(data) {
				console.log('dataConfig',data);
				switch (data.code) {
					case 200:
						layer.msg('保存成功！',{
							icon: 1,
							end: function() {
								//页面跳转
							}
						});
						break;
					case 400005:
						getNewToken();
						initData.access_token = refreshToken;
						$.doPortAjax();
						return;
				}
			}
		});
	},
	//获取数据流请求
	getInitData: function (){
		console.info('2')
		initData.access_token = accesstoken;
		$.ajax({
			type: "get",
			dataType: "json",
//			url: "http://192.168.1.37/v1/devices/"+initData.deviceId, //test
			url: globalurl+"/v1/devices/"+initData.deviceId,
			async: true,
			data: {
				access_token: initData.access_token
			},                                                                                                                                                                                                                                                                                
			success: function(data) {
				$.deepCopy(data,initData.deviceData);
			}
		});
		$.ajax({
			type: "get",
			dataType: "json",
//			url: "http://192.168.1.37/v1/devices/"+initData.deviceId+"/dataConfigs", //test
			url: globalurl+"/v1/devices/"+initData.deviceId+"/dataConfigs",
			async: true,
			data: {
				access_token: initData.access_token,
				filter: JSON.stringify({device_id: initData.deviceId})
			},
			success: function(data) {
				for (var i=data.rows.length-1; i>=0; i--) {
					initData.portData.push(data.rows[i]);
				}
			}
		});
	},
	//深拷贝
	deepCopy: function(copyFrom,copyFor) {
		for (var key in copyFor) {
			copyFor[key] = typeof copyFrom[key]==='object' ? $.deepCopy(copyFrom[key],copyFor[key]) : copyFrom[key];
		}
		return copyFor;
	}
});

$.init();