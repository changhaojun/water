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
	selectData();//获取已关注的图表数据
})

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
startTime=GetDateStr1(4,1)
endTime=year+"$"+p(month)+"$"+(p(date))+"$"+(p(h))+":"+(p(m))+":"+(p(s));
initstartTime=GetDateStr1(4)
initendTime=year+'-'+p(month)+"-"+p(date)+" "+flag+" "+p(h)+':'+p(m);
$("#reservationtime").val(initstartTime+" "+" - "+" "+initendTime);



//获取数据标签，entity_data做过同样请求，数据已保存在父页面
function dataList(){
	var data = parent.runDataList;
	if(data.length==0){
		$(".list").html("<span class='nonedata'>暂无数据</span>");
	}else{
		var screenList="";			
		for(var i=0;i<data.length;i++){
			screenList='<div  portType="'+data[i].port_type+'" class="disabledLi '+data[i].data_id+'" onclick="getChart(&apos;'+data[i].data_id+'&apos;)" >'+
							'<div class="disabledFont">'+data[i].device_name+'-'+data[i].data_name+'</div>'+
							'<div class="disabledIcon" id="'+data[i].data_id+'">+</div>'+
							'<div hidden="hidden">'+data[i].data_unit+'</div>'+
							'<div hidden="hidden">'+data[i].data_id+'</div>'+
						'</div>';
			$(".list").append(screenList);	
		}
		getChart(dataId)
	}
}
//当前图表以及点击添加生成图表
function getChart(i){
	if($("#"+i+"").html()=="+"){
		$("#"+i+"").prev().removeClass("disabledFont").addClass("selectdFont");
		$("#"+i+"").removeClass("disabledIcon").addClass("selectdIcon");
		$("#"+i+"").parent("div").removeClass("disabledLi").addClass("selectdLi");
		$("#"+i+"").html("已选");
		
		dataUnit=[];dataFid=[];
		for(var n=0;n<$(".list").children().length;n++){
			if($(".list").children().eq(n).hasClass('selectdLi')){
				dataUnit.push($(".list").children().eq(n).children().eq(2).html())
				dataFid.push(Number($(".list").children().eq(n).children().eq(3).html()))
			}
		}
		var data="{data_id:"+Number(i)+",start_time:'"+startTime+"',end_time:'"+endTime+"'}";
		$.ajax({
			url: globalurl+"/v1/runDatas",
			type:"post",
			dataType:"JSON",
			data:{
				access_token: accesstoken,
				data:data
			},
			async:true,
			crossDomain: true == !(document.all),
			success:function(data){
				if(data.length==0){
					layer.msg('该时段暂无数据',{icon:0,time:2000})
				}else{
					if(data.dataTimes.length==0 ||data.dataValues.length==0){
						layer.msg('该时段暂无数据',{icon:0,time:2000})
					}else{
						chartArr.push(data);
						initChart();
					}
				}
			}
		})
	}else{
		$("#"+i+"").prev().addClass("disabledFont").removeClass("selectdFont");
		$("#"+i+"").addClass("disabledIcon").removeClass("selectdIcon");
		$("#"+i+"").parent("div").addClass("disabledLi").removeClass("selectdLi");
		$("#"+i+"").html("+");
		
		var del1=$("#"+i+"").attr('id')
		var del=del1*1
		for(var j=0;j<dataFid.length;j++){
			if(del==dataFid[j]){
				dataFid.splice(j,1)
				dataUnit.splice(j,1)
			}
		}
		var data={};
		data.data_id=dataFid
	  	data.start_time=startTime
	  	data.end_time=endTime
		
		$.ajax({
			url: globalurl+"/v1/runDatas",
			type:"post",
			dataType:"JSON",
			data:{
				access_token: accesstoken,
				data:JSON.stringify(data)
			},
			async:true,
			crossDomain: true == !(document.all),
			success:function(data){
				echarts.init(document.getElementById('chartsContent')).clear();
				chartArr=[];
				if(data.length==0){
					layer.msg('该时段暂无数据',{icon:0,time:2000})
				}else{
					
					for(var i=0;i<dataFid.length;i++){
						if(data[i].dataTimes.length==0 || data[i].dataValues.length==0){

						}else{
							chartArr.push(data[i]);
						}
					}
					initChart();
				}
			}
		})
	}
	
	//判断是否被关注
	for(var j=0;j<selectedId.length;j++){
		if(selectedId[j].toString()==dataFid.toString()){
			$('.chartContent span').addClass('disabledFa');
			break
		}
		else{
			$('.chartContent span').removeClass('disabledFa');
		}
	}
}

