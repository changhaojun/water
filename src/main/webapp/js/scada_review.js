//数据流

$.initData = {
	token: { //令牌

		access: '',
		refresh: ''
	},
	globalurl: globalurl, //全局路径

	scadaId: $('#scadaId').val(), //情景id

	thingName: '', //实体名称

	sentData: { //待发送数据

		thing_id: '',
		scada_name: '',
		scada_model_id: $('#modelId').val(),
		description: '',
		scada_config: []
	},
	mqtt: { //MQTT订阅数据

		host: mqttHostIP,
		port: Number(portNum),
		username: mqttName,
		password: mqttWord,
		num: 0,
		group: []
	}
}

$.fn.extend({
	//窗口显示&&隐藏(运动)

	toggleWin: function(hide) {
		var This = $(this);
		if (hide) {
			$(this).animate({
				opacity: 0
			}, 'normal', 'swing', function() {
				This.css('display', 'none');
			});
		} else {
			$(this).css('display', 'block');
			$(this).animate({
				opacity: 1
			});
		}
		return $(this);
	},
	//居中位置计算

	setCenterPos: function(parent) {
		$(this).css({
			'left': (parent.width() - $(this).width()) / 2,
			'top': (parent.height() - $(this).height()) / 2
		});
	},
	//窗口改变时保持元素位置居中

	stayCenter: function(parent) {
		var This = $(this);
		$(this).setCenterPos(parent);
		$(window).resize(function() {
			This.setCenterPos(parent)
		});
	}
});

