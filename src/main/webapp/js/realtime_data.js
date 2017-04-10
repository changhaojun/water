var dataId=$("#dataId").val()//数据id
var deviceId=$("#deviceId").val()//设备Id
var startTime;
var endTime;
var arrLi=[];
//console.log(dataId);

$(function(){
	toolTip();
	getToken();	//刷新令牌
	chartDivArr.push(parseInt(dataId));//push当前的dataId;
//	console.log(chartDivArr)
	currentChart(dataId);//初始化第一次图表;
	contrastData();//初始化对比数据项列表;
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
var chartArr=new Array();
var chartDivArr =new Array();
//转换初始化时间值的格式
startTime=year+"$"+p(month)+"$"+(p(date-date+1))+"$"+(p(h-h))+":"+(p(m-m))+":"+(p(s-s));
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=year+'-'+p(month)+"-"+p(date)+" AM "+p(h-h)+':'+p(m-m);
initendTime=year+'-'+p(month)+"-"+p(date)+ flag +p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+" - "+initendTime);

//console.log(myDate);
//初始化提示框；
function toolTip(){
	$('[data-toggle="tooltip"]').tooltip();
}

//当前dataId的图表；
function currentChart(dataId){	
	var data="{data_id:'"+dataId+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
	$.ajax({
		type: "post",
		url:  globalurl+"/v1/realtimeDatas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken,
			data:data
		},
		success: function(data) {
			
			var chartType="";
			if(data.code==400005){
				getNewToken();
				currentChart(dataId)
			}else{
				if(data.data_type<=1){						
						chartType="line";
				}else{
						chartType="bar";													
				}				
				initChart(data,chartType)
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
//获取对比数据
function contrastData(){
	$.ajax({
		type: "get",
		url:  globalurl+"/v1/devices/"+deviceId+"/dataConfigs",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken,
			"filter":"{'device_id':'"+deviceId+"'}"			
		},
		success: function(data) {
			console.log(data);
			if(data.code==400005){
				getNewToken();
				contrastData()
			}else{							
				for(var i=0;i<data.rows.length;i++){
					var Ili="";
					if(data.rows[i].status==1&&data.rows[i].data_name!=""){
						arrLi.push(data.rows[i]);
					}
				}
				for(var i=0;i<arrLi.length;i++){
					if(arrLi[i].status==1&&arrLi.length==1){							
						$(".contrastList .listOul").html("<span>暂无对比数据</span>");
					}else{
						if(arrLi[i].data_id!=dataId&&arrLi[i].status==1&&arrLi.length>1&&arrLi[i].data_name!=""){	
			
							Ili="<li onclick='currentChart("+arrLi[i].data_id+")'>"+arrLi[i].data_name+"</li>"
							$(".contrastList .listOul").append(Ili)
							
						}
					}
				}
			}					
		}	
					
	})
}
//获取除本身外的图表
function getChart(dataId){
//	console.log(dataId)
	currentChart(dataId);
}
// 指定图表的配置项和数据
function initChart(data,chartType){	
	var legendData=[];
	var chartSeries=[];
//	console.log(data)
	for(var i=0;i<chartDivArr.length;i++){						
			var divId='chart'+data.data_id;
			if(chartDivArr.indexOf(data.data_id)==-1){
			chartDivArr.push(data.data_id);
				$(".contrastChart").append("<div class=' "+divId+"'>"+chartArr[i]+"</div>")
				$(".contrastChart").append("<div id='"+divId+"' class='row dataChartBox' style='width:780px;height: 300px;overflow: hidden;margin:20px;'></div>");			
			}else{
				$("#"+divId).show();
				$("."+divId).show();
			}
			$("."+divId).empty();
			$("."+divId).append("<span class='closeChart' style='float:right;margin-right:20px;cursor:pointer;' onclick='closeChart("+data.data_id+")' data-toggle='tooltip' data-placement='top' title='删除'>&times;</span>")
	}
	toolTip();
	var myChart = echarts.init(document.getElementById('chart'+data.data_id));
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
	        data:data.data_times,
	        axisLabel: {
                show: true,
                textStyle: {
                    color: '#1ab394'
                }
           }
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel : {
	        	formatter: '{value}',
	        	show: true,
                textStyle: {
                    color: '#1ab394'
                }
	        }
	    },
	    series: chartSeries
};	
	myChart.setOption(option);
	chartArr.push(myChart);
} 

//删除图表
function closeChart(closeId){
	chartDivArr.splice(chartDivArr.indexOf(closeId),1);
	$("#chart"+closeId).remove();
	$(".chart"+closeId).remove();
}







