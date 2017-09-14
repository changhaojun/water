getToken();
var dataId="";
var onOff=0;
var pngName="",imgName="";
var j=0;
var flag=0;
var idOnOff=0;//判断采集器id是否乱写
$.fn.extend({
	//智能input
	'smartInput': function (callback){
		//模拟placeholder
		$(this).attr('tips',$(this).attr('data-info'));
		$(this).focus(function (){
			$(this).css('borderColor','#1ab394');
			if ($(this).val()===$(this).attr('tips')) {
				$(this).val('');
			}
		});
		$(this).blur(function (){
			if ($(this).val()==='') {
				$(this).val($(this).attr('tips'));
				$(this).css('borderColor','#ccc');
			} else {
				callback && callback();
			}
		});
		//限制空格
		$(this).keyup(function (){
			$(this).val($(this).val().replace(/\s/g,''));
		});
	},
	//按钮组切换
	'tabButton': function (){
		$(this).children().click(function (){
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
		});
	},
	//弹窗的固定
	'stayCenter': function (){
		var This = $(this);
		setPos($(this));
		$(window).resize(function (){
			setPos(This);
		});
		function setPos(){
			var iObjWidth = This.width();
			var iObjHeight = This.height();
			var iDocWidth = $(window).width();
			var iDocHeight = $(window).height();
			This.css({
				'left': (iDocWidth-iObjWidth)/2,
				'top': (iDocHeight-iObjHeight)/2
			});
		}
	}

});

	$.each($('input'),function (){
		$(this).smartInput();
	});
	$('.controlBtn').tabButton();
	$(".pop").stayCenter();
	//点击掉线提醒事件
	$(".controlBtn span").eq(0).click(function(){
		$(".contactPhone").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
		$(".warningSpace").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
		$(".delayTime").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
		onOff=0;
	});   
	$(".controlBtn span").eq(1).click(function(){
		$(".contactPhone").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".warningSpace").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".delayTime").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		onOff=-1;
	});
	if($(".controlBtn span").eq(1).hasClass("activeBtn")){
		$(".contactPhone").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".warningSpace").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".delayTime").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
	}else{
		$(".contactPhone").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
		$(".warningSpace").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
		$(".delayTime").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
	}
		
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
		$(".editData_label").hide();
	});
	//数据配置处鼠标滑上的信息提示
	$("[data-toggle='tooltip']").tooltip();
	//选择采集器ID触发的事件
	
	var collector_id="",collectornum=0,collectorArr=[];
	var dataTypeStr,operTypeStr;
	collectorSelect();
	function collectorSelect(){
		$('.collector input').on('keyup', function () {
		    $('.collector ul').empty();
		    collectorArr=[];
			var value=$.trim($(this).val())
			//var collector='{"collector_id":"'+value+'"}';
			$.ajax({
				type:"get",
				dataType:'json',
				crossDomain: true == !(document.all),
				url:globalurl+"/v1/collectors",
				data:{
					access_token:accesstoken,
					conditions:value
				},
				success:function(data){
					
					if(data.code==400005){
						getNewToken();
						collectorSelect();
					}else{
						$('.collector ul').show();
						$('.collector ul').empty();
						var item=0;
						for(var  i in data.rows){
							var strLi='<li onclick="serchItem('+i+')">'+data.rows[i].collector_id+'</li>';
							$('.collector ul').append(strLi);
							collectorArr.push(data.rows[i].collector_id)
						}
					}
					
				},
				error:function(data){
					
				}
			});
		    
		});
	};
	//根据采集器ID获取采集器型号的信息
	
	var dataInfo="",info=[],infoJson="",dataConfigJson="",dataConfig=[];
	var optionValue="",deviceId="";
	function serchItem(i){
		$('.collector input').val($('.list ul li').eq(i).text());
		$('.collector ul').hide();
		$('.collector input').css("border","1px solid #1ab394");
		optionValue=$(".collector input").val();
		var data="{'collector_id':'"+optionValue+"'}";
		$.ajax({
			type:"post",
			dataType:"JSON",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/collectorModels",
			data:{
				access_token:accesstoken,
				data:data
			},
			success:function(data) {

				$(".detialData tbody").empty();
				pngName=(data.collector_model.split("-"))[1].toLowerCase();
				imgName="dtu_"+pngName+".png";
				//console.log(imgName)
				dataInfo=data.collector_port;
				
				for(var i in dataInfo){
					switch(dataInfo[i].data_type){
						case 0:dataTypeStr="电流"; break;
						case 1:dataTypeStr="电压"; break;
						case 2:dataTypeStr="输入IO"; break;
						case 3:dataTypeStr="输出IO";break;
					}
					switch(dataInfo[i].oper_type){
						case 1:operTypeStr="读取"; break;
						case 2:operTypeStr="写入"; break;
					}
					var dataTr='<tr><td><input type="checkbox" disabled="disabled"/></td><td>'+dataInfo[i].port_name+'</td>'
								+'<td>'+operTypeStr+'</td><td>'+dataTypeStr+'</td><td>4-20</td><td>'
								+'50-100</td><td></td><td></td><td></td><td></td><td ><i class="fa fa-edit" onclick="editClick('+i+')"></i></td></tr>'										
					$(".detialData tbody").append(dataTr);	
					j=i;
					infoJson='{"dataType":"'+dataInfo[i].data_type+'","operType":"'+dataInfo[i].oper_type+'","portName":"'+dataInfo[i].port_name+'"}';
					infoJson=JSON.parse(infoJson)
					//console.log(infoJson);
					info.push(infoJson)
				
				}
				
			}
			
		});
	}	
	$(".collector ul li").click(function(){
		modelCollector();
	})
	
	//点击问号的事件
	function devicePNG(){
		if(pngName==""){
			layer.msg('请先选择采集器ID，在获取设备型号', {
				icon : 2,
				time:1000
			});
		}else{
		 	layer.open({
				type: 1,
				title: false,
				area: '500px',
				shade:[0.1, '#000', false],
				closeBtn: 0,//不显示关闭按钮
				skin: 'layui-layer-demo', //样式类名
				anim: 2,
				shadeClose: true, //开启遮罩关闭
				content: "<img class='imgName' src='/img/box_sensor/"+imgName+"'/>"
			});
		}
	}
	//点击编辑数据同步到弹窗
	function editClick(i){
		$('.pop').filter('.step1').removeClass('hidden');
		$('.pop-mask').removeClass('hidden');
		$(".addData_label").hide();
		$(".editData_label").show();
		//点击编辑的时候同时获取里面的内容和弹窗的内容同步
		//数据类型
		$(".dataNode ").remove();
		$(".portName p i").css("background-position-x",-48+"px");
		if(info[i].dataType==0){
			$(".datanodeType ").append("<div class='dataNode' ><select><option selected='selected' value='0'>电流</option><option value='1'>电压</option></select></div>");
		}else if(info[i].dataType==1){
			$(".datanodeType ").append("<div class='dataNode' ><select><option  value='0'>电流</option><option value='1'>电压</option></select></div>");
		}else if(info[i].dataType==2){
			$(".datanodeType ").append("<div class='dataNode bettery' ><select  disabled='disabled'><option  value='2'>输入IO</option></select></div>");
		}else if(info[i].dataType==3){
			$(".datanodeType ").append("<div class='dataNode bettery' ><select  disabled='disabled'><option  value='3'>输出IO</option></select></div>");
		}
		//端口名称
		$(".portName span").html(info[i].portName);
		//读写状态
		
		var aStr="",dStr="";
		rangeLow=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[0];
		//console.log(rangeLow)
		rangeHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[1];
		realLow=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[0];
		realHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[1];
		highBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(6).text();
		lowBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(7).text();
		dataUnit=$("#dataTable").find(" tr").eq(i).find("td").eq(8).text();
		//console.log(dataUnit)
		dataName=$("#dataTable").find(" tr").eq(i).find("td").eq(9).text();
		if(info[i].portName.substr(0,1)=='A'){
			$(".changeData").empty();
			aStr='<div class="dataRow collectorRange"><label>采集量程</label><div class="rangeData">'
			+'<input type="text" class="collectorLow number" value="'+rangeLow+'" data-info="请输入采集量程" /><span>-</span><input type="text" class="number collectorHigh" data-info="请输入采集量程" value="'+rangeHigh+'"/></div>'
			+'</div><div class="dataRow realRange"><label>实际量程</label><div class="rangeData ">'
			+'<input type="text" class="number realLow" value="'+realLow+'" data-info="请输入实际量程"/><span>-</span><input type="text"  class="realHigh number" value="'+realHigh+'" data-info="请输入实际量程"/></div>'
			+'</div><div class="dataRow dataName"><label>数据名称</label><input type="text" value="'+dataName+'" data-info="请填写数据名称"/></div>'
			+'<div class="dataRow dataUnit"><label>数据单位</label><input type="text" value="'+dataUnit+'" data-info="请填写数据单位"/></div>';
			$(".changeData").append(aStr);
		}else{
			$(".changeData").empty();
			dStr='<div class="dataRow collectorRange"><label>低电平</label><div class="rangeData">'
			+'<input type="text" class="lowBattery" value="'+lowBattery+'" data-info="请填写低电平" style="width:350px;" /></div></div><div class="dataRow realRange">'
			+'<label>高电平</label><div class="rangeData "><input type="text" data-info="请填写高电平" class="highBattery" style="width:350px;" value="'+highBattery+'" /></div>'
			+'</div><div class="dataRow dataName"><label>数据名称</label><input type="text" value="'+dataName+'" data-info="请填写数据名称"/></div>';
			$(".changeData").append(dStr);
		}
		j=i
		$.each($('input'),function (){
			$(this).smartInput();
		});
		
	}
	
	//点击弹窗是否启用的状态

	$(".portName p i").click(function(){
		if(flag==0){
			$(this).css("background-position-x",-95+"px");
			flag=-1;
		}else{
			$(this).css("background-position-x",-48+"px");
			flag=0;
		}
	})
	
	//弹窗保存
	$(".saveEquipment").click(function(){
		editCollector(j);
	});
	
	function editCollector(j){
		var rangeReg=/^[0-9]*$/;
		//弹窗内容有空
		var openClose=0,openClose1=0;
		$(".pop").find("input").each( function(i) {
			if(!$(this).parent().hasClass('dataUnit')){
				if($(this).val()==$(this).attr("data-info") ||$(this).val()==""){
					$(this).css("border","1px solid #e11818");
					$(this).val($(this).attr("data-info"));
					layer.tips($(this).attr("data-info"),$(this),{
						tips:1
					});
					$(this).focus(function(){
						$(this).val("");
						$(this).css("border","1px solid #1ab394");
					})
					openClose=-1;
				}else if($(this).hasClass("number") && rangeReg.test($(this).val())==false){
					$(this).css("border","1px solid #e11818");
					layer.tips('请输入数字',$(this),{
						tips:1,
						times:1500
					});
					//$(this).val("");
					openClose=-1;
				}else{
					$(this).css("border","1px solid #ccc");
				}
			}
		});
		if(openClose==0 && openClose1==0){
			
			editContent(j);
		}
	}
	//修改弹窗数据同步到页面
	function editContent(j){
		var portName=$(".portName span").html();
		var collectRange=$(".collectorLow").val()+"-"+$(".collectorHigh").val();
		var realRange=$(".realRange input:eq(0)").val()+"-"+$(".realRange input:eq(1)").val();
		var operType=$(".readState select").val();
		var dataType=$(".datanodeType select").val();
		var dataUnit =$(".dataUnit input").val();
		var dataName=$(".dataName input").val();
		var lowBattery=$(".lowBattery").val();
		var highBattery=$(".highBattery").val();
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
//		if(info[j].dataType==0){
//			dataTypeStr="电流"; 
//		}else if(info[j].dataType==1){
//			dataTypeStr="电压"; 
//		}else if(info[j].dataType==2){
//			dataTypeStr="输入IO"; 
//		}else{
//			dataTypeStr="输出IO"; 
//		}
		if(dataType==0){
			dataTypeStr="电流"; 
		}else if(dataType==1){
			dataTypeStr="电压"; 
		}else if(dataType==2){
			dataTypeStr="输入IO"; 
		}else{
			dataTypeStr="输出IO"; 
		}
		if(info[j].operType==1){
			operTypeStr="读取";
		}else{
			operTypeStr="写入";
		};
		if(info[j].portName.substr(0,1)=="A"){
			collectRange=$(".collectorLow").val()+"-"+$(".collectorHigh").val();
			realRang=$(".realRange input:eq(0)").val()+"-"+$(".realRange input:eq(1)").val();
			highBattery="-";
			lowBattery="-";
			dataUnit=dataUnit;
			dataName:$(".dataName input").val();
		}else{
			collectRange="-";
			realRang="-";
			highBattery=highBattery;
			lowBattery=lowBattery;
			dataUnit="-";
			dataName:$(".dataName input").val();
		};
		
			var dataTr='<td><input type="checkbox" checked="checked" /></td><td>'+portName+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'</td><td>'+collectRange
			+'</td><td>'+realRang+'</td><td>'+highBattery+'</td><td>'+lowBattery+'</td><td>'+dataUnit+'</td><td>'+dataName+'</td><td ><i class="fa fa-edit" onclick="editClick('+j+')"></i></td>'	
		
					
		$(".detialData tbody").find("tr").eq(j).html(dataTr);	
	}
	
	//保存设备
	var phoneReg=/^1(3|4|5|7|8)\d{9}$/;
	var remindReg=/^[0-9]*$/;
	var warningSpace=$(".warningSpace").val();
	var delayTime=$(".delayTime").val();
	$(".contactPhone").blur(function(){
		var mobile = $(".contactPhone").val();
		if(phoneReg.test(mobile)==false){
			//$(".contactPhone").css("border","1px solid #e11818");
			layer.tips('请输入正确的电话号码',$(".contactPhone"),{
				tips:1,
				time:4000
			});
		}
	});
	$(".warningSpace").blur(function(){
		if(remindReg.test(warningSpace)==false){
			//$(".contactPhone").css("border","1px solid #e11818");
			layer.tips('请填写数字',$(".warningSpace"),{
				tips:1,
				time:4000
			});
		}
	});
	$(".delayTime").blur(function(){
		if(remindReg.test(delayTime)==false){
			//$(".contactPhone").css("border","1px solid #e11818");
			layer.tips('请填写数字',$(".delayTime"),{
				tips:1,
				time:4000
			});
		}
	});
	function saveDevice(){
		var deviceName = $(".deviceName").val();
		var deviceCode = $(".deviceCode").val();
		var mobile = $(".contactPhone").val();
		var collectorId = $(".collector input").val();
		var warningSpace=$(".warningSpace").val();
		var delayTime=$(".delayTime").val();
		var collectInterval = $(".collectInterval").val();
		var communication = "{'collect_interval':" + collectInterval+ ",'collector_id': '"+ optionValue+ "'}";
		var controlBtn=$(".controlBtn span");
		var status="";
		var isRemind="";
		var device="";
		var phoneReg=/^1[34578]\d{9}$/;
		
		for(var i=0;i<controlBtn.length;i++){
			if(controlBtn.eq(i).hasClass("activeBtn")){
				isRemind = controlBtn.eq(i).attr("value");
			}
		}
		$("input").blur(function(){
			$("input").css("border","1px solid #ccc");
		});
		if(deviceCode=="" ||deviceCode==$(".deviceCode").attr("data-info")){
		
			$(".deviceCode").css("border","1px solid #e11818");
			$(".deviceCode").val($(".deviceCode").attr("data-info"));
			layer.tips($(".deviceCode").attr("data-info"),$(".deviceCode"),{
				tips:1
			});
			$(".deviceCode").focus(function(){
				$(this).css("border","1px solid #1ab394");
			});
		}else{
			if(deviceName=="" ||deviceName==$(".deviceName").attr("data-info")){
				$(".deviceName").css("border","1px solid #e11818");
				$(".deviceName").val($(".deviceName").attr("data-info"));
				layer.tips($(".deviceName").attr("data-info"),$(".deviceName"),{
					tips:1,
				});
				$(".deviceName").focus(function(){
					$(this).css("border","1px solid #1ab394");
				});
			}else{
				if(isRemind==1){
					if(mobile=="" ||mobile==$(".contactPhone").attr("data-info")){
						$(".contactPhone").css("border","1px solid #e11818");
						$(".contactPhone").val($(".contactPhone").attr("data-info"));
						layer.tips("请输入联系电话",$(".contactPhone"),{
							tips:1
						});
						$(".contactPhone").focus(function(){
							$(this).css("border","1px solid #1ab394");
						});
					}else{
						if(warningSpace=="" ||warningSpace==$(".warningSpace").attr("data-info")){
							$(".warningSpace").css("border","1px solid #e11818");
							$(".warningSpace").val($(".warningSpace").attr("data-info"));
							layer.tips("请输入联系提醒间隔",$(".warningSpace"),{
								tips:1
							});
							$(".warningSpace").focus(function(){
								$(this).css("border","1px solid #1ab394");
							});
							nullInput5=-1;
						}else{
							if(delayTime=="" ||delayTime==$(".delayTime").attr("data-info")){
								$(".delayTime").css("border","1px solid #e11818");
								$(".delayTime").val($(".delayTime").attr("data-info"));
								layer.tips("请输入延迟时间",$(".delayTime"),{
									tips:1
								});
								$(".warningSpace").focus(function(){
									$(this).css("border","1px solid #1ab394");
								});
								nullInput5=-1;
							}else{
								if(collectorId=="" ||collectorId==$(".collector input").attr("data-info")){
									$(".collector input").css("border","1px solid #e11818");
									$(".collector input").val($(".collector input").attr("data-info"));
									layer.tips("请选择采集器ID",$(".collector input"),{
										tips:1
									});
									$(".collector input").focus(function(){
										$(this).css("border","1px solid #1ab394");
									});
									nullInput3=-1;
								}else{
									device = "{'device_code':'" + deviceCode + "','device_name':'"+ deviceName + "','mobile':'" + mobile +"','status': 1 ,'communication':" + communication+",'is_remind':1,'remind_interval':"+warningSpace+",'protocal':'A','remind_delay':"+delayTime+",'device_kind':1}";
									$.ajax({
										type:"post",
										datatype:"json",
										crossDomain: true == !(document.all),
										url:globalurl+"/v1/devices?access_token="+accesstoken,
										data:{
											data:device
										},
										success:function(data){
											dataId=data._id;
											for(var i=0;i<collectorArr.length;i++){
												if($(".list input").val()==collectorArr[i]){
													idOnOff=1;
												}
											}
											if(idOnOff==1){
												save();
											}else{
												layer.tips('请重新选择采集器ID！',$(".list input"),{
													tips: 1,
													time:2000
												});
											}
										}
									});
								}
							}
						}
					}
				}else{
					device = "{'device_code':'" + deviceCode + "','device_name':'"+ deviceName 
					+  "','communication':" + communication +",'status': 1 "
					+",'is_remind':0,'protocal':'A','device_kind':1}";
					$.ajax({
						type:"post",
						datatype:"json",
						crossDomain: true == !(document.all),
						url:globalurl+"/v1/devices?access_token="+accesstoken,
						data:{
							data:device
						},
						success:function(data){
							dataId=data._id;
							for(var i=0;i<collectorArr.length;i++){
								if($(".list input").val()==collectorArr[i]){
									idOnOff=1;
								}
							}
							if(idOnOff==1){
								save();
							}else{
								layer.tips('请重新选择采集器ID！',$(".list input"),{
									tips: 1,
									time:2000
								});
							}
						}
					});
				}
				
			}
		}
	}
	function save(){
		var dataConfig=[];
		var data={};
		var status = "";

		for (var i = 0; i < dataInfo.length; i++) {
			status=$("#dataTable").find(" tr").eq(i).find("input").attr('checked')==="checked" ? 1 : 0;
			dataTypeText=$("#dataTable").find(" tr").eq(i).find("td").eq(3).text();
			switch (dataTypeText) {
				case '电流':
					dataType = 0;
					break;
				case '电压':
					dataType = 1;
					break;
				case '输入IO':
					dataType = 2;
					break;
				case '输出IO':
					dataType = 3;
					break;
			}
			rangeLow=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[0];
			//console.log(rangeLow)
			rangeHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[1];
			realLow=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[0];
			realHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[1];
			highBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(6).text();
			lowBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(7).text();
			dataUnit=$("#dataTable").find(" tr").eq(i).find("td").eq(8).text();
			//console.log(dataUnit)
			dataName=$("#dataTable").find(" tr").eq(i).find("td").eq(9).text();
			if(rangeHigh=="-"){
				rangeHigh="";
			};
			if(rangeLow=="-"){
				rangeLow="";
			}
			if(realHigh=="-"){
				realHigh=""
			}
			if(realLow=="-"){
				realLow="-"
			}
			dataConfigJson='{"data_type":'+dataType+','+
			'"port_num":'+dataInfo[i].port_num+','+
			'"oper_type":'+dataInfo[i].oper_type+','+
			'"port_name":"'+dataInfo[i].port_name+'",'+
			'"collect_range_high":"'+rangeHigh+'",'+
			'"collect_range_low":"'+rangeLow+'",'+
			'"real_range_high":"'+realHigh+'",'+
			'"real_range_low":"'+realLow+'",'+
			'"low_battery":"'+lowBattery+'",'+
			'"high_battery":"'+highBattery+'",'+
			'"status":'+status+','+
			'"data_unit":"'+dataUnit+'",'+
			'"data_name":"'+dataName+'"}';
//				console.log(dataConfigJson)
			dataConfigJson=JSON.parse(dataConfigJson);
			//console.log(dataConfigJson);
			dataConfig.push(dataConfigJson);
			//console.log(dataConfig)
		
			data=JSON.stringify(dataConfig);
		}
		//console.log(dataId)
		$.ajax({
			type:"post",
			datatype:"json",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/devices/"+dataId+"/dataConfigs",
			data:{
				access_token:accesstoken,
				data:data
			},
			success:function(data){
				//console.log(data)
				if (data.code==200) {
					layer.msg('保存成功！', {
						icon: 1,
						time:3000,
						end:function(){
							self.location.href='/dataTag/box/'
						}
						
					});
				}
			}
		});
	}
	
	//点击保存新增
	$(".saveSettings button").click(function(){
		saveDevice();
	});
	

	//采集器获取焦点的时候
	$(".collector input").click(function(event){
		var value=$(this).val().split(0,1).join("");
	    if(value==""){
	    	$('.collector ul').hide();
	    	return;
	    }
		$.ajax({
			type:"get",
			dataType:'json',
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/collectors",
			data:{
				access_token:accesstoken,
				conditions:value
			},
			success:function(data){
				$('.collector ul').show();
				$('.collector ul').empty();
				var item=0;
				for(var  i in data.rows){
					var strLi='<li onclick="serchItem('+i+')">'+data.rows[i].collector_id+'</li>';
					$('.collector ul').append(strLi);
					//collectorArr.push(data.rows[i].collector_id)
				}
			} 
		});
		return false;
	});
	$(document).click(function(){
		$('.collector ul').hide();
	});
