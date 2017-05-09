$.data = {
	token: {
		access: '',
		refresh: ''
	},
	globalurl: globalurl,
	scadaId: $('#scadaId').val(),
	thingName: '',
	sentData: {
		thing_id: '',
		scada_name: '',
		scada_model_id: $('#modelId').val(),
		description: '',
		scada_config: []
	},
	mqtt: {
		client: null,
		topic: null,
		data: null,
		host: '139.129.231.31',
//		host: '192.168.1.114',
		port: 61623,
		username: 'admin',
		password: 'finfosoft123',
//		password: 'password',
	}
}

$.fn.extend({
	toggleWin: function(hide) {
		if (hide) {
			$(this).css('display', 'none');
		} else {
			$(this).css('display', 'block');
		}
		return $(this);
	},
	setCenterPos: function(parent) {
		$(this).css({
			'left': (parent.width() - $(this).width()) / 2,
			'top': (parent.height() - $(this).height()) / 2
		});
	},
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
		$.initToken('get', function() {
			$.initAjax(function(data) {
				$.data.thingName = data.scada.thing_name;
				$.data.sentData.thing_id = data.scada.thing_id;
				$.data.sentData.scada_name = data.scada.scada_name;
				$.data.sentData.scada_model_id = data.scada.scada_model_id;
				$.data.sentData.description = data.scada.description;
				$.data.sentData.scada_config = data.scada.scada_config;
				for (var i=0; i<$.data.sentData.scada_config.length; i++) {
					$.initThree.initLabel(
						{
							data_id: $.data.sentData.scada_config[i].data_id,
							data_name: $.data.sentData.scada_config[i].data_name,
							data_value: $.data.sentData.scada_config[i].data_value,
							data_unit: $.data.sentData.scada_config[i].data_unit,
							label_type: $.data.sentData.scada_config[i].label_type
						},
						$.data.sentData.scada_config[i].objPosition
					);
				}
				if ($.data.sentData.scada_config.length>0) $.initMQTT($.data.sentData.scada_config);
				$.initThree.init(data.scadaModel.modelConfig, function() {
					$.labelOperation($.three.capturer.intersected.labelType);
				});
			});
		})
	},
	initToken: function(type, callBack) {
		switch (type) {
			case 'get':
				getToken(function() {
					$.data.token.access = accesstoken;
					$.data.token.refresh = refreshToken;
					callBack && callBack();
				});
				break;
			case 'refresh':
				getNewToken(function() {
					$.data.token.access = accesstoken;
					$.data.token.refresh = refreshToken;
					callBack && callBack();
				});	
				break;
		}
	},
	initAjax: function(callBack) {
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.data.globalurl+"/v1/scadas/"+$.data.scadaId,
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.data.token.access
			},
			success: function(data) {
				console.log(data);
				callBack && callBack(data);
			}
		});
	},
	initMQTT: function(data) {
		$.data.mqtt.client = new Paho.MQTT.Client($.data.mqtt.host, $.data.mqtt.port, "server" + parseInt(Math.random() * 100, 10));
		var options = {
			userName: $.data.mqtt.username,
			password: $.data.mqtt.password,
			timeout: 1000,
			onSuccess: function() {
				for (var i = 0; i < data.length; i++) {
					$.data.mqtt.client.subscribe(data[i].data_id.toString());
				}
			},
			onFailure: function(message) {
				setTimeout($.initMQTT, 10000000);
			}
		};
		$.data.mqtt.client.onConnectionLost = function(responseObject) {
			if(responseObject.errorCode !== 0) {
				console.log("onConnectionLost:" + responseObject.errorMessage);
			}
		};
		$.data.mqtt.client.onMessageArrived = $.onMessageArrived;
		$.data.mqtt.client.connect(options);
	},
	onMessageArrived: function(message) {
		var dataId = Number(message.destinationName);
		var payload = JSON.parse(message.payloadString);
		var originLabel = $.three.labelGroup.children[$.initThree.searchLabelFromId(dataId)];
		if (!originLabel) return;
		var newData = {
			dataId: dataId,
			dataName: originLabel.labelName,
			dataValue: payload.data_value,
			dataUnit: originLabel.labelUnit,
			dataStatus: payload.status
		};
		var position = originLabel.position;
		var payload = JSON.parse(message.payloadString);
		$.three.labelGroup.remove(originLabel);
		$.initThree.initLabel(newData, position);
	},
	labelOperation: function(type) {
		$('.operation').toggleWin();
		$('.AI').stayCenter($('.operation'));
		$('.AI').find('.date').daterangepicker({
			timePicker: true,
			timePickerIncrement: 30,
			format: 'YYYY-MM-DD A h:mm'
    	});
//		$('.selectData').find('.selector-body').stayCenter($('.selectData'));
//		switch (type) {
//			case 'AI':
//				//do AI
//				alert(1);
//				break;
//			case 'DI':
//				//do DI
//				alert(2);
//				break;
//			case 'AO':
//				//do AO
//				alert(3);
//				break;
//			case 'DO':
//				//do DO
//				alert(4);
//				break;
//		}
	}
});

$.init();