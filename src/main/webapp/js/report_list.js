var allData={
	access_token:'',
};
$.fn.extend({
	showReportList:function(dataList){
		for(var i=0;i<dataList.length;i++){
			var boxDom='<span class="reportBox" id="'+dataList[i]._id+'">'+dataList[i].form_name+'</span>'
			$(this).append(boxDom)
		}
	},
	editReport:function(){
		var reportId=$(this).attr('id');
		self.location.href="/report/reportForm/"+reportId;
	}
});
$.extend({
	init:function(){
		getToken();
		allData.access_token = accesstoken;
		$.getReportList();
		$.bindClick();
	},
	getReportList:function(){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/formTemplates/",
			async:true,
			success:function(data){
				if(data.rows.length>0){
					$('.reportList').showReportList(data.rows)
				}
			}
		});
	},
	bindClick:function(){
		var listBox=document.querySelector('.reportList');
		listBox.onclick=(ev)=>{
			ev.stopPropagation();
			if(ev.target.className=='reportBox'){
				$(ev.target).editReport();
			}
		}
	}
});
$.init();