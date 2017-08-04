var allData={
	access_token:'',
}
$.fn.extend({
	getDTUList:function(){
		
	}
});
$.extend({
	init:function(){
		getToken();
		allData.access_token = accesstoken;
		$('#reportList').getReportList();
	}
});
$.init();
