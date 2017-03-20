$.ajax({
	type: "get",
	url: "http://121.42.253.149:18801/v1/users",
	dataType: "JSON",
	data: {
		access_token: "58cbba8ad19b1425d08b04eb"
	},
	success: function(data) {
		console.log(data);
		if (data == null) {
			$(".noneData").css("display", "block");
		} else {
			$(".noneData").css("display", "none");
			
//角色公共函数

  
    	       

                	
//点击显示添加页面
			$(".btn-primary").on("click", function() {				
				$(".addAccountMask").fadeIn(200);
				 var oRole="";
				for(var i in data.rolesName){
					oRole+="<li class='disabled' rolename_id="+data.rolesName[i]._id+">"+data.rolesName[i].role_name+"</li>";
				}
				$(".accountRole ul").html(oRole);			
				//点击添加角色
				$(".addRole ul li").on("click", function() {
					var flag = 1;
					$(this).each(function(index, ele) {
						if (flag) {
							$(this).removeClass("disabled").addClass("cheacked");
							flag = 0;
						} else {
							$(this).removeClass("cheacked").addClass("disabled");
							flag = 1;
						}	
					 })
					$(".addRole ul .cheacked").each(function(index,ele){
						console.log(ele)
					})
					
				})
		    })
			
			
			var str = '';			
			for (var i = 0; i < data.rows.length; i++) {
				var str2 = '';			
				if (data.rows[i].roles) {						
					console.log(123);
//					str2+='<li class="cheacked>'+data.rows[i].roles[0]+'</li>'
					for(var j = 0; j<data.rows[i].roles.length; j++){					
			//			console.log(encodeURI((data.rows[i].roles[0].split("{")[1].split("}")[0])));
		//				if ($.type(data.rows[i].roles[j])=='string') {
						 str2 += '<li class="cheacked>'+data.rows[i].roles[j]+'</li>';									
		//				}						
					}
					
				}			
				 str= '<div class="accountList">' +
					'<div class="listTop">' +
						'<span>' + data.rows[i].fullname + '</span>' +
						'<i class="fa fa-wrench set" data-toggle="tooltip" data-placement="top" title="修改"></i>' +
						'<strong class="accountClose" data-toggle="tooltip" data-placement="top" title="删除">&times;</strong>' +
					'</div>' +
					'<div class="listName">' + data.rows[i].username + '</div>' +
					'<ul class="positionList" >'+str2+
					'</ul>' +'</div>';	
						
			$(".accountContent").append(str);
			console.log(str2)
		}
			console.log($(".accountList").index());
		}
		
		//修改账户
		$(".set").on("click", function() {
			var that = $(this);
			$(".modifyAccountMask").fadeIn(200);
			$.ajax({
				type: 'get',
				url: "http://192.168.1.114/v1/users",
				data: {
					access_token: "58cb60ba19ee5f287ca5520b"
				},
				success: function(data) {
					$("#modifyUsername").val(data.rows[that.parents(".accountList").index()].fullname);
					$("#modifyText").val(data.rows[that.parents(".accountList").index()].username);
					$("#modifyPhone").val(data.rows[that.parents(".accountList").index()].mobile);
					$("#modifyPassword").val(data.rows[that.parents(".accountList").index()].password);
					//修改账户
					var dataId=data;
					$(".modifyBtn").on("click", function() {
						if ($("#modifyText").val() == "请输入邮箱") {
					
								$("#modifyText").val("邮箱不能为空");
								$("#modifyText").css("color", "red");
							} else if ($("#modifyUsername").val() == "请输入姓名") {
								$("#modifyUsername").val("姓名不能为空");
								$("#modifyUsername").css("color", "red");
							} else if ($("#modifyPhone").val() == "请输入手机号") {
								$("#modifyPhone").val("手机号不能为空");
								$("#modifyPhone").css("color", "red");
							} else if ($("#modifyPhone").val() == "请输入正确的手机号") {
								$("#modifyPhone").val("请输入正确的手机号");
								$("#modifyPhone").css("color", "red");
							} else if ($("#modifyPassword").val() == "请输入密码(由6到16位字母数字下划线组成)") {
								$("#modifyPassword").val("密码不能为空");
								$("#modifyPassword").css("color", "red");
							} else if ($("#modifyPassword").val() == "请输入正确密码") {
								$("#modifyPassword").val("请输入正确密码");
								$("#modifyPassword").css("color", "red");
							}else {
							 $(".modifyAccountMask").fadeOut(200);
						var modifydata = "{'fullname':'"+ $("#modifyUsername").val()+ "','username':'"+ $("#modifyText").val() + "','password':'" + $("#modifyPassword").val() + "','mobile':'"+ $("#modifyPhone").val() + "','status':" + 1 + "}";
//						console.log(dataId.rows[that.parents(".accountList").index()]._id);
						$.ajax({
							type: 'put',
							url: "http://192.168.1.114/v1/users/"+dataId.rows[that.parents(".accountList").index()]._id,
							dataType: "JSON",
							data: {
								data: modifydata,
								access_token: "58cb60ba19ee5f287ca5520b"
							},
							success: function(data) {
								console.log(data);
							}
						})
						}
					});
				}
			});
		});
		$(".closeModify").on("click", function() {
			$(".modifyAccountMask").fadeOut(200);
//			roles($(".modifyAccount .accountRole ul"),$(".modifyAccount .accountRole ul li"));
		})
		var delId=data;
		$(".accountClose").on("click", function() {
			$(".delAccountMask").fadeIn(200);
			var that=$(this);
			//删除账户
				$(".sureDel").on("click",function(){
					$.ajax({
						  type: 'delete',
						  url: "http://192.168.1.114/v1/users/"+delId.rows[that.parents(".accountList").index()]._id+"?access_token=58cb600f19ee5f23e0873653",
						  success: function(data){
						  	console.log(data);
						  	location.reload("account.html") ;
						  	console.log(that.parents(".accountList"));
						  }		  
						})
					$(".delAccountMask").fadeOut(200);
					
				})
		})
		
		$(".closeDel").on("click", function() {
			$(".delAccountMask").fadeOut(200);				
		})
		$(".cancelDel").on("click", function() {
			$(".delAccountMask").fadeOut(200);
		})
	}
});

