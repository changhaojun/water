$.allData={
	year:2017,
	month:6,
	powerData:{},
	lastYearPowerData:{},
	barsData:{},
	workLineData:{
		workshop1:{
			2017:{},
			2016:{},
		},
		workshop2:{
			2017:{},
			2016:{},
		},
		workshop3:{
			2017:{},
			2016:{},
		},
		workshop4:{
			2017:{},
			2016:{},
		},
	},
	companyLine:{},
	chartArr:{},
	nowMonth:'',
};
$.fn.extend({
	drawCompany:function(companyData){
		$.allData.companyLine = echarts.init($(this)[0]);
		var legendData=[],xAxisData=[],seriesData={2017:[],2016:[]};
		var flag=true;
		for(var year in companyData){
			var legendStr=year+'年电耗'
			legendData.push(legendStr)
			for(var day in companyData[parseInt(year)]){
				var dayStr=day.split("/")[1]+day.split("/")[2]
				if(flag){
					xAxisData.push(dayStr)
				}
				seriesData[year].push(companyData[year][day])
			}
			flag=false;
		}
        var option = {
            title: {
                text: '苏宿污水处理厂电耗环比分析'
            },
            tooltip: {
	            	trigger: 'axis',
			        position: function (pt) {
			            return [pt[0], '10%'];
			        }
		        },
            legend: {
            	data:legendData
            },
             dataZoom: [{
		        type: 'inside',
		        start: 0,
		        xAxisIndex: [0], 
		        end: 30
		    }, {
		        start: 1,
		        end: 10,
		        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
		        handleSize: '80%',
		        handleStyle: {
		            color: '#fff',
		            shadowBlur: 3,
		            shadowColor: 'rgba(0, 0, 0, 0.6)',
		            shadowOffsetX: 2,
		            shadowOffsetY: 2
		        }
		    }],
            xAxis: [
            	 {
		            type : 'category',
		            boundaryGap : false,
		            data : xAxisData
		        }
            ],
            yAxis: {},
            series:[ {
            	name:legendData[1],
				type:'line',
	            itemStyle: {
	                normal: {
	                    color: 'rgb(255, 70, 131)'
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                        offset: 0,
	                        color: 'rgb(255, 158, 68)'
	                    }, {
	                        offset: 1,
	                        color: 'rgb(255, 70, 131)'
	                    }])
	                }
	            },
				data:seriesData[2017]
            },
            {
            	name:legendData[0],
				type:'line',
	            itemStyle: {
	                normal: {
	                    color: 'rgb(1, 157, 254)'
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                        offset: 0,
	                        color: 'rgb(142, 154, 176)'
	                    }, {
	                        offset: 1,
	                        color: 'rgb(1, 157, 254)'
	                    }])
	                }
	            },
				data:seriesData[2016]
            }
            ]
        };
        $.allData.companyLine.setOption(option);
        $.allData.companyLine.on("dataZoom", function(param){
      		$.updataDataZoom(param)
		});
	},
	showShopBar:function(callBack){
		var shopBar = echarts.init($(this)[0]);
		var legendData=[]
		var seriesData=[]
		for(var barData in $.allData.barsData){
			legendData.push(barData);
			seriesData.push($.allData.barsData[barData])
		}
		option = {
		    title : {
		        text: '车间'+$.allData.year+'年电耗占比',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c} ({d}%)"
		    },
		    legend: {
		        orient: 'vertical',
		        left: 'left',
		        data: legendData
		    },
		    series : [
		        {
		            name: '电耗占比',
		            type: 'pie',
		            radius : '78%',
		            center: ['50%', '50%'],
		            data:seriesData,
		            itemStyle: {
		                emphasis: {
		                    shadowBlur: 10,
		                    shadowOffsetX: 0,
		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
		                }
		            }
		        }
		    ]
		};
		shopBar.setOption(option);
		
		callBack && callBack()
	},
	showWorkLine:function(workData,workshop,title){
		$.allData.chartArr[workshop]={}
		$.allData.chartArr[workshop] = echarts.init($(this)[0]);
//		var workLine = echarts.init($(this)[0]);
		var legendData=[],xAxisData=[],seriesData={2017:[],2016:[]};
		var flag=true;
		for(var year in workData){
			var legendStr=year+'年电耗'
			legendData.push(legendStr)
			for(var day in workData[parseInt(year)]){
				var dayStr=day.split("/")[1]+day.split("/")[2]
				if(flag){
					xAxisData.push(dayStr)
				}
				seriesData[year].push(workData[year][day])
			}
			flag=false;
		}
        var option = {
            title: {
                text: title
            },
            tooltip: {
	            	trigger: 'axis',
			        position: function (pt) {
			            return [pt[0], '10%'];
			        }
		        },
            legend: {
            	data:legendData
            },
             dataZoom: [{
		        type: 'inside',
		        start: 0,
		        xAxisIndex: [0], 
		        end: 30
		    }, {
		        start: 1,
		        end: 10,
		        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
		        handleSize: '80%',
		        handleStyle: {
		            color: '#fff',
		            shadowBlur: 3,
		            shadowColor: 'rgba(0, 0, 0, 0.6)',
		            shadowOffsetX: 2,
		            shadowOffsetY: 2
		        }
		    }],
            xAxis: [
            	 {
		            type : 'category',
		            boundaryGap : false,
		            data : xAxisData
		        }
            ],
            yAxis: {},
            series:[ {
            	name:legendData[1],
				type:'line',
	            itemStyle: {
	                normal: {
	                    color: 'rgb(255, 70, 131)'
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                        offset: 0,
	                        color: 'rgb(255, 158, 68)'
	                    }, {
	                        offset: 1,
	                        color: 'rgb(255, 70, 131)'
	                    }])
	                }
	            },
				data:seriesData[2017]
            },
            {
            	name:legendData[0],
				type:'line',
	            itemStyle: {
	                normal: {
	                    color: 'rgb(1, 157, 254)'
	                }
	            },
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
	                        offset: 0,
	                        color: 'rgb(142, 154, 176)'
	                    }, {
	                        offset: 1,
	                        color: 'rgb(1, 157, 254)'
	                    }])
	                }
	            },
				data:seriesData[2016]
            }
            ]
        };
        
        $.allData.chartArr[workshop].setOption(option);
