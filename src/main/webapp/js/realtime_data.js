var dataId=$(".dataId").val();//数据id
var startTime;
var endTime;
$(function(){
	toolTip();
	getToken();	
})
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
var  globalurl="http://rap.taobao.org/mockjsdata/15031";
$.ajax({
		type: "post",
		url:  globalurl+"/v1/realtimeDatas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken,
			"data_id":dataId
		},
		success: function(data) {
			console.log(data);
			$(".device_name").html(data.device_name);
			$(".data_name").html(data.data_name);			
		}
})
/**
 * 
 * 获取当前时间
 */
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

startTime=year+'-'+p(month)+"-"+p(date-date+1)+" "+p(h-h)+':'+p(m-m);
endTime=year+'-'+p(month)+"-"+p(date)+" "+p(h)+':'+p(m);
$("#reservationtime").val(startTime+" 到  "+endTime)

 $(document).ready(function() {
                  $('#reservationtime').daterangepicker({
                    timePicker: true,
                    timePickerIncrement: 30,
                    format: 'MM/DD/YYYY A h:mm '
                  }, function(start, end, label) {
                    console.log(start.toISOString(), end.toISOString(), label);
                  });
});









