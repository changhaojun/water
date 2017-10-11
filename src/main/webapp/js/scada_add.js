var allData = {
	thingId: $('#thingId').val(),
	//新增
	parentData: {
		system: 1,
		scada_config: {
			data_list: []
		}
	}
};

$.extend({
	init: function() {
		getToken(function() {
			console.log(accesstoken)
			$.getData();
		});
	},
	getData: function() {
		$.ajax({
			type: "get",
			url: globalurl+"/v1/things/"+allData.thingId+"/thingDatas",
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
			},
			success: function(data) {
//				console.log(data);
				$.createParentMessage(data.dataConfigList);
//				$.getMessageFromChild();
			}
		})
	},
	createParentMessage: function(data) {
		for (var i = 0; i < data.length; i++) {
			var datas = {}
			if (data[i].data_unit == 'm³/h') {
				data[i].data_unit = 'm3/h'
			}
			datas.label_id = data[i].data_id;
			datas.label_name = data[i].data_name;
			datas.label_value = data[i].data_value;
			datas.label_unit = data[i].data_unit;
			allData.parentData.scada_config.data_list.push(datas)
		}
		$.postMessageToChild();
	},
	postMessageToChild: function() {
		$('#scada').attr('src', 'http://121.42.253.149:18822/scada').on('load', function() {
			$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
		});
	},
	getMessageFromChild: function() {
		//父层接收子层信息
		$(window).on('message', function(ev) {
			//			console.log(ev.originalEvent.data); //从子层传回的数据
			//code = 200, 新增成功 //返回组态id,  //code = 201, 修改成功  ,  //code = 500, 直接返回  //code = 300, 鼠标点击数据标签后的事件
			if (ev.originalEvent.data.code == 200) {
				var scadaId = ev.originalEvent.data.data._id
				$.ajax({
					type: "post",
					url: globalurl + '/v1_0_0/station/' + allData.thingId + '/datas',
					dataType: "JSON",
					crossDomain: true == !(document.all),
					data: {
						accesstoken: accesstoken,
						scada_id: scadaId
					},
					success: function(data) {
						//						console.log(data)
						if (data.code == 200) {
							self.location.href = '/boxlist'
						}
					}
				})
			} else if (ev.originalEvent.data.code == 500) {
				self.location.href = '/boxlist'
			}
		});
	}
})
$.init();