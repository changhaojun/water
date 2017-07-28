var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();		//公司ID
$(function(){
	getToken();
	toolTip();
	getcomputedList();
	getToken();//刷新令牌
})
var isSearch=false;
//搜索功能
function searchcomputed(){
	isSearch=true;
	$('#computedList').bootstrapTable("removeAll");
	$('#computedList').bootstrapTable("refresh",queryParams);
	isSearch=false;
}
//获得设备列表;
var curpage;
function getcomputedList(){
	  window.dataTables= $('#computedList').bootstrapTable({
		  	method: 'get',
		  	url:globalurl+"/v1/devices",
		    sidePagination: 'server',//设置为服务器端分页
		    pagination: true, //是否分页
		    search: false, //显示搜索框
		    pageSize: 10,//每页的行数 
		    pageNumber:1,
		    showRefresh: false,
		    showToggle: false,
		    showColumns: false,
		    pageList:[10,15,20, 25],
		    queryParams: queryParams,
		    striped: true,//条纹
//		    ajaxOptions:"",//公司ID
		    onLoadSuccess:function(value){
		    	if(value.code==400005){
		    		window.getNewToken();
		    		getcomputedList();
		    		$('#computedList').bootstrapTable("refresh",queryParams)
		    	}
		    	toolTip();//顶部提示框
		    	$("#computedList tbody>tr").each(function(i,ele){
					$(this).mouseover(function(){
						$(this).addClass("borderColor").siblings().removeClass("borderColor");
					});
					$(this).mouseout(function(){
						$(this).removeClass("borderColor");
					});
								
				});
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
	                        align:"left",
	                        formatter: editFormatter//对本列数据做格式化
	                    }
	                ],
		});
}
//操作列的格式化
function editFormatter(value,row,index){
	return "</span><span data-toggle='tooltip' data-placement='top' title='修改' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:15px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol('"+value+"')></span>"
}
//box状态列的格式化
function statusFormatter(value,row,index){
		return "<span style='color:#2cb7c8;background:url(/img/box_info.png)no-repeat -20px 0px;padding-left:25px;'>正常</span>"
}
//表格数据获取的参数
function queryParams(params) {	
	return {
		pageNumber:isSearch?0:params.offset,//第几页
		pageSize:params.limit,//每页的条数
		access_token:window.accesstoken,
		like:'{"device_name":"'+$('#searchName').val()+'"}',//模糊查询的设备名
		filter:'{"device_kind":4,"company_id":"'+companyId+'"}'
	}
}

//初始化提示框
function toolTip(){	
	 $('[data-toggle="tooltip"]').tooltip();
	 topColor($(".fa-laptop"),"#1ab394");
	topColor($(".fa-arrow-circle-down"),"#1ab394");
	topColor($(".fa-cog"),"#ffb400");
	topColor($(".fa-trash-o"),"#ff787b");
}
function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}
//修改数据事件
function modify(value){
	self.location.href="/dataTag/addComputed/"+value;
}
//添加数据事件
function addcomputed(){
	self.location.href="/dataTag/addComputed/";
}
//删除一条数据
window.deleteCol=function(value){
	layer.confirm("<font size='2'>是否将该组数据删除？</font>", {icon:7}, function(index){
		layer.close(index);
		  $.ajax({
			  url:globalurl+'/v1/devices/'+value+'?access_token='+window.accesstoken,
			  dataType : 'JSON',
			  type : 'delete',
			  crossDomain: true == !(document.all),
			  success : function(data) {
				  if(data.code==200){
					  layer.msg(data.success,{icon:1})
					  setTimeout("self.location.reload()",2000);
				  }else if(data.code==400005){
					  window.getNewToken()
					  deleteCol(value)
				  }else if(data.code==400018){
				  	layer.msg(data.error,{icon:2})
				  }
			  }
		  })
		});
}