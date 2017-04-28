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
		description: '测试描述123456',
		scada_config: []
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
				for (var i=0; i<$.data.sentData.scada_config.length; i++) {
					$.initThree.initLabel(
						{
							dataId: $.data.sentData.scada_config[i].data_id,
							dataName: $.data.sentData.scada_config[i].data_name,
							dataValue: $.data.sentData.scada_config[i].data_value,
							dataUnit: $.data.sentData.scada_config[i].data_unit
						},
						$.data.sentData.scada_config[i].objPosition
					);
				}
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
	}
});

$.init();