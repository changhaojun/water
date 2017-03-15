
	var info = navigator.userAgent.toLowerCase();
	var flag=true;
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
		})
	//侧边栏的下拉效果以及点击导航的li添加class
		$("#side-menu .changeLi").click(function(){
			$("#side-menu .changeLi").find(".nav-second-box").slideUp(500);
			$(this).find(".nav-second-box").stop().slideToggle(500);
			$("#side-menu .changeLi").removeClass("active");
			$(this).addClass("active");
		})
	//二维码的展现	
		$(".qrCode_dl").on({
			"mouseenter":function(){
				$(".qrCode").fadeIn(400);
			},
			"mouseleave":function(){
				$(".qrCode").hide();
			}
		})
	//个人信息的修改
		$("#personInfo").click(function(){
			$(".personMsg").slideToggle(300);
		})
		
	