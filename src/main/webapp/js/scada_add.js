$.data = {
	token: {
		access: '',
		refresh: ''
	},
	globalurl: globalurl,
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
	},
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
	searchThingName: function(callBack) {
		var val = $(this).val();
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.data.globalurl+"/v1/things",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.data.token.access,
				like: JSON.stringify({
					thing_name: val
				})
			},
			success: function(data) {
				callBack && callBack(data.rows);
			}
		});
	},
	changeThingName: function(thingName) {
		$(this).css('color', '#1ab394').html(thingName);
	},
	searchData: function(callBack) {
		var val = $(this).val();
		$.ajax({
			type: "get",
			dataType: "json",
			url: $.data.globalurl+"/v1/things/"+$.data.sentData.thing_id+"/thingDatas",
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.data.token.access,
				like: JSON.stringify({
					data_name: val
				})
			},
			success: function(data) {
				callBack && callBack(data.dataConfigList);
			}
		});
	},
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
	refreshDataList: function(data) {
		$(this).html('');
		var liDom = '';
		$.each(data, function(i) {
			liDom += "<li primary='"+JSON.stringify(data[i])+"'>"+data[i].data_name+"</li>";
		});
		$(this).html(liDom);
		$(this).children().click(function() {
			$.selectThingData($(this).attr('primary'));
		});
		$(this).parents('.selector').resetScrollBar();
	},
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
	init: function() {
		$.initToken('get', function() {
			$.initAjax(function(data) {
				$.initThree.init(data.modelConfig, function() {
					$('.footBar').selectLabel();
				}, true);
				$.initButton();
				$.saveScada();
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
			url: $.data.globalurl+"/v1/scadaModels/"+$.data.sentData.scada_model_id,
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
	selectThingName: function(thingId, thingName) {
		$.data.thingName = thingName;
		$.data.sentData.thing_id = thingId;
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
	selectThingData: function(data) {
		if ($.initThree.searchLabelFromId(data.dataId)>-1) {
			layer.msg('请勿绑定重复的数据标签！', {
				icon: 2,
				time: 1000
			});
			return false;
		}
		$('.selector').toggleWin(true);
		$.initThree.initLabel(data);
	},
	saveScada: function(callBack) {
		$('.save').click(function() {
			$.data.sentData.scada_name = $('.name').find('input').val();
			$.data.sentData.description = $('.description').find('input').val();
			$.data.sentData.scada_config = $.initThree.createLabelData();
			if ($.data.sentData.scada_name==='') {
				layer.msg('请输入情景名称！', {
					icon: 2,
					time: 1000
				});
				$('.name').find('input').focus();
				return false;
			} else if ($.data.sentData.description==='') {
				layer.msg('请输入情景描述！', {
					icon: 2,
					time: 1000
				});
				$('.description').find('input').focus();
				return false;
			} else if ($.data.thingName==='') {
				layer.msg('请绑定对应实体！', {
					icon: 2,
					time: 1000
				});
				return false;
			}
			$(this).find('button').html('正在保存');
			$.ajax({
				type: "post",
				dataType: "json",
				url: $.data.globalurl+'/v1/scadas',
				async: true,
				crossDomain: true == !(document.all),
				data: {
					access_token: $.data.token.access,
					data: JSON.stringify($.data.sentData)
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