function ParticleSystem(){
    this.properties = {
        lifeSpan: 3,
        rebirth: -3,
        ext_froce: new THREE.Vector3(10, 0, 0),
        alive: { value: []},
        mass: { value: []},
        velocity: { value: [] },
        force: { value: [] },
        lifetime: { value:[]}
    };

    this.shadermaterial = null;
    this.geometry =new THREE.Geometry();
    this.particleCount = 1000;
    this.sphere = null;

    this.PosX_min = 0;
    this.PosX_max = 0;

    this.PosY_min = 0;
    this.PosY_max = 0;

    this.PosZ_min = 0;
    this.PosZ_max = 0;

}

//----------------------------------------------
//
// setting the shader
//
//----------------------------------------------

ParticleSystem.prototype.setShader = function( uni_str, att_str, ver_str, fra_str, depCheck, depTra){
    this.shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uni_str,
        attributes: att_str,
        vertexShader: ver_str,
        fragmentShader: fra_str,
        depthTest: depCheck,
        transparent: depTra
    });
}

//----------------------------------------------
//
// setting the particlecount
//
//----------------------------------------------

ParticleSystem.prototype.setParticleCount = function(num){
    this.particleCount = num;
}


//---------------------------------------------
//
// setting the geomerty vertices
//
//----------------------------------------------

ParticleSystem.prototype.setVertice = function( minX, maxX, minY, maxY, minZ, maxZ){
    this.PosX_min = minX;
    this.PosX_max = maxX;

    this.PosY_min = minY;
    this.PosY_max = maxY;

    this.PosZ_min = minZ;
    this.PosZ_max = maxZ;

    for(var i = 0; i < this.particleCount; i++){
        var vertex = new THREE.Vector3();
        vertex.x = minX + (maxX - minX) * Math.random();
        vertex.y = minY + (maxY - minY) * Math.random();
        vertex.z = minZ + (maxZ - minZ) * Math.random();

        this.geometry.vertices.push(vertex);
    }
}



//-----------------------------------------------------
//---------------------------------------------
//
// setting the each mass vertices
//
//----------------------------------------------
//-----------------------------------------------------

ParticleSystem.prototype.setMass= function( minMass, maxMass){
    for(var i = 0; i < this.particleCount; i++){
        this.properties.mass.value.push( minMass + (maxMass - minMass) * Math.random());
    }
}

//----------------------------------------------
//
// setting the alive value
//
//----------------------------------------------

ParticleSystem.prototype.setAlive = function( aliveVal){
    for(var i = 0; i < this.particleCount; i++){
        this.properties.alive.value.push(aliveVal);
    }
}

//---------------------------------------------
//
// setting the firstVelocity
//
//----------------------------------------------

ParticleSystem.prototype.setVelocity = function( minVelX, maxVelX, minVelY, maxVelY, minVelZ, maxVelZ){
    for(var i = 0; i < this.particleCount; i++){

        this.properties.velocity.value.push( new THREE.Vector3(minVelX + (maxVelX - minVelX) * Math.random(),
                                                         minVelY + (maxVelY - minVelY) * Math.random(),
                                                         minVelZ + (maxVelZ - minVelZ) * Math.random()));

    }
}

//---------------------------------------------
//
// setting the force
//
//----------------------------------------------

ParticleSystem.prototype.setForce = function( minForX, maxForX, minForY, maxForY, minForZ, maxForZ){
    for(var i = 0; i < this.particleCount; i++){

        this.properties.velocity.value.push(
            new THREE.Vector3(
                minForX + (maxForX - minForX) * Math.random(),
                minForY + (maxForY - minForY) * Math.random(),
                minForZ + (maxForZ - minForZ) * Math.random())
        );
    }
}

//---------------------------------------------
//
// setting the lifetime
//
//----------------------------------------------

ParticleSystem.prototype.setlifetime = function(lifeTimeVal){
    for(var i = 0; i < this.particleCount; i++){
        this.properties.lifetime.value.push( lifeTimeVal * Math.random());
    }
}

//---------------------------------------------------
//---------------------------------------------
//
// setting the Init
//
//----------------------------------------------
//---------------------------------------------------

ParticleSystem.prototype.setInit = function( dynamicVal, sortVal, scene){
    this.sphere = new THREE.ParticleSystem( this.geometry, this.shaderMaterial);
    this.sphere.dynamic = dynamicVal;
    this.sphere.sortParticles = sortVal;

    scene.add(this.sphere);

}


//---------------------------------------------------
//---------------------------------------------
//
// setting the update
//
//----------------------------------------------
//---------------------------------------------------

ParticleSystem.prototype.setUpdate = function(dt, attributes){
//    console.log(this.particleCount);
    for(var i = 0; i < this.particleCount; i++){
        this.properties.lifetime.value[i] -= dt;
        var geoPos = this.geometry.vertices[i];

        if(this.properties.alive.value[i] && this.properties.lifetime.value[i] <= 0){

            this.properties.alive.value[i] = false;
            this.properties.lifetime.value[i] = this.properties.rebirth * Math.random();

        }else if(this.properties.lifetime.value <= this.properties.rebirth){

            this.properties.alive[i] = true;
            this.properties.lifetime.value[i] = this.properties.lifeSpan;
            geoPos.x = this.PosX_min + (this.PosX_max - this.PosX_min) * Math.random();
            geoPos.y = this.PosY_min + (this.PosY_max - this.PosY_min) * Math.random();
            geoPos.z = this.PosZ_min + (this.PosZ_max - this.PosZ_min) * Math.random();

            this.properties.velocity.value[i].x = this.properties.velocity.value[i].y = this.properties.velocity.value[i].z = 0;

        }

        if(this.properties.alive.value[i]){
            //*** exercies ***
            this.properties.velocity.value[i].x += this.properties.force.value[i].x / this.properties.mass.value[i];
            this.properties.velocity.value[i].y += this.properties.force.value[i].y / this.properties.mass.value[i];
            this.properties.velocity.value[i].z += this.properties.force.value[i].z / this.properties.mass.value[i];

            geoPs.x += this.properties.velocity.value[i].x * dt;
            geoPs.y += this.properties.velocity.value[i].y * dt;
            geoPs.z += this.properties.velocity.value[i].z * dt;

            attributes.alpha.value[i] = this.properties.lifetime.value[i]/properties.lifeSpan;


        }else{
            attributes.alpha.value[i] = 0;
        }

    }

//    this.sphere.geometry.__dirtyVertices = true;

}