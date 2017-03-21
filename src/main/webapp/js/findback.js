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
	'testPassword': function (){
		$(this).val('');
		$(this).keyup(function (){
			if ($(this).val().length<6||$(this).val().length>16) {
				$(this).css('borderColor','#ff787b');
				$(this).siblings('.tip').removeClass('hidden');
				$('.submit-btn').attr($(this).attr('id'),'false');
			} else {
				$(this).css('borderColor','#1ab394');
				$(this).siblings('.tip').addClass('hidden');
				$('.submit-btn').attr($(this).attr('id'),'true');
			}
		});
	},
	'submitPassword': function (){
		$(this).click(function (){
			if ($('#new').val()=='') {
				$('#new').css('borderColor','#ff787b');
				$('#new').siblings('.tip').removeClass('hidden');
				return;
			} else if ($('#again').val()=='') {
				$('#again').css('borderColor','#ff787b');
				$('#again').siblings('.tip').removeClass('hidden');
				return;
			}
//			if ($(this).attr('new')==='true'||$(this).attr('again')==='true') {
//				
//			} else {
//				
//			}
		});
	}
});

$('.step1').stayCenter();
$('.step2').stayCenter();
$('#new').testPassword();
$('#again').testPassword();
$('.submit-btn').submitPassword();