//      $.allData.chartArr[workshop].on('dataZoom',function(param){
//      	$.updataDataZoom(param,workshop)
//      })
	}
});
$.extend({
	init:function(){
		$.getcompanyData();
		$.getlastData();
		$.getWorksDatas()
	},
	getcompanyData:function(){
		$.ajax({
			type:"get",
			url:"/finfosoft-water/json/y_"+$.allData.year+".json",
			async:false,
			success:function(data){
				if( typeof data =='string'){
					$.allData.powerData=JSON.parse(data); 
					
				}else{
					$.allData.powerData=data
				}
			}
		});
	},
	getlastData:function(){
		var year=$.allData.year-1
		$.ajax({
			type:"get",
			url:"/finfosoft-water/json/y_"+year+".json",
			async:false,
			success:function(data){
				if( typeof data =='string'){
					$.allData.lastYearPowerData =JSON.parse(data); 
				}else{
					$.allData.lastYearPowerData =data; 
				}
				$.calcCompany()
			}
		});
	},
	calcCompany:function(){
		var companyData={
			2017:$.allData.powerData.company,
			2016:$.allData.lastYearPowerData.company
		}
		$('#companyLine').drawCompany(companyData)
	},
	getWorksDatas:function(){
		var num=1
		for(var works in $.allData.powerData){
			if(works!="company"){
				var workSum=0;
				for(var day in $.allData.powerData[works]){
					workSum+=$.allData.powerData[works][day]
				}
				$.allData.barsData["workshop"+num]={}
				$.allData.barsData["workshop"+num].value=workSum
				$.allData.barsData["workshop"+num].name="车间"+num
				num++
			}
		}
		$('#workshopsBar').showShopBar($.creatDom)
	},
	creatDom:function(){
		for(var data in $.allData.powerData){
			if(data!="company"){
				$('.workshopCharts').append($('<div id="'+data+'" class="workLine"></div>'))
			}
		}
		$.getWorkLineData()
		if($(".dateSelect").val() != $(".dateSelect option:last").val()){
			$.getWorkLastData();
		}
	},
	getWorkLineData:function(){
		var workData={2017:{},2016:{}};
		workData[2017]=$.extend(true, {}, $.allData.powerData);
		delete workData[2017].company
		workData[2016]=$.extend(true, {}, $.allData.lastYearPowerData);
		delete workData[2016].company
		for(var name in workData[2017]){
			$.allData.workLineData[name][2017]=workData[2017][name]
		}
		for(var name in workData[2016]){
			$.allData.workLineData[name][2016]=workData[2016][name]
		}
		
		for(var workshop in $.allData.workLineData){
			var title='车间'+workshop.substring(8)+'电耗环比分析'
			$('#'+workshop).showWorkLine($.allData.workLineData[workshop],workshop,title)
		}
	},
	updataDataZoom:function(param){
//		if(name!='company'){
//			$.allData.companyLine.dispatchAction({
//			    type: 'dataZoom',
//			    start:param.start,
//			    end: param.end
//			});
//		}
		for(var work in $.allData.chartArr){
			$.allData.chartArr[work].dispatchAction({
			    type: 'dataZoom',
			    start:param.start,
			    end: param.end
			});
		}
	}
});
$.init();
