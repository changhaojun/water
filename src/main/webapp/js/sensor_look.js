var boxId=$("#boxId").val();	//获取box的id
var type=$("#type").val();      //获取box类型
var globalurl="http://rap.taobao.org/mockjsdata/15031/v1/devices/{_id}/datas";
//var globalurl= "http://rap.taobao.org/mockjsdata/15031/v1/devices/%7B_id%7D/datas"
console.info(boxId)
console.info(type)
$(function(){
	getToken();//刷新令牌
	toolTip();//提示框
	listBox();//数据列表页
})
//初始化提示框
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
//初始化头部
if(type=="A"){
	$(".sensorTop .Itype").html("查看传感器");
	$(".sensorTop .Etype").html(" / Look Sensor");
}else{
	$(".sensorTop .Itype").html("查看PLC");
	$(".sensorTop .Etype").html(" / Look PLC");
}
//获取数据列表
function listBox(){
	$.ajax({
		type: "get",
		url:  globalurl,
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success: function(data) {
			console.log(data)
			if(data.code==400005||data.code==500){
		    		window.getNewToken();
		    }else{
		    	for(var i=0;i<data.datas.length;i++){
		    		var str="";
		    		//以开关展示
		    		if(data.datas[i].oper_type==2&&data.datas[i].data_type==3){
		    			function onoff(){
		    				if(data.datas[i].status){
		    					Iopen();
		    					return "打开";	    					
			    			}else{
			    				Iclose();
			    				return "关闭";
			    			}
		    			}
		    			str='<div class="lookList  normal">'+
								'<div class="listTop">'+
									'<span>'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;)"></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="on-off">'+
											'<button type="button" class="Iopen Iactive" onclick="Iopen()">'+onoff+'</button>'+
											'<div class="off">'+
												'<div class="circle">'+				
												'</div>'+
											'</div>'+
											'<button type="button" class="Iclose" onclick="Iclose()">'+onoff+'</button>'+
										'</div>'+							
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
				//仪表盘展示
		    		}else if((type=="A"&&data.datas[i].oper_type==2&&data.datas[i].dataType==0)||(type=="A"&&data.datas[i].oper_type==2&&data.datas[i].data_type==1)||(type=="P"&&data.datas[i].oper_type==2)){
		    			str='<div class="lookList  normal">'+
								'<div class="listTop">'+
									'<span>'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="water">'+
											'<div class="board-ring">'+
												'<canvas></canvas>'+
												'<input type="text" value="'+data.datas[i].data_value+'"/>'+
											'</div>'+
											'<button type="button"id="give" onclick="give(&apos;'+data.datas[i].data_config_id+'&apos;)">下发</button>'+
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						new Finfosoft.Ring({
							el: '.board-ring',
							startDeg: 150,
							endDeg: 30,
							lineWidth: 20,
					//		bgColor: '#0055ff',
					//		mainColor: '#ff4400'
					//		initVal: this.input.value
						});			
				//数据展示
		    		}else{
		    			str='<div class="lookList  normal">'+
								'<div class="listTop">'+
									'<span>'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="Itext">'+data.datas[i].data_value+data.datas[i].data_unit+						
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
		    		}
		    	}
		    }
		}
	})
}
//打开开关
function Iopen(){
	$(".Iopen").addClass("Iactive");
	$(".Iclose").removeClass("Iactive");
	$(".circle").animate({"left":"0px"});
}
//关闭开关
function Iclose(){
	$(".Iclose").addClass("Iactive");
	$(".Iopen").removeClass("Iactive");
	$(".circle").animate({"left":"25px"});
}
//打开数据展示详情页
function show(value){
	layer.open({
	  type: 2,
	  title: '实时数据页面',
	  shadeClose: true,
	  shade: 0.8,
	  scrollbar: false,
	  area: ['873px', '90%'],
	  content: '/finfosoft-water/dataTag/dataChart/'+value //iframe的url
	}); 
}
			




