getToken();

var onOff=0;
var pngName="",imgName="";
var j=0;
var dataId=[];
var access_token="58db1858b769970a9092c5b6";
/*var commonUrl="http://121.42.253.149:18801";*/
var commonUrl="http://192.168.1.37";
$.fn.extend({
	//智能input
	'smartInput': function (callback){
		//模拟placeholder
		$(this).attr('tip',$(this).val());
		$(this).focus(function (){
			$(this).css('borderColor','#1ab394');
			if ($(this).val()===$(this).attr('tip')) {
				$(this).val('');
			}
		});
		$(this).blur(function (){
			if ($(this).val()==='') {
				$(this).val($(this).attr('tip'));
				$(this).css('borderColor','#e5e6e7');
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
	
		
	//关闭弹窗
	$(".maskClose").click(function(){
		$('.pop').addClass('hidden');
		$('.pop-mask').addClass('hidden');
		$(".editData_label").hide();
	});
	//数据配置处鼠标滑上的信息提示
	$("[data-toggle='tooltip']").tooltip();
	//选择采集器ID触发的事件
	
	var collector_id="",deviceId="";
	var dataTypeStr,operTypeStr;
	getEquipment();
	function getEquipment(){
		$.ajax({
			type:"get",
			datatype:"json",
			url:commonUrl+"/v1/devices/58da4b4f30e731311475e1f7?access_token="+access_token,
			success:function(data){
				//console.log(data)
				if(data.code==400005){
						getNewToken();
						getEquipment();
					}else{
						deviceId=data._id;
						//console.log(deviceId);
						$(".deviceCode").val(data.device_code);
						$(".deviceName").val(data.device_name);
						$(".contactPhone").val(data.mobile);
						$(".warningSpace").val(data.remind_interval);
						$(".delayTime").val(data.remind_delay);
						$(".collectInterval").val(data.communication.collect_interval);
						$(".collector input").val(data.communication.collector_id);
						//console.log(collectorArr);
						modelCollector()
					}
				
			}
		});
		
	};
	//选择采集器ID触发的事件
	
	var collector_id="";
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
			url:commonUrl+"/v1/devices/"+deviceId+"/dataConfigs",
			data:{
				access_token:access_token,
				filter:'{"device_id":"'+deviceId+'"}'
			},
			success:function(data) {
				
				console.log(data);
				$(".detialData tbody").empty();
				/*pngName=(data.collector_model.split("-"))[1].toLowerCase();
				//console.log(pngName)
				imgName="dtu_"+pngName+".png";*/
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
					dataId.push(dataInfo[i].data_id);
					IdArr.push(dataInfo[i]._id)
					var dataTr="";
					if(dataInfo[i].port_name.substr(0,1)=="A"){
						dataTr+='<tr><td><input type="checkbox" disabled="disabled"/></td><td>'+dataInfo[i].port_name
						+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'<td>'+dataInfo[i].collect_range_low+'-'
						+dataInfo[i].collect_range_high+'</td><td>'+dataInfo[i].real_range_low+'-'+dataInfo[i].real_range_high
						+'<td>-</td><td>-</td><td>'+dataInfo[i].data_name+'</td><td>'+dataInfo[i].data_unit
						+'</td><td ><i class="fa fa-edit" onclick="editClick('+i+')"></i></td></tr>';								
					}else{
						dataTr+='<tr><td><input type="checkbox" disabled="disabled"/></td><td>'+dataInfo[i].port_name
						+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'<td>-</td><td>-</td><td>'+dataInfo[i].high_battery
						+'</td><td>'+dataInfo[i].low_battery+'<td>-</td><td>'+dataInfo[i].data_unit
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
				content: "<img class='imgName' src='../img/box_sensor/"+imgName+"'/>"
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
			+'<input type="text" class="collectorLow" value="'+rangeLow+'"  /><span>-</span><input type="text" class="collectorHigh" value="'+rangeHigh+'"/></div>'
			+'</div><div class="dataRow realRange"><label>实际量程</label><div class="rangeData ">'
			+'<input type="text" class="realLow" value="'+realLow+'" /><span>-</span><input type="text"  class="realHigh" value="'+realHigh+'" /></div>'
			+'</div><div class="dataRow dataUnit"><label>数据单位</label><input type="text" value="'+dataUnit+'"/></div>'
			+'<div class="dataRow dataName"><label>数据名称</label><input type="text" value="'+dataName+'"/></div>';
			$(".changeData").append(aStr);
		}else{
			$(".changeData").empty();
			dStr='<div class="dataRow collectorRange"><label>低电平</label><div class="rangeData">'
			+'<input type="text" class="lowBattery" value="'+lowBattery+'" style="width:350px;" /></div></div><div class="dataRow realRange">'
			+'<label>高电平</label><div class="rangeData "><input type="text" class="highBattery" style="width:350px;" value="'+lowBattery+'" /></div>'
			+'</div><div class="dataRow dataName"><label>数据名称</label><input type="text"/></div>';
			$(".changeData").append(dStr);
		}
		j=i
		$.each($('input'),function (){
			$(this).smartInput();
		});
		
	}
	
	//点击弹窗是否启用的状态
	$(".portName p i").click(function(){
		if(onOff==0){
			$(this).css("background-position-x",-95+"px");
			onOff=-1;
		}else{
			$(this).css("background-position-x",-48+"px");
			onOff=0;
		}
	})
	
	
	//点击保存的时候数据同步到页面中
	
	function editCollector(j){
		
		//读写状态
		if($(".realLow").val()=="" || $(".realHigh").val()==""){
			layer.msg('请填写实际量程，且必须为数字', {
				icon : 2,
				time:1500
			});	
		}else if($(".lowBattery").val()==""){
			layer.msg('请填写低电瓶', {
				icon : 2,
				time:1500
			});
		}else if($(".highBattery").val()==""){
			layer.msg('请填写高电瓶', {
				icon : 2,
				time:1500
			});
		}else{
			var flag=0;
			var rangeReg=/^[0-9]*$/;
			var openClose=$(".collectorLow").val();
			//console.log(openClose);
			var openClose1=$(".collectorHigh").val();
			var openClose2=$(".realLow").val();
			var openClose3=$(".realHigh").val();
			if ($(".dataUnit input").val() == "") {
				layer.msg('数据单位不能为空', {
					icon : 2,
					time:1500
				});
				flag=-1;
			}else if ($(".dataName input").val() == "") {
				layer.msg('数据名称不能为空', {
					icon : 2,
					time:1500
				});
				flag=-1;
			}else if($(".portName span").html().substr(0,1)=="A"){
				if(rangeReg.test(openClose)==false || rangeReg.test(openClose1)==false ||rangeReg.test(openClose2)==false ||rangeReg.test(openClose3)==false){
					layer.msg('量程请输入数字', {
						icon : 2,
						time:1500
					});
					flag=-1;
				}else{
					editContent(j);
				}
				 
			}else{
				editContent(j);
			}	
			
		}
		
	}
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
		var dataTr='<td><input type="checkbox" checked="checked"/></td><td>'+portName+'</td><td>'+operTypeStr+'</td><td>'+dataTypeStr+'</td><td>'+collectRange
					+'</td><td>'+realRang+'</td><td>'+highBattery+'</td><td>'+lowBattery+'</td><td>'+dataUnit+'</td><td>'+dataName+'</td><td ><i class="fa fa-edit" onclick="editClick('+j+')"></i></td>'										
					
		$(".detialData tbody").find("tr").eq(j).html(dataTr);	
	}
	
	
	//弹窗保存
	$(".saveEquipment").click(function(){
		editCollector(j);
		
	})
	
	function saveDevice(){
		var deviceName = $(".deviceName").val();
		var deviceCode = $(".deviceCode").val();
		var mobile = $(".contactPhone").val();
		var collectorId = $(".collector input").val();
		var warningSpace=Number($(".warningSpace").val()?$(".warningSpace").val():0);
		var delayTime=Number($(".delayTime").val()?$(".delayTime").val():0);
		var collectInterval = $(".collectInterval").val();
		var communication = "{'collect_interval':" + collectInterval+ ",'collector_id':" + collectorId+ "}";
		var controlBtn=$(".controlBtn span");
		var status="";
		var device=""
		for(var i=0;i<controlBtn.length;i++){
			if(controlBtn.eq(i).hasClass("activeBtn")){
				status +=controlBtn.eq(i).attr("value");
				//console.log(status)
			}
		}
		if (deviceCode == "") {
			layer.msg('设备编号不能为空', {
				icon : 2,
				time:1500
			});
		} else if (deviceName == "请输入设备名称" ||deviceName == ""){
			layer.msg('设备名称不能为空', {
				icon : 2,
				time:1500
			});
		}else if(collectorId==0||collectorId==''){
			layer.msg("请选择有效的采集器ID", {
				icon : 2,
				time:1500
			});
		}else {
			if(status==1){
				var phoneReg=/^1[34578]\d{9}$/;
				if(mobile ==""){
					layer.msg('联系电话不能为空', {
						icon : 2,
						time:1500
					});
					//console.log(111)
				}else if($(".warningSpace").val() == "掉线提醒的间隔时间，单位分钟" ||$(".warningSpace").val() ==""){
					layer.msg('掉线提醒的间隔时间不能为空', {
						icon : 2,
						time:1500
					});
					//console.log(222)
				}else if($(".delayTime").val() =="掉线后提醒的延迟时间，单位分钟"||$(".delayTime").val() ==""){
					layer.msg('掉线后提醒的延迟时间不能为空', {
						icon : 2,
						time:1500
					});
					
				}else if(phoneReg.test(mobile) ==false){
					layer.msg('请输入正确的联系电话', {
						icon : 2,
						time:1500
					});
				}else{
					//console.log(onOff)
					device = "{'device_code':'" + deviceCode + "','device_name':'"+ deviceName 
						+  "','mobile':'" + mobile + "','status':" + status + ",'communication':" + communication 
						+",'is_remind':1,'remind_interval':"+warningSpace+",'protocal':'A','remind_delay':"+delayTime+"}";
					data=device;
					//console.log(data)
					$.ajax({
						type:"put",
						datatype:"json",
						url:commonUrl+"/v1/devices/"+deviceId+"?access_token="+access_token,
						data:{
							data:data
						},
						success:function(data){
							console.log(data)
							if (data.code===200) {
								layer.msg('保存成功！', {icon: 1});
							}
							save();
						}
					})
				}
			}else{
				device = "{'device_code':'" + deviceCode + "','device_name':'"+ deviceName 
						+  "','communication':" + communication 
						+",'is_remind':0,'protocal':'A','status':" + status +"}";		
				data=device;
			//	console.log(data)
				$.ajax({
					type:"put",
					datatype:"json",
					url:commonUrl+"/v1/devices/"+deviceId+"?access_token="+access_token,
					data:{
						data:data
					},
					success:function(data){
						if (data.code===200) {
							layer.msg('保存成功！', {icon: 1});
						}
						save();
					}
				})
			}
		}	
	}
	function save(){
		var dataConfig=[];
		//console.log(dataId)
		var data={};
		//console.log(info.length)
		var controlBtn=$(".controlBtn span");
		for(var i=0;i<controlBtn.length;i++){
			if(controlBtn.eq(i).hasClass("activeBtn")){
				//console.log(111)
				status +=controlBtn.eq(i).attr("value");
				//console.log(status)
			}
		}
		for (var i = 0; i < info.length; i++) {
				//console.log(33434)
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
				dataConfigJson='{"data_type":"'+dataInfo[i].data_type+'",'+
				'"oper_type":"'+dataInfo[i].oper_type+'",'+
				'"port_name":"'+dataInfo[i].port_name+'",'+
				'"collect_range_high":"'+rangeHigh+'",'+
				'"collect_range_low":"'+rangeLow+'",'+
				'"real_range_high":"'+realHigh+'",'+
				'"real_range_low":"'+realLow+'",'+
				'"low_battery":"'+lowBattery+'",'+
				'"high_battery":"'+highBattery+'",'+
				'"status":"'+status+'",'+
				'"_id":"'+IdArr[i]+'",'+
				'"data_id":"'+IdArr[i]+'",'+
				'"data_unit":"'+dataUnit+'",'+
				'"data_name":"'+dataName+'"}';
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
			url:commonUrl+"/v1/devices/"+deviceId+"/dataConfigs",
			data:{
				access_token:access_token,
				data:data
			},
			success:function(data){
				console.log(data)
				if (data.code===200) {
					layer.msg('保存成功！', {icon: 1});
				}
			}
		});
	}
	
	//点击保存新增
	$(".saveSettings button").click(function(){
		saveDevice();
		
		//save();
	})