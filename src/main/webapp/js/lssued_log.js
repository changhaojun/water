var companyCode=$("#companyCode").val();	//公司编号，获取用户列表时使用
var companyId=$("#companyId").val();



















function p(s) {	
    return s < 10 ? '0' + s: s;
}
function GetDateStr1(AddDayCount) { 
	var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear().toString().substring(2,4); 
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
	return y+"-"+p(m)+"-"+p(d)+" "+flag+" "+p(h-h)+":"+p(mm-mm); 
}
function GetDateStr2(AddDayCount) { 
	var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 
	var y = dd.getFullYear().toString().substring(2,4); 
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
initstartTime=GetDateStr1(0);
console.log(initstartTime)
initendTime=GetDateStr2(0)
$("#reservationtime").val(initstartTime+' '+' - '+' '+initendTime)
//
$(document).ready(function() {
   $('#reservationtime').daterangepicker({
      timePicker: true,
      timePickerIncrement: 30,
      format: 'YY-MM-DD A h:mm '
   }, function(start, end, label) {				        		
      start=new Date(start).getFullYear()+"$"+p(new Date(start).getMonth()+1)+"$"+p(new Date(start).getDate())+"$"+p(new Date(start).getHours())+":"+p(new Date(start).getMinutes())+":"+p(new Date(start).getSeconds());
	  end=new Date(end).getFullYear()+"$"+p(new Date(end).getMonth()+1)+"$"+p(new Date(end).getDate())+"$"+p(new Date(end).getHours())+":"+p(new Date(end).getMinutes())+":"+p(new Date(end).getSeconds());			           
   	  startTime=start;
   	  endTime=end;
   	  console.log(startTime)
   	  var data={};
   	  data.data_id=dataFid
   	  data.start_time=startTime
   	  data.end_time=endTime
// 	  var data="{data_id:'"+dataFid+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
		
   })
})
//点击时间按钮
$('.lssuedList button').click(function(){
	$('.lssuedList .listTop button').removeClass('btnColor');
	$(this).addClass('btnColor');
})