//图表配置项以及实例化图表
function initChart(){
	if(chartArr.length==0){
		layer.msg('该时段暂无数据',{
			icon:0,
			time:2000
		})
	}else{
		var objData=[]; legendData=[];
		for(var j=0;j<chartArr.length;j++){
			objData.push(chartArr[j].dataValues);	
			legendData.push(chartArr[j].device_name+'-'+chartArr[j].data_name)
		}
		series=[];
		yAxis=[];
		for(var j=0;j<chartArr.length;j++){
			//将请求到的数据添加到y轴的数据中	 
			var charDataId=chartArr[j].data_id
			var type = $('.'+charDataId).attr('portType')
			var chartType,maxValue;
			if(type == 'DI' || type == 'DO'){
				chartType = 'bar';
				maxValue = 2;
			}else{
				chartType = 'line';
				maxValue = Math.ceil(chartArr[j].max_value);
			}
			 yAxis.push({
				type:'value',
				splitLine: { show: false }, //去除网格中的坐标线
				min:0,
				max:maxValue,
				offset:45*j,
				position:'left',
				axisLabel: {
					formatter: '{value}'+dataUnit[j]
				}
			});
			//遍历每一个标签看是否被选中，如果选中绘制折线，没有选中不绘制折线
			series.push({
	            name: legendData[j],
	            type: chartType,
	//          smooth:true,//使折线平滑
	            yAxisIndex:j,
	//          areaStyle:{ normal: {} },//是否显示阴影面积
	            data: objData[j],
	            barMaxWidth:40,
	            barGap:'10%',
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
			        data:legendData,
			        x:'50px',
			        y:'top'
			    },
			    toolbox : {
		            show :true,
		            x:'96%',
		            feature : {
		                saveAsImage : {
		                    show :true,
		                }
		            }
		        },
			    grid: {
					left: '5%',
					right: '10%',
					top: '15%',
					bottom: '12%',
					containLabel: true
				},
				xAxis: {
			        type: 'category',
			        boundaryGap: true,
			        interval:5,
			        axisTick:{
			        	alignWithLabel:true
			        },
			        data:chartArr[0].dataTimes
			    },
			    yAxis:yAxis,
			    dataZoom:[
		        	//x轴缩放
		            {
		                type:'slider',
		                xAxisIndex:0,
		                start:80,
		                end:100,
		                height:30,
		                maxValueSpan:40
		            },
		            {
		                type:'inside',
		                xAxisIndex:0,
		                start:80,
		                end:100,
		                maxValueSpan:40
		            }
		        ],
				series:series		
			};
		myChart.setOption(option);
		window.onresize = myChart.resize;
	}
	
}

$('.chartContent button').click(function(){
	$('.chartContent button').removeClass('btnColor');
	$(this).addClass('btnColor');
})

//设置关注
$('.chartContent').delegate('.focusr','click',function(){
	var This=$(this)
	if($(this).hasClass('disabledFa')){
		layer.msg('已关注',{icon:2})
	}else{
		var data={};
		data.data_id=dataFid
		data.thing_id=thingId;
		$.ajax({
			type:'post',
			url: globalurl+"/v1/desktops",
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data:{
				access_token: accesstoken,
				data:JSON.stringify(data)
			},
			success:function(data){
				if(data.code==200){
					layer.msg('关注成功', {
						icon: 1,
						time:2000,
					});
					This.addClass('disabledFa');
				}
			}
		})
	}
})
//获取已关注的数据
function selectData(){
	$.ajax({
		type:'get',
		url: globalurl+"/v1/desktops",
		dataType:'JSON',
		async: true,
		crossDomain: true == !(document.all),
		data:{
			access_token: accesstoken,
		    fields:"data_id",
		    filter:JSON.stringify({"thing_id":thingId,"is_chart":1})
		},
		success:function(data){
			for(var i=0;i<data.length;i++){
				selectedId.push(data[i].data_id)
			}
		}
	})
}
//初始化提示框
function toolTip(){
	$('[data-toggle="tooltip"]').tooltip();
	topColor($('.fa'),'orange') 
}
function topColor(obj,color){
	obj.on("mouseover",function(){
		$(".tooltip-inner").css("background-color",color);
		$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
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
   	  var data={};
   	  data.data_id=dataFid
   	  data.start_time=startTime
   	  data.end_time=endTime
		$.ajax({
			url: globalurl+"/v1/runDatas",
			type:"post",
			dataType:"JSON",
			data:{
				access_token: accesstoken,
				data:JSON.stringify(data)
			},
			async:true,
			crossDomain: true == !(document.all),
			success:function(data){
				echarts.init(document.getElementById('chartsContent')).clear();
				chartArr=[];
				if(data.length==0){
					layer.msg('该时段暂无数据',{icon:0,time:2000})
				}else{	
					for(var i=0;i<dataFid.length;i++){
						if(data[i].dataTimes.length==0 || data[i].dataValues.length==0){

						}else{
							chartArr.push(data[i]);
						}
					}
					initChart();
				}
			}
		})
		$('.chartContent button').removeClass('btnColor')
   })
})

