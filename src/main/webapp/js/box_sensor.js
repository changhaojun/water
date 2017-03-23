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
				$(this).val($(this).attr('tip'));
				$(this).css('borderColor','#e5e6e7');
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

	$.each($('input'),function (){
		$(this).smartInput();
	});
	$('.controlBtn').tabButton();
	
//点击编辑弹窗
	$(".detialData table td i").click(function(){
		//console.log(22);
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
	})
	
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
	});
	//数据配置处鼠标滑上的信息提示
	$("[data-toggle='tooltip']").tooltip();	
	//选择采集器ID触发的事件
	var collector_id="";
	collectorSelect();
	function collectorSelect(){
		$.ajax({
			type:"get",
			datatype:"json",
			async:false,
			url:"http://rap.taobao.org/mockjs/15031/v1/controllers",
			success:function(data){
				//console.log(data);
				collector_id=data.collector_id;
				var str='<option class="op1">'+collector_id+'</option>';
				$(".collector select option:selected").after(str);
				console.log($(".op1").html())
				$(".collector select").change(function(){
					modelCollector();
				})
			}
			//http://rap.taobao.org/mockjs/15031/v1/collectorModels
		});
	};
	//根据采集器ID获取采集器型号的信息
	
	function modelCollector(){
		$.ajax({
			type:"post",
			dataType:"JSON",
			url:"http://rap.taobao.org/mockjsdata/15031/v1/collectorModels",
			/*data:{
				collector_id=$(".op1").html()
			},*/
			success:function(data) {
				console.log(data);
				
			}
		});
	}
