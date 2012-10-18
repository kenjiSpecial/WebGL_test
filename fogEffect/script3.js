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

// var floorMat = new THREE.MeshBasicMaterial({
	// map : THREE.ImageUtils.loadTexture('img/floorMaterial.jpg'),
	// transparent : true
// });
// 
// var fl3_Mesh = new THREE.Mesh(new THREE.PlaneGeometry(1040, 168), floorMat);
// fl3_Mesh.scale.x = 4000 / 1040;
// fl3_Mesh.scale.y = 600/168;
// fl3_Mesh.rotation.x = -Math.PI / 2;
// fl3_Mesh.position.y = -400;
// fl3_Mesh.position.z = 300;
// scene.add(fl3_Mesh);

var geometry = new THREE.Geometry();

var texture = THREE.ImageUtils.loadTexture('img/cloud.png');
var Material = new THREE.MeshBasicMaterial({
	map : THREE.ImageUtils.loadTexture('img/cloud.png'),
	transparent : false
});
// texture.magFilter = THREE.LinearMipMapLinearFilter;
// texture.minFilter = THREE.LinearMipMapLinearFilter;

var fog = new THREE.Fog(0x4584b4, 1, 3000);

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

for ( i = 0; i < 550; i++) {
	


	plane.position.x = Math.random() * 4000 - 2000;
	plane.position.y = -Math.random() * Math.random() * 10 -5-400;
	plane.position.z = i + 50;
	plane.rotation.z = Math.random() * Math.PI;
	plane.scale.x = plane.scale.y = Math.random() * Math.random() *2 + 0.5;

	THREE.GeometryUtils.merge(geometry, plane);
	
}
var mesh = new THREE.Mesh(geometry, Material);

scene.add(mesh);

// var geometry = new THREE.Geometry()
// geometry.vertices.push(new THREE.Vector3(-10, 10, 0));
// geometry.vertices.push(new THREE.Vector3(-10, -10, 0));
// geometry.vertices.push(new THREE.Vector3(10, -10, 0));
// geometry.faces.push(new THREE.Face3(0, 1, 2));
// geometry.computeBoundingSphere();

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
jm_bottle.position.y = 240 * 2.5-400-100;
scene.add(jm_bottle);


//sample mesh
var floor1_Mesh = new THREE.Mesh(new THREE.PlaneGeometry(4000, 600, 40, 6), wireframeMaterial);

// floor1_Mesh.position.z = 300;
floor1_Mesh.rotation.x = Math.PI / 2;
floor1_Mesh.position.y = -400;
floor1_Mesh.position.z = 300;
// scene.add(floor1_Mesh)



var floor2_Mesh = new THREE.Mesh(new THREE.PlaneGeometry(4000, 1000, 40, 10), wireframeMaterial);
floor2_Mesh.position.z = 600;
floor2_Mesh.position.y = -900;
scene.add(floor2_Mesh);

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
