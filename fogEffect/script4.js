var valfunc = function() {
	this.cam_posX = 0;
	this.cam_posY = 1000;
	this.cam_posZ = 3000;
};

var text = new valfunc();

var cam_posX_val = text.cam_posX;
var cam_posY_val = text.cam_posY;
var cam_posZ_val = text.cam_posZ;

// ------------------------------

var gui = new dat.GUI();

var cam_PosX_gui = gui.add(text, "cam_posX", -2000, 2000);
var cam_PosY_gui = gui.add(text, "cam_posY", -1000, 3000);
var cam_PosZ_gui = gui.add(text, "cam_posZ", 0, 6000);

// 	---------------------------------------------------------
// 	---------------------------------------------------------
// 	---------------------------------------------------------

//change the basic mesh

cam_PosX_gui.onChange(function(value) {
	// Fires on every change, drag, keypress, etc.
	cam_posX_val = value;
	camera.position.set(cam_posX_val, cam_posY_val, cam_posZ_val);
	camera.lookAt(scene.position);
	// rendering();
});

cam_PosY_gui.onChange(function(value) {
	cam_posY_val = value;
	camera.position.set(cam_posX_val, cam_posY_val, cam_posZ_val);
	camera.lookAt(scene.position);
	// rendering();
	// Fires on every change, drag, keypress, etc.
});

cam_PosZ_gui.onChange(function(value) {
	cam_posZ_val = value;
	camera.position.set(cam_posX_val, cam_posY_val, cam_posZ_val);
	camera.lookAt(scene.position);
	// rendering();

});

//initSetting

var width = 1341;
var height = 547;

var renderer = new THREE.WebGLRenderer({
	antialias : true
});

//iniScene();

var scene = new THREE.Scene();

//initCamera
var VIEW_ANGLE = 30, ASPECT = width / height, NEAR = 0.1, FAR = 20000;

var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

scene.add(camera);
camera.position.set(cam_posX_val, cam_posY_val, cam_posZ_val);
camera.lookAt(scene.position);

var axes = new THREE.AxisHelper();
axes.scale.set(1, 1, 1);
axes.position.x = 1200;
axes.position.y = 500;
axes.position.z = 1000;
scene.add(axes);

var geometry = new THREE.Geometry();

var texture = THREE.ImageUtils.loadTexture('img/cloud.png');
var Material = new THREE.MeshBasicMaterial({
	map : THREE.ImageUtils.loadTexture('img/cloud.png'),
	transparent : false
});

var object = new THREE.Mesh(geometry, Material);

// scene.add(object);

var plateMaterial = new THREE.MeshBasicMaterial({
	map : THREE.ImageUtils.loadTexture('img/JM_Back.jpg')
});

// 1339 * 578 back ground
var plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(1341, 578), plateMaterial);
plateMesh.scale.x = 4;
plateMesh.scale.y = 3;
plateMesh.position.y = 0;
scene.add(plateMesh);

var wireframeMaterial = new THREE.MeshBasicMaterial({
	color : 0xeeeeee,
	wireframe : true,
	transparent : true
});

//bottle material img and locate
var jmBotMat = new THREE.MeshBasicMaterial({
	map : THREE.ImageUtils.loadTexture('img/JM_Bottle.png'),
	transparent : true
});
var jm_bottle = new THREE.Mesh(new THREE.PlaneGeometry(225, 480), jmBotMat);
jm_bottle.scale.x = 2.5;
jm_bottle.scale.y = 2.5;
jm_bottle.position.x = 1000;
jm_bottle.position.z = 300;
jm_bottle.position.y = 240 * 2.5 - 400 - 100;
scene.add(jm_bottle);

//sample mesh
var floor1_Mesh = new THREE.Mesh(new THREE.PlaneGeometry(4000, 600, 40, 6), wireframeMaterial);

// floor1_Mesh.position.z = 300;
floor1_Mesh.rotation.x = Math.PI / 2;
floor1_Mesh.position.y = -400;
floor1_Mesh.position.z = 300;
scene.add(floor1_Mesh)

var floor2_Mesh = new THREE.Mesh(new THREE.PlaneGeometry(4000, 1000, 40, 10), wireframeMaterial);
floor2_Mesh.position.z = 600;
floor2_Mesh.position.y = -900;
scene.add(floor2_Mesh);

//----------------
//particle
//----------------

var particlesLength = 70000;

var particles = new THREE.Geometry();

function newpos(x, y, z) {

	return new THREE.Vector3(x, y, z);

}

var Pool = {

	__pools : [],

	// Get a new Vector

	get : function() {

		if (this.__pools.length > 0) {

			return this.__pools.pop();

		}

		console.log("pool ran out!")
		return null;

	},

	// Release a vector back into the pool

	add : function(v) {

		this.__pools.push(v);

	}
};

for ( i = 0; i < particlesLength; i++) {

	particles.vertices.push(newpos(Math.random() * 200 - 100, Math.random() * 100 + 150, Math.random() * 50));
	Pool.add(i);

}

// Create pools of vectors

attributes = {

	size : {
		type : 'f',
		value : []
	},
	pcolor : {
		type : 'c',
		value : []
	}

};

var sprite = generateSprite();

texture = new THREE.Texture(sprite);
texture.needsUpdate = true;

uniforms = {

	texture : {
		type : "t",
		value : 0,
		texture : texture
	}

};

function generateSprite() {
	var canvas = document.createElement('canvas');
	canvas.width = 128;
	canvas.height = 128;

	var context = canvas.getContext('2d');
	context.beginPath();
	context.arc(64, 64, 60, 0, Math.PI * 2, false);
	context.closePath();

	context.lineWidth = 0.5;
	//0.05
	context.stroke();
	context.restore();

	var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

	gradient.addColorStop(0, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
	gradient.addColorStop(0.4, 'rgba(200,200,200,1)');
	gradient.addColorStop(1, 'rgba(0,0,0,1)');

	context.fillStyle = gradient;

	context.fill();

	return canvas;
}

var shaderMaterial = new THREE.ShaderMaterial({

	uniforms : uniforms,
	attributes : attributes,

	vertexShader : document.getElementById('vertexshader').textContent,
	fragmentShader : document.getElementById('fragmentshader').textContent,

	blending : THREE.AdditiveBlending,
	depthWrite : false,
	transparent : true

});

particleCloud = new THREE.ParticleSystem(particles, shaderMaterial);

particleCloud.dynamic = true;
scene.add(particleCloud);

//----------------
//rendering
//----------------

renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

animate();

function animate() {

	requestAnimationFrame(animate);
	renderer.render(scene, camera);

}
