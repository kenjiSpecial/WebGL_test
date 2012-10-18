

var renderer, scene, camera;

var sphere, uniforms, attributes;
var geometry;

var properties;

var noise = [];

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var particleCount;
var particleObject = new ParticleSystem();

window.onload = main;


function main(){
    init();
    prevDate = Date.now();
    animate();
}


function init() {

    camera = new THREE.PerspectiveCamera( 40, WIDTH / HEIGHT, 1, 10000 );
    camera.position.z = 500;
    camera.position.y = 500;
    camera.lookAt({
        x : 0,
        y : 0,
        z : 0
    });


    scene = new THREE.Scene();

    attributes = {

        alpha: {	type: 'f', value: [] },
        vcolor: { type: 'c', value: [] }

    };

    uniforms = {

        color:     { type: "c", value: new THREE.Color( 0xffffff ) },
        texture:   { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "circle.png" ) }
    };

    var vertexShaderText = document.getElementById( 'vertexshader' ).textContent;
    var fragmentShaderText = document.getElementById( 'fragmentshader' ).textContent;

    //initializing particle;
    particleObject.setShader( uniforms, attributes, vertexShaderText, fragmentShaderText, true, true);
    particleObject.setParticleCount(2000);
    particleObject.setVertice( -2, 2, -2, 2, -300, -300);

    //----------------

    particleObject.setMass(0.5, 1.0);
    particleObject.setAlive(false);
    particleObject.setVelocity( -6, 6, 2, 5, -6, 6);
    particleObject.setForce( -2, 2, 40, 50, -2, 2);
    particleObject.setlifetime(3);

    //-------------------

    for(var i = 0; i < particleCount; i++){
        var color = new THREE.Color();
        var val = .1 + 0.3 * Math.random();
        color.setRGB(val, val, val);

        attributes.vcolor.value.push(color);
        attributes.alpha.value.push(0);
    }

    //-------------------

    scene.add(particleObject);



    renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
    renderer.setSize( WIDTH, HEIGHT );

    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );


}

var prevDate, curDate;
//var testDate = new Date();

function animate() {

    requestAnimationFrame( animate );
//    console.log("properties.rebirrth: " + properties.rebirrth);
    render();

}

function render() {

    curDate = Date.now();
    var dt = (curDate - prevDate)/1000 ;
    console.log(dt);


    particleObject.setUpdate(dt, attributes);
    renderer.render( scene, camera );

    prevDate = curDate;

}