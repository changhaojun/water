$.initData = {
	vueInstance: null,
	isSearch: false,
	tableData: null,
	tableIndex: 0,
	conditionId: '',
	isEdit: false,
	companyId:$("#companyId").val(),
	vueData: {
		search_name:'',
		config: {
			target_entity: {
				name: '',
				id: ''
			},
			target_port: {
				selectedIndex: 0,
				group: []
			},
			target_status: '',
			conditions: []
		}
	},
	origConfig: {
		type: 1,
		entity: {
			name: '',
			id: ''
		},
		port: {
			selectedIndex: 0,
			group: []
		},
		status: '',
		port_define: '',
		status_define: ''
	},
	localStorage: []
};

var extend = $.fn.extend({
	likeSearch: function(event) {
		var $This = event ? $(event.currentTarget) : $(this);
		$.initData.isSearch = true;
		$('.table').bootstrapTable("refresh", queryParams);
		$.initData.isSearch = false;
	},
	topColor: function(color) {
		$(this).on("mouseover",function(){
			$(".tooltip-inner").css("background-color",color);
			$(".tooltip.top .tooltip-arrow").css("border-top-color",color);
		});
	},
	deleteCondition: function(index) {
		if ($.initData.vueInstance.config.conditions.length === 1) {
			layer.msg('至少需要1个前置条件',{ icon: 2 });
			return;
		} else {			
			$.initData.vueInstance.config.conditions.splice(index, 1);
		}
	}
});

