
var dataId=$("#dataId").val()
var thingId=$('#thingId').val()
var selectedId=[];
var startTime;
var endTime;

var selectedId=[];
$(function(){
	getToken();//刷新令牌
	dataList();//获取device_name
	getChart(dataId);
})

function dataList(){
	$.ajax({
		url: globalurl+"/v1/things/"+thingId+"/alarms",
		type:"get",
		dataType:"JSON",
		data:{
			access_token: accesstoken,
			filter:JSON.stringify({"oper_type":1})
		},
		async:false,
		crossDomain: true == !(document.all),
		success:function(data){
			console.log(data)
			if(data.length==0){
				$(".list").html("<span class='nonedata'>暂无数据</span>");
			}else{
				var screenList="";			
				for(var i=0;i<data.length;i++){
//						console.log(data.[i].data_id+","+selectedId[i])
					if(selectedId.indexOf(data[i].data_id)!=-1){					
						screenList='<div class="selectdLi">'+
										'<div class="selectdFont">'+data[i].device_name+'</div>'+
										'<div class="selectdIcon" id="'+data[i].data_id+'">已选</div>'+
									'</div>';
						$(".list").append(screenList);
					}else{
						screenList='<div class="disabledLi">'+
										'<div class="disabledFont">'+data[i].device_name+'</div>'+
										'<div class="disabledIcon" id="'+data[i].data_id+'">+</div>'+
									'</div>';
						$(".list").append(screenList);
					}
					
				}
				
			}
		}
	})
}

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
startTime=year+"$"+p(month)+"$"+(p(date-date+1))+"$"+(p(h-h))+":"+(p(m-m))+":"+(p(s-s));
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+" "+flag+" "+p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+" "+" - "+" "+initendTime);

function getChart(dataId){
	var data="{data_id:'"+dataId+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
	$.ajax({
		url: globalurl+"/v1/runDatas",
		type:"post",
		dataType:"JSON",
		data:{
			access_token: accesstoken,
			data:data
		},
		async:false,
		crossDomain: true == !(document.all),
		success:function(data){
			console.log(data)
			if(data.length==0){
				$(".list").html("<span class='nonedata'>暂无数据</span>");
			}
		}
	})
}
//点击时间获取图表；
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
           	 for(var i=0;i<chartDivArr.length;i++){
           	 	currentChart(chartDivArr[i]);
           	 }
           });
});