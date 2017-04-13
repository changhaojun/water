var globalurl="http://rapapi.org/mockjsdata/15031/v1/things/{_id}/thingDatas"
//获取已选设备的列表
DevList();
function DevList(){
	$.ajax({
		url:globalurl,
		dataType: 'JSON',
		type: 'get',
		crossDomain: true == !(document.all),
		success: function(data) {
			var str="";
			for(var i=0;i<data.rows.length;i++){
				str="<li id='"+data.rows[i]._id+"'>"+data.rows[i].device_name+"<span onclick='colseDev(&apos;"+data.rows[i]._id+"&apos;)'>&times;</span></li>"
				$(".selectedUl").append(str);
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
addClass();
function addClass(){
	for(var i=0;i<$(".infoList").length;i++){
		$(".infoList .fa").click(function(){
			if($(this).attr("class")=="fa fa-circle-o"){
				$(this).removeClass("fa-circle-o").addClass("fa-check-circle");
			}else{
				$(this).removeClass("fa-check-circle").addClass("fa-circle-o");
			}
		})
	}
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
	$.ajax({
		url:"http://rapapi.org/mockjsdata/15031/things/{_id}/thingDatas",
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






