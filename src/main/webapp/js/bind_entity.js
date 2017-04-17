//var thingId=$("#thingId").val();
var thingId="58734ea511b69c22b0afa990";
var globalurl="http://192.168.1.114";
window.accesstoken="58f03d134077312358b70973";
$(function(){
	getToken();
	DevList();
	screenDev();
	addClass();
})
//获取已选设备的列表
function DevList(){
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'get',
		data:{
			access_token:window.accesstoken
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			console.log(data)
			if(data.code==400005){
				window.getNewToken()
				DevList();
			}else if(data.rows.length==0){
				$(".selectedUl").html("");
			}else{
				var str="";
				for(var i=0;i<data.rows.length;i++){
					str="<li id='"+data.rows[i]._id+"'>"+data.rows[i].device_name+"<span onclick='colseDev(&apos;"+data.rows[i]._id+"&apos;)'>&times;</span></li>"
					$(".selectedUl").append(str);
				}
			}	
		}
	});
}
//移除已选的设备
function colseDev(id){
	$("#"+id+"").remove();
	$(".optionalList #"+id+"").prev().removeClass("selectdFont").addClass("disabledFont");
	$(".optionalList #"+id+"").removeClass("selectdIcon").addClass("disabledIcon");
	$(".optionalList #"+id+"").parent("div").removeClass("selectdLi").addClass("disabledLi");
	$(".optionalList #"+id+"").html("+");
	
}
//选择设备角色
function addClass(){
		$(".infoList .fa").click(function(){
			if($(this).attr("class")=="fa fa-circle-o"){
				
				$(this).removeClass("fa-circle-o").addClass("fa-check-circle");
			}else{
				$(this).removeClass("fa-check-circle").addClass("fa-circle-o");
			}
			screenDev();
		})
	
}
//选择设备
function selectDev(id){
	console.log($("#"+id+"").html())
	if($("#"+id+"").html()=="+"){
		$("#"+id+"").prev().removeClass("disabledFont").addClass("selectdFont");
		$("#"+id+"").removeClass("disabledIcon").addClass("selectdIcon");
		$("#"+id+"").parent("div").removeClass("disabledLi").addClass("selectdLi");
		$("#"+id+"").html("已选");
		str1="<li id='"+id+"'>"+$(".selectdFont").html()+"<span onclick='colseDev(&apos;"+id+"&apos;)'>&times;</span></li>"
		$("#selectedUl").append(str1);
		
	}else{		
		layer.msg('抱歉该设备已添加过', {
			icon : 7
		});
	}	
}
//绑定设备
function saveDevice(){
	var data=[];
	for(var i=0;i<$(".selectedUl li").length;i++){
		decviceId=$(".selectedUl li").eq(i).attr("id")
		Idata={"device_id":""+decviceId+""}
		data.push(Idata);
	}
	data={"data":data,"access_token":window.accesstoken}
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'post',
		data:data,
		crossDomain: true == !(document.all),
		success: function(data) {
			if(data.code==400005){
				window.getNewToken()
				saveDevice();
			}else if(data.code==200){
				layer.msg(data.success, {
					icon : 1
				});
			}else{
				layer.msg(data.success, {
					icon : 2
				});
			}
		},
		error:function(data){
			layer.msg(data.error, {
					icon : 2
				});
		}
		
	})
}
//BOX接入设备的 device_kind==1
//OPC device_kind==2
//人工 device_kind==3
//计算数值 device_kind==4
//外部数据 device_kkind==5
//设备筛选
function screenDev(){
	var DevKind=[];
	for(var i=0;i<$(".infoList").length;i++){
		if($(".infoList").eq(i).find("i").attr("class")=="fa fa-check-circle"){			
			DevKind.push({"device_kind":i+1});			
		}
	}
	data={"data":DevKind,"access_token":window.accesstoken}
	$.ajax({
		url:"http://rapapi.org/mockjsdata/15031/things/{_id}/thingDatas",
		type:"get",
		dataType:"JSON",
		data:data,
		crossDomain: true == !(document.all),
		success:function(data){
			if(data.code==400005){
				window.getNewToken()
				screenDev();
			}else{
				var screenList="";
//				for(var i=0;i<data.rows.length;i++){
//					screenList+='<div class="disabledLi">'+
//						'<div class="disabledFont">'+data.rows[i].device_name+'</div>'+
//						'<div class="disabledIcon" onclick="selectDev('+data.rows[i]._id+')" id="'+data.rows[i]._id+'">+</div>'+
//					'</div>'
//				}
//				$(".optionalList").html(screenList);
			}
		}
	})
}




