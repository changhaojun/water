var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();		//公司ID
$(function(){
	getToken();
	toolTip();
	getDTUList();
	getToken();//刷新令牌
})
var isSearch=false;
//搜索功能
window.searchCollectot=function(){
	isSearch=true;
	$('#dtuList').bootstrapTable("removeAll");
	$('#dtuList').bootstrapTable("refresh",queryParams);
	isSearch=false;
}
var searchBox=new Vue({
	el:'.boxTop',
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
		    onLoadSuccess:function(value){
		    	if(value.code==400005){
		    		window.getNewToken();
		    		getDTUList();
		    		$('#dtuList').bootstrapTable("refresh",queryParams)
		    	}
		    	toolTip();//顶部提示框
		    	$("#dtuList tbody>tr").each(function(i,ele){
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
	return "<span data-toggle='tooltip' data-placement='top' title='查看' style='color:#1cb295;cursor: pointer;' class='fa fa-laptop' onclick=look('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='下发' style='color:#48c2a9;margin-left:15px;cursor: pointer;' class='fa fa-arrow-circle-down' onclick=give('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='修改' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:15px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol('"+value+"')></span>"
}
//box状态列的格式化
function statusFormatter(value,row,index){
	if(value==1){
		return "<span style='background:url(/img/box_info.png)no-repeat -20px 0px;float:left;width:20px;height:20px;'></span><i style='margin-left:10px;color:#2cb7c8;'>在线</i>"
	}else{
		return "<span style='background:url(/img/box_info.png)no-repeat 0px 0px;float:left;width:20px;height:20px;'></span><i style='margin-left:10px;color:#a3a3a3;'>离线</i>"
	}
}
//表格数据获取的参数
function queryParams(params) {	
	if(	isSearch==false){
		return {
			pageNumber:params.offset,//第几页
			pageSize:params.limit,//每页的条数
			access_token:window.accesstoken,
			like:'{"device_name":"'+searchBox.searchCollectorId+'"}',//模糊查询的设备名
			filter:'{"protocal":"A","company_id":"'+companyId+'"}'
		};
	}else{
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    access_token:window.accesstoken,
			like:'{"device_name":"'+searchBox.searchCollectorId+'"}',
			filter:'{"protocal":"A","company_id":"'+companyId+'"}'
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

//查看数据事件
function look(value){
	self.location.href="/dataTag/getDatas/"+value+"-A";
}
//修改数据事件
function modify(value){
	self.location.href="/dataTag/editSensor/"+value;
}
//添加数据事件
function addBox(){
	self.location.href="/dataTag/addSensor/";
}
//删除一条数据
window.deleteCol=function(value){
	layer.confirm("<font size='2'>是否将此采集器删除？</font>", {icon:7}, function(index){
		layer.close(index);
		  $.ajax({
			  url:globalurl+'/v1/devices/'+value+'?access_token='+window.accesstoken,
			  dataType : 'JSON',
			  type : 'delete',
			  crossDomain: true == !(document.all),
			  success : function(data) {
				  if(data.code==200){
					  layer.msg(data.success,{icon:1})
					  setTimeout("self.location.reload()",2000)
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
//设备下发
function give(value){
	layer.confirm("<font size='2'>确认下发？</font>",{icon:7},function(index){
		layer.close(index);
		layer.load(2, {
			shade: [0.7,'#eee'],
			content:'<div style="width:200px;margin-left:50px;padding-top:5px;">下发中,请稍后。。。</div>'
		});
		$.ajax({
			url:globalurl+"/v1/gateways?access_token="+accesstoken,
			data:{
				device_id:value
			},
			dataType: 'JSON',
			type:'POST',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
					  window.getNewToken()
					  give(value);
				 }else if(data.result==1){
					layer.msg(data.description, {
						icon : 1,
						time: 1400,
						end: function() {
							layer.closeAll();
						}
					});
				}else{
					layer.msg('下发失败', {
						icon : 2,
						time: 1400,
						end: function() {
							layer.closeAll();
						}
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2,
					time: 1400,
					end: function() {
						layer.closeAll();
					}
				});
		    }
		});
	});
}
function space(obj){
	obj.val(obj.val().replace(/\s/g, ''))
}