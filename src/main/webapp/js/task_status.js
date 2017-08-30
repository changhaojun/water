var allData={
	access_token:'',
	processList:[]
}
var $extend=$.fn.extend({
	stopRunProcess:function(index){		//启停工艺
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
			methods:$extend,
			updated:function(){
				$('[data-toggle="tooltip"]').tooltip();
			}
		})
		getToken();
		allData.access_token=accesstoken
		$.getProcess()
	},
	getProcess:function(){		//获取工艺列表
		$.ajax({
			type:"get",
			url:globalurl+"/v1/processes?access_token="+allData.access_token,
			async:false,
			success:function(data){
				allData.processList=data.rows
			}
		});
	},
	upDateProcess:function(process){		//更新状态
		$.ajax({
			type:"put",
			url:globalurl+"/v1/processes?access_token="+allData.access_token,
			async:true,
			data:{
				process_id:process._id,
				data:'{"status":'+process.status+'}'
			},
			success:function(data){
				if(data.code==200){
					layer.msg(data.success,{icon:1})
				}else{
					layer.msg('修改失败',{icon:2})
				}
			}
		});
	}
});
$.init();