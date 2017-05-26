var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();
$(function(){
	getToken();//刷新令牌
//	lssuedList()
})
//获取时间
function p(s) {	
    return s < 10 ? '0' + s: s;
}
var myDate = new Date();
//获取当前年
var year=myDate.getFullYear();
//获取当前月
var month=myDate.getMonth()+1;
//获取当前日
var date=myDate.getDate(); 
var h=myDate.getHours();       //获取当前小时数(0-23)
var m=myDate.getMinutes();     //获取当前分钟数(0-59)
var s=myDate.getSeconds(); 
var flag="";
if(h>=12){
	flag="PM";
}else{
	flag="AM";
}
var startTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h-h))+":"+(p(m-m))+":"+(p(s-s));
var endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+" "+flag+" "+p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+' '+' - '+' '+initendTime)

//初始获取日志列表
//function lssuedList(){
//	var data={}
//	data.start_time=startTime
//	data.end_time=endTime
//	var filter=JSON.stringify({"log_type":1});
//	data=JSON.stringify(data)
//	publicList(data,filter)
//}
//点击时间按钮获取日志
function changeList(i){
	$('#logList').html('')
	var startTime=GetDateStr1(i)
	var endTime=GetDateStr1(0)
	var data={}
	data.start_time=startTime
	data.end_time=endTime
	data=JSON.stringify(data)
	var filter=JSON.stringify({"log_type":1})
	publicList(data,filter)
	/*var initstartTime=GetDateStr2(i)
	$("#reservationtime").val(initstartTime+' '+' - '+' '+initendTime)*/
}
//表格数据
function publicList(data,filter){
	console.log("进入表格数据的方法==============")
	window.dataTables=$('#logList').bootstrapTable({
		method: 'get',
	  	url: globalurl+'/v1/logs?access_token='+accesstoken+'&data='+data+'&filter='+filter+'',
	    sidePagination: 'server',//设置为服务器端分页
	    pagination: true, //是否分页
	    search: false, //显示搜索框
	    pageSize: 5,//每页的行数 
	    pageNumber:1,
	    showRefresh: false,
	    showToggle: false,
	    showColumns: false,
	    pageList:[10,15,20, 25],
	    queryParams: queryParams,
	    striped: true,//条纹
	    onLoadSuccess:function(value){
	    console.log("进入表格数据的方法====返回值"+value+"==========")
	    	$.each($('#logList tbody>tr'),function(i,v){
	    		$(this).hover(function(){
	    			$(this).addClass('trColor')
	    		},function(){
	    			$(this).removeClass('trColor')
	    		})
	    	})
	    },
	    columns:[
	    	{
	    		field:'oper_time',
	    		title:'日期'
	    	},
	    	{
	    		field:'oper_user',
	    		title:'操作人'
	    	},
	    	{
	    		field:'address',
	    		title:'地区'
	    	},
	    	{
	    		field:'oper_port',
	    		title:'端口'
	    	},
	    	{
	    		field:'old_value',
	    		title:'数值'
	    	},
	    	{
	    		field:'result',
	    		title:'结果',
	    		formatter:resultFormatter//对本列数据格式化
	    	}
	    ]
	})
}	

//对结果列的格式化
function resultFormatter(value,row,index){
	if(value==1){
		return "<span style='color:#1AB394;'>成功</span>"
	}else{
		return "<span style='color:#d51b1c;'>失败</span>"
	}
}
//表格数据参数
function queryParams(params){
	return {
		pageNumber:params.offset,
		pageSize:params.limit,
	}
}

//点击时间获取日志
$(document).ready(function() {
   $('#reservationtime').daterangepicker({
      timePicker: true,
      timePickerIncrement: 30,
      format: 'YYYY-MM-DD A h:mm '
   }, function(start, end, label) {	
   	$('#logList').html('')
      start=new Date(start).getFullYear()+"$"+p(new Date(start).getMonth()+1)+"$"+p(new Date(start).getDate())+"$"+p(new Date(start).getHours())+":"+p(new Date(start).getMinutes())+":"+p(new Date(start).getSeconds());
	  end=new Date(end).getFullYear()+"$"+p(new Date(end).getMonth()+1)+"$"+p(new Date(end).getDate())+"$"+p(new Date(end).getHours())+":"+p(new Date(end).getMinutes())+":"+p(new Date(end).getSeconds());			           
   	  startTime=start;
   	  endTime=end;
// 	  $('#logList').html('')
   	  var data={}
		data.start_time=startTime
		data.end_time=endTime
		var filter=JSON.stringify({"log_type":1});
		data=JSON.stringify(data)
		publicList(data,filter)	
   })
})
//获取时间
function GetDateStr1(AddDayCount) { 
	var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	var h=dd.getHours();
	var mm=dd.getMinutes();
	var s=dd.getSeconds();
	var flag="";
	if(h-h>=12){
		flag="PM";
	}else{
		flag="AM";
	}
	return y+"$"+p(m)+"$"+p(d)+"$"+p(h)+":"+p(mm)+":"+p(s);
}
function GetDateStr2(AddDayCount) { 
	var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	var h=dd.getHours();
	var mm=dd.getMinutes();
	var s=dd.getSeconds();
	var flag="";
	if(h>=12){
		flag="PM";
	}else{
		flag="AM";
	}
	return y+"-"+p(m)+"-"+p(d)+" "+flag+" "+p(h)+":"+p(mm);
}

$('.lssuedList button').click(function(){
	$('.lssuedList .listTop button').removeClass('btnColor');
	$(this).addClass('btnColor');
})

