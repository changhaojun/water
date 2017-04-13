getToken();

var onOff=0;
var pngName="",imgName="";
var j=0;
var dataId=[],collectorArr=[],collectorArr1=[];
var flag=0;
var idOnOff=0;//判断采集器id是否乱写
$.fn.extend({
	//智能input
	'smartInput': function (callback){
		$(this).focus(function (){
			$(this).css('borderColor','#1ab394');
		});
		$(this).blur(function (){
			$(this).css('borderColor','#ccc');
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
		$(".warningSpace").focus(function(){
			$(this).val("");
		});
		$(".warningSpace").blur(function(){
			if($(this).val()==''){
				$(this).val($(this).attr('data-info'));
			}
			
		});
		$(".contactPhone").focus(function(){
			$(this).val("");
		});
		$(".contactPhone").blur(function(){
			if($(this).val()==''){
				$(this).val($(this).attr('data-info'));
			}
		});
		$(".delayTime").focus(function(){
			$(this).val("");
		});
		$(".delayTime").blur(function(){
			if($(this).val()==''){
				$(this).val($(this).attr('data-info'));
			}
		});
	
		onOff=0;
	});   
	$(".controlBtn span").eq(1).click(function(){
		$(".contactPhone").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".warningSpace").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		$(".delayTime").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
		onOff=-1;
	});
	
		
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
		$(".editData_label").hide();
	});
	//数据配置处鼠标滑上的信息提示
	$("[data-toggle='tooltip']").tooltip();
	//将数据读取到页面中
	var editId=$("#deviceId").val();
	console.log(editId)
	var collector_id="",deviceId="";
	var dataTypeStr,operTypeStr;
	getEquipment();
	function getEquipment(){
		$.ajax({
			type:"get",
			datatype:"json",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/devices/"+editId+"?access_token="+accesstoken,
			success:function(data){
				console.log(data)
				if(data.code==400005){
						getNewToken();
						getEquipment();
				}else{
					deviceId=data._id;
					collector_id=data.communication.collector_id;
					collectorArr.push(collector_id);
					$(".deviceCode").val(data.device_code);
					$(".deviceName").val(data.device_name);
					$(".collectInterval").val(data.communication.collect_interval);
					$(".collector input").val(data.communication.collector_id);
					if(data.is_remind==0){
						$(".controlBtn span").eq(1).addClass('activeBtn');
						$(".controlBtn span").eq(0).removeClass('activeBtn');
						$(".contactPhone").val("此号码用于接收掉线提醒，如有多个号码请用逗号分隔");
						$(".warningSpace").val("掉线提醒的间隔时间，单位分钟");
						$(".delayTime").val("掉线后提醒的延迟时间，单位分钟");
						$(".contactPhone").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
						$(".warningSpace").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
						$(".delayTime").attr("disabled",true).css({"border":"0","background":"#f1f1f1"});
					}else{
						$(".controlBtn span").eq(0).addClass('activeBtn');
						$(".controlBtn span").eq(1).removeClass('activeBtn');
						$(".contactPhone").val(data.mobile);
						$(".warningSpace").val(data.remind_interval);
						$(".delayTime").val(data.remind_delay);
						$(".contactPhone").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
						$(".warningSpace").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
						$(".delayTime").attr("disabled",false).css({"border":"1px solid #e5e6e7","background":"#fff"});
					}
					modelCollector()
				}
				
			}
		});
		
	};
	
	//选择采集器ID触发的事件
	
	var dataInfo="",info=[],infoJson="",dataConfigJson="",dataConfig=[];
	var optionValue="";
	var dataTypeStr="",operTypeStr="";
	var IdArr=[];
	function modelCollector(){
		
		optionValue=$(".collector").val();
		var data="{'collector_id':'"+optionValue+"'}";
		$.ajax({
			type:"get",
			dataType:"JSON",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/devices/"+editId+"/dataConfigs",
			data:{
				access_token:accesstoken,
				filter:'{"device_id":"'+editId+'"}'
			},
			success:function(data) {
				$(".detialData tbody").empty();
				console.log(data)
				dataInfo=data.rows;
				
				for(var i in dataInfo){
				//console.log(dataInfo[i].data_type)
					if(dataInfo[i].data_type==0){
						dataTypeStr="电流";
					}else if(dataInfo[i].data_type==1){
						dataTypeStr="电压";
					}else if(dataInfo[i].data_type==2){
						dataTypeStr="输入IO";
					}else{
						dataTypeStr="输出IO";
					}
					if(dataInfo[i].oper_type){
						operTypeStr="读取";
					}else{
						operTypeStr="写入";
					}
					var stateEnabled=""
					switch(dataInfo[i].status) {
						case 0:stateEnabled="disabled"; break;
						case 1:stateEnabled="checked"; break;
					}
					dataId.push(dataInfo[i].data_id);
					IdArr.push(dataInfo[i]._id)
					var dataTr="";
					if(dataInfo[i].data_unit==""){
						dataInfo[i].data_unit="-"
					}
					if(dataInfo[i].low_battery==""){
						dataInfo[i].low_battery="-"
					}
					if(dataInfo[i].high_battery==""){
						dataInfo[i].high_battery="-"
					}
					if(dataInfo[i].data_name==""){
						dataInfo[i].data_name="-"
					}
					if(dataInfo[i].port_name.substr(0,1)=="A"){
						dataTr+='<tr><td><input type="checkbox" '+stateEnabled+'/></td><td>'+dataInfo[i].port_name
						+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'<td>'+dataInfo[i].collect_range_low+'-'
						+dataInfo[i].collect_range_high+'</td><td>'+dataInfo[i].real_range_low+'-'+dataInfo[i].real_range_high
						+'<td>-</td><td>-</td><td>'+dataInfo[i].data_unit+'</td><td>'+dataInfo[i].data_name
						+'</td><td ><i class="fa fa-edit" onclick="editClick('+i+')"></i></td></tr>';								
					}else{
						dataTr+='<tr><td><input type="checkbox" '+stateEnabled+'/></td><td>'+dataInfo[i].port_name
						+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'<td>-</td><td>-</td><td>'+dataInfo[i].high_battery
						+'</td><td>'+dataInfo[i].low_battery+'<td>-</td><td>'+dataInfo[i].data_name
						+'</td><td><i class="fa fa-edit" onclick="editClick('+i+')"></i></td></tr>';
					};
					//console.log(dataTr)
					$("#dataTable").append(dataTr);	
					j=i;
					infoJson='{"dataType":"'+dataInfo[i].data_type+'","operType":"'+dataInfo[i].oper_type+'","portName":"'+dataInfo[i].port_name+'"}';
					infoJson=JSON.parse(infoJson)
					//console.log(infoJson);
					info.push(infoJson)
				
				}
				
			}
			
		});
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
			+'<label>高电平</label><div class="rangeData "><input type="text" data-info="请填写高电平" class="highBattery" style="width:350px;" value="'+lowBattery+'" /></div>'
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
			
			if($(this).val()==$(this).attr("data-info") ||$(this).val()=="" ||$(this).val()=="-"){
				$(this).css("border","1px solid #f00");
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
				$(this).css("border","1px solid #f00");
				layer.tips('请输入数字',$(this),{
					tips:1
				});
				//$(this).val("");
				openClose=-1;
			}else{
				$(this).css("border","1px solid #ccc");	
			}
			
		});
		if(openClose==0 && openClose1==0){
			editContent(j);
		}
		
	}
	//修改弹窗数据同步到页面
	function editContent(j){
		var portName=$(".portName span").html();
		var operType=$(".readState select").val();
		var dataType=$(".datanodeType select").val();
		var dataUnit =$(".dataUnit input").val();
		var dataName=$(".dataName input").val();
		var lowBattery=$(".lowBattery").val();
		var highBattery=$(".highBattery").val();
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
		if(info[j].dataType==0){
			dataTypeStr="电流"; 
		}else if(info[j].dataType==1){
			dataTypeStr="电压"; 
		}else if(info[j].dataType==2){
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
		if(flag==0){
			var dataTr='<td><input type="checkbox" checked="checked" /></td><td>'+portName+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'</td><td>'+collectRange
			+'</td><td>'+realRang+'</td><td>'+highBattery+'</td><td>'+lowBattery+'</td><td>'+dataUnit+'</td><td>'+dataName+'</td><td ><i class="fa fa-edit" onclick="editClick('+j+')"></i></td>'	
		}else{
			var dataTr='<td><input type="checkbox" disabled="disabled"/></td><td>'+portName+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'</td><td>'+collectRange
					+'</td><td>'+realRang+'</td><td>'+highBattery+'</td><td>'+lowBattery+'</td><td>'+dataUnit+'</td><td>'+dataName+'</td><td ><i class="fa fa-edit" onclick="editClick('+j+')"></i></td>'	
		}			
		$(".detialData tbody").find("tr").eq(j).html(dataTr);	
	}
	//更换采集器ID
	$(".collector input").on({
		"click":function(){
			focusAjax();
			return false;
		},
		"keyup":function(){
			focusAjax();
		},
		"blur":function(){
			$(this).css("border-color","#ccc")
		}
	});
	function focusAjax(){
		var value=$(".collector input").val().split(0,1).join("");
			//console.log(value)
	    if(value==""){
	    	$('.collector ul').hide();
	    	return;
	    }
	   // console.log(collectorArr)
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
				console.log(data)
				collectorArr=[];
				collectorArr.unshift(collector_id)
				$('.collector ul').show();
				$('.collector ul').empty();
				var item=0;
				for(var  i in data.rows){
					var strLi='<li onclick="serchItem('+i+')">'+data.rows[i].collector_id+'</li>';
					$('.collector ul').append(strLi);
					collectorArr.push(data.rows[i].collector_id);
				}
			} 
		});
		//collectorArr.push(collectorArr1)
	}
	$(document).click(function(){
		$('.collector ul').hide();
	});
	var dataInfo="";
	function serchItem(i){
		if($(".collector input").val()!=""){
			layer.confirm('<font size="2">更换采集器ID会导致当前设备的数据全部清空！是否继续？</font>', function(index){
  					layer.close(index);
  					//console.log(2424)
  					$('.collector input').val($('.list ul li').eq(i).text());
  					
					$('.collector ul').hide();
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
							}
						}
					});
  				
			});
		}
	}	
	//保存设备
	function saveDevice(){
		var deviceName = $(".deviceName").val();
		var deviceCode = $(".deviceCode").val();
		var mobile = $(".contactPhone").val();
		var collectorId = $(".collector input").val();
		var warningSpace=$(".warningSpace").val();
		var delayTime=$(".delayTime").val();
		var collectInterval = $(".collectInterval").val();
		var communication = "{'collect_interval':" + collectInterval+ ",'collector_id': '"+ collector_id+ "'}";
		var controlBtn=$(".controlBtn span");
		var status="";
		var isRemind="";
		var device="";
		var phoneReg=/^1[34578]\d{9}$/;
		var remindReg=/^[0-9]*$/;
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
								}else{
									device = "{'device_code':'" + deviceCode + "','device_name':'"+ deviceName 
											+  "','mobile':'" + mobile +"','status': 1 ,'communication':" + communication 
											+",'is_remind':1,'remind_interval':"+warningSpace+",'protocal':'A','remind_delay':"+delayTime+"}";
									$.ajax({
										type:"post",
										datatype:"json",
										crossDomain: true == !(document.all),
										url:globalurl+"/v1/devices?access_token="+accesstoken,
										data:{
											data:device
										},
										success:function(data){
											console.log(data)
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
					+",'is_remind':0,'protocal':'A'}";
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
		for (var i = 0; i < info.length; i++) {
				//console.log(33434)
			status=$("#dataTable").find(" tr").eq(i).find("input").attr('checked')==="checked" ? 1 : 0;
			rangeLow=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[0];
			rangeHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(4).text().split("-")[1];
			realLow=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[0];
			realHigh=$("#dataTable").find(" tr").eq(i).find("td").eq(5).text().split("-")[1];
			highBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(6).text();
			lowBattery=$("#dataTable").find(" tr").eq(i).find("td").eq(7).text();
			dataUnit=$("#dataTable").find(" tr").eq(i).find("td").eq(8).text();
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
				realLow=""
			}
			//console.log(deviceId)
			//console.log(dataInfo)
			dataConfigJson='{"data_type":'+dataInfo[i].data_type+','+
			'"oper_type":'+dataInfo[i].oper_type+','+
			'"port_name":"'+dataInfo[i].port_name+'",'+
			'"collect_range_high":"'+rangeHigh+'",'+
			'"collect_range_low":"'+rangeLow+'",'+
			'"real_range_high":"'+realHigh+'",'+
			'"real_range_low":"'+realLow+'",'+
			'"low_battery":"'+lowBattery+'",'+
			'"high_battery":"'+highBattery+'",'+
			'"status":"'+status+'",'+
			'"_id":"'+IdArr[i]+'",'+
			'"data_id":"'+dataId[i]+'",'+
			'"data_unit":"'+dataUnit+'",'+
			'"data_name":"'+dataName+'"}';
			//console.log(dataConfigJson)
			//console.log(dataConfigJson)
			dataConfigJson=JSON.parse(dataConfigJson);
			//console.log(dataConfigJson);
			dataConfig.push(dataConfigJson);
			//console.log(dataConfig)
		
			data=JSON.stringify(dataConfig);
		}
		
		$.ajax({
			type:"put",
			datatype:"json",
			crossDomain: true == !(document.all),
			url:globalurl+"/v1/devices/dataConfigs",
			data:{
				access_token:accesstoken,
				data:data,
				device_id:editId
			},
			success:function(data){
				console.log(data)
				if (data.code===200) {
					layer.msg('保存成功！', {
						icon: 1,
						time:3000,
						end:function(){
							self.location.href='/finfosoft-water/dataTag/box/'
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
	
//点击问号的事件
	function devicePNG(){
		/*optionValue=$(".collector input").val();
		var data="{'collector_id':'"+optionValue+"'}";
		$.ajax({
			type:"post",
			dataType:"JSON",
			url:globalurl+"/v1/collectorModels",
			data:{
				access_token:accesstoken,
				data:data
			},
			success:function(data) {
				pngName=(data.collector_model.split("-"))[1].toLowerCase();
				imgName="dtu_"+pngName+".png";*/
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
						content: "<img class='imgName' src='/finfosoft-water/img/box_sensor/"+imgName+"'/>"
					});
				}
					
		/*	}
		});*/
		
	}
	//更换采集器ID
/*	$(".collector input").on({
		"click":function(){
			focusAjax();
			return false;
		},
		"keyup":function(){
			focusAjax();
		},
		"blur":function(){
			$(this).css("border-color","#ccc")
		}
	});
	function focusAjax(){
		var value=$(".collector input").val().split(0,1).join("");
			//console.log(value)
	    if(value==""){
	    	$('.collector ul').hide();
	    	return;
	    }
//	    console.log(collectorArr)
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
				//console.log(data)
				collectorArr=[];
				collectorArr.unshift(collector_id)
				$('.collector ul').show();
				$('.collector ul').empty();
				var item=0;
				for(var  i in data.rows){
					var strLi='<li onclick="serchItem('+i+')">'+data.rows[i].collector_id+'</li>';
					$('.collector ul').append(strLi);
					collectorArr.push(data.rows[i].collector_id);
				}
			} 
		});
		//collectorArr.push(collectorArr1)
	}
	$(document).click(function(){
		$('.collector ul').hide();
	});
	var dataInfo="";
	function serchItem(i){
		if($(".collector input").val()!=""){
			layer.confirm('更换采集器ID会导致当前设备的数据全部清空！是否继续？', {
  				btn: ['确定','取消'], function(index){
  					layer.close(index);
  					$('.collector input').val($('.list ul li').eq(i).text());
					$('.collector ul').hide();
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
							}
							
						}
						
					});
  				}
			});
		}
		
		
	}	*/