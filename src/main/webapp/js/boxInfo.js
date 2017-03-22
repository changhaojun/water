$(function(){
	toolTip();
})
//ip地址
var URL="http://rap.taobao.org/mockjsdata/15031/v1/devices";
//获得设备列表;
var curpage;
$.ajax({
	type: "get",
	url: URL,
	dataType: "JSON",
	crossDomain: true == !(document.all),
	data: {
		access_token: "58ccb57ed77a1e1e04ceb09e"
	},
	success: function(data) {
		$(".sum").html(data.total);
		//分页;
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
//		console.log(data.rows.length)
		for(var i=0;i<data.rows.length;i++){
			//判断状态;
			if(data.rows[i].status){
				status="在线";				
			}else{
				status="离线";				
			}
			listLi+='<li  dataId="'+data.rows[i]._id+'"><span>'+data.rows[i].device_name+'</span>'+
						'<span class="nolineStatus">'+
							'<i></i>'+
							'<strong class="status">'+status+'</strong>'+
						'</span>'+
						'<span>'+
							'<i class="fa fa-laptop"onclick="look('+data.rows[i]._id+')"></i>'+
							'<i class="fa fa-arrow-circle-down"onclick="Issued('+data.rows[i]._id+')"></i>'+
							'<i class="fa fa-cog" onclick="modify('+data.rows[i]._id+')"></i>'+
							'<i class="fa fa-trash" onclick="delete('+data.rows[i]._id+')"></i>'+
						'</span>'+
					'</li>';			
//			判断列表的个数;
			if (i!=0&&i%10==0) {
				$(".trans").html(i);
				$(".listUl").eq(i/10-1).append(listLi);
				listLi='';
			} else {
				$(".first").html(i);
				$(".trans").html(i%10+i);
				$(".listUl").eq(Math.floor(i/10)).append(listLi);
			}			
		}		
	}	
})


//提示框信息;
function toolTip(str,obj,color){
	layer.tips(str, obj, {
	  tips: [1, color] //还可配置颜色
	});
}
////提示框的颜色;
//function topColor(obj,color){
//	obj.on("mouseover",function(){
//		$(".tooltip-inner").css("background-color",color);
//		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
//	})
//}
toolTip("查看",$(".listUl li span:nth-child(3) i:nth-child(1)"),"#1ab394");
toolTip("下发",$(".listUl li span:nth-child(3) i:nth-child(2)"),"#1ab394");
toolTip("配置",$(".listUl li span:nth-child(3) i:nth-child(3)"),"#ffb400");
toolTip("删除",$(".listUl li span:nth-child(3) i:nth-child(4)"),"#ff787b");
//判断是否在线;
$(".status").each(function(index,ele){
	if($(".status").html()=="在线"){
		$(".status").addClass("onlineStatus");
	}else{
		$(".status").addClass("nolineStatus");
	}

})
//点击查看;
function look(_id){
	
}

















