var editId; 	//当点击编辑时所取到的目标数据ID
var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();		//公司ID
//获取账户列表
$(function(){
	getToken();
	allList();
})
function allList(){
	var searchFilter='{"company_code":"'+companyCode+'"}';
	$.ajax({
		type: "get",
		url: globalurl + "/v1/users",
		dataType: "JSON",
		async: true,
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
//点击显示添加页面
$(".btn-primary").on("click", function() {
		$(".addManageMask").fadeIn(200);		
		$(".accountNum span").css("display","none");
})
//关闭添加
$(".closeAdd").on("click", function() {
		$(".addManageMask").fadeOut(200);

})
//选择权限按钮
function setRole() {
	$(".addRole ul li").each(function(index, ele) {
		$(this).on("click", function() {
			if($(this).attr("class") == "disabled"){
					$(this).removeClass("disabled").addClass("cheacked");	
			}else{
				$(this).removeClass("cheacked").addClass("disabled");
			}
		})
	});
	
	$(".modifyRole ul li").each(function(index, ele) {
		$(this).on("click", function() {
			if($(this).attr("class") == "disabled"){
					$(this).removeClass("disabled").addClass("cheacked");	
			}else{
				$(this).removeClass("cheacked").addClass("disabled");
			}
		})
	})
};
//选择状态
setStatus($(".addManage input"));
function setStatus(obj) {
	obj.on("click", function() {
		obj.removeClass("stats");
		$(this).addClass("stats");
	})
}




