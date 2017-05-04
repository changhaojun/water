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
//		host: '139.129.231.31',
		host: '192.168.1.114',
		port: 61623,
		username: 'admin',
//		password: 'finfosoft123',
		password: 'password',
	}
}

$.fn.extend({
	
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
				console.log(data);
				for (var i=0; i<$.data.sentData.scada_config.length; i++) {
					$.initThree.initLabel(
						{
							dataId: $.data.sentData.scada_config[i].data_id,
							dataName: $.data.sentData.scada_config[i].data_name,
							dataValue: $.data.sentData.scada_config[i].data_value,
							dataUnit: $.data.sentData.scada_config[i].data_unit,
							dataStatus: $.data.sentData.scada_config[i].status
						},
						$.data.sentData.scada_config[i].objPosition
					);
				}
				if ($.data.sentData.scada_config.length>0) $.initMQTT($.data.sentData.scada_config);
				$.initThree.init(data.scadaModel.modelConfig, '', true);
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
		console.log(payload)
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
	}
});

$.init();