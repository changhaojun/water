

//显示运行数据列表
$(function(){
	getToken();//刷新令牌
	entityList();//加载实体列表
})

function entityList(){
	$.ajax({
		type: "get",
//		url: 'http://rapapi.org/mockjsdata/15031/v1/things-runData',
//		url: 'http://192.168.1.114/v1/things',
		url: globalurl+"/v1/runDatas",
		dataType: "JSON",
		async: false,
		crossDomain: true == !(document.all),
		data: {
			access_token: accesstoken
		},
		success:function(data){
			console.log(data);
			$(".dataContent").html("");
			if(data.rows.length==0){
		    	$(".dataContent").html("<p>暂无数据</p>");
		   }
			var str='';
			for(var i=0;i<data.rows.length;i++){
				entityData(data,i)
			}	
		}
	})
}
//
function entityData(data,i){
	var str='';
	if(data.rows[i].run_data){
		str='<div class="dataList" style="cursor:pointer;" onclick="look(&apos;'+data.rows[i]._id+'&apos;)">'+
				'<div class="listTop">'+
					'<span>'+data.rows[i].thing_name+'</span>'+							
				'</div>'+
				'<div class="listHr"></div>'+
				'<div class="listContent">'+
					'<div class="contentTop" id="'+data.rows[i]._id+'">'+
					
					'</div>'+
					'<div class="contentBottom">'+
//							'<span class="fa fa-clock-o">'+' '+data.rows[i].run_data.data_times[0].substring(0,7)+'&nbsp; &nbsp;&nbsp;&nbsp;'+'72h'+'</span>'+
					'</div>'+
				'</div>'+			
			'</div>';
			$(".dataContent").append(str);
		chartInfo(data,i)
	}
}
//图表配置项
function chartInfo(data,i){
	option={
		tooltip:{
			trigger:'axis'
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
				type:'line',
				data:data.rows[i].run_data.data_values,
				markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
        		},
        		markline:{
				        data:[
                            [ { x: 80, y: 150},
                                { x: 480, y: 150}
                            ]
	                    ]
            	},
            	itemStyle : {  
                    normal : {  
                    	color:'#1ab394',
                        lineStyle:{  
                            color:'#1ab394' ,   
                        }  
                    }  
                }
			}
		]
	}
	var myChart=echarts.init(document.getElementById(data.rows[i]._id));
	myChart.setOption(option)
}

//查看实体数据
function look(id){
	console.log(id);
	self.location.href="/finfosoft-water/runData/getDatas/"+id	
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
			url: globalurl+"/v1/runDatas",
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
