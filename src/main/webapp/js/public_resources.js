//项目中所有页面公用的代码(获取token,获取新token)
var globalurl="http://192.168.1.114";	
var itemName="/finfosoft-water";
var accesstoken;
var refreshToken;
//获取token
var getToken=function(){
	$.ajax({
		url:itemName+'/frame/getToken',
		dataType : 'JSON',
		type : 'GET',
		async:false,
		success : function(data) {
			console.info(data)
			 accesstoken=data.accesstoken;
			 refreshToken=data.refreshToken;
		}
	})
}
//获取新的token
var getNewToken=function(){
	$.ajax({
		url:globalurl+'/authorize/refresh_token',
		type:'GET',
		dataType:'JSON',
		async:false,
		data:{
			refresh_token:refreshToken,
			client_id:'admin',
			client_secret:'admin',
			grant_type:"refresh_token",
		},
		success:function(data){
			console.info(data)
			if(data.code==200){
				accesstoken=data.access_token;
				refreshToken=data.refresh_token;
				$.ajax({
					url:itemName+"/frame/saveToken",
					data:data,
					dataType:"JSON",
					async:false,
					type:"POST",
					success:function(json){
					}
				})
			}
		}
	})
}