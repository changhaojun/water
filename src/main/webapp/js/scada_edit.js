$.initData = {
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
	}
}

$.fn.extend({
	//窗口显示 & 隐藏
	toggleWin: function(hide) {
		if (hide) {
			$(this).css('display', 'none');
		} else {
			$(this).css('display', 'block');
		}
		return $(this);
	},
	//居中位置计算与设置
	setCenterPos: function(parent) {
		$(this).css({
			'left': (parent.width() - $(this).width()) / 2,
			'top': (parent.height() - $(this).height()) / 2
		});
	},
	//改变窗口大小重新设置位置居中
	stayCenter: function(parent) {
		var This = $(this);
		$(this).setCenterPos(parent);
		$(window).resize(function() {
			This.setCenterPos(parent)
		});
	},
	//自定义滚动条
	resetScrollBar: function() {
		var contentParent = $(this).find('.selector-main');
		var contentPlus = $(this).find('.selector-search');
		var content = $(this).find('.selector-list');
		var barParent = $(this).find('.selector-scroll');
		var bar = $(this).find('.scrollBar');
		bar.css('top', 0);
		content.css('top', 0);
		var contentParentHeight = contentParent.height();
		var contentPlusHeight = contentPlus.height();
		var contentHeight = content.height();
		var barParentHeight = barParent.height();
		var maxContentScroll = contentParentHeight - contentPlusHeight - contentHeight;
		var scale = (contentParentHeight - contentPlusHeight) / contentHeight;
		if (scale>=1) {
			scale = 1;
			maxContentScroll = 0;
			var maxBarScroll = 0;
			bar.unbind();
			bar.css('height', barParentHeight*scale);
			return false;
		} else {
			var maxBarScroll = barParentHeight - barParentHeight*scale;
			bar.css('height', barParentHeight*scale);
		}
		bar.mousedown(function(ev) {
			var disY = ev.pageY - $(this).position().top;
			$(document).mousemove(function(ev) {
				var T = ev.pageY - disY;
				if (T<0) {
					T = 0;
				} else if (T>maxBarScroll) {
					T = maxBarScroll;
				}
				bar.css('top', T);
				content.css('top', maxContentScroll*T/maxBarScroll);
				return false;
			});
			$(document).mouseup(function() {
				$(this).unbind();
			});
		});
	},
	//ajax查询实体列表
	searchThingName: function(callBack) {
		var val = $(this).val();
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.initData.globalurl+"/v1/things",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access,
				like: JSON.stringify({
					thing_name: val
				})
			},
			success: function(data) {
				callBack && callBack(data.rows);
			}
		});
	},
	//确定并改变实体名称
	changeThingName: function(thingName) {
		$(this).css('color', '#1ab394').html(thingName);
	},
	//ajax查询实体下绑定的数据列表
	searchData: function(callBack) {
		var val = $(this).val();
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.initData.globalurl+"/v1/things/"+$.initData.sentData.thing_id+"/thingDatas",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.initData.token.access,
				like: JSON.stringify({
					data_name: val
				})
			},
			success: function(data) {
				callBack && callBack(data.dataConfigList);
			}
		});
	},
	//刷新实体名称列表
	refreshNameList: function(data) {
		$(this).html('');
		var liDom = '';
		$.each(data, function(i) {
			liDom += '<li thingId="'+data[i]._id+'">'+data[i].thing_name+'</li>'
		});
		$(this).html(liDom);
		$(this).children().click(function() {
			$.selectThingName($(this).attr('thingId'), $(this).html());
		})
		$(this).parents('.selector').resetScrollBar();
	},
	//刷新数据列表
	refreshDataList: function(data) {
		$(this).html('');
		var liDom = '';
		$.each(data, function(i) {
			liDom += "<li primary='"+JSON.stringify(data[i])+"'>"+data[i].data_name+"</li>";
		});
		$(this).html(liDom);
		$(this).children().click(function() {
			$.selectThingData(JSON.parse($(this).attr('primary')));
		});
		$(this).parents('.selector').resetScrollBar();
	},
	//选择数据标签后，底部操作栏交互
	selectLabel: function() {
		var This = $(this);
		var oldPos = -$(this).height()-1;
		$(this).css('bottom', 0);
		$(this).find('.confirm').unbind();
		$(this).find('.delete').unbind();
		$(this).find('.confirm').click(function() {
			$.three.controller.transformController.detach($.three.capturer.intersected);
			$.three.capturer.intersected = null;
			This.css('bottom', oldPos);
		});
		$(this).find('.delete').click(function() {
			$.three.controller.transformController.detach($.three.capturer.intersected);
			$.three.labelGroup.remove($.three.capturer.intersected);
			$.initThree.rendererUpdata();
			$.three.capturer.intersected = null;
			This.css('bottom', oldPos);
		});
	}
});

