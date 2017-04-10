//正则表达式库
$.RegEsp = {
	password: /^.{6,16}$/
}

//面向对象的插件方法
$.fn.extend({
	//水平垂直居中
	stayCenter: function() {
		var This = $(this);
		setPos($(this));
		$(window).resize(function() {
			setPos(This);
		});
		function setPos() {
			var iObjWidth = This.width();
			var iObjHeight = This.height();
			var iWinWidth = $(window).width();
			var iWinHeight = $(window).height() - 50;
			This.css({
				'left': (iWinWidth - iObjWidth) / 2,
				'top': (iWinHeight - iObjHeight) / 2
			});
		}
	},
	//密码长度验证
	testLength: function(callBack) {
		$(this).focus(function() {
			$(this).css('borderColor', '#1ab394');
		});
		$(this).blur(function() {
			callBack && callBack.call($(this));
		});
		return $(this);
	},
	//验证两次密码输入是否一致
	testEqual: function(testedElem, callBack) {
		$(this).focus(function() {
			$(this).css('borderColor', '#1ab394');
		});
		$(this).blur(function() {
			if(testedElem.attr('isright') === 'false') {
				$.layerTip(testedElem, testedElem.attr('warning'));
			} else {
				if($(this).val() !== testedElem.val()) {
					$(this).css('borderColor', '#ff787b').attr('isright', 'false');
					$.layerTip($(this), $(this).attr('warning'));
				} else {
					$(this).css('borderColor', '#1ab394');
					$(this).attr('isright', 'true');
					callBack && callBack.call($(this));
				}
			}
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
	//正则表达式验证提示
	testRegEsp: function(re, callBack) {
		if(re.test($(this).val())) {
			$(this).attr('isright', 'true');
			callBack && callBack.call($(this));
		} else {
			$(this).attr('isright', 'false').css('borderColor', '#ff787b');
			$.layerTip($(this), $(this).attr('warning'));
		}
		return $(this);
	},
	//提交
	submitPassword: function() {
		if(!$.couldSubmit($('input'))) {
			return;
		}
		$.passwordInfo = {
			access_token: $("#accessToken").val(),
			new_password: $('#new').val(),
			confirm_password: $('#again').val()
		};
		$(this).html('正在重置密码...').css({
			'letterSpacing': 0,
			'textIndent': 0,
			'textAlign': 'center'
		});
		$.ajax({
			type: "put",
			dataType: "json",
			url: globalurl + "/v1/users",
			async: true,
			data: $.passwordInfo,
			success: function(data) {
				if (data.code==200) {
					$('.step1').addClass('hidden');
					$('.step2').removeClass('hidden');
					setTimeout(function() {
						self.location.href = '/finfosoft-water/';
					},2000);
				}
			}
		});
	},
});

//分类调用
$.extend({
	//初始化
	init: function() {
		$.keepMainCenter();
		$.inputChain();
		$.doSubmit();
	},
	//主体->动态居中
	keepMainCenter: function() {
		$('.wrap').stayCenter();
	},
	//表单->交互链
	inputChain: function() {
		//window环境下，回车选中newPassword
		$(window).enterKey(function() {
			$('#new').focus();
		});
		//newPassword环境下，回车选中againPassword
		$('#new').testLength(function() {
			$(this).testRegEsp($.RegEsp.password);
		}).enterKey(function() {
			$('#again').focus();
		});
		//againPassword环境下，回车提交
		$('#again').testEqual($('#new')).enterKey(function() {
			$('.submit-btn').submitPassword();
		});
	},
	//提交->提交按钮点击动作
	doSubmit: function() {
		$('.submit-btn').click(function (){
			$(this).submitPassword();
		});
	},
	//工具类->layer提示
	layerTip: function(focusElem, message) {
		layer.tips(message, focusElem, {
			tips: [2, '#ff787b'],
			time: 3000,
			tipsMore: true
		});
	},
	//工具类->判断是否为可提交状态
	couldSubmit: function(elems) {
		var status = false;
		elems.each(function() {
			if($(this).attr('isright') === 'false') {
				$(this).css('borderColor', '#ff787b');
				$.layerTip($(this), $(this).attr('warning'));
				status = false;
				return false;
			} else {
				status = true;
			}
		});
		return status;
	}
});

$.init();