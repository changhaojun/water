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
	tags:[],
	access_token:'',
	inputCheck:true,//input框验证是否通过
	chioseIndex:0,
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
	//非数字限制输入
	numOnly: function() {
		$(this).keyup(function() {
			if(!$(this).attr('num-limit')) return false;
			$(this).val($(this).val().replace(/[^0-9-]/g, ''));
			eval('allData.'+$(this).attr('datasrc')+'=Number($(this).val())');
		});
	},
	showTags:function(index,event){
		$.allData.chioseIndex = index;
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		$('.tagList').show(200)
		$('.tagList').css({left:$This.offset().left,top:($This.offset().top+$This.height()-$(window).scrollTop())});
	},
	chioseTag:function(index){
		this.dataConfigs[$.allData.chioseIndex].tag_id = this.tags[index]._id;
		this.dataConfigs[$.allData.chioseIndex].tag_name = this.tags[index].tag_name; 
		$('.tagList').hide(200)
	},
	addTag:function(){
		layer.prompt({
			title: '输入新的分组标签',
			formType: 0
		}, function(pass, index) {	
			$.ajax({
				type:"post",
				url:globalurl+"/v1/tags",
				async:true,
				data:{
					access_token:$.allData.access_token,
					data:'{"company_id":"'+$('#companyId').val()+'","tag_name":"'+pass+'"}'
				},
				success:function(data){
					if(data.code==200){
						layer.close(index);
						layer.msg('添加成功',{icon:1,zIndex:99999999});
						delete data.code;
						$.allData.tags.unshift(data)
					}else{
						layer.msg(data.error,{icon:2,zIndex:99999999});
					}
				}
			});
		});
	},
	removeTag:function(index,event){
		event.stopPropagation();
		$.ajax({
			type:'delete',
			url:globalurl+'/v1/tags/'+$.allData.tags[index]._id+'?access_token='+$.allData.access_token,
			async:true,
			success:function(data){
				console.log(this.tags)
				if(data.code==200){
					$.allData.tags.splice(index,1)
					layer.msg(data.success,{icon:1,zIndex:99999999})
				}else{
					layer.msg(data.error,{icon:2,zIndex:99999999})
				}
			}
		});
	}
});

$.extend({
	init:function(){
		var vmDevice = new Vue({
			el:'#vue',
			data:$.allData,
			methods:$extend
		})
		getToken();
		$('input').filter('[num-limit=limit]').numOnly();
		$.allData.access_token = accesstoken;
		$.getDevice();
		$.getTag();
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
	getTag:function(){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/tags",
			async:true,
			data:{
					access_token:$.allData.access_token,
					filter:'{"company_id":"'+$('#companyId').val()+'"}'
			},
			success:function(data){
				$.allData.tags=data.rows
			}
		});
	},
	addPort:function(){
		var dataConfig={
			data_name:'',
			data_unit:'',
			port_type:'MO',
			tag_id:'',
			tag_name:'',
			data_value:0,
			status:1
		};
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
											self.location.href='/dataTag/manualEntry/'
										}
										})
								}else if(data.code==400018){
									layer.msg(data.error,{icon: 2,});
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
