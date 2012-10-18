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
var colors;
var vel = [];

var properties = {
	lifespan : 3,
	rebirrth : -3,
	ext_force : new THREE.Vector3(10, 0, 0),
	dt : 0.01,
	alive : {
		value : []
	},
	alpha : {
		value : []
	},
	mass : {
		value : []
	},
	velocity : {
		value : []
	},
	force : {
		value : []
	},
	lifetime : {
		value : []
	}
};

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
	colors = [];

	for (var p = 0; p < particleCount; p++) {
		var px = Math.random() * 2 - 1;
		var py = 0;
		var pz = Math.random() * 2 - 1;

		var particle = new THREE.Vector3(px, py, pz)
		vel[p] = new THREE.Vector3(0, -Math.random(), 0);

		particles.vertices.push(particle);
		colors[p] = new THREE.Color(0xffffff);
		colors[p].setHSV(0, 0, 0.9 + 0.1 * Math.random());

		properties.alpha.value.push(0);
		properties.alive.value.push(false);
		properties.mass.value.push(0.5 + 0.5 * Math.random());
		properties.velocity.value.push(new THREE.Vector3(12 * Math.random() - 6, 2 * Math.random() + 3, 12 * Math.random() - 6));
		properties.force.value.push(new THREE.Vector3(3 * Math.random() - 1.5, 3 * Math.random() + 20, 3 * Math.random() - 1.5));
		properties.lifetime.value.push(-3 * Math.random());

	}

	particles.colors = colors

	particleSystem = new THREE.ParticleSystem(particles, pMaterial);

	// 	also update the particle system to sort the particles which enables the behavior we want
	particleSystem.sortParticles = true;
	console.log(particles.vertices[0]);
	

	scene.add(particleSystem);

}

var particleSystem;
var dt = 0.1;
var t = 0;

function loop() {
	// particleSystem.rotation.y += (dt / 10) * Math.PI;
	// var pCount = particleCount;
	//
	// while (pCount--) {
	// var particle = particles.vertices[pCount];
	//
	// if (particle.y < -150) {
	// particle.y = 150;
	// vel[pCount].y = 0;
	//
	// }
	//
	// vel[pCount].y -= Math.random() * 0.08;
	//
	// particle.addSelf(vel[pCount]);
	//
	// }

	// properties.alpha.value.push(0);
	// properties.alive.value.push(false);
	// properties.mass.value.push(0.5 + 0.5 * Math.random());
	// properties.velocity.value.push(new THREE.Vector3(12 * Math.random() - 6, 2 * Math.random() + 3, 12 * Math.random() - 6));
	// properties.force.value.push(new THREE.Vector3(3 * Math.random() - 1.5, 3 * Math.random() + 20, 3 * Math.random() - 1.5));
	// properties.lifetime.value.push(-3 * Math.random());

	// lifespan : 3,
	// rebirrth : -3,

	for (var i = 0; i < particleCount; i++) {
		var particle = particles.vertices[i];

		// if(i == 0) console.log(particle);

		properties.lifetime.value[i] -= dt;

		if (properties.alive.value[i] && properties.lifetime.value[i] <= 0) {

			properties.alive.value[i] = false;
			properties.lifetime.value[i] = properties.rebirrth * Math.random();

		} else if (properties.lifetime.value[i] <= properties.rebirrth) {

			properties.alive.value[i] = true;
			properties.lifetime.value[i] = properties.lifespan;
			particle.position = new THREE.Vector3(0, 0, 0);

		}

		if (properties.alive.value[i]) {
			
			
			particle.x += dt * properties.velocity.value[i].x;
			particle.y += dt * properties.velocity.value[i].y;
			particle.z += dt * properties.velocity.value[i].z;
			
			
			// colors[i].setHSV( Math.random(), 0, 0.9 + 0.1 * Math.random());
			// particle.alpha = properties.alpha.value[i];
			

			properties.alpha.value[i] = properties.lifespan;
		} else {
			properties.alpha.value[i] = 0;
		}

	}

	particleSystem.geometry.__dirtyVertices = true;

	renderer.clear();
	renderer.render(scene, camera);

	window.requestAnimationFrame(loop);

	t++;
	// console.log("loop");
}