
function addclick(){
	$('table').delegate('.write','click',function(){
		console.info($(this).text('点击了'))
		$(this).css('color','red')
	})
}

$.fn.extend({
	
});
////日期格式化
//var formatDate = function (date) {  
//  var y = date.getFullYear();  
//  var m = date.getMonth() + 1;  
//  m = m < 10 ? '0' + m : m;  
//  var d = date.getDate();  
//  d = d < 10 ? ('0' + d) : d;  
//  return y + '-' + m + '-' + d;  
//}; 
$.extend({
	init:function(){
//		$.toDay();
		$.dateInputInit();
		$.getForm();
	},
//	toDay:function(){
//		var dateObj=new Date();
//		var dateFm=$.formatDate(dateObj)
//		console.info(dateFm)
//	},
//	formatDate:function(){
//		var y = date.getFullYear();  
//	    var m = date.getMonth() + 1;  
//	    m = m < 10 ? '0' + m : m;  
//	    var d = date.getDate();  
//	    d = d < 10 ? ('0' + d) : d;  
//	    return y + '-' + m + '-' + d; 
//	},
	getForm:function(startDate){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/formTemplates/"+reportId,
			async:true,
			data:{
				reportDate:startDate
			},
			success:function(data){
				var html=decodeURI(data.form_html)
				$('.table').append(html)
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
      		$.getForm(end.format('YYYY-MM-DD'))
      });
	}
});
$.init();

