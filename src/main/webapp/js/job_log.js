var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();
$(function(){
	getToken();//刷新令牌
	taskList()
})

//获取时间
function p(s) {	
    return s < 10 ? '0' + s: s;
}
var myDate = new Date();
var year=myDate.getFullYear();
var month=myDate.getMonth()+1;
var date=myDate.getDate(); 
var h=myDate.getHours(); //获取当前小时数(0-23)
var m=myDate.getMinutes();//获取当前分钟数(0-59)
var s=myDate.getSeconds(); 
var flag="";
if(h>=12){
	flag="PM";
}else{
	flag="AM";
}
startTime=year+"$"+p(month)+"$"+(p(date-date+1))+"$"+(p(h-h))+":"+(p(m-m))+":"+(p(s-s));
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date-date+1)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+" "+flag+" "+p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+' '+' - '+' '+initendTime)

//初始获取日志列表
function taskList(){
	var allLogData=[]
	var data={};
	data.start_time=startTime;
	data.end_time=endTime;
	data.company_id=companyId;
	data=JSON.stringify(data)

	$.ajax({
		type:'get',
		dataType:'JSON',
		url:globalurl+'/v1/logs',
		data:{
			access_token:accesstoken,
			filter:JSON.stringify({"log_type":2}),	
			data:data
		},
		async:false,
		success:function(data){
			for(var i=0;i<data.rows.length;i++){
				var taskData={
					"oper_time":(data.rows[i].oper_time),
					"oper_user":(data.rows[i].oper_user),
					"address":(data.rows[i].address),
					"process_name":(data.rows[i].process_name),
					"oper_port":(data.rows[i].oper_port),
					"new_value":(data.rows[i].new_value),
					"result":(data.rows[i].result)
				}
				allLogData.push(taskData)
			}
			//表格分页
			$('#logList').bootstrapTable({
				data : allLogData,
			    pagination: true, //是否分页
			    pageSize: 10,//每页的行数 
			    pageNumber:1,
				pageList : [ 10, 15, 20, 25 ],
				cache : true,
			});
			$("#logList").bootstrapTable('load', allLogData);
			$('#logList').bootstrapTable('refreshOptions',{pageNumber:1,pageSize:10});
//			fn(data)
		}
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
//点击时间按钮获取日志列表
function changeList(i){
	startTime=GetDateStr1(i)
	endTime=GetDateStr1(0)
	taskList()
	var initstartTime=GetDateStr2(i)
	$("#reservationtime").val(initstartTime+' '+' - '+' '+initendTime)
}
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

$('.taskList button').click(function(){
	$('.taskList .listTop button').removeClass('btnColor');
	$(this).addClass('btnColor');
})

//点击时间获取日志
$(document).ready(function() {
   $('#reservationtime').daterangepicker({
      timePicker: true,
      timePickerIncrement: 30,
      format: 'YYYY-MM-DD A h:mm '
   }, function(start, end, label) {	
      start=new Date(start).getFullYear()+"$"+p(new Date(start).getMonth()+1)+"$"+p(new Date(start).getDate())+"$"+p(new Date(start).getHours())+":"+p(new Date(start).getMinutes())+":"+p(new Date(start).getSeconds());
	  end=new Date(end).getFullYear()+"$"+p(new Date(end).getMonth()+1)+"$"+p(new Date(end).getDate())+"$"+p(new Date(end).getHours())+":"+p(new Date(end).getMinutes())+":"+p(new Date(end).getSeconds());			           
   	  startTime=start;
   	  endTime=end;
   	  var data={}
		data.start_time=startTime
		data.end_time=endTime
		data=JSON.stringify(data)
		taskList()
		$('.taskList button').removeClass('btnColor')
   })
})


//vue
function fn(data){
	var testVue=new Vue({
		el:'#main',
		data:data
	})
}

