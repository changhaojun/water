
//显示运行数据列表
$(function(){
	getToken();//刷新令牌
	entityList();//加载实体列表
	
})

function entityList(){
	var loading=new Finfosoft.Loading({
				shade:['0.7','#ffffff'],
		        color:'#000000',
		        msg:'正在获取数据，请稍后。。。',
			})
	$.ajax({
		type: "get",
		url: globalurl+"/v1/runDatas?company_id="+$('#companyId').val(),
		dataType: "JSON",
		async: true,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success:function(data){
			loading.closeLoading();
			$(".dataContent").html("");
			if(data.rows.length==0){
		    	$(".dataContent").html("<p style='padding-left:20px;'>暂无数据</p>");
		  }
			for(var i=0;i<data.rows.length;i++){
				entityData(data,i)					
			}	
		}
	})
}
//获取实体数据
function entityData(data,i){
	var str='';
	var content,name;
	if(data.rows[i].device_name){
		name = data.rows[i].device_name+'-'+data.rows[i].dataName
	}else{
		name ='该实体未绑定设备'
	}
	if(data.rows[i].run_data){
		content = '<div style="width:478px;margin:0 auto;" class="contentTop" id="'+data.rows[i]._id+'"></div><div class="contentBottom"><span class="fa fa-clock-o"> '+data.rows[i].run_data.data_times[0].substring(0,7)+'&nbsp; &nbsp;&nbsp;&nbsp;'+'72h</span><span >'+name+'</span></div>'
	}else{
		content = '<div style="width:478px;margin:0 auto; text-align:center; padding-top:80px;" class="contentTop" id="'+data.rows[i]._id+'">暂无数据</div><div class="contentBottom"><span>'+name+'</span></div>'
	}
	str='<div class="dataList" style="cursor:pointer;" onclick="look(&apos;'+data.rows[i]._id+'&apos;)">'+
				'<div class="listTop">'+
					'<span>'+data.rows[i].thing_name+'</span>'+							
				'</div>'+
				'<div class="listHr"></div>'+
				'<div class="listContent">'+content+'</div>'+			
			'</div>';
			$(".dataContent").append(str);
		chartInfo(data,i)
	
	
//	if(data.rows[i].run_data){
//		str='<div class="dataList" style="cursor:pointer;" onclick="look(&apos;'+data.rows[i]._id+'&apos;)">'+
//				'<div class="listTop">'+
//					'<span>'+data.rows[i].thing_name+'</span>'+							
//				'</div>'+
//				'<div class="listHr"></div>'+
//				'<div class="listContent">'+
//					'<div style="width:478px;margin:0 auto;" class="contentTop" id="'+data.rows[i]._id+'">'+
//					
//					'</div>'+
//					'<div class="contentBottom">'+
//							'<span class="fa fa-clock-o">'+' '+data.rows[i].run_data.data_times[0].substring(0,7)+'&nbsp; &nbsp;&nbsp;&nbsp;'+'72h'+'</span>'+
//							'<span >'+data.rows[i].device_name+'-'+data.rows[i].dataName+'</span>'+
//					'</div>'+
//				'</div>'+			
//			'</div>';
//			$(".dataContent").append(str);
//		chartInfo(data,i)
//	}else{
//		str='<div class="dataList" style="cursor:pointer;" onclick="look(&apos;'+data.rows[i]._id+'&apos;)">'+
//				'<div class="listTop">'+
//					'<span>'+data.rows[i].thing_name+'</span>'+							
//				'</div>'+
//				'<div class="listHr"></div>'+
//				'<div class="listContent">'+
//					'<div style="width:478px;margin:0 auto; text-align:center; padding-top:80px;" class="contentTop" id="'+data.rows[i]._id+'">'+
//						'暂无数据'+
//					'</div>'+
//					'<div class="contentBottom">'+
//						'<span>'+data.rows[i].device_name+'-'+data.rows[i].dataName+'</span>'+
//					'</div>'+
//				'</div>'+			
//			'</div>';
//			$(".dataContent").append(str);
//		chartInfo(data,i)	
//	}
}
//图表配置项
function chartInfo(data,i){
	if(data.rows[i].run_data){
		option={
			tooltip:{
				padding:10,
				trigger:'axis',
				formatter: function (params, ticket, callback) {  
		            //x轴名称  
		            var name = params[0].name  
		            var value = params[0].value  
		            return name + '<br />' + value  
		       } 
			},
			xAxis:{
				type:'category',
				data: data.rows[i].run_data.data_times,  
				show:false,
			},
			yAxis:{
				type:'value',
				show:false
			},
			series:[
				{
					type: 'line',
					data: data.rows[i].run_data.data_values,
					markPoint : {
	                    data : [
	                        {type : 'max', name: '最大值'},
	                        {type : 'min', name: '最小值'}
	                    ],
	        		},
	        		markLine:{
	                    data:[
	                            [ {color:'#ccc', x: -10, y: 123},
	                                { x: 500, y: 123}
	                            ]
	                    ]
	               	},
	            	itemStyle : {  
	                    normal : {  
	                    	color:'#53b29e',
	                        lineStyle:{  
	                            color:'#53b29e' ,   
	                        }  
	                    }  
	                }
				}
			]
		}
		var myChart=echarts.init(document.getElementById(data.rows[i]._id));
		myChart.setOption(option)
	}
}

//查看实体数据
function look(id){

	self.location.href="/runData/getDatas/"+id	
}

//input 失焦、获焦判断
function event(obj, str) {
	obj.on({"focus ": function() {
		if (obj.val() == str) {
			obj.val("");
		}
	},"keyup":function(event){
		if(event.keyCode==32){
			obj.val(obj.val().replace(/\s/g, ''))
		}
	}})
	obj.on("blur", function() {
		if (obj.val() == ""){
			obj.val(str);
		}
	})
}
event($("#searchId"),"请输入关键字来查找实体")

//按回车键查找
$("#searchId").on("keyup", function(event) {
	if (event.keyCode == 13) {
		ajaxRequest();
	}
})
function ajaxRequest(){
	var search = "";
	if($("#searchId").val()=="" || $("#searchId").val()=="请输入关键字来查找实体"){
		$(".dataContent").html("");
		setTimeout(function(){			
			entityList();
		},100)		
	}else{
//		var okey = '{"thing_name":"' + $("#searchId").val() + '"}';
		$(".dataContent").html("");
		$.ajax({
			type: 'get',
			url: globalurl+"/v1/runDatas?company_id="+$('#companyId').val(),
			dataType: "JSON",
			crossDomain: true == !(document.all),
			data:{
				like: '{"thing_name":"' + $("#searchId").val() + '"}',
				access_token: accesstoken
			},
			success:function(data){
				if(data.code==400005){
					getNewToken();
					ajaxRequest();
				}else{
					for(var i=0;i<data.rows.length;i++){
						entityData(data,i);
					}
				}
				
			}
		})
	}
}
//点击搜索图标查找
$(".fa-search").on("click", function() {
	ajaxRequest();	
})
