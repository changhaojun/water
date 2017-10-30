var allData = {
	thingId: $('#thingId').val(),
	createUser: $('#createUser').val(),
	companyId: $('#companyId').val(),
//	lanyueSrc: 'http://121.42.253.149:18822/scada',
	lanyueSrc: 'http://localhost:80/scada',
	ajaxComplated: {},
	//新增
	parentData: {
		system: 1,
		scada_config: {
			data_list: [],
			process_list: [],
			anchor_list: []
		}
	}
};

console.log( allData.createUser )

$.extend({
	init: function() {
		getToken(function() {
			$.getData();
			$.searchProcess();
			$.searchAnchor();
		});
	},
	getData: function() {
		allData.ajaxComplated.data = false;
		$.ajax({
			type: "get",
			url: globalurl+"/v1/things/"+allData.thingId+"/thingDatas",
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
		if (data && data.length > 0) {
			for (var i = 0; i < data.length; i++) {
				var datas = {}
				if (data[i].data_unit == 'm³/h') {
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
//		var val = $(this).val();
		allData.ajaxComplated.process = false;
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl+"/v1/processes/",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: accesstoken,
				filter: JSON.stringify({
					trigger_type: "58f0431743929a10a8fb49fa"
				})
			},
			success: function(data) {
				console.log(data);
				$.createParentProcess(data.rows);
			}
		});
	},
	createParentProcess:function(data){
		if (data && data.length > 0) {			
			for(var i=0;i<data.length;i++){
				var datas={};
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
//		var val = $(this).val();
		allData.ajaxComplated.anchor = false;
		$.ajax({
			type: "get",
			dataType: "json",
			url: globalurl+"/v1/scadas",
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
	createParentAnchor:function(data){
		if (data && data.length > 0) {			
			for(var i=0;i<data.length;i++){
				var datas={};
				datas.label_id = data[i]._id;
				datas.label_name = data[i].scada_name;
				allData.parentData.scada_config.anchor_list.push(datas);
			}
		}
		allData.ajaxComplated.anchor = true;
		$.postMessageToChild();
	},
	canPostMessageToChild: function() {
		var res = true;
		for (var key in allData.ajaxComplated) {
			if ( !allData.ajaxComplated[key] ) {
				res = false;
			}
		}
		return res;
	},
	postMessageToChild: function() {
		if ( !$.canPostMessageToChild() ) return;
		$('#scada').attr('src', allData.lanyueSrc).on('load', function() {
			$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
		});
	},
	getMessageFromChild: function() {
		//父层接收子层信息
		$(window).on('message', function(ev) {
			//			console.log(ev.originalEvent.data); //从子层传回的数据
			//code = 200, 新增成功 //返回组态id,  //code = 201, 修改成功  ,  //code = 500, 直接返回  //code = 300, 鼠标点击数据标签后的事件
			console.log(ev.originalEvent.data)
			if (ev.originalEvent.data.code == 200) {
//				var scadaId = ev.originalEvent.data.data._id;
				var sentData = {
					scada_models_id: ev.originalEvent.data.data._id,
					scada_name: ev.originalEvent.data.data.scada_name,
					description: ev.originalEvent.data.data.scada_description,
					create_user: allData.createUser,
					thing_id: allData.thingId,
					company_id: allData.companyId
				};
				$.ajax({
					type: "post",
					url: globalurl+"/v1/scadas",
					dataType: "JSON",
					crossDomain: true == !(document.all),
					data: {
						access_token: accesstoken,
						data: JSON.stringify(sentData)
					},
					success: function(data) {
						if (data.code == 200) {
							self.location.href = '/scadas'
						}
					}
				})
			} else if (ev.originalEvent.data.code == 500) {
				self.location.href = '/scadas'
			}
		});
	}
})
$.init();