var thingId=$("#thingId").val();
//var thingId="58734ea511b69c22b0afa990";
//var globalurl="http://192.168.1.114";
var selectedId=[];
$(function(){
	getToken();
	DevList()
	addClass();
	screenDev();
	omission($(".bindEntity .bindTop span:nth-child(2)"));
	

})
//获取已选设备的列表
function DevList(){
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'get',
		async:false,
		data:{
			access_token:window.accesstoken
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			console.log(data)
			
			if(data.code==400005){
				window.getNewToken()
				DevList();
			}else if(!data.rows||data.rows.length==0){
				$(".selectedUl").html("");
			}else{
				var str="";
				for(var i=0;i<data.rows.length;i++){
					str="<li id='"+data.rows[i]._id+"'>"+data.rows[i].device_name+"<span onclick='colseDev(&apos;"+data.rows[i]._id+"&apos;)'>&times;</span></li>"
					$(".selectedUl").append(str);
					selectedId.push(data.rows[i]._id)
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
		str1="<li id='"+id+"'>"+$("#"+id+"").parent(".selectdLi").find(".selectdFont").html()+"<span onclick='colseDev(&apos;"+id+"&apos;)'>&times;</span></li>"
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
		Idata={"device_id":decviceId};
		data.push(Idata);
	}	
	console.log(data)
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'post',
		async:false,
		data:{
			"access_token":window.accesstoken,
			 data:JSON.stringify(data)
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			console.log(data)
			if(data.code==400005){
				window.getNewToken()
				saveDevice();
			}else if(data.code==200){
				layer.msg(data.success, {
					icon : 1,
					end: function() {
						self.location.href='/finfosoft-water/thing/'
					}
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
	$(".optionalList").html("")
	var DevKind="";
	for(var i=0;i<$(".infoList").length;i++){
		if($(".infoList").eq(i).find("i").attr("class")=="fa fa-check-circle"){			
			DevKind+=(i+1)+",";			
		}
	}
	if($("#searchDevice").val()==""){	
		data={"device_kind":DevKind,"access_token":window.accesstoken}
		setTimeout(function(){
			doAjax(data);
		},200);
	}else{		
		data={
			'like':'{"device_name":"'+$("#searchDevice").val()+'"}',
			"device_kind":DevKind,
			"access_token":window.accesstoken
		}	
		doAjax(data);
	}	
}
function doAjax(data){
	$.ajax({
				url:globalurl+"/v1/devices",
				type:"get",
				dataType:"JSON",
				data:data,
				async:false,
				crossDomain: true == !(document.all),
				success:function(data){
					console.log(data)
					if(data.code==400005){
						window.getNewToken()
						screenDev();
					}else if(data.rows.length==0){
						$(".optionalList").html("<span class='nonedata'>暂无数据</span>");
					}else{
						var screenList="";			
						for(var i=0;i<data.rows.length;i++){
		//						console.log(data.rows[i]._id+","+selectedId[i])
							if(selectedId.indexOf(data.rows[i]._id)!=-1){					
								screenList='<div class="selectdLi">'+
								'<div class="selectdFont">'+data.rows[i].device_name+'</div>'+
								'<div class="selectdIcon" onclick="selectDev(&apos;'+data.rows[i]._id+'&apos;)" id="'+data.rows[i]._id+'">已选</div>'+
								'</div>';
								$(".optionalList").append(screenList);
							}else{
								screenList='<div class="disabledLi">'+
								'<div class="disabledFont">'+data.rows[i].device_name+'</div>'+
								'<div class="disabledIcon" onclick="selectDev(&apos;'+data.rows[i]._id+'&apos;)" id="'+data.rows[i]._id+'">+</div>'+
								'</div>';
								$(".optionalList").append(screenList);
							}
							
						}
						
					}
				}
			})
}
//input禁止输入字母空格
function space(obj){
	obj.val(obj.val().replace(/\s/g, ''))
}
//超出一行省略
function omission(obj){
	if(obj.html().length>20){
		obj.css({
			"width":"140px",
			"overflow": "hidden",
			"white-space": "nowrap",
			"text-overflow": "ellipsis"
		})
	}
	
}
