$.allData={
	manualData:{
		device_code:'',
		device_name:'',
		company_id:$('#companyId').val(),
		company_code:$('#companyCode').val(),
		device_kind:3,
		status:1
	},
	dataConfigs:[],
	access_token:'',
	inputCheck:true,			//input框验证是否通过
	device_id:$('#deviceId').val(),
};

var $extend=$.fn.extend({
	deleteData:function(index,event){
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		$.allData.dataConfigs.splice(index,1)
	},
	//空格限制输入
	limitSpacing: function() {
		$(this).keyup(function() {
			$(this).val($(this).val().replace(/\s/g, ''));
		});
	},
	formCheckFoo:function(){
		$.allData.inputCheck=true
		if($(this).val()==''){
			var This=$(this)
			$(this).focus();
			layer.tips(This.attr("placeholder"),This,{tips: [1,'#FE777A']})
			$.allData.inputCheck=false
		}
		return $.allData.inputCheck;
	},
});

$.extend({
	init:function(){
		var vmDevice = new Vue({
			el:'#vue',
			data:$.allData,
			methods:$extend
		})
		getToken();
		$.allData.access_token = accesstoken;
		$.getDevice();
		$('[data-toggle="tooltip"]').tooltip();
		$('.addPort').click(function(){
			$.addPort();
		});
		$('#main-submit').click(function(){
			$('.dataInfo input').each(function(){
				if($(this).attr('ischeck')!='false'){
					var overEach=$(this).formCheckFoo();
						if(overEach==false){
							return false;
						}
				}
			})
			if($.allData.inputCheck){
				$.saveDevice();
			}
		});
		$('input').limitSpacing();		//输入框去除空格
	},
	addPort:function(){
		var dataConfig={'data_name':'','data_unit':'','port_type':'MO','status':1};
		$.allData.dataConfigs.push(dataConfig);
		$('[data-toggle="tooltip"]').tooltip();
	},
	saveDevice:function(){
		var sendType,sendDevUrl;
		if($.allData.device_id==''){
			sendType='POST';
			sendDevUrl=globalurl+"/v1/devices"
		}else{
			sendType='PUT';
			delete $.allData.manualData._id;
			sendDevUrl= globalurl+"/v1/devices/"+$.allData.device_id
		}
		$.ajax({
			type:sendType,
			dataType:'JSON',
			url:sendDevUrl,
			async: true,
			crossDomain: true == !(document.all),
			data: {
				access_token: $.allData.access_token,
				data: JSON.stringify($.allData.manualData)
			},
			success:function(data){
				if(data._id){
					$.allData.device_id=data._id
				}
				if(data.code==200){
					$.ajax({
						type: sendType,
							dataType: "json",
							url: globalurl+"/v1/devices/"+$.allData.device_id+"/dataConfigs",
							async: true,
							crossDomain: true == !(document.all),
							data: {
								access_token: $.allData.access_token,
								data: JSON.stringify($.allData.dataConfigs)
							},
							success:function(data){
								if(data.code==200){
									layer.msg(data.success,{
										icon:1,
										end:function(){
											self.location.href='/finfosoft-water/dataTag/manualEntry/'
										}
										})
								}
							}
					});
				}
			}
		})
	},
	getDevice:function(){
		if($.allData.device_id!=''){
			$.ajax({
				type: "get",
				dataType: "json",
				url: globalurl+"/v1/devices/"+$.allData.device_id,
				async: true,
				crossDomain: true == !(document.all),
				data: {
					access_token:$.allData.access_token
				},                                                                                                                                                                                                                                                                                
				success: function(data) {
					$.allData.manualData=data
				}
			});
			$.ajax({
				type: "get",
				dataType: "json",
				url: globalurl+"/v1/devices/"+$.allData.device_id+"/dataConfigs",
				async: true,
				crossDomain: true == !(document.all),
				data: {
					access_token: $.allData.access_token,
					filter: JSON.stringify({device_id: $.allData.device_id})
				},
				success: function(data) {
					$.allData.dataConfigs=data.rows
				}
			});
		}
	}
});

$.init();
