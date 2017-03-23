//初始化提示框
$(function(){
	toolTip()
})
function toolTip(){
	 $('[data-toggle="tooltip"]').tooltip();
}
function Iopen(){
	$(".Iopen").addClass("Iactive");
	$(".Iclose").removeClass("Iactive");
	$(".circle").animate({"left":"0px"});
}
function Iclose(){
	$(".Iclose").addClass("Iactive");
	$(".Iopen").removeClass("Iactive");
	$(".circle").animate({"left":"25px"});
}
function shut(){
	$(".dataMsg").css("display","none");
}
function show(){
	$(".dataMsg").css("display","block");
}