function GetDateStr(AddDayCount) { 
	var dd = new Date(); 
		dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期 

	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 

	var d = dd.getDate(); 
	var h=dd.getHours();
	var mm=dd.getMinutes();
	var s=dd.getSeconds();
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

//24小时、48小时、72小时图表
function changeData(i){
	var start=GetDateStr(i);
	var end=GetDateStr(0)
	startTime=start;
   	endTime=end;
	
	
	var data={};
		data.data_id=dataFid
	  	data.start_time=startTime
	  	data.end_time=endTime
	$.ajax({
		url: globalurl+"/v1/runDatas",
		type:"post",
		dataType:"JSON",
		data:{
			access_token: accesstoken,
			data:JSON.stringify(data)
		},
		async:true,
		crossDomain: true == !(document.all),
		success:function(data){
			echarts.init(document.getElementById('chartsContent')).clear();
			chartArr=[];
			if(data.length==0){
				layer.msg('该时段暂无数据',{icon:0,time:2000})
			}else{	
				for(var i=0;i<dataFid.length;i++){
					if(data[i].dataTimes.length==0 || data[i].dataValues.length==0){

					}else{
						chartArr.push(data[i]);
					}
				}
				initChart();
			}
		}
	})
	var initstartTime=GetDateStr2(i)
	$("#reservationtime").val(initstartTime+" "+" - "+" "+initendTime);
}

//获取当前时间的前几小时
function GetDateStr1(n,state) { 
	var dd = new Date();  
		dd=new Date(dd.getTime() - n*60*60*1000); //获取前n小时的日期
	var y = dd.getFullYear(); 
	var m = dd.getMonth()+1;//获取当前月份的日期 
	var d = dd.getDate(); 
	var h=dd.getHours();

	var mm=dd.getMinutes();
	var s=dd.getSeconds();
	if(state){
		return y+"$"+p(m)+"$"+p(d)+"$"+p(h)+":"+p(mm)+":"+p(s); 
	}else{
		return y+"-"+p(m)+"-"+p(d)+" AM "+p(h)+":"+p(mm); 
	}	
}