$.extend({
	//初始化
	init: function() {
		$.initToken('get', function() {
			$.initTitle();
			$.initAjax(function(data) {
				//数据流初始化
				$.initData.thingName = data.scada.thing_name;
				$.initData.sentData.thing_id = data.scada.thing_id;
				$.initData.sentData.scada_name = data.scada.scada_name;
				$.initData.sentData.scada_model_id = data.scada.scada_model_id;
				$.initData.sentData.description = data.scada.description;
				$.initData.sentData.scada_config = data.scada.scada_config;
				//三维场景初始化
				$.initThree.init(data.scadaModel.modelConfig, function() {
					for (var i=0; i<$.initData.sentData.scada_config.length; i++) {
						//数据标签渲染
						$.initThree.initLabel(
							$.initData.sentData.scada_config[i],
							$.initData.sentData.scada_config[i].objPosition,
							function(userData) {
								//数据标签订阅MQTT
								$.initMQTT(userData);
							}
						);
					}
				}, function() {
					$.labelOperation($.three.capturer.intersected);
				});
			});
		})
	},
	//页头初始化

	initTitle: function() {
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.initData.globalurl+"/v1/scadas",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access
			},
			success: function(data) {
				//页头背面渲染

				var listDom = '';
				$.each(data.rows, function(i) {
					if (data.rows[i]._id == $.initData.scadaId) {
						listDom += "<li class='active' scadaId='"+data.rows[i]._id+"' scadaName='"+data.rows[i].scada_name+"' scadaDescription='"+data.rows[i].description+"'>"+data.rows[i].scada_name+"</li>";
					} else {
						listDom += "<li scadaId='"+data.rows[i]._id+"' scadaName='"+data.rows[i].scada_name+"' scadaDescription='"+data.rows[i].description+"'>"+data.rows[i].scada_name+"</li>";
					}
				});
				$('.mainTitle').find('.backSide').html(listDom);;
				if ($('.mainTitle').find('.backSide').children('[scadaName=全厂工艺]')) {
					$('.mainTitle').find('.backSide').children('[scadaName=全厂工艺]').prependTo($('.mainTitle').find('.backSide'));
				}
				//页头背面标签点击交互
				$('.mainTitle').find('.backSide').children().click(function() {
					var id = $(this).attr('scadaId');
					var name = $(this).attr('scadaName');
					var description = $(this).attr('scadaDescription');
					if (id == $.initData.scadaId) {
						$('.mainTitle').addClass('active');
					} else {
						self.location.href = '/scada/review/'+id+'-'+name+'-'+description;
					}
				});
			}
		});
		//页头正面列表点击交互

		$('.mainTitle').find('.frontSide').find('button').click(function() {
			$('.mainTitle').removeClass('active');
		});
	},
	//令牌初始化

	initToken: function(type, callBack) {
		switch (type) {
			case 'get':
				getToken(function() {
					$.initData.token.access = accesstoken;
					$.initData.token.refresh = refreshToken;
					callBack && callBack();
				});
				break;
			case 'refresh':
				getNewToken(function() {
					$.initData.token.access = accesstoken;
					$.initData.token.refresh = refreshToken;
					callBack && callBack();
				});	
				break;
		}
	},
	//页面初始化请求
	initAjax: function(callBack) {
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.initData.globalurl+"/v1/scadas/"+$.initData.scadaId,
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access
			},
			success: function(data) {
				callBack && callBack(data);
			}
		});
	},
	//MQTT订阅相关

	initMQTT: function(data, isIssue) {
		$.initData.mqtt.group.push(data);
		var client = new Paho.MQTT.Client($.initData.mqtt.host, $.initData.mqtt.port, "server" + $.initData.mqtt.num.toString());
		var options = {
			userName: $.initData.mqtt.username,
			password: $.initData.mqtt.password,
			timeout: 1000,
			keepAliveInterval: 10,
			onSuccess: function() {
				if (data.port_type == 'AO' || data.port_type == 'DO' || data.port_type == 'MO') { //AO && DO && MO订阅
					if (isIssue) {
//						client.subscribe(data.data_id.toString());
						client.subscribe(data.guid);
					}
				} else if (data.port_type == 'AI' || data.port_type == 'DI') { //AI && DI订阅
					client.subscribe(data.data_id.toString());
				} else { //任务订阅
					//任务订阅预留接口
				}
			}
		};
		client.onConnectionLost = function(responseObject) {
			var index = Number(this.clientId.replace( /server/, '' ));
			$.initMQTT($.initData.mqtt.group[ index ]);
			if(responseObject.errorCode !== 0) {
				console.log("onConnectionLost:" + responseObject.errorMessage);
			}
		};
		client.onMessageArrived = function(message) {
			console.log(message);
			if (!isIssue) { //AI && DI回调
				$.onLabelValueChange(message);
			} else { //AO && DO && MO回调
				$.onIssueSuccess(message, data);
			}
		};
		client.connect(options);
		$.initData.mqtt.num += 1;
	},
	//MQTT

	onLabelValueChange: function(message) {
		var dataId = Number(message.destinationName);
		var originLabel = $.three.labelGroup.children[$.initThree.searchLabelFromId(dataId, $.initThree.judgeLabelType({data_id: dataId}))];
		var payload = typeof message.payloadString=='string' ? JSON.parse(message.payloadString) : message.payloadString;
		console.log(payload);
		if (!originLabel) return;
		var newData = {
			data_id: dataId,
			data_name: originLabel.labelName,
			data_value: payload.data_value,
			data_unit: originLabel.labelUnit,
			port_type: originLabel.labelType,
			status: payload.status
		};
		if(payload.port_type == 'DI'){
			newData.high_battery=payload.high_battery
			newData.low_battery=payload.low_battery
		}
		var position = originLabel.position;
		$.three.labelGroup.remove(originLabel);
		$.initThree.initLabel(newData, position);
	},
	onIssueSuccess: function(message, data) {
		var payload = JSON.parse(message.payloadString);
		var originLabel = $.three.labelGroup.children[$.initThree.searchLabelFromId(data.data_id, $.initThree.judgeLabelType(data))];
		if (payload.payloadString=='0') {
			return;
		}
		if (!originLabel) return;
		if (payload.result == 0) {
			layer.closeAll();
			layer.msg('下发失败', {
				icon: 2,
				time: 2000
			});
			return;
		}
		layer.msg('下发成功！', {icon: 1});
		var newData = {
			data_id: originLabel.labelId,
			data_name: originLabel.labelName,
			data_value: data.data_value,
			data_unit: originLabel.labelUnit,
			port_type: originLabel.labelType,
			status: originLabel.labelStatus
		};
		data.high_battery && (newData.high_battery = data.high_battery);
		data.low_battery && (newData.low_battery = data.low_battery);
		var position = originLabel.position;
		$.three.labelGroup.remove(originLabel);
		$.initThree.initLabel(newData, position);
	},
	newIssueSuccesse: function(data) {
		var originLabel = $.three.labelGroup.children[$.initThree.searchLabelFromId(data.data_id, $.initThree.judgeLabelType(data))];
		var newData = {
			data_id: originLabel.labelId,
			data_name: originLabel.labelName,
			data_value: data.data_value,
			data_unit: originLabel.labelUnit,
			port_type: originLabel.labelType,
			status: originLabel.labelStatus
		};
		data.high_battery && (newData.high_battery = data.high_battery);
		data.low_battery && (newData.low_battery = data.low_battery);
		var position = originLabel.position;
		$.three.labelGroup.remove(originLabel);
		$.initThree.initLabel(newData, position);
	},
	labelOperation: function(label) {
		var time = $.initTime();
		if (label.labelType) {
			$('.operation').stop(true, true);
			$('.operation').children().stop(true, true);
			$('.operation').toggleWin();
			$('.operation').find('.close').click(function() {
				$('.operation').stop(true, true);
				$('.operation').children().stop(true, true);
				$('.operation').toggleWin(true);
				$('.operation').children().toggleWin(true);
				$.three.capturer.intersected = null;
				$('.AO').find('.confirm').unbind();
			});
			switch (label.labelType) {
				case 'AI':
					//do AI
					$('.AI').siblings().toggleWin(true);
					$('.AI').toggleWin().stayCenter($('.operation'));
					$('.AI').find('.name').html(label.labelName);
					var chart = echarts.init($('.AI').find('.chart').get(0));
					$.getRealTimeData(label.labelId, time, chart, 'AI');
					$.initDatePacker($('.AI').find('.date'), time, function(changedTime) {
						$.getRealTimeData(label.labelId, changedTime, chart, 'AI');
					});
					break;
				case 'DI':
					//do DI
					$('.DI').toggleWin().stayCenter($('.operation'));
					$('.DI').siblings().toggleWin(true);
					$('.DI').find('.name').html(label.labelName);
					var chart = echarts.init($('.DI').find('.chart').get(0));
					$.getRealTimeData(label.labelId, time, chart, 'DI');
					$.initDatePacker($('.DI').find('.date'), time, function(changedTime) {
						$.getRealTimeData(label.labelId, changedTime, chart, 'DI');
					});
					break;
				case 'AO':
					//do AO
					$('.AO').siblings().toggleWin(true);
					$('.AO').toggleWin().stayCenter($('.operation'));
					$('.AO').find('.name').html(label.labelName);
					$('.AO').find('.realtime').html(time.endDate);
					var ring = new Finfosoft.Ring({
						el: '.finfosoft-ring',
						startDeg: 125,
						endDeg: 55,
						lineWidth: 20,
						initVal: label.labelValue == 'noVal' ? 0 : label.labelValue,
						mainColor: '#1ab394',
						bgColor: '#eeeeee'
					});
					$('.AO').find('.confirm').click(function() {
						$('.conditions-layer').css('display', 'block');
						$('.conditions-layer').find('table').css('display', 'none');
						$('.conditions-layer').find('p').css('display', 'none');
						var passwordDom = $('.conditions-layer').find('input');
						passwordDom.val('');
						layer.open({
							type: 1,
							title: '下发密码验证',
							closeBtn: 0,
							content: $('.conditions-layer'),
							area: ['430px'],
							btn: ['下发', '取消'],
							yes: function(index1) {
								//确定下发
								var data_value = $('.AO').find('.confirmVal').val();
								var	data_id = label.labelId;
								var port_type = label.labelType;
								$.verifyIssuePassword(passwordDom, function() {
									$.newIssueAjax({
										data_id: data_id,
										data_value: data_value
									}, function() {
										$.newIssueSuccesse({
											data_value: data_value,
											data_id: data_id,
											port_type: port_type
										});
										layer.close(index1);
										$('.conditions-layer').css('display', 'none');
										$('.operation').toggleWin(true);
										$('.AO').find('.confirm').unbind();
										$.three.capturer.intersected = null;
									}, function() {
										ring.reset();
									});
								});
							}
						});
					});
					break;
				case 'DO':
					//do DO
					var high_battery = label.HighBattery;
					var low_battery = label.LowBattery;
					$('.finfosoft-onOff').find('.left').html(high_battery);
					$('.finfosoft-onOff').find('.right').html(low_battery);
					$('.DO').siblings().toggleWin(true);
					$('.DO').toggleWin().stayCenter($('.operation'));
					$('.DO').find('.name').html(label.labelName);
					$('.DO').find('.realtime').html(time.endDate);
					var onOff = new Finfosoft.OnOff({
						el: '.finfosoft-onOff',
						status: !label.labelValue ? 0 : label.labelValue,
						onChanged: function(status) {
							$.getConditions(label.labelId, status, function(data) {
								var tbodyHtml = '';
								var suggest = false; //是否不建议下发
								for (var i=0; i<data.rows[0].list.length; i++) {
									if ( data.rows[0].list[i].type === 1 ) {
										if ( data.rows[0].list[i].target_status !== data.rows[0].list[i].current_status ) {
											suggest = true;
										}
										tbodyHtml += '<tr class="'+ (data.rows[0].list[i].target_status === data.rows[0].list[i].current_status ? '' : 'defer') +'"><td>'+ data.rows[0].list[i].data_name +'</td><td>'+ data.rows[0].list[i].target_status +'</td><td>'+ data.rows[0].list[i].current_status +'</td></tr>';
									} else {
										tbodyHtml += '<tr><td>'+ data.rows[0].list[i].custom_name + '(自定义)' +'</td><td>'+ data.rows[0].list[i].custom_status + '(自定义)' +'</td><td>未接入</td></tr>';
									}
								}
								$('.conditions-layer').find('tbody').html(tbodyHtml);
								$('.conditions-layer').css('display', 'block');
								$('.conditions-layer').find('table').css('display', 'table');
								$('.conditions-layer').find('p').css('display', 'none');
								var passwordDom = $('.conditions-layer').find('input');
								passwordDom.val('');
								layer.open({
									type: 1,
									title: '前置条件提示',
									closeBtn: 0,
									content: $('.conditions-layer'),
									area: ['430px'],
									btn: ['下发', '取消'],
									yes: function(index1) {
										//确定下发
										var data_value = status;
										var	data_id = label.labelId;
										var port_type = label.labelType;
										if (suggest) {
											layer.confirm('<span style="color: red;">警告：当前端口存在已知异常前置端口！是否确认下发？</span>', {
												title: false,
												closeBtn: false,
												area: '400px',
												btn: ['下发','取消'] //按钮
											}, function(index2){
												layer.close(index2);
												$('.conditions-layer').css('display', 'none');
												$.verifyIssuePassword(passwordDom, function() {
													$('.conditions-layer').find('tbody').html('');
													$.newIssueAjax({
														data_id: data_id,
														data_value: data_value
													}, function() {
														$.newIssueSuccesse({
															data_value: data_value,
															data_id: data_id,
															port_type: port_type,
															high_battery: high_battery,
															low_battery: low_battery
														});
														$('.operation').toggleWin(true);
														$.three.capturer.intersected = null;
													}, function() {
														onOff.reset();
													});
												});
											});
										} else {
											$.verifyIssuePassword(passwordDom, function() {
												$('.conditions-layer').find('tbody').html('');
												$('.conditions-layer').css('display', 'none');
												$.newIssueAjax({
													data_id: data_id,
													data_value: data_value
												}, function() {
													$.newIssueSuccesse({
														data_value: data_value,
														data_id: data_id,
														port_type: port_type,
														high_battery: high_battery,
														low_battery: low_battery
													});
													$('.operation').toggleWin(true);
													$.three.capturer.intersected = null;
												}, function() {
													onOff.reset();
												});
											});
										}
									},
									btn2: function(index){
									    //do something
									    $('.conditions-layer').find('tbody').html('');
									    onOff.reset();
									    layer.close(index); //如果设定了yes回调，需进行手工关闭
									    $('.conditions-layer').css('display', 'none');
									}
								});
							}, function() {
								$('.conditions-layer').css('display', 'block');
								$('.conditions-layer').find('table').css('display', 'none');
								$('.conditions-layer').find('p').css('display', 'none');
								var passwordDom = $('.conditions-layer').find('input');
								passwordDom.val('');
								layer.open({
									type: 1,
									title: '无前置条件',
									closeBtn: 0,
									content: $('.conditions-layer'),
									area: ['430px'],
									btn: ['下发', '取消'],
									yes: function(index1) {
										//确定下发
										var data_value = status;
										var	data_id = label.labelId;
										var port_type = label.labelType;
										var guid = Date.now().toString();
										$.verifyIssuePassword(passwordDom, function() {
											$.newIssueAjax({
												data_id: data_id,
												data_value: data_value
											}, function() {
												$.newIssueSuccesse({
													data_value: data_value,
													data_id: data_id,
													port_type: port_type,
													high_battery: high_battery,
													low_battery: low_battery
												});
												layer.close(index1);
												$('.conditions-layer').css('display', 'none');
												$('.operation').toggleWin(true);
												$.three.capturer.intersected = null;
											}, function() {
												onOff.reset();
											});
										});
									},
									btn2: function(index){
									    //do something
									    onOff.reset();
									    layer.close(index);
									}
								});
							});
						}
					});
					break;
				case 'MO':
					//do MO
					$('.MO').toggleWin().stayCenter($('.operation'));
					$('.MO').siblings().toggleWin(true);
					$('.MO').find('.name').html(label.labelName);
					$('.MO').find('.realtime').html(time.endDate);
					$('.MO').find('.oldVal').val(label.labelValue);
					$('.MO').find('.confirm').click(function() {
						if ($('.MO').find('.newVal').val() == '') {
							$('.MO').find('.newVal').focus();
							layer.tips('修改值不能为空', '.newVal', {
								tips: [2, '#ff787b'],
								time: 2000,
								tipsMore: true
							});
							return false;
						}
						if ($('.MO').find('.oldVal').val() == $('.MO').find('.newVal').val()) {
							$('.MO').find('.newVal').focus();
							layer.tips('修改值需不同于原始值', '.newVal', {
								tips: [2, '#ff787b'],
								time: 2000,
								tipsMore: true
							});
							return false;
						}
						$('.conditions-layer').css('display', 'block');
						$('.conditions-layer').find('table').css('display', 'none');
						$('.conditions-layer').find('p').css('display', 'none');
						var passwordDom = $('.conditions-layer').find('input');
						passwordDom.val('');
						layer.open({
							type: 1,
							title: '下发密码验证',
							closeBtn: 0,
							content: $('.conditions-layer'),
							area: ['430px'],
							btn: ['下发', '取消'],
							yes: function(index1) {
								//确定下发
								var data_value = parseFloat($('.MO').find('.newVal').val());
								var	data_id = label.labelId;
								var port_type = label.labelType;
								$.verifyIssuePassword(passwordDom, function() {
									$.moAjax({
										data_value: data_value,
										data_id: data_id
									}, function() {
										layer.close(index1);
										$('.conditions-layer').css('display', 'none');
										$.onLabelValueChange({
											destinationName: data_id,
											payloadString: {
												data_value: data_value,
												status: label.labelStatus
											}
										});
										$('.operation').toggleWin(true);
										$('.MO').find('.confirm').unbind();
										$.three.capturer.intersected = null;
									});
								});
							}
						});
					});
					break;
			}
		} else {
			if (label.processId) {
				var processId = label.processId;
				var processName = label.processName;
				$('.conditions-layer').css('display', 'block');
				$('.conditions-layer').find('table').css('display', 'none');
				$('.conditions-layer').find('p').css('display', 'block').html('是否确定执行<span style="color: red;">'+processName+'</span>？');
				var passwordDom = $('.conditions-layer').find('input');
				passwordDom.val('');
				layer.open({
					type: 1,
					title: '下发密码验证',
					closeBtn: 0,
					content: $('.conditions-layer'),
					area: ['430px'],
					btn: ['下发', '取消'],
					yes: function(index1) {
						$('.conditions-layer').css('display', 'none');
						$.verifyIssuePassword(passwordDom, function() {
							$.issueAjax({
								process_id: processId
							}, function() {
								var position = label.position;
								$.three.labelGroup.remove(label);
								$.initThree.initLabel({
									_id: processId,
									process_name: processName,
									status: 1
								}, position);
								$.three.capturer.intersected = null;
							});
						});
					},
					btn2: function() {
						$('.conditions-layer').css('display', 'none');
						$.three.capturer.intersected = null;
					}
				});
			} else if (label.scadaId) {
				var scadaId = label.scadaId;
				var scadaName = label.scadaName;
				layer.confirm('是否跳转至<span style="color: red;">'+scadaName+'</span>组态界面？', {
					btn: ['确定','取消'],
					btn1: function() {
						$('.mainTitle').find('.backSide').children('[scadaid='+ scadaId +']').click();
					},
					btn2: function() {
						$.three.capturer.intersected = null;
					},
					cancel: function() {
						$.three.capturer.intersected = null;
					}
				});
			}
		}
	},
	initTime: function() {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth()+1 < 10 ? '0'+(now.getMonth()+1) : now.getMonth()+1;
		var date = now.getDate() < 10 ? '0'+now.getDate() : now.getDate(); 
		var hourNow = now.getHours() < 10 ? '0'+now.getHours() : now.getHours();
		var hourBefore = (hourNow-4)<10 ? '0'+(hourNow-4) : (hourNow-4);
		var minute = now.getMinutes() < 10 ? '0'+now.getMinutes() : now.getMinutes();
		var second = now.getSeconds() < 10 ? '0'+now.getSeconds() : now.getSeconds(); 
		var flagNow = (function() { return hourNow >= 12 ? 'PM' : 'AM'; })();
		var flagBefore = (function() { return hourBefore >= 12 ? 'PM' : 'AM'; })();
		var startDate = year + '-' + month + '-' + date + ' ' + flagBefore + ' ' + hourBefore + ':' + minute;
		var endDate = year + '-' + month + '-' + date + ' ' + flagNow + ' ' + hourNow + ':' + minute;
		var startDateSent = year + '$' + month + '$' + date + '$' + hourBefore + ':' + minute + ':' + second;
		var endDateSent = year + '$' + month + '$' + date + '$' + hourNow + ':' + minute + ':' + second;
		return {
			startDate: startDate,
			endDate: endDate,
			startDateSent: startDateSent,
			endDateSent: endDateSent
		}
	},
	getRealTimeData: function(dataId, time, chart, chartType) {
		chart.showLoading('default', {
			text: '加载中...',
			color: '#1ab394'
		});
		var dataSent = {
			data_id: dataId,
			start_time: time.startDateSent,
			end_time: time.endDateSent
		};
		$.ajax({
			type: "post",
			url:  globalurl+"/v1/realtimeDatas",
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access,
				data: JSON.stringify(dataSent)
			},
			success: function(data) {
				$.initChart(chart, data, chartType);
			}
		})
	},
	initDatePacker: function(inputElement, time, callBack) {
		var startDate = time.startDate;
		var endDate = time.endDate;
		inputElement.val(startDate+' - '+endDate);
		inputElement.daterangepicker({
			timePicker: true,
	        timePickerIncrement: 1,
			showDropdowns: true,
			opens: 'left',
			startDate: startDate,
		    endDate: endDate,
		    locale: {
		        format: "YYYY-MM-DD A hh:mm",
		        separator: " - ",
		        applyLabel: "確定",
		        cancelLabel: "取消",
		        fromLabel: "From",
    			toLabel: "To",
    			customRangeLabel: "Custom",
		        daysOfWeek: [
		            "日",
		            "一",
		            "二",
		            "三",
		            "四",
		            "五",
		            "六"
		        ],
		        "monthNames": [
		            "一月",
		            "二月",
		            "三月",
		            "四月",
		            "五月",
		            "六月",
		            "七月",
		            "八月",
		            "九月",
		            "十月",
		            "十一月",
		            "十二月"
		        ],
		        "firstDay": 1
		    }
		}, function(start, end) {
			callBack && callBack({
				startDateSent: start.format('YYYY$MM$DD$HH:mm:ss'),
				endDateSent: end.format('YYYY$MM$DD$HH:mm:ss')
			});
		});
	},
	initChart: function(chart, data, chartType) {
		var gData = data;
		var option = {
            tooltip: {
            	trigger: 'axis'
            },
            xAxis: {
                data: data.data_times,
				axisTick: {
					alignWithLabel: true
				}
            },
            yAxis: {
            	name: data.data_unit
            },
            grid: {
            	show: true,
            	top: '30',
            	bottom: '50',
		        left: '14',
		        right: '14',
		        containLabel: true
		    },
		    dataZoom: [
		        {
		            type: 'slider',
		            show: true,
		            start: 0,
		            end: 100,
		            bottom: 14,
		            right: 100,
		            left: 100
		        },
		        {
		            type: 'inside',
		            show: true,
		            start: 0,
		            end: 100
		        }
		    ],
		    toolbox: {
		    	show: true,
		    	right: 14,
		    	feature: {
		            saveAsImage: {
		            	title: '保存图表'
		            }
		        }
		    },
		    legend: {},
            series: []
		};
        switch (chartType) {
        	case 'AI':
        		if (typeof data.min_values === 'undefined' || typeof data.max_values === 'undefined') {
        			option.legend = {
		            	data:['数据']
		        	};
		        	option.series = [
		            	{
			                name: '数据',
			                type: 'line',
			                data: data.data_values
		           		}
		        	];
        		} else {
        			option.legend = {
		            	data:['最小值', '平均值', '最大值']
		        	};
		        	option.series = [
		            	{
			                name: '最小值',
			                type: 'line',
			                data: data.min_values
		           		},
		            	{
			                name: '平均值',
			                type: 'line',
			                data: data.data_values
		           		},
		            	{
			                name: '最大值',
			                type: 'line',
			                data: data.max_values
		           		}
		        	];
        		}	
        		break;
        	case 'DI':
        		option.grid.show = false;
        		option.tooltip.trigger = 'item';
        		option.legend = {};
	        	option.series = [
	            	{
		                type: 'bar',
		                barWidth: '80%',
		                data: (function(values) {
		                	var formattedData = [];
		                	for (var i=0; i<values.length; i++) {
		                		if (values[i] == 0) {
		                			values[i] = -1;
		                		}
		                		formattedData.push({
		                			value: values[i],
		                			itemStyle: {
		                				normal: {
		                					color: values[i] == 1 ? '#1ab394' : '#c23531'
		                				}
		                			},
		                			tooltip: {
		                				formatter: function(data) {
		                					return data.name + ' ' + (data.value == 1 ? gData.high_battery : gData.low_battery);
		                				}
		                			}
		                		});
		                	}
		                	return formattedData;
		                })(data.data_values ? data.data_values : [])
	           		}
	        	];
	        	option.yAxis = {
	        		min: -1,
	        		max: 1,
	        		interval: 2,
	        		axisLabel: {
	        			formatter: function(value) {
	        				var status;
			        		switch (value) {
			        			case 1:
			        				status = gData.high_battery;
			        				break;
			        			case -1:
			        				status = gData.low_battery;
			        				break;
			        			default:
			        				status = ''
			        				break;
			        		}
			        		return status;
			        	}
	        		}
	        	}
        		break;
        }
        chart.hideLoading();
        chart.setOption(option);
	},
	issueAjax: function(newData, callBack) {
		$.ajax({
			type: "post",
			dataType: "json",
			url: $.initData.globalurl+"/v1/homes/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access,
				data: JSON.stringify(newData)
			},
			success: function(data) {
				if (data.result == 1) {
					callBack && callBack();
				} else {
					layer.msg('下发失败！', {
						icon: 2,
						time: 2000,
						end: function() {
							layer.closeAll();
						}
					});
				}
			}
		});
	},
	newIssueAjax: function(data, callback, fail) {
		$.ajax({
			url:gatewayUrl+'/v1/waterGateways?access_token='+accesstoken,
			data:{
				data_id: data.data_id,
				data_value: data.data_value
			},
			dataType: 'JSON',
			type: 'GET',
			crossDomain: true == !(document.all),
			success: function(data) {
				if (data.result == 1) {
					callback && callback()
				} else {
					fail && fail();
					layer.closeAll();
					layer.msg('下发失败', {
						icon: 2,
						time: 2000
					});
				}
			}
		});
	},
	moAjax: function(newData, callBack) {
		$.ajax({
			type: "put",
			dataType: "json",
			url: $.initData.globalurl+"/v1/manualEnters",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access,
				data: JSON.stringify(newData)
			},
			success: function(data) {
				if (data.code == 200) {
					layer.msg('已下发！', {icon: 1});
					callBack && callBack();
				}
			}
		});
	},
	getConditions: function(dataId, status, callback, noConditions) {
		$.ajax({
			type: 'get',
			url: globalurl+"/v1/preconditions?access_token="+accesstoken,
			async: false,
			data: {
				filter: JSON.stringify({
					gateway_data_id: dataId,
					status: String(status)
				})
			},
			success:function(data){
				if (data.total === 1) {
					callback && callback(data);
				} else if (data.total === 0) {
					noConditions && noConditions();
				}
			}
		});
	},
	verifyIssuePassword: function(passwordDom, callback) {
		var password = passwordDom.val();
		if (password === '') {
			passwordDom.css('border-color', '#fe787b');
			layer.tips('请输入下发密码', passwordDom, {
				tips: [3, '#fe787b'],
				end: function() {
					passwordDom.css('border-color', '#cccccc');
				}
			});
			return;
		}
		$.ajax({
			type: 'put',
			url: globalurl+"/v1/mails?access_token="+accesstoken,
			async: false,
			data: {
				company_id: $('#companyId').val(),
				password: password
			},
			success:function(data){
				if (data.code === 200) {
					callback && callback();
				} else {
					passwordDom.css('border-color', '#fe787b');
					layer.tips(data.error, passwordDom, {
						tips: [3, '#fe787b'],
						end: function() {
							passwordDom.css('border-color', '#cccccc');
						}
					});
				}
			}
		});
	}
});

$.init();
