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
	$(".sensorTop .Etype").html("Look Sensor");
}else{
	$(".sensorTop .Itype").html("查看PLC  / ");
	$(".sensorTop .Etype").html("Look PLC");
}

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
											'<button type="button" class="Iopen Iopen'+i+' Iactive" onclick="Iopen('+i+','+data.datas[i].data_id+',event)">'+data.datas[i].high_battery+'</button>'+
											'<div class="off">'+
												'<div class="circle circle'+i+'">'+				
												'</div>'+
											'</div>'+
											'<button type="button" class="Iclose Iclose'+i+'" onclick="Iclose('+i+','+data.datas[i].data_id+',event)">'+data.datas[i].low_battery+'</button>'+
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
							mainColor: '#1ab394'

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
										'<div class="Itext">'+data.datas[i].data_value+(data.datas[i].data_unit=='-'?'':data.datas[i].data_unit)+						
										'</div>'+						
									'</div>'+
									'<div class="contentBottom">'+
										'<span class="fa fa-clock-o">'+data.datas[i].data_time+'</span>'+
									'</div>'+
								'</div>'+			
							'</div>'
						
						$(".sensorContent").append(str);
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

function Iopen(i,id,ev){
	var This=$(ev.target)
	if(!This.hasClass('Iactive')){
		clickBtn(id,1,i)	
	}
}
//关闭开关

function Iclose(i,id,ev){
	var This=$(ev.target)
	if(!This.hasClass('Iactive')){
		clickBtn(id,0,i)
	}
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
		var loading=layer.msg('正在下发，请稍等', {
			icon: 16,
			time:0,
			shade: [0.7,'#5E5C5C']
		});
		$.ajax({
			url:gatewayUrl+'/v1/waterGateways?access_token='+accesstoken,
			dataType: 'JSON',
			type: 'GET',
			data:{
				data_id:id,
				data_value:onoff
			},
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.result==1){
					layer.msg('下发成功', {
						icon : 1,
						time:2000
					});
				}else if(data.result==0){
					var boardRing=$('#'+id).find('.board-ring');
					$('#'+id).find('input').focus()
					$('#'+id).find('input').val(onoff);
					$('#'+id).find('input').blur()
					
					layer.msg('下发失败', {
						icon : 2,
						time:2000
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2,
					time:2000
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
		var loading=layer.msg('正在下发，请稍等', {
			icon: 16,
			time:0,
			shade: [0.7,'#5E5C5C']
		});
		$.ajax({
			url:gatewayUrl+'/v1/waterGateways?access_token='+accesstoken,
			data:{
				data_id:dataId,
				data_value:onoff
			},
			dataType: 'JSON',
			type: 'GET',
			crossDomain: true == !(document.all),
			success: function(data) {
				layer.close(loading)
				if(data.result==1){
					var circle=$('#'+dataId).find('.circle');
					var circleLeft=circle[0].offsetLeft;
					circle.css('left',((circleLeft-25)*-1)+'px');
					
					var textParent=$('#'+dataId).find('.on-off');
					var activeBtn=textParent.find('.Iactive');
					activeBtn.removeClass('Iactive');
					activeBtn.siblings('button').addClass('Iactive');
					layer.msg('下发成功！', {
						icon : 1,
						time:2000
					});	
				}else if(data.result==0){
					layer.msg('下发失败', {
						icon : 2,
						time:2000
					});
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				layer.msg('下发失败', {
					icon : 2,
					time:2000
				});
		   }
		});
	});
}



