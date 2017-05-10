$(function(){
	getToken();
	console.log("thing_id:"+$('#thingId').val());	
	dataList()
})

function dataList(){
	console.log("thing_id"+$('#thingId').val());
	$.ajax({
		type: "get",
		url:'http://192.168.1.114/v1/things/58734ea511b69c22b0afa990/alarms',
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken
		},
		success:function(data){
			alert(1111)
			console.log(data);
			$(".dataContent").html("");
			if(data.length==0){
				$(".dataContent").html("<p>暂无数据</p>");
			}
			var str=''
			for(var i=0;i<data.length;i++){
				str='<div class="dataList" style="cursor:pointer;">'+
						'<div class="listTop normal" style="border-left-color: rgb(26, 179, 148);color: rgb(26, 179, 148)">'+
							'<span>'+data[i].device_name+'-'+data[i].data_name+'</span>'+
							'<span class="fa fa-list-alt" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="设封面"></span>'+
							'<span class="fa fa-plus-square" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="关注"></span>'+
						'</div>'+
						'<div class="listHr"></div>'+
						'<div class="listContent">'+
							'<div class="contentTop">'+
								'<div class="Itext">'+data[i].data_value+						
								'</div>'+						
							'</div>'+
							'<div class="contentBottom">'+
								'<span class="fa fa-clock-o">'+data[i].data_time+'</span>'+
							'</div>'+
						'</div>'+			
					'</div>'
				$(".dataContent").append(str);
			}
		}
	})
}
$('.dataContent .dataList').hover(function(){
	$('.dataContent .dataList .listTop span:eq(2)').show()
	$('.dataContent .dataList .listTop span:eq(3)').show()
},function(){
	$('.dataContent .dataList .listTop span:eq(2)').hide()
	$('.dataContent .dataList .listTop span:eq(3)').hide()
})
