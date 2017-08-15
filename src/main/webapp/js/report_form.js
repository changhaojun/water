var allData={
	today:'',
	filename:'',
	dateSetting:{
		format:'yyyy-mm-dd',
		startView:2,
		minView:2,
		maxView:4,
	},
	obj:'',
	newDate:new Date()
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
//		$.getToday();
		$.dateInputInit();
//		$.onChangeDate();
		$.chioseDay();
//		if(type=='day'){
//			$('.today').click();
//		}else{
//			$('.thisMonth').click();
//		}
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
	getForm:function(startDate){
		$('.table').empty();
		$.ajax({
			type:"get",
			url:globalurl+"/v1/forms/"+reportId,
			async:false,
			data:{
				reportDate:startDate
			},
			success:function(data){
				if(data.code==404){
					layer.msg(data.error,{icon:2})
				}else{
					var html=decodeURI(data.form_html);
					$('.table').append(html);
					var splitDate=allData.today.split('-')[0]+'-'+allData.today.split('-')[1]
					if(splitDate==data.save_time||allData.today==data.save_time||data.save_time==undefined){
						$.editClick();
					}
					allData.filename=data.form_name;
				    $('.onlyReadDate').text($('.date').val())
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
		}).on('changeDate', function(ev){
			console.info(ev)
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
     				$.getForm(selectDay)
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}
//   		}else if(type=='month'){
//   			var thisMonth=$.formatDate(allData.newDate)
//   			var newThisMonth=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1]
//   			var lastMonth=$.formatDate(allData.newDate,0,1)
//   			var newLastMonth=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1]
//   			if(selectDay==newThisMonth){
//   				$('.thisMonth').click()
//   			}else if(selectDay==newLastMonth){
//   				$('.lastMonth').click();
//   			}else{
//   				$.getForm(end.format('YYYY-MM'))
//   				$('.portTiile').find('button').each(function(){
//   					if($(this).hasClass('activeBtn')){
//   						$(this).removeClass('activeBtn');
//   					}
//   				})
//   			}
     		}
		})
	},
	onChangeDate:function(){
//		$('.date').change(function(){
			var selectDay=$('#datetimepicker').val()
			console.info(selectDay)
//			var selectDay=$('.date').val()
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
     				$.getForm(selectDay)
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}
//   		}else if(type=='month'){
//   			var thisMonth=$.formatDate(allData.newDate)
//   			var newThisMonth=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1]
//   			var lastMonth=$.formatDate(allData.newDate,0,1)
//   			var newLastMonth=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1]
//   			if(selectDay==newThisMonth){
//   				$('.thisMonth').click()
//   			}else if(selectDay==newLastMonth){
//   				$('.lastMonth').click();
//   			}else{
//   				$.getForm(end.format('YYYY-MM'))
//   				$('.portTiile').find('button').each(function(){
//   					if($(this).hasClass('activeBtn')){
//   						$(this).removeClass('activeBtn');
//   					}
//   				})
//   			}
     		}
//		})
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
				console.info(1)
					$.fastGetForm().todayForm();
					break;
				case 'yesterday':
				console.info(2)
					$.fastGetForm().yesterdayForm();
					break;
				case 'beforeYesterday':
				console.info(3)
					$.fastGetForm().beforeYesterdayForm();
					break;
				case 'thisMonth':
				console.info(4)
					$.fastGetForm().thisMonthForm();
					break;
				case 'lastMonth':
				console.info(5)
					$.fastGetForm().lastMonthForm();
					break;
			}
		})
	},
	fastGetForm:function(){
		$.getToday();
		return {
			todayForm:function(){
//				console.info(allData.today)
//				$('#datetimepicker').datetimepicker('setEndDate', '2012-01-01');
				$('#datetimepicker').val(allData.today);
				$.onChangeDate();
				$.getForm(allData.today);
			},
			yesterdayForm:function(){
				var yesterday=$.formatDate(allData.newDate,1,0);
				$('.date').val(yesterday);
				$.getForm(yesterday);
			},
			beforeYesterdayForm:function(){
				var beforeYesterday=$.formatDate(allData.newDate,2,0);
				$('.date').val(beforeYesterday);
				$.getForm(beforeYesterday);
			},
			thisMonthForm:function(){
				var thisMonth=$.formatDate(allData.newDate)
				var sendDate=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1];
				$('.date').val(sendDate);
				$.getForm(sendDate);
			},
			lastMonthForm:function(){
				var lastMonth=$.formatDate(allData.newDate,0,1)
				var sendDate=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1];
				$('.date').val(sendDate);
				$.getForm(sendDate);
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
				    importStyle: false, 
				    printContainer: true, 
					//loadCSS: "/css/report_form.css", 
				    pageTitle: "二维码", 
				    removeInline: false, 
				    printDelay: 333, 
				    header: null, 
				    formValues: false
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
				data:'{"form_html":"'+encodeURI(tableStr)+'","form_name":"'+allData.filename+'","form_template_id":"'+reportId+'","save_time":"'+save_time+'"}'
			},
			success:function(data){
			}
		});
	}
});
$.init();

