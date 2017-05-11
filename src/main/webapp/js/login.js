//正则表达式库
$.RegEsp = {
	email: /^[a-zA-Z0-9]+@\w+(\.[a-zA-Z]+){1,2}$/,
	password: /^.{6,16}$/,
	verificationCode: /.+/,
	popUrl: /^\w+@/
}

//面向对象的插件方法
$.fn.extend({
	//左侧轮播
	goAnimate: function(direction, offset, isRotate) {
		var aChild = $(this).children();
		var iLen = aChild.length;
		var info = navigator.userAgent.toLowerCase();
		if(info.indexOf("msie") >= 0 || info.indexOf("trident") >= 0) {
			//IE9以下浏览器
			var iIndex = 0;
			turnHide();
		} else {
			//标准浏览器
			turnRotate.call($(this));
		}
		//三棱柱旋转
		function turnRotate() {
			var iSideLen = direction === 'X' ? $(this).height() : $(this).width();
			var iDis = Math.floor(iSideLen / 2 * Math.tan(Math.PI * (90 - 360 / iLen) / 2 / 180)) + offset;
			$(this).parent('.perspective').css({
				'perspective': 800,
				'-webkit-perspective': 800
			});
			$(this).parent('.z').css({
				'transform': 'translateZ(' + -iDis + 'px)',
				'transform-style': 'preserve-3d',
				'-webkit-transform': 'translateZ(' + -iDis + 'px)',
				'-webkit-transform-style': 'preserve-3d'
			});
			$(this).css({
				'transform-style': 'preserve-3d',
				'-webkit-transform-style': 'preserve-3d'
			});
			aChild.each(function(i, elem) {
				$(elem).css({
					'transform': 'rotate' + direction + '(' + -i * 360 / iLen + 'deg) translateZ(' + iDis + 'px)',
					'backface-visibility': 'hidden',
					'-webkit-transform': 'rotate' + direction + '(' + -i * 360 / iLen + 'deg) translateZ(' + iDis + 'px)',
					'-webkit-backface-visibility': 'hidden'
				});
			});
			if(isRotate) {
				$(this).addClass('rotate' + direction + '');
			}
		}
		//淡入淡出
		function turnHide() {
			aChild.css('opacity', 0);
			aChild.eq(iIndex).css('opacity', 1).delay(2000).animate({
				'opacity': 0
			}, 2000);
			iIndex++;
			if(iIndex > iLen - 1) {
				iIndex = 0;
			}
			aChild.eq(iIndex).delay(2000).animate({
				'opacity': 1
			}, 2000, function() {
				turnHide();
			});
		}
	},
	//水平垂直居中
	stayCenter: function() {
		var This = $(this);
		setPos.call($(this));
		$(window).resize(function() {
			setPos.call(This);
		});
		//位置计算
		function setPos() {
			var iObjWidth = $(this).width();
			var iObjHeight = $(this).height();
			var iWinWidth = $(window).width();
			var iWinHeight = $(window).height();
			$(this).css({
				'left': (iWinWidth - iObjWidth) / 2,
				'top': (iWinHeight - iObjHeight) / 2
			});
		}
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
	//placeholder模拟
	smartInput: function(type,callBack) {
		$(this).val($(this).attr('fakePlaceholder'));
		$(this).focus(function() {
			if($(this).val() === $(this).attr('fakePlaceholder')){
				$(this).val('');
			}
			$(this).css('borderColor', '#1ab394');
			if (type==='password') { //密码框处理
				$(this).attr('type', 'password');
			}
		});
		$(this).blur(function() {
			if($(this).val() === '' || $(this).val() === $(this).attr('fakePlaceholder')) {
				$(this).val($(this).attr('fakePlaceholder')).attr('isright', 'false');
				if (type==='password') { //密码框处理
					$(this).attr('type', 'text');
				}
			} else {
				$(this).attr('isright', 'true');
				callBack && callBack.call($(this));
			}
		});
		if (type==='verificationCode') {
			$(this).keyup(function() {
				callBack && callBack.call($(this));
			});
		}
		return $(this);
	},
	//正则表达式验证提示
	testRegEsp: function(re,callBack) {
		if(re.test($(this).val())) {
			$(this).attr('isright', 'true');
			callBack && callBack.call($(this));
		} else {
			$(this).attr('isright', 'false').css('borderColor', '#ff787b');
			$.layerTip($(this), $(this).attr('warning'));
		}
	},
	//如果用户在获取验证码后重新更改账号，则隐藏验证码输入框
	hideCode: function(callBack) {
		if (typeof $(this).attr('originVal')!=='undefined') {
			if ($(this).val()!==$(this).attr('originVal')) {
				callBack.trueCase && callBack.trueCase();
			} else {
				callBack.falseCase && callBack.falseCase();
			}
		}
	},
	//登录交互
	doLogin: function(hook) {
		var This = this;
		$.userInfo = {
			username: $('input').filter('[name=username]').val(),
			password: $('input').filter('[name=password]').val(),
			code: $('input').filter('[name=verificationCode]').val() === '请输入验证码' ? '' : $('input').filter('[name=verificationCode]').val(),
			client_id: 'admin',
			client_secret: 'admin',
			address: $.address
		};
		if(!$.couldSubmit($('.form input'))) {
			return;
		}
		hook && hook();
		$(this).html('正在登录中...').css({
			'letterSpacing': 0,
			'textIndent': 0
		});
		$.ajax({
			type: "post",
			dataType: "json",
			url: globalurl + "/authorize/authorize",
//			url:'http://192.168.1.106:8080/authorize',
			async: true,
			crossDomain: true == !(document.all),
			data: $.userInfo,
			success: function(data) {
				if(data.code == 200) {
					$.loginSuccess(data);
				} else {
					This.html('登录').css({
						'letterSpacing': 14,
						'textIndent': 14
					});
					$.loginFail(data);
				}
			}
		});
	}
});

//分类调用
$.extend({
	//总程序->初始化
	init: function() {
		$.getIp();
		$.keepMainCenter();
		$.tabPlay();
		$.inputChain();
		$.doSubmit();
		$.sentCode();
		$.pop();
	},
	//主体->动态居中
	keepMainCenter: function() {
		$('.wrap').stayCenter();
	},
	//轮播图->自动播放
	tabPlay: function() {
		$('.imgBox').goAnimate('Y', 200, true);
		$('.textBox').goAnimate('Y', 0, true);
	},
	//表单->交互链
	inputChain: function() {
		//window环境下，回车选中username
		$(window).enterKey(function() {
			$('input').filter('[name=username]').focus();
		});
		//username环境下，回车选中password
		$('input').filter('[name=username]').smartInput('text',function() {
			$(this).testRegEsp($.RegEsp.email,function() {
				$(this).hideCode({
					trueCase: function() {
						$('.code').addClass('hidden');
						$('input').filter('[name=verificationCode]').attr('isright','true');
					},
					falseCase: function() {
						$('.code').removeClass('hidden');
						$('input').filter('[name=verificationCode]').attr('isright','false');
					}
				});
			});
		}).enterKey(function() {
			$('input').filter('[name=password]').focus();
		});
		//password环境下，回车提交
		$('input').filter('[name=password]').smartInput('password',function() {
			$(this).testRegEsp($.RegEsp.password);
		}).enterKey(function() {
			$('.loginBtn').doLogin($.loginHook);
		});
		//verificationCode环境下，回车提交
		$('input').filter('[name=verificationCode]').smartInput('verificationCode',function() {
			$(this).testRegEsp($.RegEsp.verificationCode);
		}).enterKey(function() {
			$('.loginBtn').doLogin($.loginHook);
		});
		//pop-username环境下，回车提交
		$('input').filter('[name=pop-username]').smartInput('text', function() {
			$(this).testRegEsp($.RegEsp.email);
		}).enterKey(function() {
			$.popSubmit();
		});
	},
	//提交->提交按钮点击动作
	doSubmit: function() {
		$('.loginBtn').click(function() {
			$(this).doLogin($.loginHook);
		});
	},
	//验证码->点击发送验证码
	sentCode: function() {
		$('.code').find('p').click(function() {
			if (!$.timeOnOff) {
				$.countDown($(this),function() {
					$(this).html('获取验证码').css({
						color: '#fff',
						cursor: 'pointer'
					});
				});
			} else {
				return;
			}
			$('input').filter('[name=verificationCode]').focus();
			$.ajax({
				type: "post",
				dataType: "json",
				url: globalurl + "/v1/mails",
				async: true,
				crossDomain: true == !(document.all),
				data: {
					filter: JSON.stringify({username: $.userInfo.username})
				}
			});
		});
	},
	//发送请求->生命周期钩子
	loginHook: function() {
		$('input').filter('[name=username]').attr('originVal',$('input').filter('[name=username]').val());
		$('input').css('borderColor','#1ab394');
	},
	//登陆成功->跳转页面
	loginSuccess: function(data) {
		$.ajax({
			url: '/finfosoft-water/login',
			type: 'post',
			dataType: 'json',
			crossDomain: true == !(document.all),
			data: { 
				data: JSON.stringify(data)
			},
			success: function(data) {
				self.location.href = "/finfosoft-water/frame";
			}
		});
	},
	//登陆失败->错误提示
	loginFail: function(data) {
		if (data.code===400001) { //用户名或密码错误
			$('input').filter('[name=username]').css('borderColor', '#ff787b');
			$('input').filter('[name=password]').css('borderColor', '#ff787b');
			$.layerTip($('.login-title').find('p'),data.error);
		} else if (data.code===400009) { //ip异常
			$('.code').removeClass('hidden');
			$('input').filter('[name=verificationCode]').attr('isright','false');
			$.layerTip($('.login-title').find('p'),data.error);
		} else if (data.code===400010) { //验证码错误
			$('input').filter('[name=verificationCode]').css('borderColor', '#ff787b');
			$.layerTip($('input').filter('[name=verificationCode]'),data.error);
		} else { //其他异常
			$.layerTip($('.login-title').find('p'),data.error);
		}
	},
	//忘记密码->弹层操作集合
	pop: function (){
		$('.popup').click($.popFirstShow);
		$('.pop-close').click($.popClose);
		$('.pop-submit').click($.popSubmit);
		$('.pop-again').click($.popAgain);
		$('.pop-mail').click($.popRedirect);
	},
	//弹窗->填写邮箱界面显示
	popFirstShow: function() {
		$('.pop').filter('.step1').removeClass('hidden').stayCenter();
		$('.pop-mask').removeClass('hidden');
		$('.pop-username').val('');
	},
	//弹窗->成功界面显示
	popSecondShow: function() {
		$('.pop').filter('.step1').addClass('hidden');
		$('.pop').filter('.step2').removeClass('hidden').stayCenter();
		$('.pop-message').html($('.pop-username').val());
	},
	//弹窗->填写邮箱界面关闭
	popClose: function() {
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
	},
	//弹窗->返回填写邮箱界面
	popAgain: function() {
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop').filter('.step2').addClass('hidden');
	},
	//弹窗->重定向为邮箱地址
	popRedirect: function() {
		window.open($('.pop-username').val().replace($.RegEsp.popUrl, function() {
			return 'http://mail.';
		}));
	},
	//弹窗->提交邮箱
	popSubmit: function() {
		if(!$.couldSubmit($('.pop-username'))) {
			return;
		}
		if($('.pop-username').attr('isright')) {
			$.ajax({
				type: "get",
				dataType: "json",
				url: globalurl + "/v1/mails",
				async: true,
				crossDomain: true == !(document.all),
				data: {
					email: $('.pop-username').val()
				},
				success: function(data) {
					if (data.code==200) {
						$.popSecondShow();
					} else if(data.code==400016){
						$.layerTip($('.pop-username'),data.error,1,function (){
							$(this).css('borderColor','#ff787b')
						});
						return;
					}
				}
			});
		}
	},
	//工具类->layer提示
	layerTip: function(focusElem, message, pos, callBack) {
		layer.tips(message, focusElem, {
			tips: [!pos ? 2 : pos, '#ff787b'],
			time: 3000,
			tipsMore: true
		});
		callBack && callBack.call(focusElem);
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
	},
	//工具类->获取IP地址
	getIp: function() {
		$.getJSON('http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random(), function(data) {
			$.address = data.Isp.split(' ')[0].toString();
		});
	},
	//工具类->60秒倒计时
	countDown: function(showElem,callBack) {
		$.timeLeft = 60;
		$.timeOnOff = true;
		showElem.timer = setInterval(function() {
			$.timeLeft--;
			showElem.html('重新发送('+$.timeLeft+')').css({
				color: '#ccc',
				cursor: 'not-allowed'
			});
			if ($.timeLeft<0) {
				clearInterval(showElem.timer);
				callBack && callBack.call(showElem);
				$.timeOnOff = false;
			}
		},1000);
	}
});

$.init();