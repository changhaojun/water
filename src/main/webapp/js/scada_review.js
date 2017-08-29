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
		password: mqttWord
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
		var client = new Paho.MQTT.Client($.initData.mqtt.host, $.initData.mqtt.port, "server" + parseInt(Math.random() * 100, 10));
		var options = {
			userName: $.initData.mqtt.username,
			password: $.initData.mqtt.password,
			timeout: 1000,
			onSuccess: function() {
				if (data.port_type == 'AO' || data.port_type == 'DO' || data.port_type == 'MO') { //AO && DO && MO订阅
					if (isIssue) {
						client.subscribe(data.data_id.toString());
					}
				} else if (data.port_type == 'AI' || data.port_type == 'DI') { //AI && DI订阅
					client.subscribe(data.data_id.toString());
				} else { //任务订阅
					//任务订阅预留接口
				}
			},
			onFailure: function(message) {
				setTimeout(function() {
					$.initMQTT(data, isIssue);
				}, 10000000);
			}
		};
		client.onConnectionLost = function(responseObject) {
			if(responseObject.errorCode !== 0) {
				console.log("onConnectionLost:" + responseObject.errorMessage);
			}
		};
		client.onMessageArrived = function(message) {
			if (!isIssue) { //AI && DI回调
				$.onLabelValueChange(message);
			} else { //AO && DO && MO回调
				$.onIssueSuccess(message, data);
			}
		};
		client.connect(options);
	},
	//MQTT

	onLabelValueChange: function(message) {
		console.log(message)
		var dataId = Number(message.destinationName);
		var originLabel = $.three.labelGroup.children[$.initThree.searchLabelFromId(dataId, $.initThree.judgeLabelType({data_id: dataId}))];
		var payload = typeof message.payloadString=='string' ? JSON.parse(message.payloadString) : message.payloadString;
//		var payload = JSON.parse(message.payloadString);

		if (!originLabel) return;
		var newData = {
			data_id: dataId,
			data_name: originLabel.labelName,
			data_value: payload.data_value,
			data_unit: originLabel.labelUnit,
			port_type: originLabel.labelType,
			status: payload.status
		};
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
						layer.confirm('是否确定下发？', {
							btn: ['确定','取消']
						}, function(){
							var data_value = $('.AO').find('.confirmVal').val();
							var	data_id = label.labelId;
							var port_type = label.labelType;
							$.issueAjax({
								data_value: data_value,
								data_id: data_id
							}, function() {
								$.initMQTT({
									data_value: data_value,
									data_id: data_id,
									port_type: port_type
								}, true);
								$('.operation').toggleWin(true);
								$('.AO').find('.confirm').unbind();
								$.three.capturer.intersected = null;
							});
						});
					});
					break;
				case 'DO':
					//do DO

					$('.DO').siblings().toggleWin(true);
					$('.DO').toggleWin().stayCenter($('.operation'));
					$('.DO').find('.name').html(label.labelName);
					$('.DO').find('.realtime').html(time.endDate);
					var onOff = new Finfosoft.OnOff({
						el: '.finfosoft-onOff',
						status: !label.labelValue ? 0 : label.labelValue,
						onChanged: function(status) {
							layer.confirm('是否确定下发？', {
								btn: ['确定','取消']
							}, function() {
								var data_value = status;
								var	data_id = label.labelId;
								var port_type = label.labelType;
								$.issueAjax({
									data_value: data_value,
									data_id: data_id
								}, function() {
									$.initMQTT({
										data_value: data_value,
										data_id: data_id,
										port_type: port_type
									}, true);
									$('.operation').toggleWin(true);
									$.three.capturer.intersected = null;
								});
							}, function() {
								onOff.reset();
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
						layer.confirm('是否确定下发？', {
							btn: ['确定','取消'] //按钮

						}, function(){
							var data_value = parseFloat($('.MO').find('.newVal').val());
							var	data_id = label.labelId;
							var port_type = label.labelType;
							$.moAjax({
								data_value: data_value,
								data_id: data_id
							}, function() {
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
					});
					break;
			}
		} else {
			if (label.processId) {
				var processId = label.processId;
				var processName = label.processName;
				layer.confirm('是否确定执行<span style="color: red;">'+processName+'</span>？', {
					btn: ['确定','取消'],
					btn1: function() {
						$.issueAjax({
							process_id: processId
						}, function() {
	//						$.initMQTT({

	//							data_value: data_value,

	//							data_id: data_id,

	//							port_type: port_type

	//						}, true);

	//						$('.operation').toggleWin(true);

							var position = label.position;
							$.three.labelGroup.remove(label);
							$.initThree.initLabel({
								_id: processId,
								process_name: processName,
								status: 1
							}, position);
							$.three.capturer.intersected = null;
						});
					},
					btn2: function() {
						$.three.capturer.intersected = null;
					},
					cancel: function() {
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
		                					return data.name + ' ' + (data.value == 1 ? '开' : '关');
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
			        				status = '开';
			        				break;
			        			case -1:
			        				status = '关';
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
	}
});

$.init();