var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();		//公司ID
var isSearch=false;
$(function(){
	getToken();
//	toolTip();
	getDTUList();
	getToken();	
})
//搜索功能
window.searchCollectot=function(){
	isSearch=true;
	$('#dtuList').bootstrapTable("removeAll");
	$('#dtuList').bootstrapTable("refresh",queryParams);
	isSearch=false;
}
var searchBox=new Vue({
	el:'.PLCTop',
	data:{
		searchCollectorId:''
	} 
})
//获得设备列表;
var curpage;
window.getDTUList=function(){
	  window.dataTables= $('#dtuList').bootstrapTable({
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
		    	console.log(value);
		    	if(value.code==400005||value.code==500){
		    		window.getNewToken();
		    		$('#dtuList').bootstrapTable("refresh",queryParams)
		    	}
		    	toolTip();//顶部提示框
		    	
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
	return "<span data-toggle='tooltip' data-placement='top' title='查看' style='color:#1cb295;cursor: pointer;' class='fa fa-laptop' onclick=look('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='下发' style='color:#48c2a9;margin-left:15px;cursor: pointer;' class='fa fa-arrow-circle-down' onclick=give('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='修改' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:15px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol('"+value+"')></span>"
}
//box状态列的格式化
function statusFormatter(value,row,index){
	if(value==1){
		return "<span style='color:#2cb7c8;background:url(../img/box_info.png)no-repeat -20px 0px;padding-left:25px;'>在线</span>"
	}else{
		return "<span style='color:#a3a3a3;background:url(../img/box_info.png)no-repeat 0px 0px;padding-left:25px;'>离线</span>"
	}
}
//表格数据获取的参数
function queryParams(params) {
	
	if(	isSearch==false){
		return {
			pageNumber:params.offset,//第几页
			pageSize:params.limit,//每页的条数
			//sortOrder: params.order,//
			access_token:window.accesstoken,
			like:'{"device_name":"'+searchBox.searchCollectorId+'"}',//模糊查询的设备名
			filter:'{"protocal":"P","company_id":"'+companyId+'"}'
		};
	}else{
		console.log(searchBox.searchCollectorId)
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    //sortOrder: params.order,
		    access_token:window.accesstoken,
			like:'{"device_name":"'+searchBox.searchCollectorId+'"}',
			filter:'{"protocal":"P","company_id":"'+companyId+'"}'
	    };
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
function look(value){
	self.location.href="/finfosoft-water/dataTag/getDatas/"+value+"-P";
}

function modify(value){
	self.location.href="/finfosoft-water/dataTag/editPlc/"+value;
}

function addPlc(){
	self.location.href=itemName+"/dataTag/addPlc/";
}
//删除一条数据
window.deleteCol=function(value){
	layer.confirm('是否要将此采集器删除？', {
		  btn: ['确定','取消'] //按钮
		}, function(){
		  $.ajax({
			  url:globalurl+'/v1/devices/'+value+'?access_token='+window.accesstoken,
			  dataType : 'JSON',
			  type : 'delete',
			  success : function(data) {
				  if(data.code==200){
					  layer.msg(data.success,{icon:1})
					  setTimeout("self.location.reload()",2000)
//					  $('#dtuList').bootstrapTable("refresh",queryParams)
				  }else if(data.code==400005){
					  window.getNewToken()
					  deleteCol(value)
				  }
			  }
		  })
		});
}
//设备下发
function give(value){
	var guid=guidGenerator();	
	layer.confirm("<font size='4'>确认下发？</font>",function(index){
		layer.close(index);
		data="{'device_id':'"+value+"','guid':'"+guid+"'}";
		data={'data':data};
		$.ajax({
			url:globalurl+"/v1/homes",
			data:data,
			dataType: 'JSON',
			type: 'POST',
			success: function(data) {
				console.log(data)
				if(data.result==1){
					layer.msg('已下发', {
						icon : 1
					});
//					window.top.MQTTconnect(guid);
				}else{
					layer.msg('下发失败', {
						icon : 2
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2
				});
		    }
		});
	});
}
//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}















