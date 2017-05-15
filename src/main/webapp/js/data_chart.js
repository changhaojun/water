
var stationId=$("#stationId").val();
var startTime, endTime;
var accesstoken=getToken();
var idArr=[];//标签id
var onOff=true;
var chartArr=[];//存放每一次请求到的所有图表信息
var dataUnit=[];//存放每一次请求到的单位
var maxMin=[];//存放图表数据的最大值和最小值
var obj=[];//存放图表的value
var unitNme=[];//存放转化成汉字的单位
var objData=[];//存放每一个y轴的数据
var legendData=[];//存放每一个图标的lengend
var series=[];//存放每一个y轴的数据
//获取当前时间
function fn(s) {
	return s < 10 ? '0' + s : s
}
//创建时间对象
var myDate = new Date();
//获取当前的年
var year = myDate.getFullYear();
//获取当前的月(0-11)
var month = myDate.getMonth() + 1;
//获取日(1-31)
var day = myDate.getDate();
//获取小时(0-23)
var hour = myDate.getHours();
//获取分(0-59)
var minute = myDate.getMinutes();
var second = myDate.getSeconds();
var timeCatre = "";
//console.log(hour)
hour<12 ? timeCatre="AM":timeCatre="PM";

//console.log(timeCatre)

//转换初始化时间值的格式
startTime=year+"$"+fn(month-1)+"$"+(fn(day-day+1));
endTime=year+"$"+fn(month)+"$"+(fn(day));
initstartTime=year+'-'+fn(month)+"-"+fn(day)+" AM "+fn(hour-hour)+':'+fn(minute-minute);
initendTime=year+'-'+fn(month)+"-"+fn(day)+ "PM" +"11:59";
$("#reservationtime").val(initstartTime+" - "+initendTime);
//console.log(startTime)
chartTag();
//获取图标的标签
function chartTag(){
	$.ajax({
		type:"get",
		datatype:"json",
		crossDomain: true == !(document.all),
		url:globalurl+'/v1_0_0/station_tag',
		data:{
			access_token:accesstoken
		},
		success:function(data){
			//console.log(data);
			var tagName=data.station_tag;
			for(var i=0;i<tagName.length;i++){
				idArr.push(tagName[i]._id);
				var tagList ='<li onclick="chartData('+i+')">'+tagName[i].tag_name+'</li>';
				$(".selectData").append(tagList);
				//dataUnit.push(tagName[i].data_unit)
			}
			$(".selectData").find("li").eq(0).addClass("selectFocus");
			chartData(0)
			
		}
	});
}
//点击获取时间
$(document).ready(function() {
       $('#reservationtime').daterangepicker({
	       	showWeekNumbers : false, //是否显示第几周  
	        timePicker : true, //是否显示小时和分钟  
	        timePickerIncrement : 30, //时间的增量，单位为分钟  
	        format: 'YYYY-MM-DD A h:mm ',//显示格式
	        language: 'zh-CN'//显示中文
       }, function(start, end, label) {	
	        startDay=new Date(start).getFullYear()+"$"+fn(new Date(start).getMonth()+1)+"$"+fn(new Date(start).getDate());
			endDay=new Date(end).getFullYear()+"$"+fn(new Date(end).getMonth()+1)+"$"+fn(new Date(end).getDate()); 
	        startHour=new Date(start).getFullYear()+"$"+fn(new Date(start).getMonth()+1)+"$"+fn(new Date(start).getDate())+"$"+fn(new Date(start).getHours())+":"+fn(new Date(start).getMinutes())+":"+fn(new Date(start).getSeconds());
			endHour=new Date(end).getFullYear()+"$"+fn(new Date(end).getMonth()+1)+"$"+fn(new Date(end).getDate())+"$"+fn(new Date(end).getHours())+":"+fn(new Date(end).getMinutes())+":"+fn(new Date(end).getSeconds());			           
			var startSec=fn(new Date(start).getHours())+":"+fn(new Date(start).getMinutes())+":"+fn(new Date(start).getSeconds());
			var endSec=fn(new Date(end).getHours())+":"+fn(new Date(end).getMinutes())+":"+fn(new Date(end).getSeconds());			           ;
			if(startSec=="00:00:00" && endSec=="23:59:59"){
				changeDate()
			}else{
				changeHour()
			}
			
	       	//
	    	//
			
       });
});
//天发生改变图表的变化
function changeDate(){
	legendData=[];
	var m=0
	for(var j=0;j<$(".selectData").find("li").length;j++){
		if($(".selectData").find("li").eq(j).hasClass("selectTag")||$(".selectData").find("li").eq(j).hasClass("selectFocus")){
			legendData.push($(".selectData").find("li").eq(j).html());
			m=j;
		}
	}
	console.log(startDay)
	$.ajax({
		type:"get",
		dataType:"json",
		crossDomain: true == !(document.all),
		url:globalurl+'/v1_0_0/dayDatas',
		data:{
			access_token:accesstoken,
			station_id:stationId,
			start_time:startDay,
			end_time:endDay,
			tag_id:idArr[m]
		},
		success:function(data){
			console.log(data)
			if(data.code==400003){
				console.log(54546)
				layer.msg('该段时间内没有数据,请重新选择！', {
						icon: 2,
						time:3000,
				});
				echarts.init(document.getElementById('chartContent')).clear();
			}else{
				console.log(76767)
				chartArr.push(data)
				initChart(data,m,legendData)
			}
		}
		
	});
}
//小时发生变化
function changeHour(){
	legendData=[];
	var m=0
	for(var j=0;j<$(".selectData").find("li").length;j++){
		if($(".selectData").find("li").eq(j).hasClass("selectTag")||$(".selectData").find("li").eq(j).hasClass("selectFocus")){
			legendData.push($(".selectData").find("li").eq(j).html());
			m=j;
		}
	}
	$.ajax({
		type:"get",
		dataType:"json",
		crossDomain: true == !(document.all),
		url:globalurl+'/v1_0_0/hourDatas',
		data:{
			access_token:accesstoken,
			station_id:stationId,
			start_time:startHour,
			end_time:endHour,
			tag_id:idArr[m]
		},
		success:function(data){
			console.log(data)
			if(data.length>0){
				if(data.code==400003){
					console.log(54546)
					layer.msg('该段时间内没有数据,请重新选择！', {
							icon: 2,
							time:3000,
					});
					echarts.init(document.getElementById('chartContent')).clear();
				}else{
					
					console.log(76767)
					chartArr.push(data)
					initChart(data,m,legendData)
				}
			}else{
				layer.msg('该段时间内没有数据,请重新选择！', {
					icon: 2,
					time:3000,
				});
					echarts.init(document.getElementById('chartContent')).clear();
				
			}
			
		}
		
	});
}



