var boxId=$("#boxId").val();	//获取box的id
var type=$("#type").val();      //获取box类型
var deviceId,deviceName,dataName;
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
	$(".sensorTop .Itype").html("查看传感器  / ");
	$(".sensorTop .Etype a").html("接入传感器");
	$(".sensorTop .Etype a").attr("href","/dataTag/box")
}else{
	$(".sensorTop .Itype").html("查看PLC  / ");
	$(".sensorTop .Etype a").html("接入PLC");
	$(".sensorTop .Etype a").attr("href","/dataTag/plc")
}
//每隔十秒刷新一次
//var time=setInterval(listBox,10000)
//获取数据列表
function listBox(){
	$.ajax({
		type: "get",
		url: globalurl+"/v1/devices/"+boxId+"/datas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success: function(data) {
			$(".sensorContent").html("");
			if(data.code==400005){
		    		getNewToken();
		    		listBox();
		    }else{
		    	if(data.datas.length==0){
		    		$(".sensorContent").html("<p>暂无数据</p>");
		    	}
		    	deviceName=data.device.device_name
		    	deviceId=data.device._id
		    	for(var i=0;i<data.datas.length;i++){	    		
		    		//以开关展示
		    		if(data.datas[i].port_type=="DO"){
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)"></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="on-off">'+
											'<button type="button" class="Iopen Iopen'+i+' Iactive" onclick="Iopen('+i+','+data.datas[i].data_id+')">'+data.datas[i].high_battery+'</button>'+
											'<div class="off">'+
												'<div class="circle circle'+i+'">'+				
												'</div>'+
											'</div>'+
											'<button type="button" class="Iclose Iclose'+i+'" onclick="Iclose('+i+','+data.datas[i].data_id+')">'+data.datas[i].low_battery+'</button>'+
										'</div>'+							
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						$(".sensorContent").append(str);
						if(data.datas[i].data_value==""||data.datas[i].data_value==0){
			    			$(".Iclose"+i+"").addClass("Iactive");
							$(".Iopen"+i+"").removeClass("Iactive");
							$(".circle"+i+"").css({"left":"25px"});
			    		}else{
			    			$(".Iopen"+i+"").addClass("Iactive");
							$(".Iclose"+i+"").removeClass("Iactive");
							$(".circle"+i+"").css({"left":"0px"});
			    		}
				//仪表盘展示
		    		}else if((type="A"&&data.datas[i].port_type=="AO")||(type="P"&&data.datas[i].port_type=="AO")){
		    			if (data.datas[i].data_value===''||data.datas[i].data_value===null) {
		    				data.datas[i].data_value = 0;
		    			}
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="water">'+
											'<div class="board-ring board-ring'+i+'">'+
												'<canvas></canvas>'+
												'<input type="text" value="'+data.datas[i].data_value+'" class="dial'+data.datas[i].data_id+'"/>'+
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
							mainColor: '#1ab394'
					//		initVal: this.input.value
						});			
				//数据展示
		    		}else{	    			
		    			str='<div class="lookList  normal" id="'+data.datas[i].data_id+'">'+
								'<div class="listTop">'+
									'<span>'+deviceName+'-'+data.datas[i].data_name+'</span>'+
									'<span class="fa fa-area-chart" data-toggle="tooltip" data-placement="top" "tooltip" data-placement="top" title="数据" onclick="show(&apos;'+data.datas[i].data_id+'&apos;,&apos;'+data.datas[i].data_name+'&apos;)" ></span>'+
								'</div>'+
								'<div class="listHr"></div>'+
								'<div class="listContent">'+
									'<div class="contentTop">'+
										'<div class="Itext">'+data.datas[i].data_value+(data.datas[i].data_unit!='-'?data.datas[i].data_unit:'')+						
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						
						$(".sensorContent").append(str);
						if(type="P"&&data.datas[i].port_type=="DI"&&data.datas[i].data_value==1){
								$(".Itext").html("开")
		    			}else if(type="P"&&data.datas[i].port_type=="DI"&&data.datas[i].data_value==0){
		    					$(".Itext").html("关");
		    			}
		    		}
		    		if(data.datas[i].status==1||data.datas[i].status==undefined){
		    			$(".lookList").css({"border-left-color":"#1ab394","color":"#1ab394"});
		    		}else if(data.datas[i].status==0){
		    			$(".lookList").css({"border-left-color":"#acacac","color":"#acacac"});
		    		}else{
		    			$(".lookList").css({"border-left-color":"#a01f24","color":"#a01f24"});
		    		}
		    	}
		    	
		    }
		    toolTip();
		}
	})
}
//打开开关
function Iopen(i,id){
	
	clickBtn(id,1,i)	
}
//关闭开关
function Iclose(i,id){
	
	clickBtn(id,0,i)
}
//打开数据展示详情页
function show(value,dataName){
	layer.open({
	  type: 2,
	  title: '实时数据页面',
	  shadeClose: true,
	  shade: 0.8,
	  scrollbar: false,
	  area: ['873px', '65%'],
	  content: '/dataTag/dataChart/'+value+'-'+dataName+'-'+deviceId+'-'+deviceName
	}); 
}
/**
 * 本方法用于模拟量的下发
 * 在模拟量的下发按钮调用
 */
