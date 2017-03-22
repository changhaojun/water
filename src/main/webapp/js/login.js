$.fn.extend({
	//左侧轮播
	'goRotate': function (direction,offset,isRotate){
		var aChild = $(this).children();
		var iLen = aChild.length;
		var info = navigator.userAgent.toLowerCase();
		if (info.indexOf("msie")>=0||info.indexOf("trident")>=0) {
			//IE9以下浏览器：淡入淡出
			var iIndex = 0;
			turnHide();
			function turnHide(){
				aChild.css('opacity',0);
				aChild.eq(iIndex).css('opacity',1).delay(2000).animate({
					'opacity': 0
				},2000);
				iIndex++;
				if (iIndex>iLen-1) {
					iIndex = 0;
				}
				aChild.eq(iIndex).delay(2000).animate({
					'opacity': 1
				},2000,function (){
					turnHide();
				});
			}
		} else {
			//标准浏览器：三棱柱旋转
			var iSideLen = direction==='X' ? $(this).height() : $(this).width();
			var iDis = Math.floor(iSideLen/2*Math.tan(Math.PI*(90-360/iLen)/2/180))+offset;
			$(this).parent('.perspective').css({
				'perspective': 800,
				'-webkit-perspective': 800
			});
			$(this).parent('.z').css({
				'transform': 'translateZ('+-iDis+'px)',
				'transform-style': 'preserve-3d',
				'-webkit-transform': 'translateZ('+-iDis+'px)',
				'-webkit-transform-style': 'preserve-3d'
			});
			$(this).css({
				'transform-style': 'preserve-3d',
				'-webkit-transform-style': 'preserve-3d'
			});
			aChild.each(function (i,elem){
				$(elem).css({
					'transform': 'rotate'+direction+'('+-i*360/iLen+'deg) translateZ('+iDis+'px)',
					'backface-visibility': 'hidden',
					'-webkit-transform': 'rotate'+direction+'('+-i*360/iLen+'deg) translateZ('+iDis+'px)',
					'-webkit-backface-visibility': 'hidden'
				});
			});
			if (isRotate) {
				$(this).addClass('rotate'+direction+'');
			}
		}
	},
	//水平垂直居中
	'stayCenter': function (){
		var This = $(this);
		setPos($(this));
		$(window).resize(function (){
			setPos(This);
		});
		function setPos(){
			var iObjWidth = This.width();
			var iObjHeight = This.height();
			var iDocWidth = $(window).width();
			var iDocHeight = $(window).height();
			This.css({
				'left': (iDocWidth-iObjWidth)/2,
				'top': (iDocHeight-iObjHeight)/2
			});
		}
	},
	//邮箱验证
	'testEmal': function (){
		var re = /^[a-zA-Z0-9]+@\w+(\.[a-zA-Z]+){1,2}$/;
		$(this).attr('isright','false');
		$(this).keyup(function (){
			if (re.test($(this).val())) {
				$(this).css({
					'borderColor': '#1ab394'
				});
				$(this).siblings('.tip').addClass('hidden');
				$(this).attr('isright','true');
			} else {
				$(this).siblings('.tip').removeClass('hidden');
				$(this).css({
					'borderColor': '#ff787b'
				});
				$(this).attr('isright','false');
			}
		});
	},
	//弹出层
	'popUp': function (){
		$(this).click(function (){
			$('.pop').filter('.step1').removeClass('hidden').stayCenter();
			$('.pop-mask').removeClass('hidden');
			$('.pop-username').val('');
		});
		$('.pop-close').click(function (){
			$('.pop').addClass('hidden');
			$('.pop-mask').addClass('hidden');
		});
		$('.pop-submit').click(function (){
			if ($('.pop-username').attr('ismail')) {
				$('.pop').filter('.step1').addClass('hidden');
				$('.pop').filter('.step2').removeClass('hidden').stayCenter();
				$('.pop-message').html($('.pop-username').val());
				$.ajax({
					type:"get",
					dataType:"json",
					url:"http://192.168.1.109:80/v1/mails",
					async:true,
					data:{
						'email': msg
					},
					success: function (data){
						console.log(data);
					}
				});
			}	
		});
		$('.pop-again').click(function (){
			$('.pop').filter('.step1').removeClass('hidden');
			$('.pop').filter('.step2').addClass('hidden');
		});
		$('.pop-mail').click(function (){
			var re = /^\w+@/;
			var iUrl = $('.pop-username').val().replace(re,function (){
				return 'http://mail.';
			});
			window.open(iUrl);
		});
	},
	//文本框响应
	'smartInput': function (){
		$(this).focus(function (){
			console.log($(this).attr('class'));
			if ($(this).val()==='请输入邮箱'||$(this).val()==='请输入密码'||$(this).val()==='请输入正确的邮箱地址'||$(this).val()==='请输入验证码') {
				$(this).attr('originval',$(this).val()).val('');
			}
			$(this).css({
				'color': $(this).attr('class')==='pop-username' ? '#000' : '#fff',
				'borderColor':'#1ab394'
			});
		});
		$(this).blur(function (){
			if ($(this).val()===''){
				if ($(this).attr('originval')==='请输入邮箱'||$(this).attr('originval')==='请输入密码'||$(this).attr('originval')==='请输入正确的邮箱地址'||$(this).attr('originval')==='请输入验证码') {
					$(this).val($(this).attr('originval'));
				};
			}
		});
	},
	//密码框响应
	'passwordInput': function (){
		$(this).attr('isright','false');
		$(this).focus(function (){
			$(this).attr('type','password');
		});
		$(this).blur(function (){
			if ($(this).val()==='') {
				$(this).attr('type','text');
			} else {
				$(this).attr('isright','true');
			}
		});
	},
	//登录交互
	'login': function (){
		var This = this;
		$(this).click(function (){
			var iUsername = $('input').filter('[name=username]').val();
			var iPassword = $('input').filter('[name=password]').val();
			var iCode = $('input').filter('[name=verificationCode]').val()==='请输入验证码' ? '' : $('input').filter('[name=verificationCode]').val();
			var iClientId = 'admin';
			var iClientSecret = 'admin';
			if (iUsername==='请输入邮箱') {
				$('input').filter('[name=username]').css({
					'color': '#ff787b',
					'borderColor': '#ff787b'
				});
				return;
			} else if (iPassword==='请输入密码') {
				$('input').filter('[name=password]').css({
					'color': '#ff787b',
					'borderColor': '#ff787b'
				});
				return;
			} else if (iCode==='请输入验证码') {
				$('input').filter('[name=verificationCode]').css({
					'color': '#ff787b',
					'borderColor': '#ff787b'
				});
				return;
			}
			if ($('input').filter('[name=username]').attr('isright')==='false'||$('input').filter('[name=password]').attr('isright')==='false') {
				return;
			}
			$(this).html('正在登录中，请稍后...').css({
				'letterSpacing': 0,
				'textIndent': 0
			});
			$.getJSON('http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random(), function(data){
				var iAddress = data.Isp.split(' ')[0].toString();
				$.ajax({
					type:"post",
					dataType:"JSON",
					url:"http://192.168.1.104:80/authorize/authorize",
					async:true,
					data:{
						'client_id': 'admin',
						'client_secret': 'admin',
						'username': iUsername,
						'password': iPassword,
						'code': iCode,
						'address': iAddress
					},
					success: function (data){
						if(data.code==200){
							alert(1);
							$('.login-title .tip').addClass('hidden');
//							$.ajax({
//								url:'/lanyue-water/login',
//								type:'POST',
//								dataType:'JSON',
//								data:{'data':JSON.stringify(data)},
//								success:function(){
//									
//								}
//							})
						} else {
							$(this).html('登录').css({
								'letterSpacing': 14,
								'textIndent': 14
							});
							if (data.code==400009) {
								$('.code').removeClass('hidden');
							} else if (data.code==400010) {
								$('input').filter('[name=verificationCode]').css('borderColor','#ff787b');
							}
							$('input').filter('[name=username]').css('borderColor','#ff787b');
							$('input').filter('[name=password]').css('borderColor','#ff787b');
							$('.login-title .tip').removeClass('hidden');
							$('.login-title .tip p').html(data.error+'!');
							$('.code a').click(function (){
								$.ajax({
									type:"post",
									dataType:"JSON",
									url:"http://192.168.1.104:80/authorize/authorize",
									async:false,
									data:{
										'client_id': 'admin',
										'client_secret': 'admin',
										'username': iUsername,
										'password': iPassword,
										'code': iCode
									},
									success: function (){
										
									}
								});	
							});
						}
					}
				});
	    	});
		});	
	}
});

$('.wrap').stayCenter();
$('.imgBox').goRotate('Y',200,true);
$('.textBox').goRotate('Y',0,true);
$('.popup').popUp();
$('input').filter('[name=password]').passwordInput();
$('input').smartInput();
$('.loginBtn').login();
$('.username input').testEmal();
$('.pop-username').testEmal();