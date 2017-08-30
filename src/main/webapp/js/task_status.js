var allData={
	access_token:'',
	processList:[]
}

var $extend=$.fn.extend({
	stopProcess:function(index){
		var thisProcess=allData.processList[index]
		var newStatus=Math.abs(thisProcess.status-1)
		thisProcess.status=newStatus
		$.upDateProcess(thisProcess);
	},
	runProcess:function(index){
		var thisProcess=allData.processList[index]
		var newStatus=Math.abs(thisProcess.status-1)
		thisProcess.status=newStatus
		$.upDateProcess(thisProcess);
	}
})

$.extend({
	init:function(){
		var vmTaskBox = new Vue({
			el:'.globalContent',
			data:allData,
			methods:$extend
		})
		getToken();
		allData.access_token=accesstoken
		$.getProcess()
	},
	getProcess:function(){
		$.ajax({
			type:"get",
			url:globalurl+"/v1/processes?access_token="+allData.access_token,
			async:false,
			success:function(data){
				console.log(data)
				allData.processList=data.rows
			}
		});
	},
	upDateProcess:function(process){
		$.ajax({
			type:"put",
			url:globalurl+"/v1/processes?access_token="+allData.access_token,
			async:true,
			data:{
				process_id:process._id,
				data:'{"status":'+process.status+'}'
			},
			success:function(data){
				
			}
		});
	}
});

$.init();
