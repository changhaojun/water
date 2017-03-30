//Finfosoft前端框架 js库 

var Finfosoft = {
	
	/*
	@ 插件名： 环形滚动条插件
	@ 插件作者：dongmo / Michael.Lu
	@ 插件版本：1.0
	@ 插件兼容性：IE9.0及以上浏览器
	@ API
	 * el: 元素选择器
	 * startDeg：起始角度(0度->x轴正向)
	 * endDeg：结束角度(0度->x轴正向)
	 ** lineWidth：滚动条宽度
	 ** bgColor: 滚动条背景色
	 ** mainColor： 主情景色
	 ** initVal：input接口
	@ 插件实例：
		new Finfosoft.Ring({
			el: '.finfosoft-ring',
			startDeg: 150,
			endDeg: 30,
			lineWidth: 18,
			bgColor: '#eeeeee',
			mainColor: '#66ee66',
			initVal: 20
		});
	*/
	Ring: function (init){
		this.parent = document.querySelector(init.el);
		this.canvas = this.parent.querySelector('canvas');
		this.gc = this.canvas.getContext('2d');
		this.input = this.parent.querySelector('input');
		this.width = this.height = this.parent.clientWidth;
		this.startDeg = init.startDeg;
		this.endDeg = init.endDeg;
		this.lineWidth = init.lineWidth ? init.lineWidth : 0.2*this.width;
		this.bgColor = init.bgColor ? init.bgColor : '#eeeeee';
		this.mainColor = init.mainColor ? init.mainColor : '#66ee66';
		this.initVal = init.initVal ? init.initVal : this.input.value;
		this.radius = (this.width-this.lineWidth)/2;
		this.init();
	}
	
}

Finfosoft.Ring.prototype = {
	
	//构造函数指针修正
	constructor: this,
	
	//插件初始化
	init: function (ev) {
		var This = this;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.onmousedown = function (ev){
			var ev = ev || window.event;
			This.mousedown(ev);
		};
		this.drawLine(this.endDeg+360,this.bgColor);
		this.drawLine(this.startDeg,this.mainColor);
		this.input.onfocus = this.focus;
		this.input.onblur = function (){
			This.blur();
		};
		this.input.onkeyup = function (ev){
			var ev = ev || window.event;
			This.keyup(ev);
		}
		this.initValue(this.initVal);
		this.reDraw(this.startDeg+this.input.value*(this.endDeg+360-this.startDeg)/100);
	},
	
	//input初始化
	initValue: function (val){
		if (val<0) {
			this.input.value = 0;
		} else if (val>100) {
			this.input.value = 100;
		} else {
			this.input.value = parseInt(val);
		}
		this.input.style.width = 0.3*this.width + 'px';
		this.input.style.fontSize = 0.16*this.width + 'px';
		this.input.style.lineHeight = 0.16*this.width + 'px';
		this.input.style.color = this.mainColor;
		this.input.style.left = (this.width-this.input.clientWidth)/2 + 'px';
		this.input.style.top = (this.height-this.input.clientHeight)/2 + 'px';
	},
	
	//基础线条绘制
	drawLine: function (endDeg,color){
		this.gc.beginPath();
		this.gc.arc(this.width/2,this.height/2,this.radius,this.startDeg*Math.PI/180,endDeg*Math.PI/180,false);
		this.gc.lineWidth = this.lineWidth;
		this.gc.strokeStyle = color;
		this.gc.stroke();
	},
	
	//重绘
	reDraw: function (iDeg){
		this.gc.clearRect(0,0,this.width,this.height);
		this.drawLine(this.endDeg+360,this.bgColor);
		this.drawLine(iDeg,this.mainColor);
	},
	
	//获取到document的距离
	getPosToDoc: function (obj,dir){
		var dis = {
			x: 0,
			y: 0
		};
		while (obj) {
			dis.x += obj.offsetLeft;
			dis.y += obj.offsetTop;
			obj = obj.offsetParent;
		}
		console.log(dis.x,dis.y);
		return dir==='left' ? dis.x : dis.y;
	},
	
	//鼠标交互逻辑
	mouseCtrl: function (x,y){
		if (y<=this.height/2) {
			var iDeg = 270 + Math.atan((x-this.width/2)/(this.height/2-y))*180/Math.PI;
		} else {
			var iDeg = 90 + Math.atan((x-this.width/2)/(this.height/2-y))*180/Math.PI;
		}
		if (iDeg>this.endDeg&&iDeg<this.startDeg) {
			if (x<=this.width/2) {
				iDeg = this.startDeg;
			} else {
				iDeg = this.endDeg;
			}
		}
		if (iDeg>=this.startDeg) {
			var iScale = (iDeg-this.startDeg)/(this.endDeg+360-this.startDeg);
		} else if (iDeg<=this.endDeg) {
			var iScale = (360+iDeg-this.startDeg)/(this.endDeg+360-this.startDeg);
		}
		this.reDraw(iDeg);
		this.rangeText(iScale);
	},
	
	//鼠标按下时进度条响应
	mousedown: function (ev){
		var This = this;
		var x = ev.clientX - this.getPosToDoc(this.canvas,'left');
		var y = ev.clientY - this.getPosToDoc(this.canvas,'top');
		this.mouseCtrl(x,y);
		document.onmousemove = function (ev){
			var ev = ev || window.event;
			This.mousemove(ev);
		};
		document.onmouseup = function (){
			this.onmousemove = this.monmouseup = null;
		};
	},
	
	//鼠标移动时进度条响应
	mousemove: function (ev){
		var x = ev.clientX - this.getPosToDoc(this.canvas,'left');
		var y = ev.clientY - this.getPosToDoc(this.canvas,'top');
		this.mouseCtrl(x,y);
	},
	
	//数值按比例响应
	rangeText: function (scale){
		this.input.value = Math.round(scale*100);
	},
	
	//输入框获取焦点
	focus: function (){
		this.origVal = this.value;
		this.value = '';
	},
	
	//输入框失去焦点时进度条响应
	blur: function (){
		if (!this.input.value) {
			this.input.value = this.input.origVal;
			return;
		}
		var iDeg = this.startDeg + this.input.value*(this.endDeg+360-this.startDeg)/100;
		this.reDraw(iDeg);
	},
	
	//回车确定
	keyup: function (ev){
		this.regularVal();
		if (ev.keyCode===13) {
			this.input.blur();
		}
	},
	
	//禁用除数字外的其他输入
	regularVal: function (){
		this.input.value = this.input.value.replace(/\D/g,'');
		if (this.input.value.length>2) {
			this.input.value = 100;
		}
	}
	
}