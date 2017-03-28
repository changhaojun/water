$.fn.extend({
	//智能input
	'smartInput': function (callback){
		//模拟placeholder
		$(this).attr('tip',$(this).val());
		$(this).focus(function (){
			$(this).css('borderColor','#1ab394');
			if ($(this).val()===$(this).attr('tip')) {
				$(this).val('');
			}
		});
		$(this).blur(function (){
			if ($(this).val()==='') {
				$(this).val($(this).attr('tip')).css('borderColor','#e5e6e7');
			} else {
				callback && callback();
			}
		});
		//限制空格
		$(this).keyup(function (){
			$(this).val($(this).val().replace(/\s/g,''));
		});
	},
	//居中位置计算
	'setCenterPos': function (){
		$(this).css({
			'left': ($(window).width()-$(this).width())/2,
			'top': ($(window).height()-$(this).height())/2
		});
	},
	//改变窗口大小&&滚动 居中
	'stayCenter': function (){
		var This = $(this);
		$(this).setCenterPos();
		$(window).resize(function (){
			This.setCenterPos();
		}).scroll(function (){
			This.setCenterPos();
		});
	},
	//关闭窗口
	'closeWindow': function (el,callBack){
		$(this).click(function (){
			$.each(el,function (){
				$(this).addClass('hidden');
			});
			callBack && callBack();
		});
	},
	//打开窗口
	'openWindow': function (el,ifCenter,callBack){
		$(this).click(function (){
			$.each(el,function (){
				$(this).removeClass('hidden');
				ifCenter && $(this).stayCenter();
			});
			callBack && callBack();
		});
	},
	//清空input的value值
	'clearVal': function (){
		$(this).find('input').val('');
	},
//	//设置option下标
//	'setOptionIndex': function (){
//		$(this).children().each(function (i){
//			$(this).attr('optionIndex',$(this).index());
//		});
//	},
	//编辑表格
	'editTable': function (inputName,selectName,callBack){
		var This = this;
		$(this).openWindow([$('.pop'),$('.pop-mask')],true,function (){
			$.each(inputName,function (i){
				var originElement = This.parent('td').parent('tr').children('[port-name='+inputName[i]+']');
				$('.pop').find('input').filter('[port-name='+inputName[i]+']').val(originElement.html()).attr('beforeChange',originElement.html());
			});
			$.each(selectName,function (i){
				var originElement = This.parent('td').parent('tr').children('[port-name='+selectName[i]+']');
				$('.pop').find('select').filter('[port-name='+selectName[i]+']').find('option').each(function (){
					$(this).attr('selected',false);
				});
				$('.pop').find('select').filter('[port-name='+selectName[i]+']').find('option').filter(function (index){
					return $(this).text() == originElement.html();
				}).prop('selected',true).attr('selected',true);
			});
			callBack && callBack();
		});
	},
	//记录原始值
	'recordOriginVal': function (){
		$(this).find('input').each(function (){
			$(this).attr('beforeChange',$(this).val());
		});
	},
	//确认编辑
	'confirmEdit': function (inputName,selectName,parent,callBack){
		var This = this;
//		var originElement = This.parent('dt').parent('dl').find('[port-name='+inputName+']');
		$(this).click(function (){
			$.each(parent.children(),function (i){
				var originElement = This.parent('dt').parent('dl').find('input').filter('[port-name='+inputName[i]+']');
//				console.log(originElement.val());
//				if (!originElement.val()) continue;
				$(this).filter('[port-name='+inputName[i]+']').html(originElement.val());
				
			});
//			$.each(selectName,function (i){
//				var originElement = This.parent('td').parent('tr').children('[port-name='+selectName[i]+']');
//				$('.pop').find('select').filter('[port-name='+selectName[i]+']').find('option').each(function (){
//					$(this).attr('selected',false);
//				});
//				$('.pop').find('select').filter('[port-name='+selectName[i]+']').find('option').filter(function (index){
//					return $(this).text() == originElement.html();
//				}).prop('selected',true).attr('selected',true);
//			});
			callBack && callBack();
		});
	}
});

