$.initData = {
	access_token: '',
	infoMap: []
}

$.fn.extend({
	confirmModel: function(modelId) {
		self.location.href = '/finfosoft-water/scada/add/'+modelId;
	}
});

$.extend({
	init: function() {
		getToken(function() {
			$.initData.access_token = accesstoken;
			$.initAjax($.initVue);
		});
	},
	initAjax: function(callBack) {
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl+"/v1/scadaModels/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.access_token
			},
			success: function(data) {
				$.initData.infoMap = data;
				callBack && callBack();
			}
		});
	},
	initVue: function() {
		$.vue = new Vue({
			el: '#vue',
			data: $.initData,
			methods: $.fn
		});
	}
});

$.init();
