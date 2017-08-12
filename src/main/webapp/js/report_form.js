var allData={
	today:'',
	filename:'',
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
		$.today();
		$.dateInputInit();
		$.chioseDay();
		if(type=='day'){
			$('.today').click();
		}else{
			$('.thisMonth').click();
		}
		$.toolsClick();
	},
	today:function(){
		var dateObj=new Date();
		allData.today=$.formatDate(dateObj)
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
		$('.date').daterangepicker({
            singleDatePicker: true,
            startDate: moment().startOf('day'),
            todayHighlight:true,
            initialDate:new Date(),
			maxDate: moment(),
			locale : {
				format : 'YYYY-MM-DD',
                applyLabel : '确定',
                cancelLabel : '取消',
                fromLabel : '起始时间',
                toLabel : '结束时间',
                customRangeLabel : '自定义',
                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                monthNames : [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
                firstDay : 1
            }
     },function(start, end, label){
     		var newDate=new Date();
     		var selectDay=end.format('YYYY-MM-DD')
     		if(type=='day'){
     			$('.date').val(selectDay)
     			var yesterday=$.formatDate(newDate,1);
     			var beforeYesterday=$.formatDate(newDate,2);
     			if(selectDay==allData.today){
     				$('.today').click();
     			}
     			else if(selectDay==yesterday){
     				$('.yesterday').click();
     			}else if(selectDay==beforeYesterday){
     				$('.beforeYesterday').click();
     			}else{
     				$.getForm(end.format('YYYY-MM-DD'))
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}
     		}else if(type=='month'){
     			var splitDate=selectDay.split('-')[0]+'-'+selectDay.split('-')[1]
     			$('.date').val(splitDate)
     			var thisMonth=$.formatDate(newDate)
     			var newThisMonth=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1]
     			var lastMonth=$.formatDate(newDate,0,1)
     			var newLastMonth=lastMonth.split('-')[0]+'-'+lastMonth.split('-')[1]
     			if(splitDate==newThisMonth){
     				$('.thisMonth').click()
     			}else if(splitDate==newLastMonth){
     				$('.lastMonth').click();
     			}else{
     				$.getForm(end.format('YYYY-MM'))
     				$('.portTiile').find('button').each(function(){
     					if($(this).hasClass('activeBtn')){
     						$(this).removeClass('activeBtn');
     					}
     				})
     			}
     		}
     		
     });
	},
	editClick:function(){
		$('.write').click(function(){
			$(this).editInner();
		})
	},
	chioseDay:function(){		//选择时间
		$('.portTiile').delegate('button','click',function(){
			var buttomClass=$(this).attr('class');
			$(this).addClass('activeBtn');
			$(this).siblings().removeClass('activeBtn');
			var This=$(this);
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
		var newDate=new Date();
		return {
			todayForm:function(){
				$('.date').val(allData.today);
				$.getForm(allData.today);
			},
			yesterdayForm:function(){
				var yesterday=$.formatDate(newDate,1,0);
				$('.date').val(yesterday);
				$.getForm(yesterday);
			},
			beforeYesterdayForm:function(){
				var beforeYesterday=$.formatDate(newDate,2,0);
				$('.date').val(beforeYesterday);
				$.getForm(beforeYesterday);
			},
			thisMonthForm:function(){
				var thisMonth=$.formatDate(newDate)
				var sendDate=thisMonth.split('-')[0]+'-'+thisMonth.split('-')[1];
				$('.date').val(sendDate);
				$.getForm(sendDate);
			},
			lastMonthForm:function(){
				var lastMonth=$.formatDate(newDate,0,1)
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

