var allData={
	today:'',
	filename:'',
	companyId:$("#companyId").val(),
	dateSetting:{
		format:'yyyy-mm-dd',
		startView:2,
		minView:2,
		maxView:4,
	},
	obj:'',
	newDate:new Date(),
	type:"",
	thingId:"",
	endTime:"",
	startDate:"",
	way:"run",
	ourl:"",
	columns:[],
	allRecordData:[]
};
$.fn.extend({
	editInner:function(){
		if($(this).find('input').length==0&&$(this).find('textarea').length==0){
			var text=$(this).text();
			var newDom=$('<input type="text" />')
			newDom.val(text);
			newDom.css({
				position:'absolute',
				left:$(this).offset().left, 
				top:$(this).offset().top,
				width:$(this).outerWidth(),
				height:$(this).outerHeight(),
				textIndent:7
			})
			$(this).text('');
			$(this).append(newDom);
			newDom.focus();
			newDom.blur(function(){
				$(this).hideInput();
			})
		}
	},
	hideInput:function(){
		var text=$(this).val();
		var parentTd=$(this).parent();
		$(this).remove();
		parentTd.text(text);
		$.saveForm();
	}
});
$.extend({
	init:function(){
		getToken();
		$.entityList("");
		$.selectEntity();
		$.getToday();
		$.dateInputInit();
		$.chioseDay();
		$.toolsClick();
		if(type=='day'){
			$('.today').click();
		}else{
			$('.thisMonth').click();
		}
		$.feshTable();
		
	},
	getToday:function(){
		allData.today=$.formatDate(allData.newDate)
	},
	formatDate:function(date,dayoffset,monthOffset){
		dayoffset=dayoffset?dayoffset:0;
		monthOffset=monthOffset?monthOffset:0;
		var y = date.getFullYear();  
	    var m = date.getMonth() + 1-monthOffset;  
	    m = m < 10 ? '0' + m : m;  
	    var d = date.getDate()-dayoffset;  
	    d = d < 10 ? ('0' + d) : d;  
	    return y + '-' + m + '-' + d; 
	},
	//获取开始时间以及结束时间
	startAendTime:function (data){
		if(data=="day"){
			allData.startDate=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1) + "-" + $.addZero(new Date().getDate());
			allData.endTime=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1) + "-" + $.addZero(new Date().getDate()+1)
		}else{
			allData.startDate=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+"-01";
			allData.endTime=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+2)+"-01";
		}
	},
	//yesterday
	Date:function(date){
		if(date=="yesterday"){
			allData.startDate=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+ "-" + $.addZero(new Date().getDate()-1);
			allData.endTime=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+ "-" + $.addZero(new Date().getDate());
		}else if(date=="beforeYesterday"){
			allData.startDate=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+ "-" + $.addZero(new Date().getDate()-2);
			allData.endTime=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+ "-" + $.addZero(new Date().getDate()-1);
		}else if(date=="lastMonth"){
			allData.startDate=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth())+"-01";
			allData.endTime=new Date().getFullYear() + "-" + $.addZero(new Date().getMonth()+1)+"-01";
		}
		
	},
	getForm:function(startDate){
		$('.table').empty();
		$.ajax({
			type:"get",
			url:globalurl+"/v1/forms/"+reportId,
			async:false,
			data:{
				reportDate:startDate,
				access_token:accesstoken,			
			},
			success:function(data){
				if(data.code==404){
					layer.msg(data.error,{icon:2})
				}else{
					allData.filename=data.form_name;
					if(data.way=="run"){
							var html=decodeURI(data.form_html);
							$('.table').append(html);
							var splitDate=allData.today.split('-')[0]+'-'+allData.today.split('-')[1]
							if(splitDate==data.save_time||allData.today==data.save_time||data.save_time==undefined){
								$.editClick();
							}
						    $('.onlyReadDate').text($('.date').val())
					}else{
						allData.way=data.way;
						if(allData.way=="operate"){
							allData.ourl=globalurl + "/v1/gatewayCounts";
							allData.columns=$.columns()[0]
						}else if(allData.way=="alarm"){
							allData.ourl=globalurl + "/v1/alarmCounts";
							allData.columns=$.columns()[1]
						}
						allData.type=data.type;
						$.startAendTime(data.type);
						$.monthTable();
					}
				
				}
			}
		});
	},
	dateInputInit:function(){
		if(type=='day'){
			allData.dateSetting.format='yyyy-mm-dd';
			allData.dateSetting.startView=2;
			allData.dateSetting.minView=2;
			allData.dateSetting.maxView=4;
		}else if(type=='month'){
			allData.dateSetting.format='yyyy-mm';
			allData.dateSetting.startView=3;
			allData.dateSetting.minView=3;
			allData.dateSetting.maxView=4;
		}
		allData.obj=$('#datetimepicker').datetimepicker({
			format:allData.dateSetting.format,
			language:'zh-CN',
			initialDate:allData.newDate,
			endDate:allData.newDate,
			startView:allData.dateSetting.startView,
			minView:allData.dateSetting.minView,
			maxView:allData.dateSetting.maxView,
			todayHighlight:true,
			autoclose:true
		}).on('hide', function(ev){
     		var selectDay=$('.date').val()
     		if(type=='day'){
   				var yesterday=$.formatDate(allData.newDate,1);
     			var beforeYesterday=$.formatDate(allData.newDate,2);
     			if(selectDay==allData.today){
	   				$('.today').click();
     			}
     			else if(selectDay==yesterday){
     				$('.yesterday').click();
     			}else if(selectDay==beforeYesterday){
     				$('.beforeYesterday').click();
     			}else{
     				if(allData.way=="run"){
     					$.getForm(selectDay)
     				}else{
     					var num = ev.date;
						allData.startDate= new Date(num).getFullYear() + "-" + $.addZero(new Date(num).getMonth() + 1) + "-" + $.addZero(new Date(num).getDate());
						allData.endTime= new Date(num).getFullYear() + "-" + $.addZero(new Date(num).getMonth() + 1) + "-" + $.addZero(new Date(num).getDate()+1);
						$('#reportForm').bootstrapTable("refresh", $.queryParams)
     				}  				
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}
     			
     		}else if(type=='month'){
     			var thisMonth=$.formatDate(allData.newDate)
     			var newThisMonth=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1]
     			var lastMonth=$.formatDate(allData.newDate,0,1)
     			var newLastMonth=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1]
     			if(selectDay==newThisMonth){
     				$('.thisMonth').click()
     			}else if(selectDay==newLastMonth){
     				$('.lastMonth').click();
     			}else{
     				if(allData.way=="run"){
     					$.getForm(selectDay)
     				}else{
     					var num = ev.date;
						allData.startDate= new Date(num).getFullYear() + "-" + $.addZero(new Date(num).getMonth() + 1) + "-" + "01";
						allData.endTime= new Date(num).getFullYear() + "-" + $.addZero(new Date(num).getMonth() + 2) + "-" + "01";
						$('#reportForm').bootstrapTable("refresh", $.queryParams)
     				}  				
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}     			
     		}
		})
},
	editClick:function(){
		$('.write').click(function(){
			$(this).editInner();
		})
	},
	chioseDay:function(){		//选择时间
		$('.portTiile').delegate('button','click',function(ev){
			ev.stopPropagation();
			var buttomClass=$(this).attr('class');
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
			switch(buttomClass)
			{
				case 'today':
					$.fastGetForm().todayForm();
					break;
				case 'yesterday':
					$.fastGetForm().yesterdayForm();
					break;
				case 'beforeYesterday':
					$.fastGetForm().beforeYesterdayForm();
					break;
				case 'thisMonth':
					$.fastGetForm().thisMonthForm();
					break;
				case 'lastMonth':
					$.fastGetForm().lastMonthForm();
					break;
			}
		})
	},
	fastGetForm:function(){
		return {
			todayForm:function(){
				$('#datetimepicker').val(allData.today);			
				if(allData.way=="run"){
					$.getForm(allData.today);
				}else{
					allData.type="day"
					$.startAendTime("day");
					$.monthTable();
					$('#reportForm').bootstrapTable("refresh", $.queryParams);
				}			
			},
			yesterdayForm:function(){
				var yesterday=$.formatDate(allData.newDate,1,0);
				$('.date').val(yesterday);
				if(allData.way=="run"){
					$.getForm(yesterday);
				}else{
					$.Date("yesterday")
					$('#reportForm').bootstrapTable("refresh", $.queryParams);
				}										
			},
			beforeYesterdayForm:function(){
				var beforeYesterday=$.formatDate(allData.newDate,2,0);
				$('.date').val(beforeYesterday);				
				if(allData.way=="run"){
					$.getForm(beforeYesterday);
				}else{
					$.Date("beforeYesterday")
					$('#reportForm').bootstrapTable("refresh", $.queryParams);
				}	
			},
			thisMonthForm:function(){
				var thisMonth=$.formatDate(allData.newDate)
				var sendDate=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1];
				$('.date').val(sendDate);
				if(allData.way=="run"){
					$.getForm(sendDate);
				}else{
					allData.type="month"
					$.startAendTime("month");
					$.monthTable();
					$('#reportForm').bootstrapTable("refresh", $.queryParams);
				}							
			},
			lastMonthForm:function(){
				var lastMonth=$.formatDate(allData.newDate,0,1)
				var sendDate=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1];
				$('.date').val(sendDate);
				if(allData.way=="run"){
					$.getForm(sendDate);
				}else{
					$.Date("lastMonth")
					$('#reportForm').bootstrapTable("refresh", $.queryParams);
				}
				
				
			}
		}
	},
	toolsClick:function(){
		$('.portTiile').delegate('.tools','click',function(){
			if($(this).hasClass('print')){
				$.tableTools().print();
			}else if($(this).hasClass('excel_o')){
				$.tableTools().excel();
			}
		})
		
	},
	tableTools:function(){		//打印导出工具
		return{
			print:function(){
//手写打印功能
//				var headDom=$('head')[0].outerHTML; 
//				var newWin= window.open("","","_self");//新打开一个空窗口
//				newWin.document.write(headDom+$('.table')[0].outerHTML);
//			    newWin.document.close();//在IE浏览器中使用必须添加这一句
//			    newWin.focus();//在IE浏览器中使用必须添加这一句
//			    setTimeout(function(){
//			    	 newWin.print();//打印
//			    	 newWin.close();//关闭窗口
//			    },300)	
				$('.tableContent').printThis({ 
				    debug: false, 
				    importCSS: true, 
				    importStyle: true, 
				    printContainer: true, 
					//loadCSS: "/css/report_form.css", 
				    pageTitle: "二维码", 
				    removeInline: false, 
				    printDelay: 333, 
				    header: null, 
				    formValues: false,
				    doctypeString: '<!DOCTYPE html>'
				   });
			},
			excel:function(){
				excel_o.href= tableToExcel('reportForm')
				$("#excel_o").attr("download",allData.filename)
			}
		}
	},
	saveForm:function(){
		var tableStr=$('.table')[0].innerHTML
		var save_time;
		if(type=='day'){
			save_time=allData.today
		}else if(type=='month'){
			save_time=allData.today.split("-")[0]+"-"+allData.today.split("-")[1]
		}
		$.ajax({
			type:"post",
			url:globalurl+"/v1/forms/",
			async:true,
			data:{
				access_token:accesstoken,
				data:'{"way":"run","company_id":"'+allData.companyId+'","form_html":"'+encodeURI(tableStr)+'","form_name":"'+allData.filename+'","form_template_id":"'+reportId+'","save_time":"'+save_time+'"}'
			},
			success:function(data){
			}
		});
	},
	//获取操作报表，客户端的分页
	monthTable:function(){
		$('#reportForm').bootstrapTable({
		method: 'get',
		url: allData.ourl,
		sidePagination: 'client', //设置为服务器端分页
		pagination: true, //是否分页
		search: false, //显示搜索框
		pageSize: 10, //每页的行数 
		pageNumber: 1,
		showRefresh: false,
		showToggle: false,
		showColumns: false,
		pageList: [10, 15, 20, 25],
		queryParams: $.queryParams,
		striped: true, //条纹
		onLoadSuccess: function(value) {
			if (value.code == 400005) {
				getlogTable();
				$('#reportForm').bootstrapTable("refresh", $.queryParams)
				$.colorBorder();
			}
		},
		responseHandler: function(data){
		     return data.rows;
		},
		columns:allData.columns
		})
	},
	//数据请求参数
	queryParams:function(params){
		var data=JSON.stringify({
				pageNumber: 0,
				pageSize: params.limit,
				type:allData.type,
				start_time:allData.startDate+" 00:00:00",
				end_time:allData.endTime+" 00:00:00",
				thing_id:allData.thingId
			})
		return {
			data:data,
			access_token:accesstoken,
		}
	},
	//列表参数
	columns:function(){
		return [
				[
	                    {
	                        title: "设备名",
	                        field: "device_name",
	                        valign:"middle",
	                        align:"left",
	                  
	                    },
						{
	                        field: "data_name",
	                        title: "端口",
	                        valign:"middle",
	                        align:"left",	               
	                   },	       
						{
	                        field: "all_count",
	                        title: "下发次数",
	                        valign:"middle",
	                        align:"left",	               
	                    },
						{
	                        field: "success_count",
	                        title: "成功次数",
	                        valign:"middle",
	                        align:"left",	               
	                    },
						{
	                        field: "fail_count",
	                        title: "失败次数",
	                        valign:"middle",
	                        align:"left",	               
	                    }
	            ],
	            [
	                    {
	                        title: "设备名",
	                        field: "device_name",
	                        valign:"middle",
	                        align:"left",
	                  
	                    },
						{
	                        field: "data_name",
	                        title: "端口",
	                        valign:"middle",
	                        align:"left",	               
	                   },	       
						{
	                        field: "alarm_count",
	                        title: "报警次数",
	                        valign:"middle",
	                        align:"left",	               
	                    }
	            ]
		]
	},
	//获取实体列表
	entityList:function(callBack){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/things",
			async:false,
			crossDomain: true == !(document.all),
			data:{
				"company_id":allData.companyId,
				access_token:accesstoken,
				like:'{"thing_name":"'+callBack+'"}'
			},
			success:function(data){
				$(".compareThingList").show();
				$(".compareThingList").empty();
				if(data.rows.length>0){
					for(var i=0;i<data.rows.length;i++){
						$(".compareThingList").append($('<li class="thingLi" value="'+data.rows[i]._id+'">'+data.rows[i].thing_name+'</li>'));
					}
//					$(".selectEntity").val(data.rows[0].thing_name)
					$(".compareThingList").css("border-color","#E7E7E7");
				}else{
					$(".compareThingList").append($('<li class="thingLi" value=0>未查询到该实体！</li>'));
					$(".compareThingList").css("border-color","red");
				}
				$.feshTable();
				
			}			
		});				
	},
	//选择实体
	selectEntity:function(){
		$(".compareThingList").hide();
		$(".selectEntity").val($(".compareThingList .thingLi:nth-child(1)").html())
		allData.thingId=$(".compareThingList .thingLi:nth-child(1)").attr("value");
		$(".selectEntity").keyup(function(){	//实体名称输入框keyUp
			$.entityList($(this).val());
			$.empty($(this))
		});	
	},
	//选择实体刷新列表
	feshTable:function(){
		$(".compareThingList li").on("click",function(){
			$(".selectEntity").val($(this).html())
			$(".compareThingList").hide();
			allData.thingId=$(this).attr("value");
			$('#reportForm').bootstrapTable("refresh", $.queryParams);
		});
	},
	empty:function(obj){		
		obj.val(obj.val().replace(/\s/g, ''))	
	},
	addZero: function(s) {
		return s < 10 ? '0' + s : s;
	}
	
});
$.init();

