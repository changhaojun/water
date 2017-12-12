//项目中所有页面公用的代码(获取token,获取新token)
//var globalurl="http://192.168.1.104:9090";		//访问水务API地址
var globalurl="http://121.42.253.149:18808";		//访问水务API测试服务器地址
var manage_globalurl="http://121.42.253.149:18825";	//获取数据标签
//var auth_globalurl="http://121.42.253.149:18826";	//获取资源列表
var gatewayUrl="http://121.42.253.149:18840";		//下发API 测试服
var auth_globalurl="http://121.42.253.149:18826";//获取资源列表
var accesstoken;
var refreshToken;

var mqttHostIP="139.129.235.9"
var mqttName="admin"
var mqttWord="finfosoft123"
var portNum='61623'

//获取token
var getToken=function(callBack){
	$.ajax({
		url:'/frame/getToken',
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
					url:"/frame/saveToken",
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
