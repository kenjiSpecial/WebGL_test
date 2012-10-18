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

var properties = {
	lifespan : 3,
	rebirth : -3,
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
	renderer.setClearColorHex(0xffffff, 1.0);
}

function initCamera() {
	camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

	camera.position.x = 100;
	camera.position.y = 200;
	camera.position.z = 50;

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

var particleCount = 10;
var geometry;

function initObjt() {
	geometry = new THREE.Geometry();

	var uniforms = {
		color : {
			type : "c",
			value : new THREE.Color(0xffffff)
		},
		texture : {
			type : "t",
			value : 0,
			texture : THREE.ImageUtils.loadTexture("circle.png")
		}
	};
	var attributes = {
		vcolor : {
			type : "c",
			value : []
		},
		alpha : {
			type : "f",
			value : []
		}
	};

	for (var i = 0; i < particleCount; i++) {
		geometry.vertices.push(new THREE.Vector3(2 * Math.random() - 1, 0, 2 * Math.random() - 1));

		var color = new THREE.Color(0xffffff);
		color.setHSV(0, 0, 0.9 + 0.1 * Math.random());

		attributes.vcolor.value.push(color);
		attributes.alpha.value.push(0);

		properties.alpha.value.push(0);
		properties.alive.value.push(false);
		properties.mass.value.push(0.5 + 0.5 * Math.random());
		properties.velocity.value.push(new THREE.Vector3(12 * Math.random() - 6, 2 * Math.random() + 3, 12 * Math.random() - 6));
		properties.force.value.push(new THREE.Vector3(3 * Math.random() - 1.5, 3 * Math.random() + 20, 3 * Math.random() - 1.5));
		properties.lifetime.value.push(-3 * Math.random());
	}

	// console.log(attributes.vcolor.value);
	var material = new THREE.ShaderMaterial({
		uniforms : uniforms,
		attributes : attributes,
		vertexShader : $("#vertext_program").text(),
		fragmentShader : $("#fragment_program").text(),
		transparent : true,
		depthWrite : true
	});
	
	particleSystem = new THREE.ParticleSystem(geometry, material);
	particleSystem.sortParticles = true;

	scene.add(particleSystem);
	// console.log("initObj");

}

function loop() {

	var dt = 0.1;
	update_particle(dt);
	renderer.render(scene, camera);

	window.requestAnimationFrame(loop);
}

function update_particle(dt) {
	// console.log(dt);
	for (var i = 0; i < particleCount; i++) {
		var particle = geometry.vertices[i];

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

}
