$.fn.extend({
	//左侧轮播
	'goRotate': function (direction,offset,isRotate){
		var aChild = $(this).children();
		var iLen = aChild.length;
		var info = navigator.userAgent.toLowerCase();
		if (info.indexOf("msie 9")>=0||info.indexOf("msie 8")>=0||info.indexOf("msie 7")>=0) {
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
			var iObjWidth = This.outerWidth(true);
			var iObjHeight = This.outerHeight(true);
			var iDocWidth = $(document).outerWidth(true);
			var iDocHeight = $(document).outerHeight(true);
			This.css({
				'left': (iDocWidth-iObjWidth)/2,
				'top': (iDocHeight-iObjHeight)/2
			});
		}
	},
	//弹出层
	'popUp': function (){
		var msg;
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
			var re = /^[a-zA-Z0-9]+@\w+(.[a-zA-Z]+){1,2}$/;
			msg = $('.pop-username').val();
			if (re.test(msg)) {
				$('.pop').filter('.step1').addClass('hidden');
				$('.pop').filter('.step2').removeClass('hidden').stayCenter();
				$('.pop-message').html(msg);
			} else {
				$('.pop-username').val('请输入正确的邮箱地址');
			}
		});
		$('.pop-again').click(function (){
			$('.pop').filter('.step1').removeClass('hidden');
			$('.pop').filter('.step2').addClass('hidden');
		});
		$('.pop-mail').click(function (){
			var re = /^\w+@/;
			var iUrl = msg.replace(re,function (){
				return 'http://mail.';
			});
			window.open(iUrl);
		});
	},
	//文本框相应
	'smartInput': function (){
		$(this).focus(function (){
			if ($(this).val()==='请输入用户名'||$(this).val()==='请输入密码'||$(this).val()==='请输入正确的邮箱地址') {
				$(this).attr('originval',$(this).val()).val('');
			}
		});
		$(this).blur(function (){
			if ($(this).val()===''){
				if ($(this).attr('originval')==='请输入用户名'||$(this).attr('originval')==='请输入密码'||$(this).attr('originval')==='请输入正确的邮箱地址') {
					$(this).val($(this).attr('originval'));
				};
			}
		});
	},
	//密码框相应
	'passwordInput': function (){
		$(this).focus(function (){
			$(this).attr('type','password');
		});
		$(this).blur(function (){
			if ($(this).val()==='') {
				$(this).attr('type','text');
			}
		});
	},
	//登录交互
	'login': function (){
		$(this).click(function (){
			var iUsername = $('input').filter('[name=username]').val();
			var iPassword = $('input').filter('[name=password]').val();
			var iClientId = 'admin';
			var iClientSecret = 'admin';
			if (iUsername==='请输入用户名'||iPassword==='请输入密码') {
				return;
			} else {
				$.getJSON('http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_='+Math.random(), function(data){
					var iAddress = data.Isp.split(' ')[0].toString();
					$.ajax({
						type:"post",
						dataType:"JSON",
						url:"http://121.42.253.149:18801/authorize/authorize",
						async:true,
						data:{
							'username': iUsername,
							'password': iPassword,
							'client_id': 'admin',
							'client_secret': 'admin'
//							'code': '',
//							'address': iAddress
						},
						success: function (data){
							console.log(data);
							if(data.code==200){
								$.ajax({
									url:'/lanyue-water/login',
									type:'POST',
									dataType:'JSON',
									data:{'data':JSON.stringify(data)},
									success:function(){
										
									}
								})
							}
						}
					});
		      });
			}
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
