

function search(){
	//$('#searchId').val()
	console.log($('#searchId').val())
}




//显示运行数据列表
$(function(){
	getToken();
	dataList();
})

function dataList(){
	$.ajax({
		type: "get",
		url: 'http://rapapi.org/mockjsdata/15031/v1/things-runData',
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success:function(data){
			console.log(data);
			$(".dataContent").html("");
			if(data.rows.length==0){
		    		$(".dataContent").html("<p>暂无数据</p>");
		   }
			for(var i=0;i<data.rows.length;i++){
				str='<div class="dataList">'+
								'<div class="listTop">'+
									'<span>'+data.rows[i].thing_name+/*'-'+data.datas[i].data_name+*/'</span>'+
									/*'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)" ></span>'+*/
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										/*'<div class="Itext">'+data.datas[i].data_value+data.datas[i].data_unit+						
										'</div>'+	*/					
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+' '+data.rows[i].run_data.data_times[0].substring(0,7)+'&nbsp; &nbsp;&nbsp;&nbsp;'+'72h'+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>';
				option={
					tooltip:{
						trigger:'axis'
					},
					xAxis:{
						type:'category',
						data: data.rows[i].run_data.data_times,  
						show:false,
						/*axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                       },*/
                       
					},
					yAxis:{
						type:'value',
						show:false
					},
					series:[
						{
							type:'line',
							data:data.rows[i].run_data.data_values,
							markPoint : {
			                    data : [
			                        {type : 'max', name: '最大值'},
			                        {type : 'min', name: '最小值'}
			                    ]
	                		},
	                		markline:{
	                			data : [
								[
								    {name: '标线1起点', value: 100, x: 50, y: 20},
								    {name: '标线1终点', x: 150, y: 120}
								],
	                		}
		                	itemStyle : {  
	                                normal : {  
	                                	color:'#1ab394',
	                                    lineStyle:{  
	                                        color:'#1ab394' ,   
	                                    }  
	                                }  
	                        },
						}
					]
				}
				$(".dataContent").append(str);
				var myChart=echarts.init($('.contentTop')[i])
				myChart.setOption(option)
			}
		
		}
	})
}