function give(id){
	onoff=$(".dial"+id).val();
	layer.confirm("<font size='2'>确认下发？</font>", {icon:7},function(index){
		layer.close(index);
		layer.load(2, {
			shade: [0.7,'#eee'],
			content:'<div style="width:200px;margin-left:50px;padding-top:5px;">下发中,请稍后。。。</div>'
		});
		$.ajax({
			url:globalurl+"/v1/gateways?access_token="+accesstoken,
			data:{
				data_id:parseInt(id),
				data_value:parseInt(onoff)
			},
			dataType: 'JSON',
			type: 'POST',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
				getNewToken();
				contrastData()
			}else if(data.result==1){
					layer.msg(data.description, {
						icon : 1,
						time: 1400,
						end: function() {
							layer.closeAll();
						}
					});
				}else{
					layer.msg('下发失败', {
						icon : 2,
						end: function() {
							layer.closeAll();
						}
					})
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2,
					end: function() {
							layer.closeAll();
						}
				});
		    }
		});
	});
}
//io调控触发

function clickBtn(id,dataValue,i){
	dataId=id;
	onoff=dataValue;	
	layer.confirm("<font size='2'>确认下发？</font>",{icon:7},function(index){
		layer.close(index);
		layer.load(2, {
			shade: [0.7,'#eee'],
			content:'<div style="width:200px;margin-left:50px;padding-top:5px;">下发中,请稍后。。。</div>'
		});
		$.ajax({
			url:globalurl+"/v1/gateways?access_token="+accesstoken,
			data:{
				data_id:parseInt(dataId),
				data_value:parseInt(onoff)
			},
			dataType: 'JSON',
			type: 'POST',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.code==400005){
					getNewToken();
					contrastData()
				}else if(data.result==1){
						layer.msg(data.description, {
						icon : 1,
						time: 1400,
						end: function() {
							layer.closeAll();
						}
					});
						if(onoff){
							$(".Iopen"+i+"").addClass("Iactive");
							$(".Iclose"+i+"").removeClass("Iactive");
							$(".circle"+i+"").animate({"left":"0px"});
						}else{
							$(".Iclose"+i+"").addClass("Iactive");
							$(".Iopen"+i+"").removeClass("Iactive");
							$(".circle"+i+"").animate({"left":"25px"});
						}
				}else{
					layer.msg('下发失败', {
						icon : 2,
						time: 1400,
						end: function() {
							layer.closeAll();
						}
					})
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2,
					time: 1400,
					end: function() {
						layer.closeAll();
					}
				});
		    }

		});
	});
}
function space(obj){
	obj.val(obj.val().replace(/\s/g, ''))
}