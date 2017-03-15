$.ajax({
	type:"get",
	url:"http://rap.taobao.org/mockjsdata/15031/users",
	dataType:"JSON",
	data:{
		
	},
	success:function(data){
		console.log(data);
		if(data==null){
			$(".noneData").css("display","block");
		}else{
			$(".noneData").css("display","none");
				for(i=0;i<data.rows.length;i++){
					var str='<div class="accountList">'+
						'<div class="listTop">'+
							'<span>'+data.rows[i].fullname+'</span>'+
							'<i class="fa fa-wrench" data-toggle="tooltip" data-placement="top" title="修改"></i>'+
							'<strong class="accountClose" data-toggle="tooltip" data-placement="top" title="删除">&times;</strong>'+
						'</div>'+
						'<div class="listName">'+data.rows[i].username+'</div>'+
						'<ul class="positionList" >'+
						'</ul>'+
					'</div>'
				for(j=0;j<data.rows[i].roles.length;j++){
					console.log(data.rows[i].roles[j])
					var str2='<li class="cheacked>'+JSON.stringify(data.rows[i].roles[j])+'</li>';
				}
			$(".positionList").append(str2);
			$(".accountContent").append(str);
			}
			
		}
		
	$(".btn-primary").on("click",function(){
	$(".addAccountMask").fadeIn(200);
	
})
$(".closeAdd").on("click",function(){
	$(".addAccountMask").fadeOut(200);
})
$(".fa-wrench").on("click",function(){
	$(".modifyAccountMask").fadeIn(200);
})
$(".closeModify").on("click",function(){
	$(".modifyAccountMask").fadeOut(200);
})
$(".accountClose").on("click",function(){
	$(".delAccountMask").fadeIn(200);
})
$(".closeDel").on("click",function(){
	$(".delAccountMask").fadeOut(200);
})
$(".cancelDel").on("click",function(){
	$(".delAccountMask").fadeOut(200);
})
		
	}
});


function blank(obj,str1,str2){
	obj.on("focus",function(){
		obj.val(str1);	
		obj.css("color","#A4A4A4");
	})
	obj.on("blur",function(){
		if(obj.val()==""){
			obj.val(str2);
		}		
	})
}
blank($("#searchId"),"","输入关键字来查找您的账号");
blank($("#addUsername"),"","请输入姓名");
$('[data-toggle="tooltip"]').tooltip();
var re = /^[a-zA-Z0-9]+@\w+(.[a-zA-Z]+){1,2}$/;//验证邮箱
var tage=/^1[3|4|5|8][0-9]\d{8}$/;//验证手机号
function validate(obj,tar,str,str1){
	obj.on("focus",function(){
			obj.val("");
			obj.css("color","#A4A4A4");
		})
	obj.on("blur",function(){	
			if(obj.val()!=""){
				if(!tar.test(obj.val())){
				obj.val(str);
				obj.css("color","red");
			}
			}else{
				obj.val(str1);
				
			};
		})
}
validate($("#addText"),re,"请输入正确的邮箱格式","请输入邮箱");
validate($("#addPhone"),tage,"请输入正确的手机号","请输入手机号");
$("#sureBtn").on("click",function(){
	if($("#addText").val()=="请输入邮箱"){
		console.log(123);
		$("#addText").val("邮箱不能为空");
		$("#addText").css("color","red");
	}else if($("#addUsername").val()=="请输入姓名"){
		$("#addUsername").val("姓名不能为空");
		$("#addUsername").css("color","red");
	}else if($("#addPhone").val()=="请输入手机号"){
		$("#addPhone").val("手机号不能为空");
		$("#addPhone").css("color","red");
	}else{
		$.ajax({
		  type: 'POST',
		  url: "http://rap.taobao.org/mockjsdata/15031/users",
		  dataType: "JSON",
		  data: {
		  	"fullname":$("#addUsername").val(),
		  	"username":$("#addText").val(),
		  	"password":$("#addPhone").val(),
		  	"status":1
		  },
		  success: function(data){
		  	console.log(data);
		  }		  
		})
	}	
})






















