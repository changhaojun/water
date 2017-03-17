
	//左侧边栏的伸缩
		$(".onOff").click(function(){
			$("body").toggleClass("mini-navbar");
			$(".nav-label").toggleClass('onOff');
			if($("body").hasClass("mini-navbar")){
				$(".showHide").show();
				$(".logoHide").hide();
				$(".companyName").hide();
				$("[data-toggle='tooltip']").tooltip();
				
			}else{
				$(".showHide").hide();
				$(".logoHide").show();
				$(".companyName").show();
				$("[data-toggle='tooltip']").tooltip('destroy');//隐藏并销毁元素的提示工具。
			}
		});
		//侧边栏的下拉效果以及点击导航的li添加class
		$("#side-menu .changeLi>a").click(function(){
			if($("body").hasClass("mini-navbar")){
				$(this).next().hide();
			}else{
				/*$(this).find("slideToggle").next().stop().slideToggle(500);
				$("#side-menu .slideToggle").next().slideUp(500);*/
				$("#side-menu .changeLi").find(".nav-second-box").finish().slideUp(500);
				$(this).next().stop().slideToggle(500);
			}
			$("#side-menu .changeLi").removeClass("active");
			$(this).offsetParent().addClass("active");
		});
	//二维码的展现	
		$(".qrCode_dl").on({
			"mouseenter":function(){
				$(".qrCode").fadeIn(400);
			},
			"mouseleave":function(){
				$(".qrCode").hide();
			}
		});
	//个人信息的修改
		$("#personInfo").click(function(){
			$(".personMsg").slideToggle(500);
		});
		
	//导航的数据交互
	$.ajax({
		type:'get',
		url:"http://rap.taobao.org/mockjsdata/15031/v1/resources",
		datatype:'json',
		success:function(data){
			//console.log(data)
			var strNav=$('<li class="changeLi" data-type="" data-toggle="tooltip" data-placement="right"'+
			' title="'+data.resource_name+'"><a class="J_menuItem slideToggle" href="javascript:;">'+
			'<i class="fa fa-edit"></i><span class="nav-label">'+data.resource_name+'</span>'+
			'<span class="fa arrow"></span></a><div class="nav-second-box"><ul class="nav nav-second-level nav_list"></ul></div></li>');
			$('#side-menu .slideToggle a').after(strNav);
			var childData=data.children_resource;
			for (var i in childData){
				var childStr=$('<li><a class="J_menuItem" href="javascript:;" data-index="0">'+childData[i].resource_name+'</a></li>');	
		   }
			$(".nav_list").prepend(childStr)
		}	
		
	});
	//修改密码
	$(".personMsg a:nth-child(1)").click(function(){
		console.log(22);
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
	})
	
	//关闭弹窗
	$(".pop-close").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
	})
	//修改时确认密码
	$("")
