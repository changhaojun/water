$.ThreeCavs = $('#canv');
$.loaderEl = $('.loader');

$.three = {
	modelsLoading: true,
	fontLoading: true,
	loadingStatus: 1,
	scene: {
		el: null
	},
	camera: {
		el: null,
		fov: 45,
		aspect: $.ThreeCavs.width() / $.ThreeCavs.height(),
		near: 1,
		far: 10000
	},
	light: {
		el: {
			eastLight: null,
			westLight: null,
			southLight: null,
			northLight: null,
			midLight: null
		},
		hex: 0xffffff,
		intensity: 1,
		distance: 1600,
		scrope: 500,
		height: 500
	},
	ground: {
		el: null,
		size: 1000,
		step: 50,
		color: 0x000000,
		opacity: 0.3,
		transparent: true
	},
	model: {
		mtlLoader: null,
		objLoader: null,
		path: '/finfosoft-water/modelResource/',
		count: 0,
		material: {
			specular: 0xffffff,
			shininess: 500
		}
	},
	font: {
		loader: null,
		src: '/finfosoft-water/plugins/three/font/FZLanTingHeiS-UL-GB_Regular.json',
		size: 6,
		depth: 2,
		color: 0xffffff,
		opacity: 0.9,
		geometry: null
	},
	labelPlane: {
		opacity: 0.8
	},
	labelGroup: new THREE.Object3D(),
	renderer: {
		el: null,
		clearColor: 0xffffff
	},
	controller: {
		cameraController: null,
		transformController: null,
		rotateSpeed: 0.05,
		zoomSpeed: 1,
		minDistance: 100,
		maxDistance: 3000,
		enableDamping: true,
		dampingFactor: 0.2,
		maxPolarAngle: Math.PI / 2,
		enablePan: true,
		hiding: null
	},
	capturer: {
		raycaster: null,
		intersected: null,
		mouse: null,
	},
	resize: {
		width: $.ThreeCavs.width(),
		height: $.ThreeCavs.height(),
		disX: window.innerWidth - $.ThreeCavs.width(),
		disY: window.innerHeight - $.ThreeCavs.height(),
		minWidth: parseInt($('body').css('minWidth'))
	}
}