$.extend({
	init: function() {
		$.token();
		$.initVue();
		$.toolTip();
		$.getList();
		$.addConfig();
		$.saveConfig();
	},
	initVue: function() {
		$.initData.vueInstance = new Vue({
			el:'.vue',
			methods: extend,
			data: $.initData.vueData
		});
	},
	token: function() {
		getToken();
	},
	toolTip: function() {
		$('[data-toggle="tooltip"]').tooltip();
		$(".fa-laptop").topColor("#1ab394");
		$(".fa-cog").topColor("#fcc433");
		$(".fa-trash-o").topColor("#f98c91");
	},
	getList: function() {
		window.dataTables = $('.table').bootstrapTable({
		  	method: 'get',
		  	url:globalurl+"/v1/preconditions",
		    sidePagination: 'server',//设置为服务器端分页
		    pagination: true, //是否分页
		    search: false, //显示搜索框
		    pageSize: 10,//每页的行数 
		    pageNumber: 1,
		    showRefresh: false,
		    showToggle: false,
		    showColumns: false,
		    pageList:[10,15,20, 25],
		    queryParams: $.queryParams,
		    striped: true,//条纹
		    onLoadSuccess:function(value){
		    	$.initData.tableData = value;
		    	console.log(value);
		    	if(value.code==400005){
		    		$.token();
		    		$.getList();		    	
		    		$('.table').bootstrapTable("refresh", $.queryParams);
		    	}
		    	$.toolTip();//顶部提示框
		    },
		    columns: [
	            {
	                title: "前置端口",
	                field: "gateway_data_name",
	            },
	            {
	                title: "前置状态",
	                field: "target_status",
	            },
	            {
	                title: "前置条件数",
	                field: "listRows"
	            },
	            {
	                title: "创建时间",
	                field: "time"
	            },
				{
	                title: "操作",
	                field: '_id',
	                valign: "middle",
	                align:"left",
	                formatter: $.editFormatter//对本列数据做格式化
	            }
	        ],
		});
	},
	queryParams: function(params) {
		return {
			pageNumber: params.offset,//第几页
			pageSize: params.limit,//每页的条数
			access_token: accesstoken,
//			like:'{"scada_name":"'+$.initData.vueInstance.search_name+'"}',//模糊查询的设备名
			filter: '{"company_id": "'+ $('#companyId').val() +'"}'
		};
	},
	editFormatter: function(id) {
		return "<span _id='"+ id +"' data-toggle='tooltip' data-placement='top' title='编辑' style='color:#ffb400;margin-right:30px;cursor: pointer;' class='fa fa-cog' onclick='$.editConfig.call(this)'></span><span _id='"+ id +"' data-toggle='tooltip' data-placement='top' title='删除' style='color:#ff787b;margin-right:30px;cursor: pointer;' class='fa fa-trash-o' onclick='$.deleteConfig.call(this)'></span>";
	},
	addConfig: function() {
		$(document).click(function() {
			$('.list-define').css('display', 'none');
		});
		$('.add-config').click(function() {
			$('.config-title-name').html('新增配置');
			$('.config').removeClass('hidden');
			$('.config-mask').removeClass('hidden');
			$.initData.conditionId = '';
			$.addCondition(false);
		});
		$('.config .close').click(function() {
			$('.config').addClass('hidden');
			$('.config-mask').addClass('hidden');
		});
		$('.add-condition').click(function() {
			$.addCondition(true);
		});
		$('.target>.entity>input').keyup(function() {
			$.initData.vueInstance.config.target_port.group = [];
			$.initData.vueInstance.config.target_port.selectedIndex = 0;
			$.initData.vueInstance.config.target_status = '';
			var list = $(this).siblings('ul');
			$.getEntity($.initData.vueInstance.config.target_entity.name, function(domString) {
				list.html( domString );
				$.setListPosition(list);
			});
		});
		$('.target>.entity>ul').delegate('li', 'click', function() {
			$.initData.vueInstance.config.target_entity.name = $(this).html();
			$.initData.vueInstance.config.target_entity.id = $(this).attr('_id');
			var opts = {
				id: $.initData.vueInstance.config.target_entity.id, 
				callback: function(data) {
					$.initData.vueInstance.config.target_port.group = data;
				}
			};
			$.getPort(opts);
			$(this).parent().css('display', 'none');
		});
		$('.prepose').delegate('.entity>input', 'keyup', function() {
			var index = $(this).parents('li').index();
			var list = $(this).siblings('ul');
			$.initData.vueInstance.config.conditions[index].port.group = [];
			$.initData.vueInstance.config.conditions[index].port.selectedIndex = 0;
			$.initData.vueInstance.config.conditions[index].status = '';
			$.getEntity($.initData.vueInstance.config.conditions[index].entity.name, function(domString) {
				list.html( domString );
				$.setListPosition(list);
			});
		});
		$('.prepose').delegate('.entity>ul>li', 'click', function() {
			var index = $(this).parents('.deleparent').index();
			$.initData.vueInstance.config.conditions[index].entity.name = $(this).html();
			$.initData.vueInstance.config.conditions[index].entity.id = $(this).attr('_id');
			var opts = {
				id: $.initData.vueInstance.config.conditions[index].entity.id,
				callback: function(data) {
					$.initData.vueInstance.config.conditions[index].port.group = data;
				}
			};
			$.getPort(opts);
			$(this).parent().css('display', 'none');
		});
	},
	canBeSaved: function() {
		var res = true;
		$('.check').each(function() {
			var This = this;
			if ( $(this).attr('correct') === 'false' ) {
				res = false;
				$(This).css('border-color', '#fe787b');
				layer.tips('必填项', This, {
					tips: [1, '#fe787b'],
					end: function() {
						$(This).css('border-color', '#cccccc');
					}
				});
			}
		});
		return res;
	},
	hasExisted: function(portId, status, except) {
		var res = false;
		for (var i=0; i<$.initData.tableData.rows.length; i++) {
			if ( typeof except === 'number' && i === except ) {
				continue;
			}
			if (portId === $.initData.tableData.rows[i].gateway_data_id && status === $.initData.tableData.rows[i].status) {
				layer.msg( '当前所配置的目标端口以及所对应的目标状态存在于配置列表中，请勿重复配置！' ,{ icon: 2 });
				res = true;
			}
		}
		return res;
	},
	saveConfig: function() {
		$('.save-config').click(function() {
			if ( !$.canBeSaved() ) return;
			var sentData = {};
			if ( $.initData.conditionId ) {
				sentData.id = $.initData.conditionId;
				sentData.type = 'put';
				if ( $.hasExisted( $.initData.vueData.config.target_port.group[ $.initData.vueData.config.target_port.selectedIndex ].data_id, $.initData.vueData.config.target_status, $.initData.tableIndex ) ) {
					return;
				}
			} else {
				if ( $.hasExisted( $.initData.vueData.config.target_port.group[ $.initData.vueData.config.target_port.selectedIndex ].data_id, $.initData.vueData.config.target_status ) ) {
					return;
				}
				sentData.type = 'post';
			}
			sentData.mainData = {
				thing_name: $.initData.vueData.config.target_entity.name,
				thing_id: $.initData.vueData.config.target_entity.id,
				gateway_index: Number($.initData.vueData.config.target_port.selectedIndex),
				gateway_data_id: $.initData.vueData.config.target_port.group[ $.initData.vueData.config.target_port.selectedIndex ].data_id,
				company_id: $('#companyId').val(),
				status: $.initData.vueData.config.target_status,
				conditions: $.createConditionsData()
			};
			sentData.callback = function(data) {
				$('.table').bootstrapTable("refresh", $.queryParams);
				layer.msg(data.success, {
					icon: 1,
					end: function() {
						$('.config').addClass('hidden');
						$('.config-mask').addClass('hidden');
						$.initData.conditionId = '';
					}
				});
			}
			$.mainAjax(sentData);
		});
		
	},
	editConfig: function() {
//		$('.config-title-name').html('修改配置');
//		$('.config').removeClass('hidden');
//		$('.config-mask').removeClass('hidden');
		var index = $(this).parents('tr').index();
		$.initData.conditionId = $(this).attr('_id');
		$.initData.tableIndex = index;
		$.applyEditData(index);
	},
	deleteConfig: function() {
		var index = $(this).parents('tr').index();
		var portName = $(this).parents('tr').children().eq(0).html();
		var portStatus = $(this).parents('tr').children().eq(1).html();
		var pageNumber = $('.table').find('tbody').children().length;
		$.initData.conditionId = $(this).attr('_id');
		layer.confirm('<span style="color: red;">是否要删除前置条件配置？</span></br>端口【'+ portName +'】 / 状态【'+ portStatus +'】', {
			title: '删除配置',
			btn: ['删除','取消'] //按钮
		}, function(){
			var sentData = {
				id: $.initData.conditionId,
				type: 'delete',
				callback: function(data) {
					if (pageNumber === 1) {
						$('.table').bootstrapTable("prevPage");
					}
					$('.table').bootstrapTable("refresh", $.queryParams);
					layer.msg(data.success, {
						icon: 1,
						time: 1000,
						end: function() {
							layer.closeAll();
							$.initData.conditionId = '';
						}
					});
				}
			};
			$.mainAjax(sentData);
		}, function(){
			$.initData.conditionId = '';
		});
	},
	addCondition: function(type) {
		if (type) {
			$.initData.vueInstance.config.conditions.push( $.extend(true, {}, $.initData.origConfig) );
		} else {
			$.initData.vueInstance.config = {
				target_entity: {
					name: '',
					id: ''
				},
				target_port: {
					selectedIndex: 0,
					group: []
				},
				target_status: '',
				conditions: []
			}
			$.initData.vueInstance.config.conditions = [ $.extend(true, {}, $.initData.origConfig) ];
		}
	},
	getEntity: function(searchValue, callback) {
		$.ajax({
			type:"get",
			url:globalurl+"/v1/things?access_token="+accesstoken,
			async:true,
			data:{
				filter:"{'company_id':'"+$.initData.companyId+"'}",
				like:'{"thing_name":"'+searchValue+'"}'
			},
			success:function(data){
				var domString = $.createOptions(data.rows).entity();
				callback && callback(domString);
			}
		});
	},
	getPort: function(opts) {
//		var localData = $.getDataFromLocal(opts.id);
//		if ( localData ) {
//			opts.callback && opts.callback(localData);
//			return;
//		}
		$.ajax({
			type:"get",
			url:globalurl+"/v1/missionDataTags?access_token="+accesstoken+"&thing_id="+opts.id,
			async:true,
			data:{
				filter:JSON.stringify({ port_type: ['DO'] })
			},success:function(data){
//				$.initData.localStorage.push({
//					id: opts.id,
//					data: data
//				});
//				console.log($.initData.localStorage);
//				console.log(data);
				opts.callback && opts.callback(data);
			}
		});
	},
	mainAjax: function(sentData) {
		var url = !sentData.id ? globalurl+"/v1/preconditions?access_token="+accesstoken : globalurl+"/v1/preconditions/"+ sentData.id +"?access_token="+accesstoken;
		$.ajax({
			type: sentData.type,
			url: url,
			async: true,
			data: sentData.mainData ? 'data='+ JSON.stringify(sentData.mainData) +'' : '',
			success:function(data){
				if (data.code == 200) {
					sentData.callback && sentData.callback(data);
				} else {
					layer.msg(data.error, {
						icon: 2,
						time: 1000
					});
				}
			}
		});
	},
	createOptions: function(data) {
		var domString = '';
		return {
			entity: function() {
				data.forEach(function(each) {
					domString += '<li _id="'+ each._id +'">' + each.thing_name + '</li>';
				});
				return domString;
			},
			port: function() {
				
			}
		}
	},
	createConditionsData: function() {
		var resource = $.initData.vueInstance.config.conditions;
		var data = [];
		for (var i=0; i<resource.length; i++) {
			data.push({});
			data[i].type = Number(resource[i].type);
			data[i].condition_port_index = Number(resource[i].port.selectedIndex);
			data[i].condition_thing_name = resource[i].port.group[ resource[i].port.selectedIndex ] ? resource[i].entity.name : 0;
			data[i].condition_thing_id = resource[i].port.group[ resource[i].port.selectedIndex ] ? resource[i].entity.id : '';
			data[i].data_id = resource[i].port.group[ resource[i].port.selectedIndex ] ? resource[i].port.group[ resource[i].port.selectedIndex ].data_id : '';
			data[i].target_status = resource[i].port.group[ resource[i].port.selectedIndex ] ? resource[i].status : '';
			data[i].custom_name = resource[i].port_define;
			data[i].custom_status = resource[i].status_define;
		}
		return data;
	},
	applyEditData: function(index) {
		layer.load(3);
		var targetData = $.initData.tableData.rows[index];
		var number = targetData.list.filter(function(item) {
			return item.type === 1;
		}).length + 1;
		$.initData.vueData.config = {
			target_entity: {
				name: targetData.thing_name,
				id: targetData.thing_id
			},
			target_port: {
				selectedIndex: targetData.gateway_index,
				group: []
			},
			target_status: targetData.status,
			conditions: []
		};
		for (let i=0; i<targetData.list.length; i++) {
			$.initData.vueData.config.conditions.push({
				type: targetData.list[i].type,
				entity: {
					name: targetData.list[i].condition_thing_name,
					id: targetData.list[i].condition_thing_id
				},
				port: {
					selectedIndex: targetData.list[i].condition_port_index,
					group: []
				},
				status: targetData.list[i].target_status,
				port_define: targetData.list[i].custom_name,
				status_define: targetData.list[i].custom_status
			});
			if (targetData.list[i].type === 1) {
				var opts = {
					id: $.initData.vueData.config.conditions[i].entity.id,
					callback: function(data) {
						if (data) {
							number --;
							if (number === 0) {
								$('.config-title-name').html('修改配置');
								$('.config').removeClass('hidden');
								$('.config-mask').removeClass('hidden');
								layer.closeAll();
							}
						}
						$.initData.vueData.config.conditions[i].port.group = data;
					}
				};
				$.getPort(opts);
			}
		}
		var opts = {
			id: $.initData.vueData.config.target_entity.id, 
			callback: function(data) {
				if (data) {
					number --;
					if (number === 0) {
						$('.config-title-name').html('修改配置');
						$('.config').removeClass('hidden');
						$('.config-mask').removeClass('hidden');
						layer.closeAll();
					}
				}
				$.initData.vueData.config.target_port.group = data;
			}
		};
		$.getPort(opts);
	},
	setListPosition: function(list) {
		if (!list.html()) {
			list.css('display', 'none');
			return;
		}
		list.css('display', 'block');
		var target = list.siblings('input');
		var offsetParent = $('.config');
		var width = target.outerWidth();
		var height = target.outerHeight();
		var scrollTop = offsetParent.scrollTop();
		var disLeft = offsetParent.offset().left;
		var disTop = offsetParent.offset().top;
		var left = target.offset().left - disLeft;
		var top = target.offset().top + height - disTop + scrollTop;
		list.css({
			width: width,
			left: left,
			top: top
		});
	},
	getDataFromLocal: function(id) {
		var res;
		console.log($.initData.localStorage)
		$.initData.localStorage.forEach(function(item) {
			(item.id === id) && (res = item.data);
		});
		return res;
	}
});

$.init();
