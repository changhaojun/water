	getToken();
	getNavData();
	var companyId=$('#companyId').val();
	getMsgNum();
	var guid=guidGenerator();
	MQTTconnect();
	$(".userName").append("欢迎你，"+user.fullname)
var flag=-1;
	//二维码的展现	
		$(".qrCode_dl").on({
			"mouseenter":function(){
				$(".qrCode").fadeIn(400);
			},
			"mouseleave":function(){
				$(".qrCode").hide();
			},
		});
		$(".qrCode").mouseleave(function(){
			$(".qrCode").hide();
		})
	//个人信息的修改
	$("#personInfo").on({
		"mouseenter":function(){
			$(".personMsg").stop().slideDown(500);
		},
		"mouseleave":function(){
			$(".personMsg").finish().slideUp(500);
		}
	})
		
	
	var dataNav=[],childData=[];	
	//导航的数据交互
function getNavData(){
	$.ajax({
		type:'get',
		crossDomain: true == !(document.all),
		url:globalurl+"/v1/resources?access_token="+accesstoken,
		datatype:'json',
		success:function(data){
			if(data.code==400005){
				getNewToken()
				getNavData()
			}else if(data.length>0){
				var strNav="";
				var iIcon="";
				for(var i=0 ;i<data.length;i++){
					if(data[i].is_navigation>0){
						var navURL="javascript:;"
						if(data[i].is_navigation==1){
							navURL="/finfosoft-water"+data[i].resource_url;
						}
						var dataJson='{"resourceName":"'+data[i].resource_name+'","resourceUrl":"'+navURL+'","dataNum":"'+i+'"}';
						dataJson=JSON.parse(dataJson);
						dataNav.push(dataJson);
					}
				}
				for(var j in dataNav){
					switch (dataNav[j].resourceName) {
						case "账号管理": iIcon = 'fa-user-circle';break;
						case "数据标签配置":iIcon = 'fa-edit';break;
						case "组态":iIcon = 'fa-microchip';break;
						case "实体":iIcon = 'fa-sitemap';break;
						case "操作日志":iIcon = 'fa-file-text-o';break;
						case "任务配置":iIcon = 'fa-calendar';break;
						case "运行数据":iIcon = 'fa-database';break;
						default :break;
					}
					strNav=$('<li class="changeLi" data-type="" data-toggle="tooltip" data-placement="right"'+
								' title="'+dataNav[j].resourceName+'"><a class="J_menuItem slideToggle" href="'+dataNav[j].resourceUrl+'" target="iframe0">'+
								'<i class="fa '+iIcon+'"></i><span class="nav-label">'+dataNav[j].resourceName+'</span>'+
						'<span class="fa arrow"></span></a><div class="nav-second-box"><ul class="nav nav-second-level nav_list"></ul></div></li>');
					$('#side-menu ').append(strNav);
					var m=dataNav[j].dataNum;
					if(data[m].children_resource.length){
						var childStr="";
						for(var t=0;t<data[m].children_resource.length;t++){
							if(data[m].children_resource[t].is_navigation>0){
								var childData=data[m].children_resource[t];
								childStr+='<li><a class="J_menuItem" href="/finfosoft-water'+childData.resource_url+'" data-index="0" target="iframe0">'+childData.resource_name+'</a></li>';
							}
						}
						$(".changeLi .nav_list").eq(j).append(childStr);
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
				$(".navbar-default").on({
					"mouseenter":function(){
						if($("body").hasClass("mini-navbar")){
							$("[data-toggle='tooltip']").tooltip();
						}else{
							$("[data-toggle='tooltip']").tooltip('destroy');
						}
					},
					"mouseleave":function(){
						$("[data-toggle='tooltip']").tooltip('destroy');
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
						if($("body").hasClass("mini-navbar")){
							$(this).next().hide();
						}else{
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
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
		
	})
	
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
		$(".pop-username").val("");
		$(".pop-main").find("span").hide();
		$(".pop-main .pop-username").css("border","1px solid #ccc");
	});
	//修改时确认密码
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
		if($(".passwordConfirm").val()==""){
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
		var passReg = /[a-zA-Z\d+]{6,16}/;
		passText=$(".passwordNew").val();
		if($(".passwordOld").val()==""){
			$(this).next().show().html("原密码不能为空!");
			$(this).css("border-color","#e11818");
		}else if(passReg.test(passText)==false){
			$(".passwordNew").next().show().html("密码为6-16位!");
			$(".passwordNew").css("border-color","#e11818");
		}else{
			editPassword();
		}
	});
	//修改密码
	function editPassword(){
		$.ajax({
			type:"put",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/users",
			datatype:"json",
			data:{
				old_password:$(".oldPassword .pop-username").val(),
				new_password:$(".newPassword .pop-username").val(),
				confirm_password:$(".confirmPassword .pop-username").val(),
				access_token:accesstoken,
				_id:user.user_id
			},
			success:function(data){
				$(".popMsg").show();
				if(data.code==400011){
					$(".errorMsg i").addClass("error");
					$(".errorMsg span").html(data.error).css("color","#f55659");
					$(".passwordOld ").val("");
					
				}else {
					if(data.code==400012){
						$(".errorMsg i").addClass("error");
						$(".errorMsg span").html(data.error).css("color","#f55659");
						$(".passwordNew ").val("");
						$(".passwordConfirm ").val("");
						
					}else{
						$(".errorMsg i").removeClass("error");
						$(".errorMsg span").html(data[1]).css("color","#1ab394");
						$(".popMsg_content button").click(function(){
							$('.pop').addClass('hidden');
							$('.pop-mask').addClass('hidden');
							
						});			
							$(".pop-username").val("");
							//$(".confirmPassword .pop-username").val("");
						
					}
					
				}
			}
		});
	}
	
$(".popMsg_content button,.popMsg .pop-close").click(function(){
	$(".popMsg").hide();
	
});

function getMsgNum(){
	$.ajax({
		type:'get',
		crossDomain: true == !(document.all),
		url:globalurl+"/v1/alarmHistorys",
		datatype:'json',
		data:{
			access_token:accesstoken,
			filter:'{"company_id":"'+$('#companyId').val()+'"}'
		},
		success:function(data){
			$('.msgNum').text(data.untreated)
		}
	});
}

//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function MQTTconnect(){
	console.log("订阅程序开始执行");
//	var mqttHost = '139.129.231.31';
//	var username = "admin";
//	var password = "finfosoft123";
	var mqttHost = '192.168.1.114';
	var username = "admin";
	var password = "password";
	client = new Paho.MQTT.Client(mqttHost, Number(61623), "server" + parseInt(Math.random() * 100, 10));
	var options = {
		timeout: 1000,
		onSuccess: onConnect,
		onFailure: function(message) {
			setTimeout(MQTTconnect, 10000000);
		}
	};
	// set callback handlers
	client.onConnectionLost = onConnectionLost;
	client.onMessageArrived = onMessageArrived;
	
	if(username != null) {
		options.userName = username;
		options.password = password;
	}
	client.connect(options);
	// connect the clien
}

// called when the client connects
function onConnect() {
    console.log("onConnect");
    topic = companyId;
    client.subscribe(topic);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:" + responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  var topic = message.destinationName;
  var payload = JSON.parse(message.payloadString);
  console.info(payload)
  toastr.options = {
	  "closeButton":true,
	  "debug":false,
	  "progressBar":true,
	  "positionClass":"toast-top-right",
	  "onclick":null,
	  "showDuration": "400",
	  "hideDuration": "1000",
	  "timeOut": "7000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
   toastr.error('告警!&nbsp;&nbsp;'+payload.whole_name+'&nbsp;&nbsp;&nbsp;&nbsp;当前值：'+payload.data_value+payload.data_unit);
   var alarmNum=$('.msgNum').text();
   $('.msgNum').text(Number(alarmNum)+1);
}