function blank(obj, str1, str2) {
	obj.on("focus", function() {
		obj.val(str1);
		obj.css("color", "#A4A4A4");
	})
	obj.on("blur", function() {
		if (obj.val() == "") {
			obj.val(str2);
		}
	})
}
blank($("#searchId"), "", "请输入姓名查找");
blank($("#addUsername"), "", "请输入姓名");
$('[data-toggle="tooltip"]').tooltip();
var re = /^[a-zA-Z0-9]+@\w+(.[a-zA-Z]+){1,2}$/; //验证邮箱
var tage = /^1[3|4|5|8][0-9]\d{8}$/; //验证手机号
var pass = /^\w{5,15}$/; //验证密码
function validate(obj, tar, str, str1) {
	obj.on("focus", function() {
		obj.val("");
		obj.css("color", "#A4A4A4");
	})
	obj.on("blur", function() {
		if (obj.val() != "") {
			if (!tar.test(obj.val())) {
				obj.val(str);
				obj.css("color", "red");
			}
		} else {
			obj.val(str1);

		};
	})
}
validate($("#addText"), re, "请输入正确的邮箱格式", "请输入邮箱");
validate($("#addPhone"), tage, "请输入正确的手机号", "请输入手机号");
validate($("#addPassword"), pass, "请输入正确密码", "请输入密码(由6到16位字母数字下划线组成)");
validate($("#modifyText"), re, "请输入正确的邮箱格式", "请输入邮箱");
validate($("#modifyPhone"), tage, "请输入正确的手机号", "请输入手机号");
validate($("#modifyPassword"), pass, "请输入正确密码", "请输入密码(由6到16位字母数字下划线组成)");
$(".btn-primary").on("click", function() {				
			$(".addAccountMask").fadeIn(200);
})

$(".addState").find("input").on("click",function(){
	$(".addState").find("input").removeClass(".stats");
	$(this).addClass(".stats");
})
$(".closeAdd").on("click", function() {
		$(".addAccountMask").fadeOut(200);
		
})

//点击添加账户

$(".addBtn").on("click", function() {
	
		if ($("#addText").val() == "请输入邮箱") {
			$("#addText").val("邮箱不能为空");
			$("#addText").css("color", "red");
		} else if ($("#addUsername").val() == "请输入姓名") {
			$("#addUsername").val("姓名不能为空");
			$("#addUsername").css("color", "red");
		} else if ($("#addPhone").val() == "请输入手机号") {
			$("#addPhone").val("手机号不能为空");
			$("#addPhone").css("color", "red");
		} else if ($("#addPhone").val() == "请输入正确的手机号") {
			$("#addPhone").val("请输入正确的手机号");
			$("#addPhone").css("color", "red");
		} else if ($("#addPassword").val() == "请输入密码(由6到16位字母数字下划线组成)") {
			$("#addPassword").val("密码不能为空");
			$("#addPassword").css("color", "red");
		} else if ($("#addPassword").val() == "请输入正确密码") {
			$("#addPassword").val("请输入正确密码");
			$("#addPassword").css("color", "red");
		} else {
			
			var data = "{'fullname':'" + $("#addUsername").val() + "','username':'" + $("#addText").val() + "','password':'" + $("#addPassword").val() + "','mobile':'" + $("#addPhone").val() + "','status':" + 1 + "}";
			$.ajax({
				type: 'POST',
				url: "http://192.168.1.114/v1/users",
				dataType: "JSON",
				data: {
					data: data,
					access_token: "58cb600f19ee5f23e0873653"
				},
				success: function(data) {
					console.log(data);
					alert(data.success);				
					$("#addText").val("请输入邮箱");
					$("#addUsername").val("请输入姓名");
					$("#addPhone").val("请输入手机号");
					$("#addPassword").val("请输入密码(由6到16位字母数字下划线组成)");
					location.reload("account.html") ;
				}
			})
		}
	})
//按回车键进行查找
$("#searchId").on("keyup",function(event){	
	if(event.keyCode==13){	
		ajaxRequest();
	}
})
function ajaxRequest(){
	var search="";
	var okey='{"fullname":"'+$("#searchId").val()+'"}';
	$(".accountContent").html("");
	$.ajax({
				type: 'get',
				url: "http://192.168.1.114/v1/users",
				dataType: "JSON",
				data: {
					like: okey,
					access_token: "58cb600f19ee5f23e0873653"
				},
				success: function(data) {
					for(var i=0;i<data.rows.length;i++){
						search= '<div class="accountList">' +
						'<div class="listTop">' +
							'<span>' + data.rows[i].fullname + '</span>' +
							'<i class="fa fa-wrench set" data-toggle="tooltip" data-placement="top" title="修改"></i>' +
							'<strong class="accountClose" data-toggle="tooltip" data-placement="top" title="删除">&times;</strong>' +
						'</div>' +
						'<div class="listName">' + data.rows[i].username + '</div>' +
						'<ul class="positionList" >'+
						'</ul>' +'</div>';							
						$(".accountContent").append(search);
					}
				}
		})
}
//按搜索图标进行查找
$(".fa-search").on("click",function(){
	ajaxRequest();
})

