$.extend({
	//总程序
	init: function() {
		$.initToken('get', function() {
			$.initAjax(function(data) {
				$.initData.thingName = data.scada.thing_name;
				$.initData.sentData.thing_id = data.scada.thing_id;
				$.initData.sentData.scada_name = data.scada.scada_name;
				$.initData.sentData.scada_model_id = data.scada.scada_model_id;
				$.initData.sentData.description = data.scada.description;
				$.initData.sentData.scada_config = data.scada.scada_config;
				for (var i=0; i<$.initData.sentData.scada_config.length; i++) {
					$.initThree.initLabel(
						{
							data_id: $.initData.sentData.scada_config[i].data_id,
							data_name: $.initData.sentData.scada_config[i].data_name,
							data_value: $.initData.sentData.scada_config[i].data_value,
							data_unit: $.initData.sentData.scada_config[i].data_unit,
							port_type: $.initData.sentData.scada_config[i].port_type,
							status: $.initData.sentData.scada_config[i].status
						},
						$.initData.sentData.scada_config[i].objPosition
					);
				}
				$('.link').find('p').changeThingName($.initData.thingName);
				$('.name').find('input').val($.initData.sentData.scada_name);
				$('.description').find('input').val($.initData.sentData.description);
				$('.selectData').find('input').searchData(function(data) {
					$('.selectData').find('.selector-list').refreshDataList(data);
				});
				$.initThree.init(data.scadaModel.modelConfig, function() {
					$('.footBar').selectLabel();
				}, true);
				$.initButton();
				$.saveScada();
			});
		})
	},
	//获取token
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
	//获取组态
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
	//按钮鼠标交互
	initButton: function() {
		$('.link').click(function() {
			if ($('.link').find('p').html()!=='请绑定实体') {
				var confirm = layer.confirm('警告：更换绑定的实体会清除所有情景内所有的数据标签！是否确定更换？', {
					btn: ['确定','取消']
				}, function(){
					$.three.scene.el.remove($.three.labelGroup);
					$.three.labelGroup = new THREE.Object3D();
					$.three.controller.transformController.detach($.three.capturer.intersected);
					$('.footBar').css('bottom', -$('.footBar').height()-1);
					$.three.capturer.intersected = null;
					$.initThree.rendererUpdata();
					layer.close(confirm);
					$.openSelectThingName();
				});
			} else {
				$.openSelectThingName();
			}
		});
		$('.add').click(function() {
			if ($('.link').find('p').html()==='请绑定实体') {
				layer.msg('请绑定对应实体！', {
					icon: 2,
					time: 1000
				});
				return false;
			}
			$('.selectData').toggleWin();
			$('.selectData').find('.selector-body').stayCenter($('.selectData'));
			$('.selectData').resetScrollBar();
			$('.selectData').find('input').keyup(function() {
				$(this).searchData(function(data) {
					$('.selectData').find('.selector-list').refreshDataList(data);
				});
			});
		});
		$('.selector-close').click(function() {
			$('.selector').toggleWin(true);
		});
	},
	//打开选择实体列表
	openSelectThingName: function() {
		$('.selectThing').toggleWin();
		$('.selectThing').find('.selector-body').stayCenter($('.selectThing'));
		$('.selectThing').resetScrollBar();
		$('.selectThing').find('input').keyup(function() {
			$(this).searchThingName(function(data) {
				$('.selectThing').find('.selector-list').refreshNameList(data);
			});
		});
	},
	//选择相应实体
	selectThingName: function(thingId, thingName) {
		$.initData.thingName = thingName;
		$.initData.sentData.thing_id = thingId;
		$('.selector').toggleWin(true);
		$('.link').find('p').changeThingName(thingName);
		layer.msg('绑定实体：【'+thingName+'】成功！', {
			icon: 1,
			time: 1500
		});
		$('.selectData').find('input').searchData(function(data) {
			$('.selectData').find('.selector-list').refreshDataList(data);
		});
	},
	//选择相应数据
	selectThingData: function(data) {
		if ($.initThree.searchLabelFromId(data.data_id)>-1) {
			layer.msg('请勿绑定重复的数据标签！', {
				icon: 2,
				time: 1000
			});
			return false;
		}
		$('.selector').toggleWin(true);
		$.initThree.initLabel(data);
	},
	//保存情景
	saveScada: function(callBack) {
		$('.save').click(function() {
			$.initData.sentData.scada_name = $('.name').find('input').val();
			$.initData.sentData.description = $('.description').find('input').val();
			$.initData.sentData.scada_config = $.initThree.createLabelData();
			if ($.initData.sentData.scada_name==='') {
				layer.msg('请输入情景名称！', {
					icon: 2,
					time: 1000
				});
				$('.name').find('input').focus();
				return false;
			} else if ($.initData.sentData.description==='') {
				layer.msg('请输入情景描述！', {
					icon: 2,
					time: 1000
				});
				$('.description').find('input').focus();
				return false;
			} else if ($.initData.thingName==='') {
				layer.msg('请绑定对应实体！', {
					icon: 2,
					time: 1000
				});
				return false;
			}
			$(this).find('button').html('正在保存');
			$.ajax({
				type: "put",
				dataType: "json",
				url: $.initData.globalurl+'/v1/scadas/'+$.initData.scadaId,
				async: true,
				crossDomain: true == !(document.all),
				data: {
					access_token: $.initData.token.access,
					data: JSON.stringify($.initData.sentData)
				},
				success: function(data) {
					if (data.code===200) {
						layer.msg('保存成功！', {
							icon: 1,
							end: function() {
								self.location.href='/finfosoft-water/scada'
							}
						});
					}
				}
			});
		});
	}
});

$.init();