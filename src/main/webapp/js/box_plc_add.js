//Vue页面总数据流
var initData = {
	//令牌
	access_token: "",
	//页面状态选择器
	pageStatus: "window",
	//采集器ID
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
			plc_id: 1,
			CRC_check: 16,
			baud_rate: 0,
			data_addr: 0,
			check_bit: 0,
			data_length: 100,
			stop_bit: 1,
			byte_oder: 0
		},
		device_kind:1,
		protocal: "P", //无渲染
		status: 1, //无渲染
		company_id: $('#companyId').val(), //无渲染
		company_code: $('#companyCode').val() //无渲染
	},
	//新增端口接口
	newPort: {
		data_name: "",
		port_name: "A",
		oper_type: 1,
		data_unit: "",
		data_type: 0,
		data_precision: "",
		data_addr: "",
		real_range_low: "",
		real_range_high: "",
		high_battery: "",
		low_battery: "",
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
		return $(this);
	},
	//回车键响应
	enterKey: function(callBack) {
		$(this).keyup(function(ev) {
			if(ev.which === 13) {
				$(this).blur();
				callBack && callBack.call($(this));
			}
			return false;
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
			eval('initData.'+$(this).attr('datasrc')+'=Number($(this).val())');
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
		initData.pageStatus = 'window';
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
	createPort: function(event) {
		//将原生DOM转化为jQueryDOM
		var $This = event ? $(event.currentTarget) : $(this);
		$This.openWindow([$('.newPort'), $('.pop-mask')], true, function() {
			initData.pageStatus = 'newPort';
		});
		$.initNewPort();
	},
	//编辑端口
	editPort: function(index,event) {
		//将原生DOM转化为jQueryDOM
		var $This = event ? $(event.currentTarget) : $(this);
		this.portIndex = index;
		for (var key in this.portData[index]) {
			this.newPort[key] = this.portData[index][key];
		}
		$This.openWindow([$('.editPort'), $('.pop-mask')], true, function() {
			initData.pageStatus = 'editPort';
		});
	},
	//新端口信息保存
	saveNewPort: function(event) {
		//将原生DOM转化为jQueryDOM
		var $This = event ? $(event.currentTarget) : $(this);
		$This.attr('isright','false');
		$.isEmpty($('.newPort'),$This);
		if ($This.attr('isright')==='false') {
			return;
		}
		$This.closeWindow([$('.pop'), $('.pop-mask')]);
		initData.portData.unshift(initData.newPort);
		$.initNewPort();
	},
	//编辑端口信息保存
	saveEditPort: function(event) {
		//将原生DOM转化为jQueryDOM
		var $This = event ? $(event.currentTarget) : $(this);
		$This.attr('isright','false');
		$.isEmpty($('.editPort'),$This);
		if ($This.attr('isright')==='false') {
			return;
		}
		$This.closeWindow([$('.pop'), $('.pop-mask')]);
		for (var key in initData.newPort) {
			initData.portData[initData.portIndex][key] = initData.newPort[key];
		}
	},
	//删除端口信息
	deletePort: function(index) {
		this.portIndex = index;
		this.portData.splice(this.portIndex, 1);
	},
	//选择采集器ID
	confirmId: function(event) {
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		initData.deviceData.communication.collector_id = $This.html();
		$This.parent().addClass('hidden');
		$This.parent().siblings('input').attr('selectedid',$This.html());
	},
	//显示采集器ID列表
	toggleList: function(event,hide) {
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		if (!initData.collectorData.length) {
			$This.siblings('ul').addClass('hidden');
		} else {
			$This.siblings('ul').removeClass('hidden');
		}
		if (hide) {
			initData.deviceData.communication.collector_id = !$This.attr('selectedid') ? '' : $This.attr('selectedid');
			$This.siblings('ul').addClass('hidden');
		}
	},
	//请求采集器ID所对应的端口列表
	requestCollectorList: function(event) {
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		if ($This.val()==='') {
			$This.siblings('ul').addClass('hidden');
			return;
		}
		$.ajax({
			type:"get",
			dataType: "json",
			url: globalurl+"/v1/collectors",
			async:true,
			crossDomain: true == !(document.all),
			data: {
				access_token: initData.access_token,
				conditions: $This.val()
			},	
			success: function(data) {
				if (data.code===400005) {
					getNewToken();
					initData.access_token = refreshToken;
					$This.requestCollectorList();
					return;
				}
				initData.collectorData = data.rows;
				$This.toggleList();
			}
		});
	},
	//提交按钮状态相应
	changeTip: function(content) {
		$(this).html(content);
	},
	//数据提交
	mainSubmit: function() {
		$(this).attr('isright','false');
		$.isEmpty($('.dataInfo'),$(this));
		if ($(this).attr('isright')==='false') {
			return;
		} else {
			$(this).attr('disabled',true);
		};
		$(this).changeTip('正在保存，请稍后...');
		$.doAjax();
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
		//获取令牌
		getToken();
		initData.access_token = accesstoken;
		$(window).enterKey(function() {
			$.judgePageStatus();
		});
		$('input').changeBorderColor().enterKey(function() {
			$.judgePageStatus();
		});
		$('input').limitSpacing();
		$('input').filter('[num-limit=limit]').numOnly();
		$('select').changeBorderColor();
		$('.pop-close').click(function() {
			$(this).closeWindow([$('.pop'), $('.pop-mask')]);
		});
		$('#main-submit').click(function() {
			$(this).mainSubmit();
		});
	},
	//新增端口信息初始化
	initNewPort: function() {
		initData.newPort = {
			data_name: "",
			port_name: "A",
			oper_type: 1,
			data_unit: "",
			data_type: 0,
			data_precision: "",
			data_addr: "",
			real_range_low: "",
			real_range_high: "",
			high_battery: "",
			low_battery: "",
			status: 1 //无渲染
		}
	},
	//判断是否有未填写项目
	isEmpty: function(parent,target) {
		$.each(parent.find('input'),function() {
			if ($(this).attr('empty')) {
				$(this).focus();
				$(this).css('borderColor','#ff787b');
				$.layerTip($(this),$(this).attr('warning'));
				target.attr('isright','false');
				return false;
			} else {
				target.attr('isright','true');
			}
		});
	},
	//页面状态判断
	judgePageStatus: function() {
		switch (initData.pageStatus) {
			case 'window':
				$('#main-submit').mainSubmit();
				break;
			case 'newPort':
				$('.newPort').find('button').saveNewPort();
				break;
			case 'editPort':
				$('.editPort').find('button').saveEditPort();
				break;
		}
	},
	//工具类->layer提示
	layerTip: function(focusElem, message) {
		layer.tips(message, focusElem, {
			tips: [1, '#ff787b'],
			time: 3000,
			tipsMore: true
		});
	},
	//提交
	doAjax: function() {
		$.ajax({
			type: "post",
			dataType: "json",
			url: globalurl+"/v1/devices",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: initData.access_token,
				data: JSON.stringify(initData.deviceData)
			},
			success: function(data) {
				switch (data.code) {
					case 200: 
						//发送dataConfig
						$.ajax({
							type: "post",
							dataType: "json",
							url: globalurl+"/v1/devices/"+data._id+"/dataConfigs",
							async: true,
							crossDomain: true == !(document.all),
							data: {
								access_token: initData.access_token,
								data: JSON.stringify(initData.portData)
							},
							success: function(data) {
								if (data.code===200) {
									layer.msg('保存成功！', {
										icon: 1,
										end: function() {
											self.location.href='/finfosoft-water/dataTag/plc/'
										}
									});
								}
							}
						});
						break;
					case 400005:
						getNewToken();
						initData.access_token = refreshToken;
						$.doAjax();
						break;
				}
			}
		});
	}
});

$.init();