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
	//按钮组切换
	'tabButton': function (){
		$(this).children().click(function (){
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
		});
	}
});

$.extend({
	'init': function (){
		$.each($('input'),function (){
			$(this).smartInput();
		});
		$('.controlBtn').tabButton();
	}
});

$.init();