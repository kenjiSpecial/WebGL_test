var valfunc = function() {
	this.cam_posX = 0;
	this.cam_posY = 150;
	this.cam_posZ = 400;
};

var text = new valfunc();

var gui = new dat.GUI();
var cameraGui = gui.addFolder('Camera:');

var cam_psX_val = text.cam_posX;
var cam_psY_val = text.cam_posY;
var cam_psZ_val = text.cam_posZ;

var cam_PosX_gui = cameraGui.add(text, "cam_posX", -6000, 6000);
var cam_PosY_gui = cameraGui.add(text, "cam_posY", -6000, 6000);
var cam_PosZ_gui = cameraGui.add(text, "cam_posZ", -6000, 6000);

//initSetting

var width = window.innerWidth;
var height = window.innerHeight;

var renderer = new THREE.WebGLRenderer({
	antialias : true
});

//iniScene();

var scene = new THREE.Scene();

//initCamera
var VIEW_ANGLE = 30, ASPECT = width / height, NEAR = 0.1, FAR = 20000;

var camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

scene.add(camera);
camera.position.set(0, 200, 6000);
// camera.lookAt(scene.position);

var axes = new THREE.AxisHelper();
axes.scale.set(1, 1, 1);
scene.add(axes);

var geometry = new THREE.Geometry();

var texture = THREE.ImageUtils.loadTexture('cloud.png');
var Material = new THREE.MeshBasicMaterial({
	map : THREE.ImageUtils.loadTexture('cloud.png')
});
// texture.magFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapLinearFilter;

var fog = new THREE.Fog(0x4584b4, 1, 3000);

// console.log("texture: " + texture);
// console.log("fog.color: " + fog.color);
// console.log("fog.near: " + fog.near);
// console.log("fog.far" + fog.far);

var uniform = {

	map : {
		type : "t",
		value : 2,
		texture : texture
	},
	fogColor : {
		type : "c",
		value : fog.color
	},
	fogNear : {
		type : "f",
		value : fog.near
	},
	fogFar : {
		type : "f",
		value : fog.far
	}

};

material = new THREE.ShaderMaterial({

	uniforms : uniform,
	vertexShader : document.getElementById('vertexShader').textContent,
	fragmentShader : document.getElementById('fragmentShader').textContent,

	depthTest : false

});

//plane

var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));

for ( i = 0; i < 8000; i++) {

	plane.position.x = Math.random() * 1000 - 500;
	plane.position.y = -Math.random() * Math.random() * 200 - 15;
	plane.position.z = i;
	plane.rotation.z = Math.random() * Math.PI;
	plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

	THREE.GeometryUtils.merge(geometry, plane);
}

// scene.add(plane);

// var geometry = new THREE.Geometry()
// geometry.vertices.push(new THREE.Vector3(-10, 10, 0));
// geometry.vertices.push(new THREE.Vector3(-10, -10, 0));
// geometry.vertices.push(new THREE.Vector3(10, -10, 0));
// geometry.faces.push(new THREE.Face3(0, 1, 2));
// geometry.computeBoundingSphere();

var object = new THREE.Mesh(geometry, Material);
scene.add(object);

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
