var searchEntity = new Vue({
	el:'.entityTop',
	data:{
		searchEntityId:''
	}
});

getToken();//刷新令牌
toolTip();
getEntityList();
var thing_id=[];
var isSearch = false;

//搜索功能
function likeSearch() {
	isSearch = true;
	$('#dtuList').bootstrapTable("refresh", queryParams);
	isSearch = false;
}


//获得设备列表;
function getEntityList() {
	window.dataTables = $('#dtuList').bootstrapTable({
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
	    		getNewToken();
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
	thing_id.push(row.thing_id);
	return "<span data-toggle='tooltip' data-placement='top' title='查看' style='color:#18b393;cursor: pointer;' class='fa fa-laptop' onclick='reviewScada.call(this)'></span><span data-toggle='tooltip' data-placement='top' title='编辑' style='color:#ffb400;margin-left:30px;cursor: pointer;' class='fa fa-cog' onclick='editScada.call(this,&quot;"+row.thing_id+"&quot;)'></span><span data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-left:30px;cursor: pointer;' class='fa fa-trash-o' onclick=deleteCol.call(this)></span>"
}

//表格数据获取的参数
function queryParams(params) {
	return {
		pageNumber: isSearch ? 0 : params.offset,//第几页
		pageSize:params.limit,//每页的条数
		access_token:window.accesstoken,
		like:'{"scada_name":"'+searchEntity.searchEntityId+'"}'//模糊查询的设备名
	};
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
	$('.popup').find('input').val();
	searchThing();
	layer.open({
		title: false,
		closeBtn: 0,
		type: 1,
		content: $('.popup'),
		success: function(layero, index) {
			$('.popup').find('.close').off('click').click(function() {
				layer.close(index);
			});
			$('.popup').find('.save').off('click').click(function() {
				var thingId = $(this).attr('thingId');
				if ( !thingId ) {
					layer.msg('请选择实体', {icon: 2});
					return false;
				}
				layer.close(index);
				self.location.href="/scada/add/"+thingId;
			});
		}
	});
}

function thingLikeSearch(dom) {
		var val = $(dom).val();
		searchThing(val);
}

function searchThing(val) {
	$.ajax({
		type: "get",
		dataType: "json",
		url: globalurl+"/v1/things",
		async: true,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken,
			like: JSON.stringify({
				thing_name: val
			})
		},
		success: function(data) {
			var list = $('.popup').find('.thing-list');
			var save = $('.popup').find('.save');
			save.removeAttr('thingId');
			list.html('');
			var liDom = '';
			if (data.rows.length > 0) {
				console.log(thing_id)
				$.each(data.rows, function(i) {
					liDom = '<li thingId="'+data.rows[i]._id+'">'+data.rows[i].thing_name+'</li>';					
					for(var j=0;j<thing_id.length;j++){
						if(data.rows[i]._id==thing_id[j]){
							liDom = '<li thingId="'+data.rows[i]._id+'" class="alreadyActive">'+data.rows[i].thing_name+'</li>';
						}
					}
					list.append(liDom);					
				});		
				list.children().click(function() {
					$(this).addClass('active');
					$(this).siblings().removeClass('active');
					save.attr('thingId', $(this).attr('thingId'));
				})
				$(".alreadyActive").click(function(){
					layer.msg("不能重复绑定实体",{icon:2});
					save.removeAttr('thingId');
				})
			} else {
				liDom += '<li style="color: #ff787b;">未查询到对应实体!</li>';
				list.html(liDom);
			}
		}
	});
}


function reviewScada(){
	var id = $(this).parents('tr').attr('id');
	var name = $(this).parents('tr').find('td').eq(0).html();
	var description = $(this).parents('tr').find('td').eq(1).html();
	self.location.href = '/scada/review/'+id+'-'+name+'-'+description;
}

function editScada(thingId){
	var id = $(this).parents('tr').attr('id');
	self.location.href = '/scada/edit/'+id+'-'+thingId;
}

//删除一条数据
function deleteCol() {
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
					getNewToken()
					deleteCol.call($(this));
				}
			}
		})
	});
}