//当前图表以及点击标签生成图表
function chartData(i){
	$(".selectData").find("li").eq(0).removeClass("selectFocus");
	$(".selectData").find("li").eq(i).toggleClass("selectTag");
	legendData=[];
	for(var n=0;n<$(".selectData").find("li").length;n++){
		if($(".selectData").find("li").eq(n).hasClass("selectTag")||$(".selectData").find("li").eq(n).hasClass("selectFocus")){
			legendData.push($(".selectData").find("li").eq(n).html());
		}
	}
	$.ajax({
		type:"get",
		datatype:"json",
		url:globalurl+"/v1_0_0/dayDatas",
		crossDomain:true == !(document.all),
		data:{
			access_token:accesstoken,
			station_id:stationId,
			tag_id:idArr[i],
			start_time:startTime,
			end_time:endTime,
		},
		success:function(data){
		console.log(data)
			chartArr.push(data)
//			console.log(chartArr)
			maxMin.push(data[data.length-1]);
			//console.log(maxMin)
			//data=data.pop()
			initChart(data,i,legendData);
			
		}
	});
}

//图表的数据项和配置

function initChart(data,i,legendData){
	//unique1(dataUnit)
	//var name=dataUnit;
	var yAxis=[];
	series=[];
	 //数组去重
//	var newArr;
//	function unique1(arr) {
//		newArr = [];//新建一个数组
//		for(var i = 0, len = arr.length; i < len; i++) {
//			if(newArr.indexOf(arr[i]) == -1) { //若新数组中未包含该项则将其存入新数组
//				newArr.push(arr[i]);
//			}
//		}
//		return newArr;
//	} 
//	console.log(dataUnit)
	objData=[];
	for(var j=0;j<chartArr.length;j++){
		obj=[];
		for(var n=0;n<chartArr[j].length-1;n++){
			 obj.push(chartArr[j][n].data_value)	
			// console.log(obj)
		}
		objData.push(obj);
		//maxMin=chartArr[j].pop();
		
	}
//	console.log(legendData.length)
//	console.log(chartArr.length)
	unitNme=[];
	dataUnit=[];
	for(var j=0;j<legendData.length;j++){
		/*switch (legendData[j]) {
			case "℃": unitNme.push('温度');break;
			case "Kpa":unitNme.push('压力') ;break;
			case "GJ":unitNme.push('能耗') ;break;
			case "m³/h":unitNme.push('流量');break;
			default :break;
		}*/
		
		switch (legendData[j]) {
			case "一网供温": 
				unitNme.push('温度');
				dataUnit.push('℃');
				break;
			case "一网回温": 
				unitNme.push('温度');
				dataUnit.push('℃');
				break;
			case "一网供压":
				unitNme.push('压力') ;
				dataUnit.push('Kpa');
				break;
			case "计划能耗":
				unitNme.push('能耗') ;
				dataUnit.push('GJ');
				break;
			case "实际能耗":
				unitNme.push('能耗') ;
				dataUnit.push('GJ');
				break;
			case "瞬时流量":
				unitNme.push('流量');
				dataUnit.push('m³/h');
				break;
			default :break;
		}
		 var m=-1;
		 /*console.log(dataUnit)
		 console.log(legendData[j])
		 console.log(dataUnit[j]);*/
		 //判断y轴是第几个，如果是第1，2则距离是默认
		 if(j<2){m=0;}else{m=j-1;};
		 //将请求到的数据添加到y轴的数据中	 
		 yAxis.push({
			type:'value',
			name: unitNme[j],
			splitLine: { show: false }, //去除网格中的坐标线
			offset:43*m,
			axisLabel: {
				formatter: '{value}'+ dataUnit[j]
			}
		});
		//遍历每一个标签看是否被选中，如果选中绘制折线，没有选中不绘制折线
		series.push({
            name: legendData[j],
            type: 'line',
            stack: '总量',
            yAxisIndex:j,
           // areaStyle:{ normal: {} },
            data: objData[j]
       });
		 
	}
	
	var dataInfo=[],dateInfo=[];
	//console.log(data.length)
	for(var j=0;j<data.length-1;j++){
		dataInfo.push(data[j].data_value)
		dateInfo.push(data[j].create_date)
	}
//	console.log(dateInfo)
	var myChart = echarts.init(document.getElementById("chartContent"));
	var option={
		title:{
			text:''
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
	        data:legendData
	    },
	    grid: {
			left: '5%',
			right: '20%',
			bottom: '5%'
		},
		xAxis: {
	        type: 'category',
	        boundaryGap: false,
	        data:dateInfo
	    },
	    yAxis:yAxis ,
		series:series
		
	};
	myChart.setOption(option,true);
	myChart.hideLoading();
	console.log(series)
}

