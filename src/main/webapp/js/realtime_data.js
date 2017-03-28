var dataId=2466;//数据id
var deviceId="58ccb438d77a1e15ac5da16a";//设备Id
//var data.device_name;
//var data.data_name;
var startTime;
var endTime;
$(function(){
	toolTip();
	getToken();	

})
//$(".device_name").html("测试日志23");
//$(".data_name").html(2468);
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
var chartArr=new Array();
var chartDivArr =new Array();
//转换初始化值的格式
startTime=year+"$"+p(month)+"$"+(p(date)-p(date)+1)+"$"+(p(h)-p(h))+":"+(p(m)-p(m))+":"+(p(s)-p(s));
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+ flag +p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+" - "+initendTime);
chartDivArr.push(dataId);
currentChart(dataId);//初始化第一次图表
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
var  globalurl="http://192.168.1.114";
function currentChart(dataId){	
	var data="{data_id:'"+dataId+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
	$.ajax({
		type: "post",
		url:  "http://192.168.1.37"+"/v1/realtimeDatas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: "58da135bb769971fcc5e3bdf",
			data:data
		},
		success: function(data) {
			console.log(data)
			var chartType="";
			if(data.code==400002){
				getNewToken();
			}else{
				if(data.data_type<=1){
					chartType="line";
//					if(data.data_values.length==0&&data.max_values.length==0&&data.min_values.length==0){
//						$(".nodata").css("display","block");
//					}else{
						$(".nodata").css("display","none");
//					}
				}else{
					chartType="bar";
//					if(data.data_values.length==0){
//						$(".nodata").css("display","block");
//					}else{
//						$(".nodata").css("display","none");
//					}
				}
					$(".device_name").html(data.device_name);
					$(".data_name").html(data.data_name);   		      	
		      		initChart(data,chartType);
		      		initChart(data,chartType)
		       //初始化图表
				dataId=data.data_id;
				$(document).ready(function() {
				           $('#reservationtime').daterangepicker({
				              timePicker: true,
				              timePickerIncrement: 30,
				              format: 'YYYY-MM-DD A h:mm '
				           }, function(start, end, label) {
				        		
				              start=new Date(start).getFullYear()+"$"+p(new Date(start).getMonth())+"$"+p(new Date(start).getDate())+"$"+p(new Date(start).getHours())+":"+p(new Date(start).getMinutes())+":"+p(new Date(start).getSeconds());
				    		  end=new Date(end).getFullYear()+"$"+p(new Date(end).getMonth())+"$"+p(new Date(end).getDate())+"$"+p(new Date(end).getHours())+":"+p(new Date(end).getMinutes())+":"+p(new Date(end).getSeconds());			           
				           	  startTime=start;
				           	  endTime=end;
				           	  currentChart(dataId);													
				           });
				});
			
				
			}
			
		}
	})
}
//获取对比数据
//alert("1")
$.ajax({
		type: "get",
		url:  "http://192.168.1.37"+"/v1/devices/"+'58ccb438d77a1e15ac5da16a'+"/dataConfigs",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: "58da135bb769971fcc5e3bdf",
			"filter":"{'device_id':'"+"58ccb438d77a1e15ac5da16a"+"'}"			
		},
		success: function(data) {
			console.log(data)
		for(var i=0;i<data.rows.length;i++){
			var Ili="";
				if(data.rows[i].data_id!=dataId){
					Ili="<li onclick='getChart("+data.rows[i].data_id+")'>"+data.rows[i].data_name+"</li>"
					$(".contrastList .listOul").append(Ili)									
			}
		}
			
		}
})
//获取除本身外的图表
function getChart(dataId){
	currentChart(dataId);
}
// 指定图表的配置项和数据
function initChart(data,chartType){	

var ocloseChart="";
var legendData=[];
var chartSeries=[];

for(var i=0;i<chartDivArr.length;i++){						
	if(chartDivArr[i]!=data.data_id){
		var divId='chart'+data.data_id;
		if(chartDivArr.indexOf(data.data_id)==-1){
		chartDivArr.push(data.data_id);
		$(".contrastChart").append("<div class=' "+divId+"'>"+chartArr[i]+"</div>")
		$(".contrastChart").append("<div id='"+divId+"' class='row dataChartBox' style='width:890px;height: 300px;overflow: hidden;margin:20px;'></div>");
		}else{
		$("#"+divId).show();
		$("."+divId).show();
		}
		$("."+divId).empty();
		$("."+divId).append("<span class='closeChart' style='float:right;margin-right:30px;cursor:pointer;' onclick='closeChart("+data.data_id+")'>&times;</span>")
	}
}
if(chartDivArr.length==1){
	var myChart = echarts.init(document.getElementById('line'));
}else{
	var myChart = echarts.init(document.getElementById('chart'+data.data_id));
}

if(data.max_values!=undefined){
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
	chartArr.push(myChart);
//	for(var i=0;i<chartDivArr.length;i++){						
//		if(chartDivArr[i]!=data.data_id){
//			var divId='chart'+data.data_id;
//			if(chartDivArr.indexOf(data.data_id)==-1){
//			chartDivArr.push(data.data_id);
//			$(".contrastChart").append("<div class=' "+divId+"'>"+chartArr[i]+"</div>")
//			$(".contrastChart").append("<div id='"+divId+"' class='row dataChartBox' style='width:890px;height: 300px;overflow: hidden;margin:20px;'></div>");
//			}else{
//			$("#"+divId).show();
//			$("."+divId).show();
//			}
//			$("."+divId).empty();
//			$("."+divId).append("<span class='closeChart' style='float:right;margin-right:30px;cursor:pointer;' onclick='closeChart("+data.data_id+")'>&times;</span>")
//	}
//}
	console.log(chartDivArr)
} 


function closeChart(closeId){
//	console.log(13)
	chartDivArr.splice(chartDivArr.indexOf(closeId),1);
	$("#chart"+closeId).remove();
	$(".chart"+closeId).remove();
}







