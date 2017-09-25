$.allData={
	computedData:{
		device_code:'',
		device_name:'',
		company_id:$('#companyId').val(),
		company_code:$('#companyCode').val(),
		device_kind:4,
		oper_type:1,
		status:1
	},
	dataConfigs:[

	],
	dataConfig:{
		data_name:'',
		calculate_formula:[],
		status:1,
		tag_id:'',
		tag_name:'',
		port_type:'CD'
	},
	tags:[],
	ports:[],
	selectPort:'',
	access_token:'',
	chioseIndex:0,
	inputCheck:true,			//input框验证是否通过
	device_id:$('#deviceId').val(),
	dataIndex:999
};

var $extend=$.fn.extend({
	openDataBox:function(titleMsg){
		dataBox=layer.open({
			type: 1,
			title: titleMsg,
			shadeClose: false,
			shade: [0.7,'#ffffff'],
			area: ['860px'],
			content: $('.dataBox'), //iframe的url
			cancel: function(dataBox, layero){ 
			    layer.close(dataBox);
			    $('.tagList').hide();
			  	return false; 
			}
		})
	},
	getThing:function(){		//获取触发条件的实体列表
		var selectUl=$(this).next();
		$.ajax({
			type:"get",
			url:globalurl+"/v1/things?access_token="+$.allData.access_token,
			async:false,
			data:{
				like:'{"thing_name":"'+$(this).val()+'"}'
			},
			success:function(data){
				selectUl.show();
				selectUl.empty();
				if(data.rows.length>0){
					for(var i=0;i<data.rows.length;i++){
						selectUl.append($('<li class="thingLi" thing_id="'+data.rows[i]._id+'">'+data.rows[i].thing_name+'</li>'));
					}
					selectUl.css("border-color","#E7E7E7");
				}else{
					selectUl.append($('<li class="thingLi" thing_id=0>未查询到该实体！</li>'));
					selectUl.css("border-color","red");
				}
			}
		});
	},
	changeThing:function(){	//选择实体后执行
		var parent=$(this).parent();
		var parentInput=parent.prev();
		var classType=$(this).attr('class');
		var thingId=$(this).attr('thing_id');
		if(classType=="thingLi"){
			parent.attr("thing_id",thingId);
			parent.getTagList();
			parentInput.val($(this).text());
			parent.empty();
			parent.hide();
		}
	},
	getTagList:function(){		//选择实体后获取该实体下标签的列表
		var tagSelect;
		tagSelect=$(this).parent().next().find("select");
		var thingId;
		thingId=$(this).attr('thing_id');
		$.ajax({
			type:"get",
			url:globalurl+"/v1/missionDataTags?access_token="+$.allData.access_token+"&thing_id="+thingId,
			async:false,
			data:{
//				filter:'{"port_type":"AI","port_type_1":"MO"}'
//				filter:''
			},success:function(data){
				if(data.length>0){
					$.allData.ports=data
				}
			}
		});
	},
	selectTag:function(){
		if($(this).val()!=0){
			var selectData=$(this).find("option:selected").text();
			var value=$.allData.selectPort;
			var formula={
				"data_name":selectData,
				"class_name":"dataTag",
				"data_tag":value
				
			};
			$.allData.dataConfig.calculate_formula.push(formula);
		}
	},
	addSign:function(){
			var selectSign=$(this).text();
			var formula={
				"data_name":selectSign,
				"class_name":"selectSign",
				"dataTag":selectSign
				
			};
			$.allData.dataConfig.calculate_formula.push(formula);
		
	},
	editPort:function(index,event){
		$.allData.dataIndex=index;
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		$.allData.dataConfig = $.allData.dataConfigs[index]
		var titleMsg="修改计算公式"
		$This.openDataBox(titleMsg)
	},
	deletePort:function(index,event){
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
	showTags:function(index,event){
		$.allData.chioseIndex = index;
		var $This = typeof event==="undefined" ? $(this) : $(event.currentTarget);
		$('.tagList').show(200)
		$('.tagList').css({left:$This.offset().left,top:($This.offset().top+$This.height()-$(window).scrollTop())});
	},
	chioseTag:function(index){
		$.allData.dataConfig.tag_id = this.tags[index]._id;
		$.allData.dataConfig.tag_name = this.tags[index].tag_name; 
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
		});
		getToken();
		$.allData.access_token = accesstoken;
		$.addPort();
		$.getTag();
		$('input').limitSpacing();		//输入框去除空格
		$(document).delegate('*','click',function(ev){
			if($(ev.target).attr('class')==='analogInput'){
				$('.analogCursor').removeAttr("hidden")
			}else{
				$('.analogCursor').attr("hidden","hidden")
			}
			return false;
		});
		$(".thing").keyup(function(){
			$(this).getThing();
		});
		$("ul").delegate("li","click",function(){
			$(this).changeThing();
		});
		$('.conditionTag').change(function(){
			$(this).selectTag();
		});
		$('.sign').click(function(){
			$(this).addSign();
		});
		$('.saveBtn').click(function(){
			$('.dataBox input').each(function(){
				if($(this).attr('ischeck')!='false'){
					var overEach=$(this).formCheckFoo();
						if(overEach==false){
							return false;
						}
				}
			})
			if($.allData.inputCheck){
				if($.allData.dataConfig.calculate_formula.length==0){
					$.allData.inputCheck=false;
					layer.tips("请书写公式后再进行保存",$('.analogInput'),{tips: [1,'#FE777A']})
				}else{
					$.allData.inputCheck=true
				}
			}
			if($.allData.inputCheck){
				$.saveDataConfig();
			}
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
		$(document).keydown(function (event) {
			if($('.analogCursor').attr("hidden")==undefined){ 
				event.preventDefault();
				if(event.keyCode==8){
					if($('.analogCursor').prev().prop('tagName')=='DIV'){
						var deleteIndex=$('.analogCursor').index()-1
						$.allData.dataConfig.calculate_formula.splice(deleteIndex,1)
					}
				}else if(event.keyCode==37){
					if($('.analogCursor').prev().prop('tagName')=='DIV'){
						$('.analogCursor').insertBefore($('.analogCursor').prev())
					}
				}else if(event.keyCode==39){
					if($('.analogCursor').next().prop('tagName')=='DIV'){
						$('.analogCursor').insertAfter($('.analogCursor').next())
					}
				}
			}
		});
		$.getDevice();
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
		$('.addPort').click(function(){
			var titleMsg="新增计算公式"
			$.allData.dataConfig={
				data_name:'',
				calculate_formula:[],
				status:1,
				tag_id:'',
				tag_name:'',
				port_type:'CD'
			};
			$.allData.ports=[];
			$.allData.dataIndex=999;
			$(this).openDataBox(titleMsg)
		})
	},
	saveDataConfig:function(){
		if($.allData.dataIndex==999){
			$.allData.dataConfigs.push($.allData.dataConfig);
		}else{
			$.allData.dataConfigs.splice($.allData.dataIndex,1,$.allData.dataConfig)
		}
		layer.close(dataBox);
	},
	saveDevice:function(){
		var sendType,sendDevUrl;
		if($.allData.device_id==''){
			sendType='POST';
			sendDevUrl=globalurl+"/v1/devices"
		}else{
			sendType='PUT';
			delete $.allData.computedData._id;
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
				data: JSON.stringify($.allData.computedData)
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
											self.location.href='/dataTag/computedEntry/'
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
					$.allData.computedData=data
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
