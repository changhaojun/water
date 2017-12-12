var allData = {
	thingId: $('#thingId').val(),
	companyId: $('#companyId').val(),
	accessToken: "",
	//	lanyueSrc: 'http://121.42.253.149:18822/scada',
	lanyueSrc: 'http://localhost:80/scada',
	ajaxComplated: {},
	mqtt: { //MQTT订阅数据
		host: mqttHostIP,
		port: Number(portNum),
		username: mqttName,
		password: mqttWord,
	},
	parentData: { //初始化传的数据
		type: 3,
		accessToken: "",
		scada_id: $('#scadaId').val(),
		scada_config: {
			data_list: [],
			process_list: [],
			anchor_list: []
		}
	},
	mqttGroup: [],
	changedData: {
		type: 0,
		group: []
	}
};

$.fn.extend({
	//窗口显示&&隐藏(运动)

	toggleWin: function(hide) {
		var This = $(this);
		if(hide) {
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
	init: function() {
		getToken(function() {
			$.initTitle();
			$.getData();
			$.searchProcess();
			$.searchAnchor();
		});
	},
	initTitle: function() {
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl + "/v1/scadas",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken
			},
			success: function(data) {
				//页头背面渲染
				var listDom = '';
				$.each(data.rows, function(i) {
					if(data.rows[i].scada_models_id == $('#scadaId').val()) {
						listDom += "<li class='active' scadaId='" + data.rows[i].scada_models_id + "' thingId='" + data.rows[i].thing_id + "' thingName='" + data.rows[i].thing_name + "' scadaName='" + data.rows[i].scada_name + "'>" + data.rows[i].scada_name + "</li>";
					} else {
						listDom += "<li scadaId='" + data.rows[i].scada_models_id + "' thingId='" + data.rows[i].thing_id + "' thingName='" + data.rows[i].thing_name + "' scadaName='" + data.rows[i].scada_name + "'>" + data.rows[i].scada_name + "</li>";
					}
				});
				$('.mainTitle').find('.backSide').html(listDom);;
				if($('.mainTitle').find('.backSide').children('[scadaName=全厂工艺]')) {
					$('.mainTitle').find('.backSide').children('[scadaName=全厂工艺]').prependTo($('.mainTitle').find('.backSide'));
				}
				//页头背面标签点击交互
				$('.mainTitle').find('.backSide').children().click(function() {
					var scadaId = $(this).attr('scadaId');
					var thingId = $(this).attr('thingId');
					var scadaName = $(this).attr('scadaName');
					var thingName = $(this).attr('thingName');
					if(scadaId == $('#scadaId').val()) {
						$('.mainTitle').addClass('active');
					} else {
						//						self.location.href = '/scada/review/'+id+'-'+name+'-'+description;
						self.location.href = '/scadas/get?id=' + scadaId + '&thing_id=' + thingId + '&name=' + scadaName + '&description=' + thingName;
					}
				});
			}
		});
		//页头正面列表点击交互

		$('.mainTitle').find('.frontSide').find('button').click(function() {
			$('.mainTitle').removeClass('active');
		});
	},
	getData: function() {
		allData.ajaxComplated.data = false;
		$.ajax({
			type: "get",
			url: globalurl + "/v1/things/" + allData.thingId + "/thingDatas",
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken
			},
			success: function(data) {
				$.createParentMessage(data.dataConfigList);
				$.getMessageFromChild();
			}
		})
	},
	createParentMessage: function(data) {
		if(data && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var datas = {}
				if(data[i].data_unit == 'm³/h') {
					data[i].data_unit = 'm3/h'
				}
				datas.label_id = data[i].data_id;
				datas.label_name = data[i].data_name;
				datas.label_value = data[i].data_value;
				datas.label_unit = data[i].data_unit;
				datas.status = data[i].status;
				datas.port_type = data[i].port_type;
				datas.high_battery = data[i].high_battery;
				datas.low_battery = data[i].low_battery;
				allData.parentData.scada_config.data_list.push(datas)
			}
		}
		allData.ajaxComplated.data = true;
		$.postMessageToChild();
	},
	//所有人工触发的
	searchProcess: function() {
		allData.ajaxComplated.process = false;
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl + "/v1/processes/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				filter: JSON.stringify({
					trigger_type: "58f0431743929a10a8fb49fa",
					company_id: allData.companyId
				})
			},
			success: function(data) {
				$.createParentProcess(data.rows);
			}
		});
	},
	createParentProcess: function(data) {
		if(data && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var datas = {};
				datas.label_id = data[i]._id;
				datas.label_name = data[i].process_name;
				datas.status = data[i].status;
				allData.parentData.scada_config.process_list.push(datas);
			}
		}
		allData.ajaxComplated.process = true;
		$.postMessageToChild();
	},
	//ajax查询所有工艺锚点
	searchAnchor: function() {
		allData.ajaxComplated.anchor = false;
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl + "/v1/scadas",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				filter: JSON.stringify({
					company_id: allData.companyId
				})
			},
			success: function(data) {
				$.createParentAnchor(data.rows);
			}
		});
	},
	createParentAnchor: function(data) {
		if(data && data.length > 0) {
			for(var i = 0; i < data.length; i++) {
				var datas = {};
				datas.label_id = data[i].scada_models_id;
				datas.label_name = data[i].scada_name;
				allData.parentData.scada_config.anchor_list.push(datas);
			}
		}
		allData.ajaxComplated.anchor = true;
		$.postMessageToChild();
	},
	canPostMessageToChild: function() {
		var res = true;
		for(var key in allData.ajaxComplated) {
			if(!allData.ajaxComplated[key]) {
				res = false;
			}
		}
		return res;
	},
	makeMqttGroup: function(originDatas, callback) {
		var localDatas = allData.parentData.scada_config.data_list;
		localDatas.forEach(function(a) {
			var type = a.port_type;
			if(/[A-Z]I/g.test(type)) {
				originDatas.forEach(function(b) {
					if(a.label_id === b.label_id) {
						allData.mqttGroup.push(a);
					}
				});
			}
		});
		console.log(allData.mqttGroup);
		MQTTconnect();

		function MQTTconnect() {
			var mqttHost = allData.mqtt.host;
			var port = allData.mqtt.port;
			var username = allData.mqtt.username;
			var password = allData.mqtt.password;
			var style = {
				successed: "background: #1ab394; color: #fff; font-weight: bold; padding: 0 4px;",
				warning: "background: rgb(255, 134, 54); color: #fff; font-weight: bold; padding: 0 4px;",
				fail: "background: rgb(232, 16, 16); color: #fff; font-weight: bold; padding: 0 4px;"
			};
			var client = new Paho.MQTT.Client(mqttHost, port, "server" + parseInt(Math.random() * 100, 10));
			var options = {
				timeout: 1000,
				onSuccess: function() {
					console.log("%cMQTT connect successfully.", style.successed);
					allData.mqttGroup.forEach(function(item) {
						console.log(item.label_id)
						client.subscribe( item.label_id.toString() );
					});
				},
				onFailure: function(message) {
					console.log("%cMQTT connect fail, trying connection again.", style.fail);
					setTimeout(function() {
						MQTTconnect();
					}, 10000000);
				}
			};
			// set callback handlers
			client.onConnectionLost = function(responseObject) {
				console.log("%cMQTT connect lost, trying connection again.", style.fail);
				setTimeout(function() {
					MQTTconnect();
				}, 0);
			};
			client.onMessageArrived = function(message) {
				console.log("MQTT messageArrived.", style.successed)
				var topic = message.destinationName;
				var payload = JSON.parse(message.payloadString);
				callback && callback(payload);
			};

			if(username != null) {
				options.userName = username;
				options.password = password;
			}
			client.connect(options);
		}
	},
	postMessageToChild: function() {
		if(!$.canPostMessageToChild()) return;
		$('#scada').attr('src', allData.lanyueSrc).on('load', function() {
			$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
		});
	},
	updateMessageToChild: function(data) {
//		setInterval(function() {
//			var index = Math.round(Math.random() * (allData.mqttGroup.length - 1));
//			console.log(index, allData.mqttGroup.length)
//			var type = allData.mqttGroup[index].port_type;
//			if(type === "AI") {
//				allData.mqttGroup[index].label_value = Math.round(Math.random() * 100);
//			} else {
//				allData.mqttGroup[index].label_value = Math.round(Math.random());
//			}
//			console.log(allData.mqttGroup[index].label_value);
//
			
//			allData.changedData.group = [];
//			allData.changedData.group.push(allData.mqttGroup[index]);
//			$('#scada').get(0).contentWindow.postMessage(allData.changedData, '*');
//		}, 2000);
	},
	getMessageFromChild: function() {
		//父层接收子层信息
		$(window).on('message', function(ev) {
			//			console.log(ev.originalEvent.data); //从子层传回的数据
			//code = 200, 新增成功 //返回组态id,  //code = 201, 修改成功  ,  //code = 500, 直接返回  // code = 501 返回已经绑定的数据 //code = 300, 鼠标点击数据标签后的事件
			var code = ev.originalEvent.data.code;
			var data = ev.originalEvent.data.data;
			if(code == 201) {
				//				var scadaId = ev.originalEvent.data.data._id;
				var sentData = {
					//					scada_models_id: ev.originalEvent.data.data._id,
					scada_name: data.scada_name,
					description: data.scada_description,
					//					create_user: allData.createUser,
					//					thing_id: allData.thingId,
					//					company_id: allData.companyId
				};
				$.ajax({
					type: "put",
					url: globalurl + "/v1/scadas/" + allData.scadaId,
					dataType: "JSON",
					crossDomain: true == !(document.all),
					data: {
						access_token: accesstoken,
						data: JSON.stringify(sentData)
					},
					success: function(data) {
						if(data.code == 200) {
							self.location.href = '/scadas'
						}
					}
				})
			} else if(code == 300) {
				layer.closeAll();
				var group = data.group;
				var originData = data.originData;
				var dataType = originData.port_type;
				if(group === "data_list") {
					switch(dataType) {
						case "AI":
							$.labelOperation(originData).AI();
							break;
						case "DI":
							$.labelOperation(originData).DI();
							break;
						case "AO":
							$.labelOperation(originData).AO();
							break;
						case "DO":
							$.labelOperation(originData).DO();
							break;
						case "MO":
							$.labelOperation(originData).MO();
							break;
						case "CD":
							$.labelOperation(originData).CD();
							break;
					}
				} else if(group === "process_list") {
					$.labelOperation(originData).process();
				} else if(group === "anchor_list") {
					$.labelOperation(originData).anchor();
				}
			} else if(code == 500) {
				self.location.href = '/scadas'
			} else if(code == 501) {
				$.makeMqttGroup(data, function(dataNeedUpdate) {
					console.log(dataNeedUpdate);
//					console.log(allData.mqttGroup);
					$.updateMessageToChild(dataNeedUpdate);
				});
			}
		});
	},
	labelOperation: function(label) {
		var time = $.initTime();
		var parent = $('.operation');
		parent.stop(true, true);
		parent.children().stop(true, true);
		parent.toggleWin();
		parent.find('.close').off('click').click(function() {
			parent.stop(true, true);
			parent.children().stop(true, true);
			parent.toggleWin(true);
			parent.children().toggleWin(true);
		});
		return {
			AI: function() {
				var son = $('.AI');
				son.siblings().toggleWin(true);
				son.toggleWin().stayCenter($('.operation'));
				son.find('.name').html(label.label_name);
				var chart = echarts.init(son.find('.chart').get(0));
				$.getRealTimeData(label.label_id, time, chart, 'AI');
				$.initDatePacker(son.find('.date'), time, function(changedTime) {
					$.getRealTimeData(label.label_id, changedTime, chart, 'AI');
				});
			},
			DI: function() {
				var son = $('.DI');
				son.toggleWin().stayCenter($('.operation'));
				son.siblings().toggleWin(true);
				son.find('.name').html(label.label_name);
				var chart = echarts.init(son.find('.chart').get(0));
				$.getRealTimeData(label.label_id, time, chart, 'DI');
				$.initDatePacker(son.find('.date'), time, function(changedTime) {
					$.getRealTimeData(label.label_id, changedTime, chart, 'DI');
				});
			},
			AO: function() {
				var son = $('.AO');
				son.siblings().toggleWin(true);
				son.toggleWin().stayCenter($('.operation'));
				son.find('.name').html(label.label_name);
				son.find('.realtime').html(time.endDate);
				var ring = new Finfosoft.Ring({
					el: '.finfosoft-ring',
					startDeg: 125,
					endDeg: 55,
					lineWidth: 20,
					initVal: label.label_value === 'noVal' || !label.label_value ? 0 : label.label_value,
					mainColor: '#1ab394',
					bgColor: '#eeeeee'
				});
				son.find('.confirm').off('click').click(function() {
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
							var data_value = son.find('.confirmVal').val();
							var data_id = label.label_id;
							var port_type = label.port_type;
							$.verifyIssuePassword(passwordDom, function() {
								$.newIssueAjax({
									data_id: data_id,
									data_value: data_value
								}, function() {
									$.newIssueSuccessed({
										data_value: data_value,
										data_id: data_id,
										port_type: port_type
									});
									layer.close(index1);
									$('.conditions-layer').css('display', 'none');
									parent.find('.close').click();
									son.find('.confirm').unbind();
									//									$.three.capturer.intersected = null;
								}, function() {
									ring.reset();
								});
							});
						}
					});
				});
			},
			DO: function() {
				var son = $('.DO');
				var high_battery = label.high_battery;
				var low_battery = label.low_battery;
				$('.finfosoft-onOff').find('.left').html(high_battery);
				$('.finfosoft-onOff').find('.right').html(low_battery);
				son.siblings().toggleWin(true);
				son.toggleWin().stayCenter($('.operation'));
				son.find('.name').html(label.label_name);
				son.find('.realtime').html(time.endDate);
				var onOff = new Finfosoft.OnOff({
					el: '.finfosoft-onOff',
					status: !label.label_value ? 0 : label.label_value,
					onChanged: function(status) {
						$.getConditions(label.label_id, status, function(data) {
							var tbodyHtml = '';
							var suggest = false; //是否不建议下发

							for(var i = 0; i < data.rows[0].list.length; i++) {
								if(data.rows[0].list[i].type === 1) {
									if(data.rows[0].list[i].target_status !== data.rows[0].list[i].current_status) {
										suggest = true;
									}
									tbodyHtml += '<tr class="' + (data.rows[0].list[i].target_status === data.rows[0].list[i].current_status ? '' : 'defer') + '"><td>' + data.rows[0].list[i].data_name + '</td><td>' + data.rows[0].list[i].target_status + '</td><td>' + data.rows[0].list[i].current_status + '</td></tr>';
								} else {
									tbodyHtml += '<tr><td>' + data.rows[0].list[i].custom_name + '(自定义)' + '</td><td>' + data.rows[0].list[i].custom_status + '(自定义)' + '</td><td>未接入</td></tr>';
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
									var data_value = status;
									var data_id = label.label_id;
									var port_type = label.port_type;
									if(suggest) {
										layer.confirm('<span style="color: red;">警告：当前端口存在已知异常前置端口！是否确认下发？</span>', {
											title: false,
											closeBtn: false,
											area: '400px',
											btn: ['下发', '取消'] //按钮

										}, function(index2) {
											$.verifyIssuePassword(passwordDom, function() {
												$.newIssueAjax({
													data_id: data_id,
													data_value: data_value
												}, function() {
													$.newIssueSuccessed({
														data_value: data_value,
														data_id: data_id
													});
													parent.find('.close').click();
													layer.closeAll();
													$('.conditions-layer').css('display', 'none');
													$('.conditions-layer').find('tbody').html('');
												}, function() {
													onOff.reset();
												});
											});
										});
									} else {
										$.verifyIssuePassword(passwordDom, function() {
											$.newIssueAjax({
												data_id: data_id,
												data_value: data_value
											}, function() {
												$.newIssueSuccessed({
													data_value: data_value,
													data_id: data_id
												});
												$('.conditions-layer').find('tbody').html('');
												$('.conditions-layer').css('display', 'none');
												parent.find('.close').click();
												layer.closeAll();
											}, function() {
												onOff.reset();
											});
										});
									}
								},
								btn2: function(index) {
									$('.conditions-layer').find('tbody').html('');
									onOff.reset();
									layer.close(index);
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
									var data_value = status;
									var data_id = label.label_id;
									var port_type = label.port_type;
									$.verifyIssuePassword(passwordDom, function() {
										$.newIssueAjax({
											data_id: data_id,
											data_value: data_value
										}, function() {
											$.newIssueSuccessed({
												data_value: data_value,
												data_id: data_id
											});
											layer.close(index1);
											$('.conditions-layer').css('display', 'none');
											parent.find('.close').click();
										}, function() {
											onOff.reset();
										});
									});
								},
								btn2: function(index) {
									onOff.reset();
									layer.close(index);
								}
							});
						});
					}
				});
			},
			MO: function() {
				var son = $('.MO');
				son.toggleWin().stayCenter($('.operation'));
				son.siblings().toggleWin(true);
				son.find('.name').html(label.label_name);
				son.find('.realtime').html(time.endDate);
				son.find('.oldVal').val(label.label_value);
				son.find('.newVal').val("");
				son.find('.confirm').off('click').click(function() {
					if(son.find('.newVal').val() == '') {
						son.find('.newVal').focus();
						layer.tips('修改值不能为空', '.newVal', {
							tips: [2, '#ff787b'],
							time: 2000,
							tipsMore: true
						});
						return false;
					}
					if(son.find('.oldVal').val() == son.find('.newVal').val()) {
						son.find('.newVal').focus();
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
						yes: function() {
							var data_value = parseFloat($('.MO').find('.newVal').val());
							var data_id = label.label_id;
							var port_type = label.port_type;
							$.verifyIssuePassword(passwordDom, function() {
								$.moAjax({
									data_value: data_value,
									data_id: data_id
								}, function() {
									$.newIssueSuccessed({
										data_value: data_value,
										data_id: data_id
									});
									$('.conditions-layer').css('display', 'none');
									parent.find('.close').click();
									layer.closeAll();
								});
							});
						}
					});
				});
			},
			CD: function() {
				var son = $('.CD');
				son.siblings().toggleWin(true);
				son.toggleWin().stayCenter($('.operation'));
				son.find('.name').html(label.label_name);
				var chart = echarts.init(son.find('.chart').get(0));
				$.getRealTimeData(label.label_id, time, chart, 'AI');
				$.initDatePacker(son.find('.date'), time, function(changedTime) {
					$.getRealTimeData(label.label_id, changedTime, chart, 'AI');
				});
			},
			process: function() {
				var processId = label.label_id;
				var processName = label.label_name;
				$('.conditions-layer').css('display', 'block');
				$('.conditions-layer').find('table').css('display', 'none');
				$('.conditions-layer').find('p').css('display', 'block').html('是否确定执行<span style="color: red;">' + processName + '</span>？');
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
								$('.conditions-layer').css('display', 'none');
								parent.find('.close').click();
								layer.closeAll();
							});
						});
					},
					btn2: function() {
						$('.conditions-layer').css('display', 'none');
						parent.find('.close').click();
					}
				});
			},
			anchor: function() {
				var scadaId = label.label_id;
				var scadaName = label.label_name;
				layer.confirm('是否跳转至<span style="color: red;">' + scadaName + '</span>组态界面？', {
					btn: ['确定', '取消'],
					btn1: function() {
						console.log(scadaId)
						$('.mainTitle').find('.backSide').children('[scadaId=' + scadaId + ']').click();
					},
					btn2: function() {
						$('.operation').toggleWin(true);
						layer.closeAll();
					},
					cancel: function() {
						layer.closeAll();
						$('.operation').toggleWin(true);
					}
				});
			}
		}
	},
	initTime: function() {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
		var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
		var hourNow = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
		var hourBefore = (hourNow - 4) < 10 ? '0' + (hourNow - 4) : (hourNow - 4);
		var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
		var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
		var flagNow = (function() {
			return hourNow >= 12 ? 'PM' : 'AM';
		})();
		var flagBefore = (function() {
			return hourBefore >= 12 ? 'PM' : 'AM';
		})();
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
			url: globalurl + "/v1/realtimeDatas",
			dataType: "JSON",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
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
		inputElement.val(startDate + ' - ' + endDate);
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
			dataZoom: [{
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
		switch(chartType) {
			case 'AI':
				if(typeof data.min_values === 'undefined' || typeof data.max_values === 'undefined') {
					option.legend = {
						data: ['数据']
					};
					option.series = [{
						name: '数据',
						type: 'line',
						data: data.data_values
					}];
				} else {
					option.legend = {
						data: ['最小值', '平均值', '最大值']
					};
					option.series = [{
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
				option.series = [{
					type: 'bar',
					barWidth: '80%',
					data: (function(values) {
						var formattedData = [];
						for(var i = 0; i < values.length; i++) {
							if(values[i] == 0) {
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
				}];
				option.yAxis = {
					min: -1,
					max: 1,
					interval: 2,
					axisLabel: {
						formatter: function(value) {
							var status;
							switch(value) {
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
			url: globalurl + "/v1/homes/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				data: JSON.stringify(newData)
			},
			success: function(data) {
				console.log(data)
				if(data.result == 1) {
					callBack && callBack();
					layer.msg("下发成功", {
						icon: 1
					});
				} else {
					layer.msg('下发失败！', {
						icon: 2,
						time: 2000,
						end: function() {
							layer.closeAll();
							$('.conditions-layer').css('display', 'none');
							$('.operation').toggleWin(true);
						}
					});
				}
			}
		});
	},
	newIssueAjax: function(data, callback, fail) {
		$.ajax({
			url: gatewayUrl + '/v1/gateways?access_token=' + accesstoken,
			data: {
				data_id: data.data_id,
				data_value: data.data_value
			},
			dataType: 'JSON',
			type: 'GET',
			crossDomain: true == !(document.all),
			success: function(data) {
				if(data.result == 1) {
					callback && callback();
					layer.msg("下发成功", {
						icon: 1
					});
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
	newIssueSuccessed: function(data) {
		var id = data.data_id;
		var value = data.data_value;
		var target = $.searchDataById(id, allData.parentData.scada_config.data_list);
		target.label_value = value;
		allData.changedData.group = [];
		allData.changedData.group.push(target);
		$('#scada').get(0).contentWindow.postMessage(allData.changedData, '*');
	},
	moAjax: function(newData, callBack) {
		$.ajax({
			type: "put",
			dataType: "json",
			url: globalurl + "/v1/manualEnters",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				data: JSON.stringify(newData)
			},
			success: function(data) {
				if(data.code == 200) {
					callBack && callBack();
					layer.msg('下发成功！', {
						icon: 1
					});
				}
			}
		});
	},
	getConditions: function(dataId, status, callback, noConditions) {
		$.ajax({
			type: 'get',
			url: globalurl + "/v1/preconditions?access_token=" + accesstoken,
			async: false,
			data: {
				filter: JSON.stringify({
					gateway_data_id: dataId,
					status: String(status)
				})
			},
			success: function(data) {
				if(data.total === 1) {
					callback && callback(data);
				} else if(data.total === 0) {
					noConditions && noConditions();
				}
			}
		});
	},
	verifyIssuePassword: function(passwordDom, callback) {
		var password = passwordDom.val();
		if(password === '') {
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
			url: globalurl + "/v1/mails?access_token=" + accesstoken,
			async: false,
			data: {
				company_id: allData.companyId,
				password: password
			},
			success: function(data) {
				if(data.code === 200) {
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
	},
	searchDataById: function(id, group) {
		var target;
		group.forEach(function(data) {
			if(data.label_id === id) {
				target = data;
			}
		});
		return target;
	}
})

$.init();