$.initData = {
	access_token: '',
	infoMap: [],
	search: '',
	pageStatus: 'loading'
}

var $extend = $.fn.extend({
	likeSearch: function(event, type) {
		if (type == 'key') {
			if (event.keyCode == 13) {
				$.initAjax();
			}
		} else if (type == 'mouse') {
			$.initAjax();
		}
	},
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
		$.initData.pageStatus = 'loading';
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl+"/v1/scadaModels/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.access_token,
				like: JSON.stringify({
					modelName: $.initData.search
				})
			},
			success: function(data) {
				$.initData.infoMap = data;
				if ($.initData.infoMap.length == 0) {
					$.initData.pageStatus = 'nodata';
				} else {
					$.initData.pageStatus = '';
				}
				callBack && callBack();
			}
		});
	},
	initVue: function() {
		$.vue = new Vue({
			el: '#vue',
			data: $.initData,
			methods: $extend
		});
	}
});

$.init();
