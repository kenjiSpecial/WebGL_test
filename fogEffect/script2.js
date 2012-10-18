var valfunc = function() {
	this.cam_posX = 0;
	this.cam_posY = 150;
	this.cam_posZ = 400;
};

var container;
var camera, scene, renderer, sky, mesh, geometry, material, i, h, color, colors = [], sprite, size, x, y, z;

var mouseX = 0, mouseY = 0;
var start_time = new Date().getTime();

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var cam_posX_val;
var cam_posY_val;
var cam_posZ_val;

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	renderer = new THREE.WebGLRenderer({
		antialias : true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();

	camera = new THREE.Camera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
	scene.add(camera);
	camera.position.set(0, 150, 400);
	camera.lookAt(scene.position);

	// geometry = new THREE.Geometry();
	//
	// var texture = THREE.ImageUtils.loadTexture('cloud.png');
	// texture.magFilter = THREE.LinearMipMapLinearFilter;
	// texture.minFilter = THREE.LinearMipMapLinearFilter;

	// var fog = new THREE.Fog(0x4584b4, -100, 3000);

	// material = new THREE.ShaderMaterial({
	//
	// uniforms : {
	//
	// "map" : {
	// type : "t",
	// value : 2,
	// texture : texture
	// },
	// "fogColor" : {
	// type : "c",
	// value : fog.color
	// },
	// "fogNear" : {
	// type : "f",
	// value : fog.near
	// },
	// "fogFar" : {
	// type : "f",
	// value : fog.far
	// },
	//
	// },
	// vertexShader : document.getElementById('vs').textContent,
	// fragmentShader : document.getElementById('fs').textContent,
	// depthTest : false
	//
	// });

	// var plane = new THREE.Mesh(new THREE.Plane(64, 64));
	// console.log("test")
	var axes = new THREE.AxisHelper();
	axes.scale.set(1, 1, 1);
	scene.add(axes);

	wireframeMaterial = new THREE.MeshBasicMaterial({
		color : 0x00ee00,
		wireframe : true,
		transparent : true
	});
	var plane = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100, 32, 32, 32), wireframeMaterial);
	scene.add(plane);
	// basicMesh = new THREE.Mesh(objGeom, wireframeMaterial);

	// for ( i = 0; i < 8000; i++) {
	//
	// plane.position.x = Math.random() * 1000 - 500;
	// plane.position.y = -Math.random() * Math.random() * 200 - 15;
	// plane.position.z = i;
	// plane.rotation.z = Math.random() * Math.PI;
	// plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
	//
	// THREE.GeometryUtils.merge(geometry, plane);
	//
	// }
	//
	// mesh = new THREE.Mesh(geometry, wireframeMaterial);
	// scene.add(mesh);
	//
	// mesh = new THREE.Mesh(geometry, wireframeMaterial);
	// mesh.position.z = -8000;
	// scene.add(mesh);
	//

	scene.add(plane);

}

function animate() {

	// requestAnimationFrame(animate);
	render();

}

function render() {

	// renderer.clear();
	renderer.render(scene, camera);

}