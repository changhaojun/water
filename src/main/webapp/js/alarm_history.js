var company_id=$('#companyId').val()
getToken();
var access_token = accesstoken;
var alarmId;
getAlarmList();
var This;
function getAlarmList(){
	$('#alarmList').bootstrapTable({
	  	method: 'get',
	  	url:globalurl+"/v1/alarmHistorys",
	    sidePagination: 'server',//设置为服务器端分页
	    pagination: true, //是否分页
	    search: false, //显示搜索框
	    pageSize: 10,//每页的行数 
	    pageNumber:1,
	    showRefresh: false,
	    showToggle: false,
	    showColumns: false,
	    pageList:[10,15,20, 25],
	    queryParams:queryParams,
	    striped: true,//条纹
	    onLoadSuccess:function(value){
	    	if(value.code==400005){
	    		window.getNewToken();
	    		getDTUList();
	    		$('#alarmList').bootstrapTable("refresh",queryParams)
	    	}
	    	$('[data-toggle="tooltip"]').tooltip();
	    	resultBind();
	    },
	    columns: [
                    {
                        title: "告警时间",
                        field: "start_time"
                    },
                    {
                        title: "告警项目",//标题
                        field: "alarm_name",//键名
                    },
                    {
                        title: "当前值",//标题
                        field: "data_value",//键名
                    },
					{
                        field: "handle_result",
                        title: "处理结果",
                        valign:"middle",
                        align:"left",
                        formatter: resultFormatter//对本列数据做格式化
                    }
                ],
	})
}

function queryParams(params){
	return{
		pageNumber:params.offset,//第几页
		pageSize:params.limit,//每页的条数
		access_token:access_token,
		filter:'{"company_id":"'+company_id+'"}',
		sorts:'{"start_time":"desc"}'
	};
}
function resultFormatter(value,rows){
	if(value==''||value==undefined){
		return '<span class="result untreated" data-toggle="tooltip" data-placement="top" title="处理">未处理</span>'
	}else{
		return '<span class="result already" data-toggle="tooltip" data-placement="top" title="查看">已处理</span>'
	}
}
function resultBind(){
	$('.result').on('click',function(){
		This=$(this);
		alarmId=$(this).parent().parent().attr('id')
		$.ajax({
			type:"get",
			url:globalurl+"/v1/alarmHistorys",
			async:true,
			data:{
				access_token: access_token,
				alarm_history_id:alarmId
			},
			success:function(data){
				openResult(data)
			}
		});
		
	})
}    

function openResult(resultData){
	var titleMsg;
	if(resultData.handle_result==undefined||resultData.handle_result==''){
		titleMsg='提交处理结果';
		$('.resultInfo').val('');
		$('.resultInfo').removeAttr('disabled');
		$('.btnRow').show();
	}else{
		titleMsg='查看处理结果';
		$('.resultInfo').val(resultData.handle_result);
		$('.resultInfo').attr('disabled','disabled');
		$('.btnRow').hide();
	}
	resultBox=layer.open({
			type: 1,
			title: titleMsg,
			shadeClose: false,
			shade: 0.8,
			area: ['580px'],
			content: $('.alarmInfo') 
		})
}

$('.saveBtn').click(function(){
	$.ajax({
			type:"put",
			url:globalurl+"/v1/alarmHistorys",
			async:true,
			data:{
				access_token: access_token,
				data:'{"handle_result":"'+$('.resultInfo').val()+'"}',
				alarm_history_id:alarmId
			},
			success:function(data){
				if(data.code==200){
					layer.msg(data.success,{icon:1});
					layer.close(resultBox);
					This.text('已处理')
					This.attr('class','result already')
					var alarmNum=$('.msgNum', window.parent.document).text()
					$('.msgNum', window.parent.document).text(alarmNum-1)
				}
			}
		});
});

$('.cancelBtn').click(function(){
	layer.close(resultBox)
});

