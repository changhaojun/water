$.fn.extend({
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
			var iDocHeight = $(window).height()-50;
			This.css({
				'left': (iDocWidth-iObjWidth)/2,
				'top': (iDocHeight-iObjHeight)/2
			});
		}
	},
	//密码长度验证
	'testLength': function (){
		$(this).keyup(function (){
			if ($(this).val().length<6||$(this).val().length>16) {
				$(this).css('borderColor','#ff787b');
				$(this).siblings('.tip').removeClass('hidden');
			} else {
				$(this).css('borderColor','#1ab394');
				$(this).siblings('.tip').addClass('hidden');
			}
		});
		$(this).focus(function (){
			$('#again').css('borderColor','#1ab394');
			$('#again').siblings('.tip').addClass('hidden');
			$('.submit-btn').attr('isright','true');
		});
		$(this).blur(function (){
			if ($(this).val()!==$('#again').val()) {
				$('.submit-btn').attr('isright','false');
				if ($('#again').val()!=='') {
					$('#again').css('borderColor','#ff787b');
					$('#again').siblings('.tip').removeClass('hidden');
					$('.submit-btn').attr('isright','false');
				}
			}
		});
	},
	//验证两次密码输入
	'testEqual': function (){
		$(this).blur(function (){
			if ($(this).val()!==$('#new').val()) {
				$(this).css('borderColor','#ff787b');
				$(this).siblings('.tip').removeClass('hidden');
				$('.submit-btn').attr('isright','false');
			} else {
				$(this).css('borderColor','#1ab394');
				$(this).siblings('.tip').addClass('hidden');
				$('.submit-btn').attr('isright','true');
			}
		});
	},
	'submitPassword': function (){
		$(this).attr('isright','false');
		$(this).click(function (){
			if ($('#new').val()=='') {
				$('#new').css('borderColor','#ff787b');
				$('#new').siblings('.tip').removeClass('hidden');
				$(this).attr('isright','false');
				return;
			} else if ($('#again').val()=='') {
				$('#again').css('borderColor','#ff787b');
				$('#again').siblings('.tip').removeClass('hidden');
				$(this).attr('isright','false');
				return;
			}
			if ($(this).attr('isright')==='true') {
				$(this).html('正在重置密码，请稍后...').css({
					'letterSpacing': 0,
					'textIndent': 0,
					'textAlign': 'center'
				});
				$.ajax({
					type:"put",
					dataType:"json",
					url:"http://192.168.1.107:80/v1/users",
					async:true,
					data:{
						'username': '543943341@qq.com',
						'new_password': $('#new').val(),
						'confirm_password': $('#again').val()
					},
					success: function (data){
						console.log(data);
						$('.step1').addClass('hidden');
						$('.step2').removeClass('hidden');
					}
				});
			}
		});
	}
});

$('.wrap').stayCenter();
$('#new').testLength();
$('#again').testEqual();
$('.submit-btn').submitPassword();