$.initThree = {
	init: function(models, afterFontLoaded, selectLabelFn, isTransform) {
		$.initThree.initScene();
		$.initThree.initCamera();
		$.initThree.initLight();
		$.initThree.initObjects(models);
		$.initThree.initGround();
		$.initThree.initRenderer();
		$.initThree.initCameraController();
		$.initThree.initFont(function() {
			afterFontLoaded && afterFontLoaded();
			selectLabelFn && $.initThree.initRaycaster(selectLabelFn, isTransform);
			isTransform && $.initThree.initTransformController();
		});
		$.initThree.initAnimation();
		$.initThree.threeResize();
	},
	initScene: function() {
		var scene = new THREE.Scene();
		$.three.scene.el = scene;
		$.three.scene.el.add($.three.labelGroup);
	},
	initCamera: function() {
		var camera = new THREE.PerspectiveCamera(
			$.three.camera.fov,
			$.three.camera.aspect,
			$.three.camera.near,
			$.three.camera.far
		);
		camera.position.set(100, 100, 500);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		$.three.scene.el.add(camera);
		$.three.camera.el = camera;
	},
	initLight: function() {
		var eastLight = new THREE.PointLight(
			$.three.light.hex,
			$.three.light.intensity,
			$.three.light.distance
		);
		eastLight.position.set(
			$.three.light.scrope,
			$.three.light.height,
			0
		);
		var westLight = new THREE.PointLight(
			$.three.light.hex,
			$.three.light.intensity,
			$.three.light.distance
		);
		westLight.position.set(
			-$.three.light.scrope,
			$.three.light.height,
			0
		);
		var southLight = new THREE.PointLight(
			$.three.light.hex,
			$.three.light.intensity,
			$.three.light.distance
		);
		southLight.position.set(
			0,
			$.three.light.height,
			$.three.light.scrope
		);
		var northLight = new THREE.PointLight(
			$.three.light.hex,
			$.three.light.intensity,
			$.three.light.distance
		);
		northLight.position.set(
			0,
			$.three.light.height,
			-$.three.light.scrope
		);
		$.three.scene.el.add(eastLight, westLight, southLight, northLight);
		$.three.light.el.eastLight = eastLight;
		$.three.light.el.westLight = westLight;
		$.three.light.el.southLight = southLight;
		$.three.light.el.northLight = northLight;
	},
	initObjects: function(models) {
		var model = models[$.three.model.count];
		var objModelUrl = model.fileName;
		var objMaterial = model.material;
		var objPosition = model.objPosition;
		var objRotation = model.objRotation;
		$.three.model.mtlLoader = new THREE.MTLLoader();
		$.three.model.mtlLoader.setTexturePath($.three.model.path+'img/');
		$.three.model.mtlLoader.load($.three.model.path+objModelUrl+'.mtl', function(material) {
			$.three.model.objLoader = new THREE.OBJLoader();
			$.three.model.objLoader.setMaterials( material );
			$.three.model.objLoader.load($.three.model.path+objModelUrl+'.obj', function(object) {
				object.scale.set(0.1,0.1,0.1)
				object.position.set(objPosition.x, objPosition.y, objPosition.z);
				object.rotation.set(objRotation._x, objRotation._y, objRotation._z);
				$.three.scene.el.add(object);
			});
		});
		if ($.three.model.count===models.length-1) {
			$.three.modelsLoading = false;
			$.three.loadingStatus++;
			$.initThree.initLoading();
			return;
		} else {
			$.three.model.count++;
			$.initThree.initObjects(models);
		}
	},
	initGround: function() {
		var size = $.three.ground.size;
		var step = $.three.ground.step;
		var geometry = new THREE.Geometry();
		for (var i=-size; i<=size; i+=step) {
			geometry.vertices.push(new THREE.Vector3(-size, 0, i));
			geometry.vertices.push(new THREE.Vector3(size, 0, i));
			geometry.vertices.push(new THREE.Vector3(i, 0, -size));
			geometry.vertices.push(new THREE.Vector3(i, 0, size));
		}
		var material = new THREE.LineBasicMaterial({
			color: $.three.ground.color,
			opacity: $.three.ground.opacity,
			transparent: $.three.ground.transparent
		});
		var ground = new THREE.LineSegments( geometry, material );
		$.three.scene.el.add(ground);
		$.three.ground.el = ground;
	},
	initFont: function(callBack) {
		$.three.font.loader = $.three.font.loader===null ? new THREE.FontLoader() : $.three.font.loader;
		$.three.font.loader.load($.three.font.src, function(font) {
			$.three.font.geometry = font;
			$.three.fontLoading = false;
			$.three.loadingStatus++;
			$.initThree.initLoading();
			callBack && callBack();
		});
	},
	initLabel: function(data, oldPos, onSingleLabelLoaded) {
		var userData = typeof data === 'string' ? JSON.parse(data) : data;
		var labelMessage;
		if ($.initThree.judgeLabelType(userData)=='data') {
			var dataId = userData.data_id;
			var dataName = userData.data_name ? userData.data_name : 'noName';
			var dataValue = userData.data_value === 'null' || !userData.data_value ? 'noVal' : userData.data_value;
			var dataUnit = userData.data_unit ? userData.data_unit : 'noUnit';
			var dataStatus = userData.status ? userData.status : 1;
			var portType = userData.port_type;
			if (portType == 'AI' || portType == 'AO' || portType == 'MO') {
				labelMessage = dataName + ':' + dataValue + dataUnit;
			} else if (portType == 'DI' || portType == 'DO') {
				labelMessage = dataName + ':' + (dataValue == 1 ? '开启' : '关闭');
			}
		} else if ($.initThree.judgeLabelType(userData)=='process') {
			var processId = userData._id ? userData._id : userData.process_id;
			var processName = userData.process_name;
			var processStatus = userData.status ? userData.status : 0;
			labelMessage = processName;
		}
		
		//text
		var textGeo = new THREE.TextGeometry(labelMessage, {
			font: $.three.font.geometry,
			size:  $.three.font.size,
			height: $.three.font.depth,
			curveSegments: 10
		});
		var textMtl = new THREE.MeshPhongMaterial({
			emissive: $.three.font.color,
			transparent: true,
			opacity: $.three.font.opacity
		});
		var text = new THREE.Mesh(textGeo, textMtl);
		textGeo.computeBoundingBox();
		textGeo.computeBoundingSphere();
		var textLength = textGeo.boundingBox.max.x-textGeo.boundingBox.min.x;
		var textHeight = textGeo.boundingBox.max.y-textGeo.boundingBox.min.y;
		var textDepth = $.three.font.depth;
		text.position.set(
			-textGeo.boundingSphere.center.x,
			-$.three.font.size/2,
			-$.three.font.depth/2
		);
		//plane
		var labelPlaneLength = textLength+10;
		var labelPlaneHeight = textHeight*1.2;
		var labelPlaneDepth = textDepth*0.6;
		
		if ($.initThree.judgeLabelType(userData) == 'data') {
			var labelPlaneColor = (function() {
				switch (dataStatus) {
					case 0:
						return 0xcccccc;
					case 1:
						return 0x00aeff;
					case 2:
						return 0xff0000;
				}
			})();
		} else if ($.initThree.judgeLabelType(userData) == 'process') {
			var labelPlaneColor = (function() {
				switch (processStatus) {
					case 0:
						return 0xcccccc;
					case 1:
						return 0x00aeff;
				}
			})();
		}
		
		if ($.initThree.judgeLabelType(userData) == 'data') {
			var labelPlaneGeo = new THREE.ExtrudeGeometry(
				$.initThree.createDataLabelShape(0, 0, labelPlaneLength, labelPlaneHeight, labelPlaneHeight/5, labelPlaneHeight/4),
				{
					amount: labelPlaneDepth,
					bevelEnabled: false
				}
			);
		} else if ($.initThree.judgeLabelType(userData) == 'process') {
			var labelPlaneGeo = new THREE.ExtrudeGeometry(
				$.initThree.createMissionLabelShape(0, 0, labelPlaneLength, labelPlaneHeight),
				{
					amount: labelPlaneDepth,
					bevelEnabled: false
				}
			);
		}
		var labelPlaneMtl = new THREE.MeshPhongMaterial({
			color: labelPlaneColor,
			transparent: true,
			opacity: $.three.labelPlane.opacity
		});
		var labelPlane = new THREE.Mesh(labelPlaneGeo, labelPlaneMtl);
		labelPlane.position.set(
			-labelPlaneLength/2,
			-labelPlaneHeight/2,
			-labelPlaneDepth/2
		);
		
		//label
		var label = new THREE.Object3D();
		label.add(text, labelPlane);
		if (oldPos) {
			label.position.x = oldPos.x;
			label.position.y = oldPos.y;
			label.position.z = oldPos.z;
		} else {
			label.position.y = 40;
		}
		label.target = 'target';
		
		if ($.initThree.judgeLabelType(userData) == 'data') {
			label.labelId = parseInt(dataId);
			label.labelName = dataName;
			label.labelValue = dataValue;
			label.labelUnit = dataUnit;
			label.labelType = portType;
			label.labelStatus = dataStatus;
		} else if ($.initThree.judgeLabelType(userData) == 'process') {
			label.processId = processId;
			label.processName = processName;
			label.labelStatus = processStatus;
		}
		$.three.labelGroup.add(label);
		$.initThree.rendererUpdata();
		onSingleLabelLoaded && onSingleLabelLoaded(userData);
	},
	initRenderer: function() {
		var renderer =  new THREE.WebGLRenderer({
			canvas: $.ThreeCavs.get(0),
			antialias:true
		});
		renderer.setClearColor($.three.renderer.clearColor);
		renderer.setSize($.ThreeCavs.width(), $.ThreeCavs.height());
		$.three.renderer.el = renderer;
		$.initThree.rendererUpdata();
	},
	initCameraController: function() {
		var controller = new THREE.OrbitControls($.three.camera.el, $.three.renderer.el.domElement);
		controller.rotateSpeed = $.three.controller.rotateSpeed;
		controller.zoomSpeed = $.three.controller.zoomSpeed;
		controller.minDistance = $.three.controller.minDistance;
		controller.maxDistance = $.three.controller.maxDistance;
		controller.enableDamping = $.three.controller.enableDamping;
		controller.dampingFactor = $.three.controller.dampingFactor;
		controller.maxPolarAngle = $.three.controller.maxPolarAngle;
		controller.enablePan = $.three.controller.enablePan;
		controller.addEventListener('change', $.initThree.rendererUpdata);
		$.three.controller.cameraController = controller;
	},
	initTransformController: function() {
		var controller = new THREE.TransformControls( $.three.camera.el, $.three.renderer.el.domElement );
		controller.addEventListener('change', $.initThree.rendererUpdata);
		$.three.scene.el.add(controller);
		$.three.controller.transformController = controller;
	},
	initRaycaster: function(selectLabelFn, isTransform) {
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		$.three.capturer.raycaster = raycaster;
		$.three.capturer.mouse = mouse;
		$.ThreeCavs.get(0).addEventListener('mousedown', function() {
			$.initThree.getMouseCoordinate(event);
			$.initThree.initCapturer(selectLabelFn, isTransform);
		});
	},
	initCapturer: function(selectLabelFn, isTransform) {
		if ($.three.capturer.mouse.x===0&&$.three.capturer.mouse.y===0) return;
		$.three.capturer.raycaster.setFromCamera($.three.capturer.mouse, $.three.camera.el);
		var intersects = $.three.capturer.raycaster.intersectObjects($.three.labelGroup.children, true);
		if ( intersects.length > 0 ) {
			if ( $.three.capturer.intersected != $.initThree.searchLabelFromChild(intersects[0].object) ) {
				if ( isTransform && $.three.capturer.intersected ) {
					$.three.controller.transformController.detach($.three.capturer.intersected);
				}
				$.three.capturer.intersected = $.initThree.searchLabelFromChild(intersects[0].object);
				isTransform && $.three.controller.transformController.attach($.three.capturer.intersected);
				var oldPos = $.three.capturer.intersected.position;
				selectLabelFn && selectLabelFn();
			}
		}
		$.initThree.rendererUpdata();
	},
	initAnimation: function() {
		requestAnimationFrame( $.initThree.initAnimation );
		$.three.controller.cameraController && $.three.controller.cameraController.update();
		$.three.controller.transformController && $.three.controller.transformController.update();
		$.initThree.rendererUpdata();
	},
	createDataLabelShape: function(x, y, width, height, radius, arrowLength) {
		var labelShape = new THREE.Shape();
		labelShape.moveTo(x, y + radius);
		labelShape.lineTo(x, y + height - radius);
		labelShape.quadraticCurveTo(x, y + height, x + radius, y + height);
		labelShape.lineTo(x + width - radius, y + height);
		labelShape.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		labelShape.lineTo(x + width, y + radius);
		labelShape.quadraticCurveTo(x + width, y, x + width - radius, y);
		labelShape.lineTo(x+width/2+arrowLength/2, y);
		labelShape.lineTo(x+width/2, y-Math.sin(Math.PI/2)*arrowLength/2);
		labelShape.lineTo(x+width/2-arrowLength/2, y);
		labelShape.lineTo(x + radius, y);
		labelShape.quadraticCurveTo(x, y, x, y + radius);
		return labelShape;
	},
	createMissionLabelShape: function(x, y, width, height) {
		var labelShape = new THREE.Shape();
		labelShape.moveTo(x, y);
		labelShape.lineTo(x - height/2, y + height/2);
		labelShape.lineTo(x, y + height);
		labelShape.lineTo(x + width, y + height);
		labelShape.lineTo(x + width + height/2, y + height/2);
		labelShape.lineTo(x + width, y);
		labelShape.lineTo(x, y);
		return labelShape;
	},
	getMouseCoordinate: function(event) {
		event.preventDefault();
		$.three.capturer.mouse.x = ( (event.clientX-$.three.resize.disX/2) / $.three.resize.width ) * 2 - 1;
		$.three.capturer.mouse.y = - ( (event.clientY-$.three.resize.disY+$.three.resize.disX/2) / $.three.resize.height ) * 2 + 1;
	},
	rendererUpdata: function() {
		$.three.renderer.el.render($.three.scene.el, $.three.camera.el);
	},
	threeResize: function() {
		$(window).resize(function() {
			if (window.innerWidth < $.three.resize.minWidth+$.three.resize.disX) {
				return;
			}
			$.three.resize.width = window.innerWidth-$.three.resize.disX;
			$.three.resize.height = window.innerHeight-$.three.resize.disY;
			$.three.camera.el.aspect = $.three.resize.width / $.three.resize.height;
			$.three.camera.el.updateProjectionMatrix();
			$.three.renderer.el.setSize($.three.resize.width, $.three.resize.height);
		});
	},
	searchLabelFromChild: function(obj) {
		while (obj) {
			if (obj.target==='target') {
				return obj;
			}
			obj = obj.parent;
		}
	},
	searchLabelFromId: function(id, type) {
		var index;
		for (var i=0; i<$.three.labelGroup.children.length; i++) {
			if (type == 'data' && $.three.labelGroup.children[i].labelId == id) {
				index = i;
			} else if (type == 'process' && $.three.labelGroup.children[i].processId == id) {
				index = i;
			}
		}
		return index;
	},
//	createText: function(text) {
//		var width=512, height=256; 
//		var canvas = document.createElement('canvas');
//		canvas.width = width;
//		canvas.height = height;
//		var ctx = canvas.getContext('2d');
//		ctx.fillStyle = '#C3C3C3';
//		ctx.fillRect(0, 0, width, height);
//		ctx.font = 50+'px " bold';
//		ctx.fillStyle = '#2891FF';
//		ctx.textAlign = 'center';
//		ctx.textBaseline = 'middle';
//		ctx.fillText(text, width/2,height/2); 
//		return canvas;
//	},
	createLabelData: function() {
		var labels = [];
		for (var i=0; i<$.three.labelGroup.children.length; i++) {
			if ($.initThree.judgeLabelType($.three.labelGroup.children[i]) == 'data') {
				labels.push({
					data_id: $.three.labelGroup.children[i].labelId,
					data_name: $.three.labelGroup.children[i].labelName,
					data_value: $.three.labelGroup.children[i].labelValue,
					data_unit: $.three.labelGroup.children[i].labelUnit,
					port_type: $.three.labelGroup.children[i].labelType,
					status: $.three.labelGroup.children[i].labelStatus,
					objPosition: $.three.labelGroup.children[i].position,
					objRotation: $.three.labelGroup.children[i].rotation
				});
			} else if ($.initThree.judgeLabelType($.three.labelGroup.children[i]) == 'process') {
				labels.push({
					process_id: $.three.labelGroup.children[i].processId,
					process_name: $.three.labelGroup.children[i].processName,
					status: $.three.labelGroup.children[i].labelStatus,
					objPosition: $.three.labelGroup.children[i].position,
					objRotation: $.three.labelGroup.children[i].rotation
				})
			}
				
		}
		return labels;
	},
	judgeLabelType: function(data) {
		if (data.data_id || data.labelId) {
			return 'data';
		} else if (data._id || data.process_id || data.processId) {
			return 'process';
		}
	},
	initLoading: function() {
		if (!$.three.fontLoading && !$.three.modelsLoading) {
			$.loaderEl.animate({
				opacity: 0
			}, 2000, 'swing', function() {
				$.loaderEl.css('display', 'none');
			});
			$.loaderEl.find('.text').html('加载完成！('+$.three.loadingStatus+' / 3)').css({
				'webkitAnimationName': 'color-text'+$.three.loadingStatus,
				'animationName': 'color-text'+$.three.loadingStatus
			});
		} else if (!$.three.fontLoading) {
			$.loaderEl.find('.text').html('模型加载中，请稍后('+$.three.loadingStatus+' / 3)').css({
				'webkitAnimationName': 'color-text'+$.three.loadingStatus,
				'animationName': 'color-text'+$.three.loadingStatus
			});
		} else if (!$.three.modelsLoading) {
			$.loaderEl.find('.text').html('字体加载中，请稍后('+$.three.loadingStatus+' / 3)').css({
				'webkitAnimationName': 'color-text'+$.three.loadingStatus,
				'animationName': 'color-text'+$.three.loadingStatus
			});
		}
	}
}