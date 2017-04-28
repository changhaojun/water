//项目中所有页面公用的代码(获取token,获取新token)
//var globalurl="http://192.168.1.104";
var globalurl="http://121.42.253.149:18808";
var itemName="/finfosoft-water";
var accesstoken;
var refreshToken;
//获取token
var getToken=function(callBack){
	$.ajax({
		url:itemName+'/frame/getToken',
		dataType : 'JSON',
		type : 'GET',
		async:false,
		success : function(data) {
			 accesstoken=data.accesstoken;
			 refreshToken=data.refreshToken;
			 callBack && callBack()
		}
	})
}
//获取新的token
var getNewToken=function(callBack){
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
			if(data.code==200){
				accesstoken=data.access_token;
				refreshToken=data.refresh_token;
				callBack && callBack();
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
