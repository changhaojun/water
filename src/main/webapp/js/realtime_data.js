var dataId=2466;//数据id
var deviceId="58ccb438d77a1e15ac5da16a";//设备Id
var startTime;
var endTime;
$(function(){
	toolTip();
	getToken();	

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
var flag="";
if(h>=12){
	flag="PM";
}else{
	flag="AM";
}
//转换初始化值的格式
startTime=year+"$"+p(month)+"$"+(p(date)-p(date)+1)+"$"+(p(h)-p(h))+":"+(p(m)-p(m))+":"+(p(s)-p(s));
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+ flag +p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+" - "+initendTime);
console.log(endTime)
currentChart(dataId);//初始化第一次图表
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
var  globalurl="http://192.168.1.37/";
function currentChart(dataId){
	console.log(startTime)
	var data="{data_id:'"+dataId+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
	$.ajax({
		type: "post",
		url:  globalurl+"/v1/realtimeDatas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: "58d8ba58b769971a146f8989",
			data:data
		},
		success: function(data) {
			var chartType="";
			if(data.code==400002){
				getNewToken();
			}
			if(data.data_type<=1){
				chartType="line";
			}else{
				chartType="bar";
			}
			console.log(data)
			$(".device_name").html(data.device_name);
			$(".data_name").html(data.data_name);
//			if(data.max_values.length==undefined){
//	       	  	$(".nodata").css("display","block");
//	       	}else{
	       	  	$(".nodata").css("display","none");
	       	  	initChart(data,chartType);	       	  	
//	        }			
			dataId=data.data_id;
			$(document).ready(function() {
			           $('#reservationtime').daterangepicker({
			              timePicker: true,
			              timePickerIncrement: 30,
			              format: 'YYYY-MM-DD A h:mm '
			           }, function(start, end, label) {           
			              start=new Date(start).toLocaleDateString().replace(new RegExp("/","gm"),"$")+"$"+new Date(start).getHours()+":"+new Date(start).getMinutes()+":"+new Date(start).getSeconds();
			    		  end=new Date(end).toLocaleDateString().replace(new RegExp("/","gm"),"$")+"$"+new Date(end).getHours()+":"+new Date(end).getMinutes()+":"+new Date(end).getSeconds();			           
			           	  startTime=start;
			           	  endTime=end;			           	  
			           	  currentChart(dataId);
//			           	  if(data.data_values.length==0&&data.max_values.length==0&&data.min_values==0){
//			           	  	$(".nodata").css("display","block");
//			           	  }else{
//			           	  	$(".nodata").css("display","none");
			           	  	initChart(data,chartType);
//			           	  }
							console.log(dataId);
			           	  
			           });
			});
		}
	})
}

//deviceId="%7B_id%7D";
//获取对比数据

$.ajax({
		type: "get",
		url:  globalurl+"v1/devices/58ccb438d77a1e15ac5da16a/dataConfigs",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: "58d8ba58b769971a146f8989",
			"filter":'{"data_id":'+dataId+'}'
			
		},
		success: function(data) {
			console.log(data);
			var Ili="";
			for(var i=0;i<data.rows.length;i++){
				Ili="<li onclick='getChart("+data.rows[i].data_id+")'>"+data.rows[i].data_name+"</li>"
				$(".contrastList .listOul").append(Ili)
			}
			
		}
})
//获取除本身外的图表
function getChart(dataId){
	currentChart(dataId);
	console.log(dataId)
}

// 指定图表的配置项和数据
function initChart(data,chartType){
var legendData=[];
var chartSeries=[];
var myChart = echarts.init(document.getElementById('line'));
if(data.data_type!=undefined){
legendData=["平均值","最大值","最小值"];
	chartSeries=[{ 
		"name":"平均值",
		"type":chartType,
		"areaStyle": {normal: {}},
		"data":data.data_values		
	},
	{ 
		"name":"最大值",
		"type":chartType,
		"areaStyle": {normal: {}},
		"data":data.max_values		
	},
	{ 
		"name":"最小值",
		"type":chartType,
		"areaStyle": {normal: {}},
		"data":data.min_values		
	}]
	
}else{
	legendData=["实时数据"];
	chartSeries=[{ 
		"name":"实时数据",
		"type":chartType,
		"data":data.data_values		
	}]
}
var option = {
    title: {
        text:data.data_name
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data:legendData
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data:data.data_times
    },
    yAxis: {
        type: 'value',
        axisLabel : {formatter: '{value}'}
    },
    series: chartSeries
};
myChart.setOption(option);
$(".contrastChart").append(myChart);
//$(".contrastChart canvs").getContext("2d").fillStyle("#1ab394");
} 








