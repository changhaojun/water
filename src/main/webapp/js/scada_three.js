$.ThreeCavs = $('#canv');

$.three = {
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
		distance: 2000,
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
		loader: null,
		path: '/finfosoft-water/modelResource/',
		count: 0,
		material: {
			specular: 0xffffff,
			shininess: 500
		}
	},
	font: {
		loader: null,
//		src: '/finfosoft-water/plugins/three/font/FZLanTingHei-M-GBK_Regular.json',
		src: '/finfosoft-water/plugins/three/font/FZLanTingHeiS-UL-GB_Regular.json',
//		src: '/finfosoft-water/plugins/three/font/font.json',
		size: 10,
		depth: 4,
		color: 0xffffff,
		opacity: 0.9
	},
	labelPlane: {
		color: 0x00aeff,
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
	init: function(models, selectLabelFn, isControlLabel) {
		$.initThree.initScene();
		$.initThree.initCamera();
		$.initThree.initLight();
		$.initThree.initObjects(models);
		$.initThree.initGround();
		$.initThree.initRenderer();
		$.initThree.initCameraController();
		!isControlLabel && $.initThree.initRaycaster(selectLabelFn);
		!isControlLabel && $.initThree.initTransformController();
		$.initThree.initAnimation();
		$.initThree.threeResize();
	},
	initScene: function() {
		var scene = new THREE.Scene();
		$.three.scene.el = scene;
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
		$.three.model.loader = new THREE.OBJLoader();
		var model = models[$.three.model.count];
		var objModelUrl = model.fileName;
		var objMaterial = model.material;
		var objPosition = model.objPosition;
		var objRotation = model.objRotation;
		$.three.model.loader.load($.three.model.path+objModelUrl+'.obj', function(object) {
			object.traverse(function(child) {
				if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshPhongMaterial({
						color: Number(objMaterial),
						specular: $.three.model.material.specular,
						shininess: $.three.model.material.shininess,
						side: THREE.DoubleSide
					});
				}
			});
			object.scale.set(0.1,0.1,0.1)
			object.position.set(objPosition.x, objPosition.y, objPosition.z);
			object.rotation.set(objRotation._x, objRotation._y, objRotation._z);
			$.three.scene.el.add(object);
			if ($.three.model.count===models.length-1) {
				return;
			} else {
				$.three.model.count++;
				$.initThree.initObjects(models);
			}
		});
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
	initLabel: function(data, oldPos) {
		var dataId = data.dataId;
		var dataName = data.dataName ? data.dataName : 'noName';
		var dataValue = data.dataValue==='null' || !data.dataValue ? 'noVal' : data.dataValue;
		var dataUnit = data.dataUnit ? data.dataUnit : 'noUnit';
		var message = dataName+':'+dataValue+' '+dataUnit;
		$.three.font.loader = new THREE.FontLoader();
		$.three.font.loader.load($.three.font.src, function(font) {
			//text
			var textGeo = new THREE.TextGeometry(message, {
				font: font,
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
			var labelPlaneGeo = new THREE.ExtrudeGeometry(
				$.initThree.createLabelShape(0, 0, labelPlaneLength, labelPlaneHeight, labelPlaneHeight/5, labelPlaneHeight/4),
				{
					amount: labelPlaneDepth,
					bevelEnabled: false
				}
			);
			var labelPlaneMtl = new THREE.MeshPhongMaterial({
				color: $.three.labelPlane.color,
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
			label.userData = 'target';
			label.labelId = parseInt(dataId);
			label.labelName = dataName;
			label.labelValue = dataValue;
			label.labelUnit = dataUnit;
			$.three.labelGroup.add(label);
			$.three.scene.el.add($.three.labelGroup);
		});
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
	initRaycaster: function(selectLabelFn) {
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();
		$.three.capturer.raycaster = raycaster;
		$.three.capturer.mouse = mouse;
		$.ThreeCavs.get(0).addEventListener('mousedown', function() {
			$.initThree.getMouseCoordinate(event);
			$.initThree.initCapturer(selectLabelFn);
		});
	},
	initCapturer: function(selectLabelFn) {
		if ($.three.capturer.mouse.x===0&&$.three.capturer.mouse.y===0) return;
		$.three.capturer.raycaster.setFromCamera($.three.capturer.mouse, $.three.camera.el);
		var intersects = $.three.capturer.raycaster.intersectObjects($.three.labelGroup.children, true);
		if ( intersects.length > 0 ) {
			if ( $.three.capturer.intersected != $.initThree.searchLabelFromChild(intersects[0].object) ) {
				if ( $.three.capturer.intersected ) {
					$.three.controller.transformController.detach($.three.capturer.intersected);
				}
				$.three.capturer.intersected = $.initThree.searchLabelFromChild(intersects[0].object);
				$.three.controller.transformController.attach($.three.capturer.intersected);
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
	createLabelShape: function(x, y, width, height, radius, arrowLength) {
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
			if (obj.userData==='target') {
				return obj;
			}
			obj = obj.parent;
		}
	},
	searchLabelFromId: function(id) {
		var index;
		for (var i=0; i<$.three.labelGroup.children.length; i++) {
			if ($.three.labelGroup.children[i].labelId==id) {
				index = i;
			}
		}
		return index;
	},
	createLabelData: function() {
		var labels = [];
		for (var i=0; i<$.three.labelGroup.children.length; i++) {
			labels.push({
				data_id: $.three.labelGroup.children[i].labelId,
				data_name: $.three.labelGroup.children[i].labelName,
				data_value: $.three.labelGroup.children[i].labelValue,
				data_unit: $.three.labelGroup.children[i].labelUnit,
				objPosition: $.three.labelGroup.children[i].position,
				objRotation: $.three.labelGroup.children[i].rotation
			})
		}
		return labels;
	}
}