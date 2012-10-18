

var renderer, scene, camera;

var sphere, uniforms, attributes;
var geometry;

var properties;

var noise = [];

var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var particleCount

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

    properties = {
        lifeSpan: 3000,
        rebirth: -3000,
        ext_froce: new THREE.Vector3(10, 0, 0),
        alive: { value: []},
        mass: { value: []},
        velocity: { value: [] },
        force: { value: [] },
        lifetime: { value:[]}
    };


    var shaderMaterial = new THREE.ShaderMaterial( {

        uniforms: 		uniforms,
        attributes:     attributes,
        vertexShader:   document.getElementById( 'vertexshader' ).textContent,
        fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
        depthTest: 		true,
        transparent:	true

    });

    console.log(shaderMaterial);

    particleCount = 2000;
    geometry = new THREE.Geometry();

    for ( var i = 0; i < particleCount; i++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 2 - 1;
        vertex.y = -500;
        vertex.z = Math.random() * 2 - 1;

        geometry.vertices.push( vertex );

        var color = new THREE.Color();
        var val = .1 + 0.3 * Math.random();
        color.setRGB(val, val, val);

//        color.setHSV(0.0, 0.0, 0.5 + 0.5 * Math.random());

        attributes.vcolor.value.push(color);
        attributes.alpha.value.push(0);

        properties.alive.value.push(false);
        properties.mass.value.push( 0.5 + 0.5 * Math.random());
        properties.velocity.value.push( new THREE.Vector3( 12 * Math.random() - 6, 2 * Math.random() + 3, 12 * Math.random() - 6));
        properties.force.value.push(new THREE.Vector3( 3 * Math.random() + 50, 30 * Math.random() - 15, 3 * Math.random() - 1.5));
        properties.lifetime.value.push( -3000 * Math.random());
    }

    sphere = new THREE.ParticleSystem( geometry, shaderMaterial );

    sphere.dynamic = true;
    sphere.sortParticles = true;



    scene.add( sphere );

    renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1 } );
    renderer.setSize( WIDTH, HEIGHT );

    var container = document.getElementById( 'container' );
    container.appendChild( renderer.domElement );


}

var prevDate, curDate;

function animate() {

    requestAnimationFrame( animate );
//    console.log("properties.rebirrth: " + properties.rebirrth);
    render();

}

function render() {

    curDate = Date.now();
    var dt = (curDate - prevDate) | 0;
//    console.log(dt);

    for(var i = 0; i < particleCount; i++){

        properties.lifetime.value[i] -= dt;
        //if(i == 0) console.log("lifetime: "+ properties.lifetime.value[i]);
        var geoPs = geometry.vertices[i];


        if(properties.alive.value[i] && properties.lifetime.value[i] <= 0){

            properties.alive.value[i] = false;
            properties.lifetime.value[i] = properties.rebirth * Math.random();


        }else if(properties.lifetime.value[i] <= properties.rebirth){

            properties.alive.value[i] = true;
            properties.lifetime.value[i] = properties.lifeSpan;
            geoPs.x  = geoPs.z = 0;
            geoPs.y = -500;
            properties.velocity.value[i].x = properties.velocity.value[i].y = properties.velocity.value[i].z = 0;
        }

        if(properties.alive.value[i]){
            // calculation of the position
            properties.velocity.value[i].x += properties.force.value[i].x / properties.mass.value[i];
            properties.velocity.value[i].y += properties.force.value[i].y / properties.mass.value[i];
            properties.velocity.value[i].z += properties.force.value[i].z / properties.mass.value[i];

            geoPs.x +=properties.velocity.value[i].x * dt/10000;
            geoPs.y +=properties.velocity.value[i].y * dt/10000;
            geoPs.z +=properties.velocity.value[i].z * dt/10000;


            attributes.alpha.value[i] = properties.lifetime.value[i]/properties.lifeSpan;

        }else{
            attributes.alpha.value[i] = 0;
        }

    }
    sphere.geometry.__dirtyVertices = true;

    prevDate = curDate;

    renderer.clear();
    renderer.render( scene, camera );

}