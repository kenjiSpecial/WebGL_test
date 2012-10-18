var container;
var camera, scene, renderer, sky, mesh, geometry, material, i, h, color, colors = [], sprite, size, x, y, z;

var mouseX = 0, mouseY = 0;
var start_time = new Date().getTime();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.Camera(30, window.innerWidth / window.innerHeight, 1, 3000);
	camera.position.z = 6000;

	scene = new THREE.Scene();

	geometry = new THREE.Geometry();

	var texture = THREE.ImageUtils.loadTexture('cloud.png');
	// texture.magFilter = THREE.LinearMipMapLinearFilter;
	//texture.minFilter = THREE.LinearMipMapLinearFilter;

	var fog = new THREE.Fog(0x4584b4, -100, 3000);

	console.log("texture: " + texture);
	console.log("fog.color: " + fog.color);
	console.log("fog.near: " + fog.near);
	console.log("fog.far" + fog.far);

	material = new THREE.MeshShaderMaterial({

		uniforms : {

			"map" : {
				type : "t",
				value : 2,
				texture : texture
			},
			"fogColor" : {
				type : "c",
				value : fog.color
			},
			"fogNear" : {
				type : "f",
				value : fog.near
			},
			"fogFar" : {
				type : "f",
				value : fog.far
			}

		},
		vertexShader : document.getElementById('vs').textContent,
		fragmentShader : document.getElementById('fs').textContent,
		depthTest : false

	});

	var plane = new THREE.Mesh(new THREE.Plane(64, 64));

	for ( i = 0; i < 8000; i++) {

		plane.position.x = Math.random() * 1000 - 500;
		plane.position.y = -Math.random() * Math.random() * 200 - 15;
		plane.position.z = i;
		plane.rotation.z = Math.random() * Math.PI;
		plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

		GeometryUtils.merge(geometry, plane);

	}

	mesh = new THREE.Mesh(geometry, material);
	scene.addObject(mesh);

	// mesh = new THREE.Mesh(geometry, material);
	// mesh.position.z = -8000;
	// scene.addObject(mesh);

	renderer = new THREE.WebGLRenderer({
		antialias : false
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

}

function animate() {

	requestAnimationFrame(animate);
	render();

}

function render() {

	renderer.render(scene, camera);

}