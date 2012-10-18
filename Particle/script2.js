window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(/* function */callback, /* DOMElement */element) {
		window.setTimeout(callback, 1000 / 60);
	};

})();

var width, hight;

var container;
var camera, controls, scene, renderer;

var light;

window.onload = function() {

	initSetting();
	initCamera();
	initScene();
	initLight();
	initObjt();

	loop();

};

function initSetting() {
	width = window.innerWidth;
	height = window.innerHeight;

	renderer = new THREE.WebGLRenderer({
		antialias : true
	});

	renderer.setSize(width, height);
	document.body.appendChild(renderer.domElement);

	//changing the background
	renderer.setClearColorHex(0x000000, 1.0);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

	camera.position.x = 100;
	camera.position.y = 200;
	camera.position.z = 500;

	camera.lookAt({
		x : 0,
		y : 0,
		z : 0
	});
}

function initScene() {
	scene = new THREE.Scene();
}

function initLight() {
	light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
	light.position.set(100, 100, 200);
	scene.add(light);
}

var particleCount;
var particles;
var attributes = [];

function initObjt() {
	particleCount = 1800;
	particles = new THREE.Geometry();

	var pMaterial = new THREE.ParticleBasicMaterial({
		color : 0xffffff,
		size : 20,
		map : THREE.ImageUtils.loadTexture("circle.png"),
		blending : THREE.AdditiveBlending,
		transparent : true,
		vertexColors : true
	});
	

	//creating particles
	var colors = [];

	var mass = 1;

	for (var p = 0; p < particleCount; p++) {
		var px = Math.random() * 50 - 25;
		var py = Math.random() * 50 - 25;
		var pz = Math.random() * 50 - 25;

		var particle = new THREE.Vector3(px, py, pz)
		// vel[p] = new THREE.Vector3(0, -Math.random(), 0);
		var velocity = new THREE.Vector3(10 * Math.random() - 5, 10 * Math.random() - 5, 10 * Math.random() - 5);
		var force = new THREE.Vector3(0, 0, 0);
		// console.log("velocity: " + velocity.x);

		attributes[p] = {
			ma : mass,
			vl : velocity,
			fc : force
		};
		// console.log(attributes[p].vl.x);

		particles.vertices.push(particle);
		colors[p] = new THREE.Color(0xffffff);
		colors[p].setRGB((px + 25) / 50, (py + 25) / 50, (pz + 25) / 50);
	}

	particles.colors = colors

	particleSystem = new THREE.ParticleSystem(particles, pMaterial);

	// 	also update the particle system to sort the particles which enables the behavior we want
	particleSystem.sortParticles = true;

	scene.add(particleSystem);

}

var particleSystem;
var t = 0;

function loop() {
	// console.log(t);

	// console.log(pCount);

	
	var pCount = particleCount;

	// console.log(pCount);

	var dt = .2;
	particleSystem.rotation.y += (dt / 200) * Math.PI;

	var rest = 15;
	var k = 1;
	var drag = 5;

	var p0 = particles.vertices[0];
	// console.log(p0);
	for (var j = 1; j < particleCount; j++) {

		var pj = particles.vertices[j];
		var u = new THREE.Vector3(p0.x - pj.x, p0.y - pj.y, p0.z - pj.z);
		var d = u.length();
		u.normalize();
		var F = new THREE.Vector3(-k * (d - rest) * u.x, -k * (d - rest) * u.y, -k * (d - rest) * u.z);
		attributes[0].fc.addSelf(F);
		attributes[j].fc.subSelf(F);

		
	}

	// console.log("");

	for (var i = 0; i < particleCount; i++) {
		var attr = attributes[i];
		var v = attr.vl;
		var speed = v.length();
		
		v.normalize();

		attr.fc.x = -drag * speed * v.x;
		attr.fc.y = -drag * speed * v.y;
		attr.fc.z = -drag * speed * v.z;

		v.x += attr.fc.x / attr.ma * dt;
		v.y += attr.fc.y / attr.ma * dt;
		v.z += attr.fc.z / attr.ma * dt;

		// if (t == 0) {
			// console.log("v: " + v);
			// console.log("speed: " + speed);
		// }

	}

	while (pCount--) {
		var particle = particles.vertices[pCount];

		particle.x += attributes[pCount].vl.x * dt;
		particle.y += attributes[pCount].vl.y * dt;
		particle.z += attributes[pCount].vl.z * dt;

		// if(t == 0){
		// console.log(attributes[pCount]);
		// }
		// if (t < 3) {
			// console.log(particle);
			// // console.log(attributes[pCount].vl.x);
		// }

	}
	// console.log(pCount);
	particleSystem.geometry.__dirtyVertices = true;

	renderer.clear();
	renderer.render(scene, camera);

	window.requestAnimationFrame(loop);
	// t++;

}