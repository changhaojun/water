$(function(){
	toolTip();
	getDTUList();
})
var isSearch=false;
//ip地址
var URL="http://rap.taobao.org/mockjsdata/15031";
//获得设备列表;
var curpage;
window.getDTUList=function(){
	  window.dataTables= $('#dtuList').bootstrapTable({
		  	method: 'get',
		  	url:URL+"/v1/devices",
		    sidePagination: 'server',//设置为服务器端分页
		    pagination: true, //是否分页
		    search: false, //显示搜索框
		    pageSize: 10,//每页的行数 
		    toolbar: '',
		    pageNumber:1,
		    showRefresh: false,
		    showToggle: false,
		    showColumns: false,
		    pageList:[10,15,20, 25],
		    queryParams: queryParams,
		    striped: true,//条纹
		    onLoadSuccess:function(value){
		    	console.log(value);
		    	if(value.code==400005||value.code==500){
		    		window.getNewToken();
		    		$('#dtuList').bootstrapTable("refresh",queryParams)
		    	}
//		    	showTooltips();//提示框
		    },
		    columns: [
	                    {
	                        title: "名称",
	                        field: "device_name"
	                    },
	                    {
	                        title: "状态",//标题
	                        field: "status",//键名
	                        formatter: statusFormatter//对本列数据做格式化
	                    },
						{
	                        field: "_id",
	                        title: "操作",
	                        valign:"middle",
	                        align:"center",
	                        formatter: editFormatter//对本列数据做格式化
	                    }
	                ],
		});
}
//操作列的格式化
function editFormatter(value,row,index){
	return "<span data-toggle='tooltip' data-placement='top' title='查看' style='color:#1cb295;margin-left:15px;cursor: pointer;' class='fa fa-laptop' onclick=look('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='下发' style='color:#149bb9;margin-left:15px;cursor: pointer;' class='fa fa-arrow-circle-down' onclick=give('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='修改' style='color:#ee5567;margin-left:15px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#f9ac5a;margin-left:15px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol('"+value+"')></span>"
}
//box状态列的格式化
function statusFormatter(value,row,index){
	if(value==1){
		return "在线"
	}else{
		return "离线"
	}
}
//表格数据获取的参数
function queryParams(params) {
	if(	isSearch==false){
		return {
			pageNumber:params.offset,
			pageSize:params.limit,
			sortOrder: params.order,
//			access_token:window.accesstoken,
//			like:'{"collectorId":"'+searchBox.searchCollectorId+'"}',
			filter:'{"protocal":"A"}'
		};
	}else{
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    sortOrder: params.order,
//		    access_token:window.accesstoken,
//			like:'{"collectorId":"'+searchBox.searchCollectorId+'"}',
			filter:'{"protocal":"A"}'
	    };
	}
}
//$.ajax({
//	type: "get",
//	url: URL,
//	dataType: "JSON",
//	crossDomain: true == !(document.all),
//	data: {
//		access_token: "58ccb57ed77a1e1e04ceb09e"
//	},
//	success: function(data) {
//		toolTip();
//		$(".sum").html(data.total);
//		//分页;
//		var page="";
//		var listUl="";
//		var total=Math.ceil(data.total/10);//分页总数
//		for(var i=0;i<total;i++){
//			page="<li><a href='###'>"+(i+1)+"</li>";
//			listUl="<ul class='listUl'></ul>";
//			$(".boxFooter>nav .pagination").append(page);
//			$(".boxList .listContent").append(listUl);
//		}
//		//总的列表页;	
//		var listLi="";	
//		var status="";
////		console.log(data.rows.length)
//		for(var i=0;i<data.rows.length;i++){
//			//判断状态;
//			if(data.rows[i].status){
//				status="在线";				
//			}else{
//				status="离线";				
//			}
//			listLi+='<li  dataId="'+data.rows[i]._id+'"><span>'+data.rows[i].device_name+'</span>'+
//						'<span class="nolineStatus">'+
//							'<i></i>'+
//							'<strong class="status">'+status+'</strong>'+
//						'</span>'+
//						'<span>'+
//							'<i class="fa fa-laptop"onclick="look('+data.rows[i]._id+')"data-toggle="tooltip" data-placement="top" title="查看"></i>'+
//							'<i class="fa fa-arrow-circle-down"onclick="Issued('+data.rows[i]._id+')"data-toggle="tooltip" data-placement="top" title="下发"></i>'+
//							'<i class="fa fa-cog" onclick="modify('+data.rows[i]._id+')"data-toggle="tooltip" data-placement="top" title="配置"></i>'+
//							'<i class="fa fa-trash" onclick="delete('+data.rows[i]._id+')"data-toggle="tooltip" data-placement="top" title="删除"></i>'+
//						'</span>'+
//					'</li>';			
////			判断列表的个数;
//			if (i!=0&&i%10==0) {
//				$(".trans").html(i);
//				$(".listUl").eq(i/10-1).append(listLi);
//				listLi='';
//			} else {
//				$(".first").html(i);
//				$(".trans").html(i%10+i);
//				$(".listUl").eq(Math.floor(i/10)).append(listLi);
//			}			
//		}		
//	}	
//})
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
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
//判断是否在线;
//$(".status").each(function(index,ele){
//	if($(".status").html()=="在线"){
//		$(".status").addClass("onlineStatus");
//	}else{
//		$(".status").addClass("nolineStatus");
//	}
//
//})
//点击查看;
function look(_id){
	self.location.href="/dataTag/getDatas/"+value+"-'sensor'";
}

function modify(value){
	self.location.href="/dataTag/editSensor/"+value;
}

function addBox(){
	self.location.href="/dataTag/addSensor/";
}
















