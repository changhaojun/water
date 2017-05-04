
//var globalurl="http://192.168.1.114";

$(function(){
	getToken();//刷新令牌
	toolTip();
	getEntityList();
	
})
var isSearch=false;
//搜索功能
window.likeSearch=function(){
	isSearch=true;
	$('#dtuList').bootstrapTable("removeAll");
	$('#dtuList').bootstrapTable("refresh",queryParams);
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
		    pageNumber:1,//初始化第一页
		    showRefresh: false,
		    showToggle: false,
		    showColumns: false,
		    pageList:[10,15,20,25],//是否显示分页
		    queryParams: queryParams,
		    striped: true,//条纹
		    onLoadSuccess:function(value){
				console.log(value)
		    	if(value.code==400005){
		    		window.getNewToken();
		    		getEntityList();		    	
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
				omission($(this).find("td:nth-child(1)>span"));
				});
		    },
		    columns: [
	                    {
	                        title: "名称",
	                        field: "thing_name",
	                        formatter: textThing
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
function textThing(value,row,index){
	return "<span>"+value+"</span>";
}
//操作列的格式化
function editFormatter(value,row,index){
	return "<span data-toggle='tooltip' data-placement='top' title='绑定' style='color:#18b393;cursor: pointer;' class='fa fa-chain' onclick=bind('"+value+"','"+row.thing_name+"')></span><span data-toggle='tooltip' data-placement='top' title='告警' style='color:#7cc1c8;margin-left:15px;cursor: pointer;' class='fa fa-bell' onclick=alarm('"+value+"','"+row.thing_name+"')></span><span data-toggle='tooltip' data-placement='top' title='改名' style='color:#ffb400;margin-left:15px;cursor: pointer;' class='fa fa-cog' onclick=modify('"+value+"')></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:15px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteThing('"+value+"')></span>"
}

//表格数据获取的参数
function queryParams(params) {	
	if(	isSearch==false){//是否为搜索的状态
		return {
			pageNumber:params.offset,//第几页
			pageSize:params.limit,//每页的条数
			access_token:window.accesstoken,
			like:'{"thing_name":"'+searchEntity.searchEntityId+'"}'//模糊查询的设备名
			
		};
	}else{
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    access_token:window.accesstoken,
			like:'{"thing_name":"'+searchEntity.searchEntityId+'"}'
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
function bind(value,thingName){
	self.location.href="/finfosoft-water/thing/bindDatas/"+value+"-"+thingName;
}
//警告实体事件
function alarm(value,thingName){
	self.location.href="/finfosoft-water/thing/alarmDatas/"+value+"-"+thingName;
}
//添加数据事件
function addEntity(){
	layer.confirm('<input type="text" id="addentityName" placeholder="请输入实体名称" onkeyup="if(event.keyCode==32){space($(this))}"/>',{title:"添加实体"}, function(index){			
		if($("#addentityName").val()==""){
			layer.tips('实体名称不能为空', $("#addentityName"), {
				  tips: [1, '#ff787c'],
				  time: 2000
			});
		}else{
			 data="{'thing_name':'"+$("#addentityName").val()+"'}";
			 data={"data":data,"access_token":window.accesstoken};
			 console.log(data)
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
						  addEntity();
					 }else if(data.code==200){
						layer.msg(data.success, {
							icon : 1
						});
						setTimeout("self.location.reload()",2000)
					}else{
						layer.msg(data.success, {
							icon : 2
						});
					}
				},
				error: function(data) {
					console.log(data)
					layer.msg("添加失败", {
						icon : 2
					});
			    }
			});
		}
		
	});

}
//删除一条数据
window.deleteThing=function(value){
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
					  deleteThing(value)
				  }else if(data.code==400007){
				  	layer.msg(data.error,{icon:2})
				  }
			  }
		  })
		});
}
//修改设备名
function modify(value){
	
	$.ajax({
			url:globalurl+'/v1/things/'+value,
			dataType: 'JSON',
			type: 'get',
			data:{
				"access_token":window.accesstoken
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
					window.getNewToken()
					modify(value);
				}else{
					layer.confirm('<input type="text" id="modifyentityName" value="'+data.thing_name+'" onkeyup="if(event.keyCode==32){space($(this))}"/>',{title:"修改实体"}, function(index){
					console.log($("#modifyentityName").val())
					if($("#modifyentityName").val()==""){
						layer.tips('实体名称不能为空', $("#modifyentityName"), {
							  tips: [1, '#ff787c'],
							  time: 2000
						});
					}else{
						
			 			data="{'thing_name':'"+$("#modifyentityName").val()+"'}";
			 			$.ajax({
							url:globalurl+"/v1/things/"+value,
							data:{
								data:data,
								"access_token":window.accesstoken
							},
							dataType: 'JSON',
							type: 'put',
							crossDomain: true == !(document.all),
							success: function(data) {
								console.log(data)
								if(data.code==400005){
									  window.getNewToken()
									  modify(value);
								 }else if(data.code==200){
									layer.msg(data.success, {
										icon : 1
									});
									setTimeout("self.location.reload()",2000)
								}else{
									layer.msg("修改失败", {
										icon : 2
									});
								}
							},
							error: function(data) {
								
								layer.msg("修改失败", {
									icon : 2
								});
						    }
						});
					}
				});
			}				
		}			
	});
}
//input禁止输入字母空格
function space(obj){
	obj.val(obj.val().replace(/\s/g, ''))
}
//超出一行省略
function omission(obj){
	if(obj.html().length>40){
		obj.css({
			"display":"inline-block",
			"width":"140px",
			"overflow": "hidden",
			"white-space": "nowrap",
			"text-overflow": "ellipsis"
		})
	}
	
}
