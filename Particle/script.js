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
var vel = [];

function initObjt() {
	particleCount = 1800;
	particles = new THREE.Geometry();

	var pMaterial = new THREE.ParticleBasicMaterial({
		color : 0xffffff,
		size : 20,
		map : THREE.ImageUtils.loadTexture("circle.png"),
		blending : THREE.AdditiveBlending,
		transparent : true,
		vertexColors : true,
	});

	//creating particles
	var colors = [];

	for (var p = 0; p < particleCount; p++) {
		var px = Math.random() * 300 - 150;
		var py = Math.random() * 300 - 150;
		var pz = Math.random() * 300 - 150;

		var particle = new THREE.Vector3(px, py, pz)
		vel[p] = new THREE.Vector3(0, -Math.random(), 0);

		particles.vertices.push(particle);
		colors[p] = new THREE.Color(0xffffff);
		colors[p].setRGB((px + 150) / 300, (py + 150) / 300, (pz + 150) / 300);
	}

	particles.colors = colors

	particleSystem = new THREE.ParticleSystem(particles, pMaterial);

	// 	also update the particle system to sort the particles which enables the behavior we want
	particleSystem.sortParticles = true;

	scene.add(particleSystem);

}

var particleSystem;
var dt = 0;

function loop() {
	// console.log(t);

	// console.log(pCount);

	particleSystem.rotation.y = (t / 1000) * Math.PI;
	var pCount = particleCount;

	console.log(pCount);

	while (pCount--) {
		var particle = particles.vertices[pCount];
		// console.log(particle);
		// console.log(particle.y);

		if (particle.y < -150) {
			particle.y = 150;
			vel[pCount].y = 0;

		}

		vel[pCount].y -= Math.random() * 0.08;

		particle.addSelf(vel[pCount]);

	}
	// console.log(pCount);
	particleSystem.geometry.__dirtyVertices = true;

	renderer.clear();
	renderer.render(scene, camera);

	window.requestAnimationFrame(loop);
	t++;
}