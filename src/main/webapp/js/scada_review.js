var allData={
	accessToken:"",
//	lanyueSrc: 'http://121.42.253.149:18822/scada',
	lanyueSrc: 'http://localhost:80/scada',
	//初始化传的数据
	parentData: {
		accessToken:"",
		scada_id: $('#scadaId').val()
	}
}

$.fn.extend({
	
})

$.extend({
	init:function(){
		getToken()
		allData.accessToken=accesstoken;
		allData.parentData.accessToken=accesstoken;
		$.initView();
	},
	//初始化查看页面
	initView: function(callback) {
		console.log(allData.parentData.scada_id)
		//初始化组态查看页面
		$('#scada').attr('src',allData.lanyueSrc).on('load', function() {
			$(this).get(0).contentWindow.postMessage(allData.parentData, '*');
			//console.log(allData.parentData)
		})
	}
});

$.init();
