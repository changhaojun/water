var editId; 	//当点击编辑时所取到的目标数据ID
var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();		//公司ID
//获取账户列表
$(function(){
	getToken();
	allList();
	showTips();
})
function allList(){
	var searchFilter='{"company_code":"'+companyCode+'"}';
	$.ajax({
		type: "get",
		url: globalurl + "/v1/users",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken,
			filter:searchFilter
		},
		success: function(data) {		
			if(data.code==400005){
				getNewToken();
				allList();
			}else if(data.rows.length>0){
				console.log(data)
				$(".accountContent").html("");
				if (data == null) {
					$(".noneData").css("display", "block");
				} else {
					$(".noneData").css("display", "none");
					var str = '';
					//获取列表页
					for (var i = 0; i < data.rows.length; i++) {
						var str2 = '';
						if (data.rows[i].roles) {
							for (var j = 0; j < data.rows[i].roles.length; j++) {
								str2 += '<li>' + data.rows[i].roles[j] + '</li>';
							}
						}
						str = '<div class="accountList" dataId="' + data.rows[i]._id + '">' +
						'<div class="listTop">' +
						'<span>' + data.rows[i].fullname + '</span>' +
						'<i class="fa fa-wrench set" data-toggle="tooltip" data-placement="top" title="修改" onclick="modify(&apos;' + data.rows[i]._id + '&apos;)"></i>' +
						'<strong class="accountClose" data-toggle="tooltip" data-placement="top" title="删除" onclick="deleteUser(&apos;' + data.rows[i]._id + '&apos;)">&times;</strong>' +
						'</div>' +
						'<div class="listName">' + data.rows[i].username + '</div>' +
						'<ul class="positionList" >' + str2 +
						'</ul>' + '</div>';
						$(".accountContent").append(str);
						
						//判断列表的状态
						if (data.rows[i].status == 0) {
							$(".accountList").eq(i).addClass("invalidList");
							$(".accountList .positionList").eq(i).find("li").addClass("disabled");
						} else {
							$(".accountList .positionList").eq(i).find("li").addClass("cheacked");
						}
					}
				}
				//获取角色列表
				var oRole = "";
				for (var i in data.rolesName) {
					oRole += "<li class='disabled' rolename_id=" + data.rolesName[i]._id + ">" + data.rolesName[i].role_name + "</li>";
				}
				$(".accountRole ul").html(oRole);	
			}
		}
	})
};
//点击添加角色
function setRole(obj) {
	obj.each(function(index, ele) {
		$(this).on("click", function() {
			if ($(this).attr("class") == "disabled") {
				$(this).removeClass("disabled").addClass("cheacked");
			} else {
				$(this).removeClass("cheacked").addClass("disabled");
			}
		})
	})
};
//点击显示添加页面
$(".btn-primary").on("click", function() {
		$(".addAccountMask").fadeIn(200);
		setRole($(".addRole ul li"));
})
//点击添加账户的保存
function addUser(){	
	if ($(".addState .stats").val() == "有效") {
		flag = 1;
	} else {
		flag = 0;
	}
	var flag;
	if ($("#addText").val() == "请输入邮箱") {
		$(".addaccountError").css("display", "block");
		$(".addaccountError").html("邮箱不能为空");
		$(".addaccountError").css("color", "#fff");
	} else if ($("#addUsername").val() == "请输入姓名") {
		$(".adduserError").css("display", "block");
		$(".adduserError").html("姓名不能为空");
		$(".adduserError").css("color", "#fff");
	} else if ($("#addPassword").val() == "请输入密码(由6到16位字母数字下划线组成)") {
		$(".addpassError").css("display", "block");
		$(".addpassError").html("密码不能为空");
		$(".addpassError").css("color", "#fff");
	} else if ($(".addpassError").html() == "请输入正确密码(6到16位字母数字或下划线)") {
		$(".addpassError").css("display", "block");
		$(".addpassError").html("请输入正确密码(6到16位字母数字或下划线)");
		$(".addpassError").css("color", "#fff");
	} else if ($("#addPhone").val() == "请输入手机号") {
		$(".addphoneError").css("display", "block");
		$(".addphoneError").html("手机号不能为空");
		$(".addphoneError").css("color", "#fff");
	} else if ($(".addphoneError").html() == "请输入正确的手机号") {
		$(".addphoneError").css("display", "block");
		$(".addphoneError").html("请输入正确的手机号");
		$(".addphoneError").css("color", "#fff");
	} else {
		
		//添加角色
		var addoRole = [];
		$(".addRole ul .cheacked").each(function(index, ele) {
			addoRole.push($(".addRole ul .cheacked").eq(index).attr("rolename_id"));
		})
		addoRole += "";
		var data = "{'fullname':'" + $("#addUsername").val() + "','username':'" + $("#addText").val() + "','password':'" + $("#addPassword").val() + "','mobile':'" + $("#addPhone").val() + "','status':" + flag + ",'company_id':'" + companyId + "','company_code':'" +companyCode+ "'}";
		$.ajax({
			type: 'POST',
			url: globalurl + "/v1/users",
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				'roles': addoRole,
				data: data,
				access_token: accesstoken
			},
			success: function(data) {
				console.log(data);
				$(".successMsg").css("display", "block");
				if (data.code == 200) {
					$(".successMsg .addback .backImg").css("background-position", "0px 0px");
					$(".successMsg .addback .addText").html(data.success);
					location.reload("account.html");
				} else {
					$(".successMsg .addback .backImg").css("background-position", "-32px 0px");
					$(".successMsg .addback .addText").html(data.error);
				}
				$(".addSuccess").on("click", function() {
					$(".addAccountMask").fadeOut(200);
					$(".successMsg").css("display", "none");

				});
			}
		})
	}
};
//修改账户
function modify(_id){
	editId = _id;
	setRole($(".modifyRole ul li"));
	$(".modifyRole ul li").removeClass("cheacked").addClass("disabled");
	$(".modifyAccountMask").fadeIn(200);
	$(".modifyState input").removeClass();
	$.ajax({
		type: 'get',
		crossDomain: true == !(document.all),
		url: globalurl + "/v1/users/"+_id,
		data: {
			access_token: accesstoken
		},
		success: function(data) {
			console.log(data);
			if (data.status) {
				$(".modifyState #modifyValid").addClass("stats")
			} else {
				$(".modifyState #modifyInvalid").addClass("stats")
			}
			$(data.roles).each(function(index, ele) {
				if (ele == $(".modifyRole ul li").eq(index).html()) {
					$(".modifyRole ul li").eq(index).removeClass("disabled").addClass("cheacked")
				}
			})
			$("#modifyUsername").val(data.fullname);
			$("#modifyText").val(data.username);
			$("#modifyPhone").val(data.mobile);
			$("#modifyPassword").val(data.password);
		}
	});
}

