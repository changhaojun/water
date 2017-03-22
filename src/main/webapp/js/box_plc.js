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
	//按钮组切换
	'tabButton': function (){
		$(this).children().click(function (){
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
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
		var inputPortName = ['dataName','dataUnit','dataPrecision','dataAddr','realRangeLow','realRangeHigh'];
		var selectPortName = ['operType','dataType'];
		$.each($('input'),function (){
			$(this).smartInput();
		});
		$('.controlBtn').tabButton();
		$('.pop-close').closeWindow([$('.pop'),$('.pop-mask')]);
		$('.addPort').openWindow([$('.pop'),$('.pop-mask')],true,function (){
			$('.pop').clearVal();
		});
//		$('select').setOptionIndex();
		$.each($('.fa-edit'),function (i){
			$(this).editTable(inputPortName,selectPortName,function (){
				$('.pop').find('button').confirmEdit(inputPortName,selectPortName,$('tbody').find('tr').eq(i));
			});
		});
	}
});

$.init();