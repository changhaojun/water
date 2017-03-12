$.fn.extend({
	'goRotate': function (direction){
		var aChild = $(this).children();
		var iLen = aChild.length;
		var iHeight = $(this).height()/3;
		var iNum = 1;
		$(this).parent('.perspective').css('perspective',800);
		$(this).parent('.z').css({
			'transform': 'translateZ('+-iHeight+'px)',
			'transform-style': 'preserve-3d'
		});
		$(this).css({
			'transform-style': 'preserve-3d',
			'transition': '2s'
		});
		aChild.each(function (i,elem){
			$(elem).css({
				'transform': ''+direction+'('+-i*360/iLen+'deg) translateZ('+iHeight+'px)',
				'backface-visibility': 'hidden'
			});
		});
		$(this).timer = setInterval(function (This){
			This.css('transform',''+direction+'('+iNum*360/iLen+'deg)');
			iNum++;
		},4000,$(this));
	}
});

$('.imgBox').goRotate('rotateY');
$('.textBox').goRotate('rotateX');