//确定修改
function sureModify() {
	if ($("#modifyText").val() == "请输入邮箱") {
		$(".modifyaccountError").css("display", "block");
		$(".modifyaccountError").html("邮箱不能为空");
		$(".modifyaccountError").css("color", "#fff");
	} else if ($("#modifyUsername").val() == "请输入姓名") {
		$(".modifyuserError").css("display", "block");
		$(".modifyuserError").html("姓名不能为空");
		$(".modifyuserError").css("color", "#fff");
	} else if ($("#modifyPhone").val() == "请输入手机号") {
		$(".modifyphoneError").css("display", "block");
		$(".modifyphoneError").html("手机号不能为空");
		$(".modifyphoneError").css("color", "#fff");
	} else if ($(".modifyphoneError").html() == "请输入正确的手机号") {
		$(".modifyphoneError").css("display", "block");
		$(".modifyphoneError").html("请输入正确的手机号");
		$(".modifyphoneError").css("color", "#fff");
	} else if ($("#modifyPassword").val() == "请输入密码(由6到16位字母数字下划线组成)") {
		$(".modifypassError").css("display", "block");
		$(".modifypassError").html("密码不能为空");
		$(".modifypassError").css("color", "#fff");
	} else if ($(".modifypassError").html() == "请输入正确密码(6到16位字母数字或下划线)") {
		$(".modifypassError").css("display", "block");
		$(".modifypassError").html("请输入正确密码(6到16位字母数字或下划线)");
		$(".modifypassError").css("color", "#fff");
	} else {
		//修改状态
		var setVar;
		if ($(".modifyState .stats").val() == "有效") {
			setVar = 1;
		} else {
			setVar = 0;
		}
		//添加角色
		var addoRole = [];
		$(".modifyRole ul .cheacked").each(function(index, ele) {
			addoRole.push($(".modifyRole ul .cheacked").eq(index).attr("rolename_id"));
		})
		addoRole += "";
		var modifydata = "{'fullname':'" + $("#modifyUsername").val() + "','username':'" + $("#modifyText").val() + "','password':'" + $("#modifyPassword").val() + "','mobile':'" + $("#modifyPhone").val() + "','status':" + setVar + "}";
		$.ajax({
			type: 'put',
			url: globalurl + "/v1/users/" +editId,
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				roles: addoRole,
				data: modifydata,
				access_token: accesstoken
			},
			success: function(data) {
				$(".modifyMsg").css("display", "block");
				if (data.code == 200) {
					$(".modifyMsg .modifyback  .backImg").css("background-position", "0px 0px");
					$(".modifyMsg .modifyback .modifyText").html(data.success);

				} else {
					$(".modifyMsg .modifyback .backImg").css("background-position", "-32px 0px");
					$(".modifyMsg .modifyback  .modifyText").html(data.error);
				}
				$(".modifySuccess").on("click", function() {
					$(".addAccountMask").fadeOut(200);
					$(".modifyMsg").css("display", "none");
					location.reload("account.html");
				});
			}
		})
	}
};
//关闭修改
$(".closeModify").on("click", function() {
		$(".modifyAccountMask").fadeOut(200);
})
//删除账户;
function deleteUser(_id){
	editId=_id;
	$(".delAccountMask").fadeIn(200);
}
//删除账户
function sureDel() {
	$.ajax({
		type: 'delete',
		crossDomain: true == !(document.all),
		url: globalurl + "/v1/users/" + editId + "?access_token=" + accesstoken,
		success: function(data) {
			location.reload("account.html");
			$(".delAccountMask").fadeOut(200);
		}
	})
}
//关闭删除
$(".closeDel").on("click", function() {
	$(".delAccountMask").fadeOut(200);
})
//取消删除
$(".cancelDel").on("click", function() {
	$(".delAccountMask").fadeOut(200);
})
//按搜索键进行查找聚焦失焦
function event(obj, str) {
	obj.on("focus", function() {
		if (obj.val() == str) {
			obj.val("");
		}
	})
	obj.on("blur", function() {
		if (obj.val() == "") {
			obj.val(str);
		}
		if (obj.val() != "") {
			$(".adduserError").html("");
			$(".modifyuserError").html("");
		}
	})
}
event($("#searchId"), "请输入姓名查找")
event($("#addUsername"), "请输入姓名")
event($("#modifyUsername"), "请输入姓名")
var re = /^[a-zA-Z0-9]+@\w+(\.[a-zA-Z]+){1,2}$/; //验证邮箱
var phone = /^1[3|4|5|8][0-9]\d{8}$/; //验证手机号
var pass = /^\w{6,16}$/; //验证密码
function blank(obj1, obj2, str1, str2, Var) {
	obj1.on("focus", function() {
		if (obj1.val() == str1) {
			obj1.val("");
		}
	})
	obj1.on("blur", function() {
		if (obj1.val() == "") {
			obj1.val(str1);
		} else {
			if (!Var.test(obj1.val())) {
				obj2.css("display", "block");
				obj2.html(str2);
				obj2.css("color", "#fff");
			} else {
				obj2.html("");
				obj2.css("display", "none");
			}
		}
	})
}
blank($("#addText"), $(".addaccountError"), "请输入邮箱", "请输入正确的邮箱格式", re);
blank($("#addPassword"), $(".addpassError"), "请输入密码(由6到16位字母数字下划线组成)", "请输入正确密码(6到16位字母数字或下划线)", pass);
blank($("#addPhone"), $(".addphoneError"), "请输入手机号", "请输入正确的手机号", phone);
blank($("#modifyText"), $(".modifyaccountError"), "请输入邮箱", "请输入正确的邮箱格式", re);
blank($("#modifyPassword"), $(".modifypassError"), "请输入密码(由6到16位字母数字下划线组成)", "请输入正确密码(6到16位字母数字或下划线)", pass);
blank($("#modifyPhone"), $(".modifyphoneError"), "请输入手机号", "请输入正确的手机号", phone);
//初始化提示框

