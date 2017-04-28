//var globalurl = 'http://192.168.1.114'

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
	$('#dtuList').bootstrapTable("refresh", queryParams);
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
		  	url:globalurl+"/v1/scadas",
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
		    		getEntityList();		    	
		    		$('#dtuList').bootstrapTable("refresh",queryParams)
		    	}
		    	toolTip();//顶部提示框
		    },
		    columns: [
                {
                    title: "名称",
                    field: "scada_name"
                },
                {
                    title: "说明",
                    field: "description"
                },
                {
                    title: "创建人",
                    field: "create_user"
                },
                {
                    title: "创建时间",
                    field: "create_date"
                },
				{
                    title: "操作",
                    field: "_id",
                    valign:"middle",
                    align:"left",
                    formatter: editFormatter//对本列数据做格式化
                }
            ],
		});
}
//操作列的格式化
function editFormatter(value,row,index){
	return "<span data-toggle='tooltip' data-placement='top' title='查看' style='color:#18b393;cursor: pointer;' class='fa fa-laptop' onclick='reviewScada.call(this)'></span><span data-toggle='tooltip' data-placement='top' title='编辑' style='color:#ffb400;margin-left:30px;cursor: pointer;' class='fa fa-cog' onclick='editScada.call(this)'></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:30px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol.call(this)></span>"
}

//表格数据获取的参数
function queryParams(params) {
	if(	isSearch==false){
		return {
			pageNumber:params.offset,//第几页
			pageSize:params.limit,//每页的条数
			access_token:window.accesstoken,
			like:'{"scada_name":"'+searchEntity.searchEntityId+'"}'//模糊查询的设备名
		};
	}else{
	    return {
	    	pageNumber:0,
	    	pageSize:params.limit,
		    access_token:window.accesstoken,
			like:'{"scada_name":"'+searchEntity.searchEntityId+'"}'
	    };
	}
}

//初始化提示框
function toolTip(){	
	$('[data-toggle="tooltip"]').tooltip();
	topColor($(".fa-laptop"),"#1ab394");
	topColor($(".fa-cog"),"#fcc433");
	topColor($(".fa-trash-o"),"#f98c91");
}

function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
	})
}

//添加数据事件
function addEntity(){
	self.location.href="/finfosoft-water/scada/select/";
}

function reviewScada(){
	var id = $(this).parents('tr').attr('id');
	self.location.href = 'scada/review/'+id;
}

function editScada(){
	var id = $(this).parents('tr').attr('id');
	self.location.href = 'scada/edit/'+id;
}

//删除一条数据
window.deleteCol=function(){
	var id = $(this).parents('tr').attr('id');
	var val = $(this).parents('tr').children().eq(0).html();
	layer.confirm("<font size='2'>是否将此"+val+"删除？</font>", {icon:7}, function(){
		  $.ajax({
			  url:globalurl+'/v1/scadas/'+id+'?access_token='+window.accesstoken,
			  dataType : 'JSON',
			  type : 'delete',
			  crossDomain: true == !(document.all),
			  success : function(data) {
				  if(data.code==200){
					  layer.msg(data.success,{icon:1})
					  setTimeout("self.location.reload()",2000)
				  }else if(data.code==400005){
					  window.getNewToken()
					  deleteCol.call($(this));
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
					layer.confirm('<input type="text" id="modifyentityName" value="'+data.thing_name+'"/>',{title:"修改实体"}, function(index){
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