$.extend({
	'init': function (){
		var deviceData = {
		    device_code: "请输入设备编号",
		    device_name: "请输入设备名称",
		    is_remind: 0,
		    mobile: "此号码用于接收掉线提醒",
		    remind_interval: "掉线提醒的间隔时间，单位分钟",
		    remind_delay: "掉线后提醒的延迟时间，单位分钟",
		    communication: {
		        collect_interval: 180,
		        collector_id: 100000,
		        plc_id: 1,
		        CRC_check: 16,
		        baud_rate: 0,
		        data_addr: 0,
		        check_bit: 0,
		        data_length: 100,
		        stop_bit: 1,
		        byte_oder: 0
		    },
		    protocal: "P", //无渲染
		    status: 1, //无渲染
		    company_id: "58c20d5f9aa7a32554f770de", //无渲染
		    company_code: "000001" //无渲染
		}
		var portData = [
			{
				data_name: "压力",
				oper_type: 2,
			    data_unit: "KPa",
			    data_type: 1,
			    data_precision: 0,
			    data_addr: 0,
			    real_range_low: 10,
			    real_range_high: 100,
			    _id: "566b6a37cdf8a441975d0c5a", //无渲染
			    device_id: "58ccb438d77a1e15ac5da16a", //无渲染
			    data_id: 2466, //无渲染
			    status: 1 //无渲染
			},
			{
				data_name: "温度",
				oper_type: 1,
			    data_unit: "℃",
			    data_type: 2,
			    data_precision: 10,
			    data_addr: 20,
			    real_range_low: 10,
			    real_range_high: 50,
			    _id: "566b6a37cdf8a441975d0c5a", //无渲染
			    device_id: "58ccb438d77a1e15ac5da16a", //无渲染
			    data_id: 2466, //无渲染
			    status: 1 //无渲染
			},
			{
				data_name: "温1231度",
				oper_type: 2,
			    data_unit: "℃123",
			    data_type: 0,
			    data_precision: 20,
			    data_addr: 888,
			    real_range_low: 654654,
			    real_range_high: 5465465,
			    _id: "566b6a37cdf8a441975d0c5a", //无渲染
			    device_id: "58ccb438d77a1e15ac5da16a", //无渲染
			    data_id: 2466, //无渲染
			    status: 1 //无渲染
			}
		];
		var device = new Vue({
			el: '#device',
			data: {
				deciveData: deviceData,
				portData: portData
			},
			methods: {
				remindOnOff: function (index){
					deviceData.is_remind = index;
				}
			}
		});
		var inputPortName = ['dataName','dataUnit','dataPrecision','dataAddr','realRangeLow','realRangeHigh'];
		var selectPortName = ['operType','dataType'];
		$.each($('input'),function (){
			$(this).smartInput();
		});
		$('.pop-close').closeWindow([$('.pop'),$('.pop-mask')]);
		$('.addPort').openWindow([$('.pop'),$('.pop-mask')],true,function (){
			$('.pop').clearVal();
		});
		$.each($('.fa-edit'),function (i){
			$(this).editTable(inputPortName,selectPortName,function (){
				$('.pop').find('button').confirmEdit(inputPortName,selectPortName,$('tbody').find('tr').eq(i));
			});
		});
		
//		setInterval(function (){
//			console.log(initData.is_remind);
//		},1000)
	}
});

$.init();
//
//getToken();
//
//console.log(accesstoken);

//var deviceInfo = [];
//



//$.ajax({
//	type: "get",
//	dataType: "json",
//	url: "http://121.42.253.149:18801/v1/devices/58d373a5cfd737459c433585",
//	async:true,
//	data: data,
//	success: function (data){
//		console.log(data);
//	}
//});