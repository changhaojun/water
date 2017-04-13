//var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
//var companyId=$("#companyId").val();		//公司ID
companyId="58c20d5f9aa7a32554f770de";
window.accesstoken="58ee2254d19b145b6d2c051b";
var globalurl="http://192.168.1.114";
$(function(){
	toolTip();
	getEntityList();
	getToken();//刷新令牌
})
var isSearch=false;
//搜索功能
window.searchEntity=function(){
	isSearch=true;
	$('.entityList').bootstrapTable("removeAll");
	$('.entityList').bootstrapTable("refresh",queryParams);
	isSearch=false;
}
var searchEntity=new Vue({
	el:'.entityTop',
	data:{
		searchEntityId:''
	} 
})
//获得设备列表;
var curpage;
window.getEntityList=function(){
	  window.dataTables= $('#dtuList').bootstrapTable({
		  	method: 'get',
		  	url:globalurl+"/v1/things",
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
				console.log(value)
		    	if(value.code==400005){
		    		window.getNewToken();
		    		getDTUList();
		    		$('#dtuList').bootstrapTable("refresh",queryParams)
		    	}
		    	toolTip();//顶部提示框
		    },
		    columns: [
	                    {
	                        title: "名称",
	                        field: "thing_name"
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
	return "<span data-toggle='tooltip' data-placement='top' title='绑定' style='color:#18b393;cursor: pointer;' class='fa fa-chain' onclick=bind('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='告警' style='color:#7cc1c8;margin-left:12px;cursor: pointer;' class='fa fa-bell' onclick=alarm('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='改名' style='color:#ffb400;margin-left:12px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:12px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol('"+value+"')></span>"
}

//表格数据获取的参数
function queryParams(params) {	
	if(	isSearch==false){
		return {
			pageNumber:params.offset,//第几页
			pageSize:params.limit,//每页的条数
			access_token:window.accesstoken,
			like:'{"device_name":"'+searchEntity.searchEntityId+'"}',//模糊查询的设备名
			filter:'{"protocal":"A","company_id":"'+companyId+'"}'
		};
	}else{
		console.log(searchEntity.searchEntityId)
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    access_token:window.accesstoken,
			like:'{"device_name":"'+searchEntity.searchEntityId+'"}',
			filter:'{"protocal":"A","company_id":"'+companyId+'"}'
	    };
	}
}

//初始化提示框
function toolTip(){	
	 $('[data-toggle="tooltip"]').tooltip();
	 topColor($(".fa-chain"),"#1ab394");
	topColor($(".fa-bell"),"#7fbfc9");
	topColor($(".fa-cog"),"#fcc433");
	topColor($(".fa-trash-o"),"#f98c91");
}
function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}

//绑定实体事件
function bind(value){
	self.location.href="/finfosoft-water/dataTag/getDatas/"+value+"-A";
}
//警告实体事件
function alarm(value){
	self.location.href="/finfosoft-water/dataTag/editSensor/"+value;
}
//添加数据事件
function addEntity(){
	layer.confirm('<input type="text" id="addentityName" placeholder="请输入实体名称"/>', function(index){			
		if($("#addentityName").val()==""){
			layer.tips('实体名称不能为空', $("#addentityName"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{
			layer.close(index);
			 data="{'things_name':'"+$("#addentityName").val()+"'}";
			 data={"data":data,"access_token":window.accesstoken}
			$.ajax({
				url:globalurl+"/v1/things",
				data:data,
				dataType: 'JSON',
				type: 'POST',
				crossDomain: true == !(document.all),
				success: function(data) {
					console.log(data);
					if(data.code==400005){
						  window.getNewToken()
						  addEntity(value);
					 }else if(data.code==200){
						layer.msg(data.success, {
							icon : 1
						});
	//					window.top.MQTTconnect(guid);
					}else{
						layer.msg(data.success, {
							icon : 2
						});
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					layer.msg(data.error, {
						icon : 2
					});
			    }
			});
		}
		
	});

}
//删除一条数据
window.deleteCol=function(value){
	layer.confirm("<font size='2'>是否将此实体删除？</font>", {icon:7}, function(index){
		layer.close(index);
		  $.ajax({
			  url:globalurl+'/v1/things/'+value+'?access_token='+window.accesstoken,
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
				  }
			  }
		  })
		});
}
//修改设备名
function modify(value){
	value="58734ea511b69c22b0afa990";
	var guid=guidGenerator();
	$(".layui-layer-title").html("修改实体");
	$.ajax({
			url:globalurl+'/v1/things/'+value,
			dataType: 'JSON',
			type: 'get',
			crossDomain: true == !(document.all),
			success: function(data) {
				layer.confirm('<input type="text" id="modifyentityName" value="'+data.thing_name+'"/>', function(index){
					if($("#addentityName").val()==""){
						layer.tips('实体名称不能为空', $("#modifyentityName"), {
							  tips: [1, '#ff787c'],
							  time: 2000
						});
					}else{
						layer.close(index);
			 			data="{'things_id':'"+value+"','things_name':'"+$("#modifyentityName").val()+"','guid':'"+guid+"'}";
			 			$.ajax({
							url:globalurl+"/v1/things",
							data:data,
							dataType: 'JSON',
							type: 'put',
							crossDomain: true == !(document.all),
							success: function(data) {
								if(data.code==400005){
									  window.getNewToken()
									  addEntity(value);
								 }else if(data.code==200){
									layer.msg(data.success, {
										icon : 1
									});
				//					window.top.MQTTconnect(guid);
								}else{
									layer.msg(data.success, {
										icon : 2
									});
								}
							},
							error: function(XMLHttpRequest, textStatus, errorThrown) {
								layer.msg(data.error, {
									icon : 2
								});
						    }
						});
					}
				});
			}
			
		});

}
//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
