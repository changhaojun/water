
var dataId=$("#dataId").val()
var thingId=$('#thingId').val()
var selectedId=[];
var startTime;
var endTime;
var dateInfo=[];
var series=[];
var yAxis=[];
var objData=[];//存放每一个y轴的数据
var chartArr=[];//存放每一次请求到的所有图表信息
var idArr=[];//标签id
var legendData=[];//存放每一个图标的lengend
var dataUnit=[];
var dataFid=[];

var selectedId=[];
$(function(){
	getToken();//刷新令牌
	dataList();//获取device_name
	toolTip();
	getChart();//获取图表数据
})
console.log(thingId)
console.log(dataId)



//
////选择数据
//function selectData(id){
//	console.log($("#"+id+"").html())
//	
//	if($("#"+id+"").html()=="+"){
//		$("#"+id+"").prev().removeClass("disabledFont").addClass("selectdFont");
//		$("#"+id+"").removeClass("disabledIcon").addClass("selectdIcon");
//		$("#"+id+"").parent("div").removeClass("disabledLi").addClass("selectdLi");
//		$("#"+id+"").html("已选");
//	}
////	getChart(dataId)
//}

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

//获取数据标签
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
					if(dataId.indexOf(data[i].data_id)!=-1){					
						screenList='<div class="selectdLi">'+
										'<div class="selectdFont">'+data[i].device_name+'-'+data[i].data_name+'</div>'+
										'<div class="selectdIcon" id="'+data[i].data_id+'">已选</div>'+
										'<div hidden="hidden">'+data[i].data_unit+'</div>'+
										'<div hidden="hidden">'+data[i].data_id+'</div>'+
									'</div>';		
						$(".list").append(screenList);
					}else{
						screenList='<div class="disabledLi" onclick="getChart(&apos;'+data[i].data_id+'&apos;)" >'+
										'<div class="disabledFont">'+data[i].device_name+'-'+data[i].data_name+'</div>'+
										'<div class="disabledIcon" id="'+data[i].data_id+'">+</div>'+
										'<div hidden="hidden">'+data[i].data_unit+'</div>'+
										'<div hidden="hidden">'+data[i].data_id+'</div>'+
									'</div>';
						$(".list").append(screenList);
					}	
				}		
				getChart(data[0].data_id)
			}
		}
	})
}
//当前图表以及点击添加生成图表
function getChart(i){
//	console.info("dataId:"+dataId)
//	console.info("i:"+i)
	if($("#"+i+"").html()=="+"){
		$("#"+i+"").prev().removeClass("disabledFont").addClass("selectdFont");
		$("#"+i+"").removeClass("disabledIcon").addClass("selectdIcon");
		$("#"+i+"").parent("div").removeClass("disabledLi").addClass("selectdLi");
		$("#"+i+"").html("已选");
	}
	legendData=[];dataUnit=[];dataFid=[];
	for(var n=0;n<$(".list").children().length;n++){
		
		if($(".list").children().eq(n).hasClass('selectdLi')){
			legendData.push($(".list").children().eq(n).children().eq(0).html());
//			console.log(legendData)
			dataUnit.push($(".list").children().eq(n).children().eq(2).html())
//			console.log(dataUnit)
			dataFid.push(Number($(".list").children().eq(n).children().eq(3).html()))
			console.log(dataFid)
		}
	}
	
	var data="{data_id:'"+i+"',start_time:'"+startTime+"',end_time:'"+endTime+"'}";
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
				$(".chartsContent").html("<span class='nonedata'>暂无数据</span>");
	
			
			}else{
				
				chartArr.push(data);
//				console.log(chartArr)
				initChart(data,i,legendData);
			}
		}
	})
}

var option={
		title:{
			text:''
		},
		tooltip: {
			trigger: 'axis'
		},
		legend: {
//	        data:legendData
	    },
	    grid: {
			left: '5%',
			right: '20%',
			bottom: '5%'
		},
		xAxis: {
	        type: 'category',
	        boundaryGap: false,//段空白策略
	        data:dateInfo
	    },
	    yAxis:{
	    	type:'value'
	    } ,
		series:series	
	};
	var myChart=echarts.init(document.getElementById('chartsContent'))
	myChart.setOption(option);


function initChart(data,i,legendData){
	var objData=[];obj=[]
	for(var j=0;j<chartArr.length;j++){
//			chartArr[j].dataValues
		objData.push(chartArr[j].dataValues);	
	}
	//console.log(objData)
	
	series=[];
	yAxis=[];
	for(var j=0;j<legendData.length;j++){
		
		//将请求到的数据添加到y轴的数据中	 
		 yAxis.push({
			type:'value',
//			name: unitNme[j],
			splitLine: { show: false }, //去除网格中的坐标线
			offset:60*j,
			position:'left',
			axisLabel: {
				formatter: '{value}'+dataUnit[j]
			}
		});
		//遍历每一个标签看是否被选中，如果选中绘制折线，没有选中不绘制折线
		series.push({
            name: legendData[j],
            type: 'line',
            stack: '总量',
            yAxisIndex:j,
           // areaStyle:{ normal: {} },
            data: objData[j],
            markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            },
            markLine : {
                data : [
                    {type : 'average', name: '平均值'},
                ]
            },
//          markLine:{
//                  data:[
//                          [ {name: '标线1起点', x: 280, y: 460},
//                              {name: '标线1终点', x: 800, y: 460}
//                          ]
//                  ]
//              }

       });
	}	

	var myChart=echarts.init(document.getElementById('chartsContent'))
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
				left: '10%',
				right: '5%',
				top: '12%',
				bottom: '12%',
				containLabel: true
			},
			xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data:chartArr[0].dataTimes
		    },
		    yAxis:yAxis,
		    /*dataZoom:[
            //x轴缩放
	            {
	                type:'slider',
	                xAxisIndex:0,
	                start:20,
	                end:80,
	                height:30,
	            },
	            {
	                type:'inside',
	                xAxisIndex:0,
	                start:20,
	                end:80
	            }
	        ],*/
			series:series
			
		};
		//console.log(dateInfo)
//		console.log(yAxis)
//		console.log(series)
		myChart.setOption(option);
}

$('.chartContent button').click(function(){
	$('.chartContent button').removeClass('btnColor');
	$(this).addClass('btnColor');
})

//设置关注
function focus1(id){
	var data={};
	data.data_id=dataFid
	data.thing_id=thingId;
	$.ajax({
		type:'post',
		url: globalurl+"/v1/desktops",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
			data:JSON.stringify(data)
		},
		success:function(data){
			console.log(data)
			if(data.code==200){
				layer.msg('关注成功', {
					icon: 1,
					time:2000,
				});
			}
			
		}
	})
}
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
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
// 	 for(var i=0;i<chartDivArr.length;i++){
// 	 	currentChart(chartDivArr[i]);
// 	 }
   });
});