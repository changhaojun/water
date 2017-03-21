$('[data-toggle="tooltip"]').tooltip();

function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}
topColor($(".listUl li span:nth-child(3) i:nth-child(1)"),"#1ab394");
topColor($(".listUl li span:nth-child(3) i:nth-child(2)"),"#1ab394");
topColor($(".listUl li span:nth-child(3) i:nth-child(3)"),"#ffb400");
topColor($(".listUl li span:nth-child(3) i:nth-child(4)"),"#ff787b");
//ip地址
var URL="http://rap.taobao.org/mockjsdata/15031/v1/devices";
//获得设备列表;
$.ajax({
	type: "get",
	url: URL,
	dataType: "JSON",
	async:false,
	crossDomain: true == !(document.all),
	data: {
		access_token: "58cf4c9619ee5f1068248ded"
	},
	success: function(data) {
		//分页;
		console.log(data.rows);
		var page="";
		var listUl="";
		var total=Math.ceil(data.total/10);//分页总数
		for(var i=0;i<total;i++){
			page="<li><a href='###'>"+(i+1)+"</li>";
			listUl="<ul class='listUl'></ul>";
			$(".boxFooter>nav .pagination").append(page);
			$(".boxList .listContent").append(listUl);
		}
		//总的列表页;	
		var listLi="";	
		var status="";
		for(var i=0;i<data.rows.length;i++){
			//判断状态;
			if(data.rows[i].status){
				status="在线";
				
			}else{
				status="离线";				
			}
			listLi+='<li><span>'+data.rows[i].device_name+'</span>'+
						'<span class="nolineStatus">'+
							'<i></i>'+
							'<strong class="status">'+status+'</strong>'
						'</span>'+
						'<span>'+
							'<i class="fa fa-laptop" data-toggle="tooltip" data-placement="top" title="查看"></i>'+
							'<i class="fa fa-arrow-circle-down" data-toggle="tooltip" data-placement="top" title="下发"></i>'+
							'<i class="fa fa-cog" data-toggle="tooltip" data-placement="top" title="修改"></i>'+
							'<i class="fa fa-trash" data-toggle="tooltip" data-placement="top" title="删除"></i>'+
						'</span>'+
					'</li>';
			for(var j=0;j<10;j++){
				$(".listUl").append(listLi);
			}
			//判断列表的个数;
//			if (i!=0&&i%10==0) {
//				$(".listUl").eq(i/10-1).append(listLi);
//				listLi='';
//			} else {
//				$(".listUl").eq(Math.floor(i/10)).append(listLi);
//			}
		
		}
		
	}	
})


