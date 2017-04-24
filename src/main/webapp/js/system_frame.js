	getToken();
	getNavData();
	$(".userName").append("欢迎你，"+user.fullname)
var flag=-1;
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
function getNavData(){
	$.ajax({
		type:'get',
		url:globalurl+"/v1/resources?access_token="+accesstoken,
		datatype:'json',
		success:function(data){
			
			if(data.code==400005){
				getNewToken()
				getNavData()
			}else if(data.length>0){
				var strNav="";
				for(var i=0 ;i<data.length;i++){
					var iIcon="";
					switch (data[i].resource_name) {
					case "账号管理": iIcon = 'fa-user-circle';break;
					case "数据标签配置":iIcon = 'fa-edit';break;
					case "框架页":iIcon = 'fa-microchip';break;
					case "组态":iIcon = 'fa-sitemap';break;
					case "操作日志":iIcon = 'fa-file-text-o';break;
					default :break;
					}
					
					if(data[i].is_navigation>0){
						var navURL="javascript:;"
							if(data[i].is_navigation==1){
								navURL="/finfosoft-water"+data[i].resource_url;
							}
						strNav=$('<li class="changeLi" data-type="" data-toggle="tooltip" data-placement="right"'+
								' title="'+data[i].resource_name+'"><a class="J_menuItem slideToggle" href="'+navURL+'" target="iframe0">'+
								'<i class="fa '+iIcon+'"></i><span class="nav-label">'+data[i].resource_name+'</span>'+
						'<span class="fa arrow"></span></a><div class="nav-second-box"><ul class="nav nav-second-level nav_list"></ul></div></li>');
						$('#side-menu ').append(strNav);
						if(data[i].children_resource.length){
							
							var childStr="";
							for(var j=0;j<data[i].children_resource.length;j++){							
								if(data[i].children_resource[j].is_navigation>0){
									var childData=data[i].children_resource[j];
									childStr+='<li><a class="J_menuItem" href="/finfosoft-water'+childData.resource_url+'" data-index="0" target="iframe0">'+childData.resource_name+'</a></li>';
										console.log(childStr);
								}
							
							}
							$(".changeLi .nav-second-box .nav_list").eq(i-1).append(childStr);
						}	
					}
					
				}
				//左侧边栏的伸缩
				$(".onOff").click(function(){
					$("body").toggleClass("mini-navbar");
					$(".nav-label").toggleClass('onOff');
					if($("body").hasClass("mini-navbar")){
						$(".showHide").show();
						$(".logoHide").hide();
						$(".companyName").hide();
						$(".nav_list").hide();
						$("[data-toggle='tooltip']").tooltip();
						
					}else{
						$(".showHide").hide();
						$(".logoHide").show();
						$(".nav_list").show();
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
					
				});
			}
		}	
	});
}
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
	//修改密码弹窗内确定事件
	$(".pop-submit").click(function(){
		$.ajax({
			type:"put",
			url:globalurl+"/v1/users",
			datatype:"json",
			data:{
				//old_password:dataPass,
				old_password:$(".oldPassword .pop-username").val(),
				new_password:$(".newPassword .pop-username").val(),
				confirm_password:$(".confirmPassword .pop-username").val(),
				access_token:accesstoken,
				_id:user.user_id
			},
			success:function(data){
				console.info(data)
				$(".popMsg").show();
				if(data.code==400011){
					$(".errorMsg i").addClass("error");
					$(".errorMsg span").html(data.error).css("color","#f55659");
					
					$(".popMsg .pop-close,.popMsg_content button").click(function(){
						$(".popMsg").hide();
						$(".oldPassword .pop-username").val("");
					});
				}else{
					$(".errorMsg i").removeClass("error");
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
	//点击退出
	
