var boxId=$("#boxId").val();	//获取box的id
var type=$("#type").val();      //获取box类型
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
		url: globalurl+"/v1/devices/"+'58db6d70b769970e78fb9d2b'+"/datas",
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
		    	console.log(data)
		    	for(var i=0;i<data.datas.length;i++){
		    		
		    		var str="";
		    		//以开关展示
		    		if(data.datas[i].oper_type==2&&data.datas[i].data_type==3){
		    			str='<div class="lookList  normal">'+
								'<div class="listTop">'+
									'<span>'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;)"></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="on-off">'+
											'<button type="button" class="Iopen Iopen'+i+' Iactive" onclick="Iopen('+i+','+data.datas[i].data_id+')">'+data.datas[i].onText+'</button>'+
											'<div class="off">'+
												'<div class="circle circle'+i+'">'+				
												'</div>'+
											'</div>'+
											'<button type="button" class="Iclose Iclose'+i+'" onclick="Iclose('+i+','+data.datas[i].data_id+')">'+data.datas[i].offText+'</button>'+
										'</div>'+							
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						if(data.datas[i].data_value==""||data.datas[i].data_value==0){
			    			nooff(i);
			    		}else{
			    			onoff(i);
			    		}
				//仪表盘展示
		    		}else if((type=="A"&&data.datas[i].oper_type==2&&data.datas[i].data_type==0)||(type=="A"&&data.datas[i].oper_type==2&&data.datas[i].data_type==1)||(type=="P"&&data.datas[i].oper_type==2)){
		    			if (data.datas[i].data_value==='') {
		    				data.datas[i].data_value = 0;
		    			}
		    			str='<div class="lookList  normal">'+
								'<div class="listTop">'+
									'<span>'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="water">'+
											'<div class="board-ring board-ring'+i+'">'+
												'<canvas></canvas>'+
												'<input type="text" value="'+data.datas[i].data_value+'" class="dial"/>'+
											'</div>'+
											'<button type="button"id="give" onclick="give(&apos;'+data.datas[i].data_id+'&apos;)">下发</button>'+
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						new Finfosoft.Ring({
							el: '.board-ring'+i,
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
		    toolTip();
		}
	})
}
function onoff(i){
	$(".Iopen"+i+"").addClass("Iactive");
	$(".Iclose"+i+"").removeClass("Iactive");
	$(".circle"+i+"").animate({"left":"0px"});

}
function nooff(i){
	$(".Iclose"+i+"").addClass("Iactive");
	$(".Iopen"+i+"").removeClass("Iactive");
	$(".circle"+i+"").animate({"left":"25px"});
}
//打开开关
function Iopen(i,id){
	$(".Iopen"+i+"").addClass("Iactive");
	$(".Iclose"+i+"").removeClass("Iactive");
	$(".circle"+i+"").animate({"left":"0px"});
	clickBtn(id,1)	
}
//关闭开关
function Iclose(i,id){
	$(".Iclose"+i+"").addClass("Iactive");
	$(".Iopen"+i+"").removeClass("Iactive");
	$(".circle"+i+"").animate({"left":"25px"});
	clickBtn(id,0)
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
/**
 * 本方法用于模拟量的下发
 * 在模拟量的下发按钮调用
 */
function give(id){
	onoff=$(".dial").val();
	console.log(onoff)
	var guid=guidGenerator();	
	layer.confirm("<font size='4'>确认下发？</font>",function(index){
		layer.close(index);
		data="{'data_id':"+id+",'data_value':"+onoff+",'guid':'"+guid+"'}";
		data={'data':data};
		$.ajax({
			url:globalurl+"/v1/homes",
			data:data,
			dataType: 'JSON',
			type: 'POST',
			success: function(data) {
				console.log(data)
				if(data.result==1){
					layer.msg('已下发', {
						icon : 1
					});
//					window.top.MQTTconnect(guid);
				}else{
					layer.msg('下发失败', {
						icon : 2
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2
				});
		    }
		});
	});
}
//io调控触发

function clickBtn(id,dataValue){
	dataId=id;
	onoff=dataValue;	
	var guid=guidGenerator();
	console.log("guid:"+guid);
	
	layer.confirm("<font size='4'>确认下发？</font>",function(index){
    	data="{'data_id':"+dataId+",'data_value':"+onoff+",'guid':'"+guid+"'}";    	 
		data={'data':data};	
		$.ajax({
			url:globalurl+"/v1/homes",
			data:data,
			dataType: 'JSON',
			type: 'POST',
			success: function(data) {
				console.log(data)
//				alert(data.result);
				if(data.result==1){
					layer.msg('已下发', {
						icon : 1
					});
//					window.top.MQTTconnect(guid);

				}else{
					layer.msg('下发失败', {
						icon : 2
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2
				});
		    }

		});
	});
}
//控制量guid
function guidGenerator() {
	var S4 = function() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};
	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}			