function showTips(){
	$('[data-toggle="tooltip"]').tooltip();
}

//选择状态
setStatus($(".addState input"));
setStatus($(".modifyState input"));

function setStatus(obj) {
	obj.on("click", function() {
		obj.removeClass("stats");
		$(this).addClass("stats");
	})
}
//关闭添加
$(".closeAdd").on("click", function() {
		$(".addAccountMask").fadeOut(200);

})
//按回车键进行查找
$("#searchId").on("keyup", function(event) {
	if (event.keyCode == 13) {
		ajaxRequest();
	}
})

function ajaxRequest() {
	var search = "";
	if($("#searchId").val()==""){
		allList();
	}else{
		var okey = '{"fullname":"' + $("#searchId").val() + '"}';
		$(".accountContent").html("");
		$.ajax({
			type: 'get',
			url: globalurl + "/v1/users",
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				like: okey,
				access_token: accesstoken
			},
			success: function(data) {
				var str = '';
				//获取列表页
				for (var i = 0; i < data.rows.length; i++) {
					var str2 = '';
					if (data.rows[i].roles) {
						for (var j = 0; j < data.rows[i].roles.length; j++) {
							str2 += '<li>' + data.rows[i].roles[j] + '</li>';
						}
					}
					str = '<div class="accountList">' +
						'<div class="listTop">' +
						'<span>' + data.rows[i].fullname + '</span>' +
						'<i class="fa fa-wrench set" data-toggle="tooltip" data-placement="top" title="修改"></i>' +
						'<strong class="accountClose" data-toggle="tooltip" data-placement="top" title="删除">&times;</strong>' +
						'</div>' +
						'<div class="listName">' + data.rows[i].username + '</div>' +
						'<ul class="positionList" >' + str2 +
						'</ul>' +
						'</div>';
					$(".accountContent").append(str);
					//判断列表的状态
					if (data.rows[i].status == 0) {
						$(".accountList").eq(i).addClass("invalidList");
						$(".accountList .positionList").eq(i).find("li").addClass("disabled");
					} else {
						$(".accountList .positionList").eq(i).find("li").addClass("cheacked");
					}
				}
			}
		})
	}	
}
//按搜索图标进行查找
$(".fa-search").on("click", function() {
	ajaxRequest();
})