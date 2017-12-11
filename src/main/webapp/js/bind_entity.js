var thingId=$("#thingId").val();
var customerId=$("#customerId").val();
//var thingId="58734ea511b69c22b0afa990";
//var globalurl="http://192.168.1.114";
var selectedId=[];
var allData=[];
$(function(){
	getToken();
	DevList(); //获取已选设备的列表
	deviceKind(); //设备类型
	omission($(".bindEntity .bindTop span:nth-child(2)"));
})

function deviceKind(){
	for(var i=0;i<$(".infoList").length;i++){
		if($(".infoList").eq(i).find("i").attr("class")=="fa fa-check-circle"){			
			$(".infoList").eq(i).find("i").attr("devicekind",i+1)		
		}	
	}
}

//获取已选设备的列表
function DevList(){
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'get',
		async:true,
		data:{
			access_token:window.accesstoken,
			getDataConfig:'false'
		},
		crossDomain: true == !(document.all),
		success: function(data) {		
			if(data.code==400005){
				window.getNewToken()
				DevList();
			}else if(!data.rows||data.rows.length==0){
				$(".selectedUl").html("");
			}else{
				var str="";
				for(var i=0;i<data.rows.length;i++){
					str="<li id='"+data.rows[i]._id+"' onclick='colseDev(&apos;"+data.rows[i]._id+"&apos;)' >"+data.rows[i].device_name+"<span>&times;</span></li>"
					$(".selectedUl").append(str);
					selectedId.push(data.rows[i]._id)
				}
			}
			screenDev();
		}
	});
}

//删除selectedId数组中的制定元素
Array.prototype.indexOf = function(val) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if (index > -1) {
		this.splice(index, 1);
	}
};

//移除已选的设备
function colseDev(id){
	$("#"+id+"").remove();
	selectedId.remove(id);
	$(".optionalList #"+id+"").prev().removeClass("selectdFont").addClass("disabledFont");
	$(".optionalList #"+id+"").removeClass("selectdIcon").addClass("disabledIcon");
	$(".optionalList #"+id+"").parent("div").removeClass("selectdLi").addClass("disabledLi");
	$(".optionalList #"+id+"").html("+");
	
}
//修改已选设备样式
function addClass(){
		$(".infoList .fa").click(function(){
			$(".optionalList").html("")
			if($(this).attr("class")=="fa fa-circle-o"){				
				$(this).removeClass("fa-circle-o").addClass("fa-check-circle");
			}else{
				$(this).removeClass("fa-check-circle").addClass("fa-circle-o");
			}
			for(var i=0;i<allData.length;i++){
				for(var j=0;j<$(".fa-check-circle").length;j++){
					if(allData[i].device_kind==$(".fa-check-circle").eq(j).attr("devicekind")){
						domHtml(allData[i]);
					}
				}			
			}
		})
	
}
//选择设备
function selectDev(id){	
		if($("#"+id+"").html()=="+"){
		$("#"+id+"").prev().removeClass("disabledFont").addClass("selectdFont");
		$("#"+id+"").removeClass("disabledIcon").addClass("selectdIcon");
		$("#"+id+"").parent("div").removeClass("disabledLi").addClass("selectdLi");
		$("#"+id+"").html("已选");
		selectedId.push(id)
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
	var loading=new Finfosoft.Loading({
			shade:['0.7','#ffffff'],
	        color:'#000000',
	        msg:'正在保存数据，请稍后。。。',
		})
	
	var data=[];
	for(var i=0;i<$(".selectedUl li").length;i++){
		decviceId=$(".selectedUl li").eq(i).attr("id")
		Idata={"device_id":decviceId};
		data.push(Idata);
	}
	$.ajax({
		url:globalurl+"/v1/things/"+thingId+"/thingDatas",
		dataType: 'JSON',
		type: 'post',
		async:true,
		data:{
			"access_token":window.accesstoken,
			 data:JSON.stringify(data),
		},
		crossDomain: true == !(document.all),
		success: function(data) {
			loading.closeLoading();
			if(data.code==400005){
				window.getNewToken()
				saveDevice();
			}else if(data.code==200){
				layer.msg(data.success, {
					icon : 1,
					end: function() {
						self.location.href='/thing/'
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
//获取所有所有设备列表
function screenDev(){
	$(".optionalList").html("")
	var DevKind="";	
	data={
		'like':'{"device_name":"'+$("#searchDevice").val()+'"}',
		"access_token":window.accesstoken,
		filter:'{"customer_id":"'+customerId+'"}'
	}	
	$.ajax({
		url:manage_globalurl+"/v1/devices",
		type:"get",
		dataType:"JSON",
		data:data,
		async:true,
		crossDomain: true == !(document.all),
		success:function(data){
			if(data.code==400005){
				window.getNewToken()
				screenDev();
			}else if(data.rows.length==0){
				$(".optionalList").html("<span class='nonedata'>暂无数据</span>");
			}else{
				for(var i=0;i<data.rows.length;i++){
					domHtml(data.rows[i]);
				}					
				allData=data.rows;
				addClass
			}
		}
	})
}

//设备列表的布局
function domHtml(data){
	var screenList="";	
	if(selectedId.indexOf(data._id)!=-1){	
		screenList='<div class="selectdLi" onclick="selectDev(&apos;'+data._id+'&apos;)">'+
		'<div class="selectdFont">'+data.device_name+'</div>'+
		'<div class="selectdIcon"  id="'+data._id+'">已选</div>'+
		'</div>';
		$(".optionalList").append(screenList);
	}else{
		screenList='<div class="disabledLi" onclick="selectDev(&apos;'+data._id+'&apos;)">'+
		'<div class="disabledFont">'+data.device_name+'</div>'+
		'<div class="disabledIcon"  id="'+data._id+'">+</div>'+
		'</div>';
		$(".optionalList").append(screenList);
	}
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
