	var flag=-1;
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
		$("#side-menu .changeLi>a").each(function(i,ele){
			$(ele).click(function(){
				if(flag==i){
					$(this).offsetParent().removeClass("active");
					flag=-1;
				}else{
					flag=i;
					$("#side-menu .changeLi").removeClass("active");
					$(this).offsetParent().addClass("active");
				}
				//console.log(flag)
				if($("body").hasClass("mini-navbar")){
					$(this).next().hide();
				}else{
					/*$(this).find("slideToggle").next().stop().slideToggle(500);
					$("#side-menu .slideToggle").next().slideUp(500);*/
					$("#side-menu .changeLi").find(".nav-second-box").finish().slideUp(500);
					$(this).next().stop().slideToggle(500);
				}
				$("#side-menu .changeLi").removeClass("activeFocus");
				$(this).offsetParent().addClass("activeFocus");
			});
			
		})
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
		url:"http://rap.taobao.org/mockjsdata/15031/v1",
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
		//console.log(22);
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
	})
	
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
	});
	//修改时确认密码
	/*var dataPass="{'old_password':'"+$(".oldPassword").val()+",'new_password':"+$(".newPassword").val()+",'confirm_password':"+$(".confirmPassword").val()+"}";*/
	//旧密码
	$(".passwordOld").focus(function(){
		$(".oldPassword span").hide();
		$(this).css("border-color","#ccc");
	});
	$(".passwordOld").blur(function(){
		if($(".passwordOld").val()==""){
			$(this).next().show().html("原密码不能为空!");
			$(this).css("border-color","#e11818");
		}else{
			$(this).css("border-color","#1ab394");
		}
	});
	//新密码
	var passText="";
	$(".passwordNew ").blur(function(){
		var passReg = /[a-zA-Z\d+]{6,16}/;
		passText=$(this).val();
		if(passReg.test(passText)==false){
			$(this).next().show().html("密码为6-16位!");
			$(this).css("border-color","#e11818");
		}else{
			$(this).css("border-color","#1ab394");	
		}
	});
	$(".passwordNew").focus(function(){
		$(".newPassword span").hide();
		$(this).css("border-color","#ccc");
	});
	//确认新密码
	$(".passwordConfirm").blur(function(){
		if($(".passwordConfirm").val()!=passText){
		//console.log(passText)
			$(this).next().show().html("两次密码不一致");
			$(this).css("border-color","#e11818");
		}else if($(".passwordConfirm").val()==""){
			$(".confirmPassword span").hide();
			$(this).css("border-color","#ccc");
		}else{
			$(this).css("border-color","#1ab394");
		}
	});
	$(".passwordConfirm ").focus(function(){
		$(".confirmPassword span").hide();
		$(this).css("border-color","#ccc");
	});
	//点击确定事件
	$(".pop-submit").click(function(){
		//console.log($(".oldPassword .pop-username").val());
		//console.log($(".newPassword .pop-username").val());
		//console.log($(".confirmPassword .pop-username").val());
		$.ajax({
			type:"put",
			url:"http://192.168.1.104/v1/users",
			datatype:"json",
			data:{
				//old_password:dataPass,
				old_password:$(".oldPassword .pop-username").val(),
				new_password:$(".newPassword .pop-username").val(),
				confirm_password:$(".confirmPassword .pop-username").val(),
				access_token:"58cf4c9619ee5f1068248ded",
				_id:"58c1feb2cfd737459c3ed1a7"
			},
			success:function(data){
				$(".popMsg").show();
				if(data.code==400011){
					$(".errorMsg i").css('background','url(../img/icon_btn.png) no-repeat -32px 0;');
					$(".errorMsg span").html(data.error).css("color","#f55659");
					
					$(".popMsg .pop-close,.popMsg_content button").click(function(){
						$(".popMsg").hide();
						$(".oldPassword .pop-username").val("");
					});
				}else{
					//console.log(data[1])
					$(".errorMsg i").css('background','url(../img/icon_btn.png) no-repeat 0 0; ');
					$(".errorMsg span").html(data[1]).css("color","#1ab394");
					$(".popMsg_content button").click(function(){
						$('.pop').addClass('hidden');
						$('.pop-mask').addClass('hidden');
						
					});			
					$(".popMsg_content button,.popMsg .pop-close").click(function(){
						$(".popMsg").hide();
						$(".oldPassword .pop-username").val("");
					});
				}
			}
		});
		
	});
