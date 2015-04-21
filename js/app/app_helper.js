/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


 groundX = 250;
 groundY = 1;
 groundZ = 600;


 paddleX = 30;
 paddleY = 20;
 paddleZ = 10;

function createPaddle(){

  var geometry = new THREE.BoxGeometry( paddleX, paddleY, paddleZ );
  var material = new THREE.MeshLambertMaterial( {color: 0xccaabb } );  new THREE.MeshNormalMaterial();//new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var paddle = new THREE.Mesh( geometry, material );
  paddle.castShadow = true;
  paddle.receiveShadow = true;

  return paddle;
}



function createAndAddPlayfield(scene) {

  var ground = createGround();
  scene.add(ground);

  var wallLeft = createSideWall();
  wallLeft.position.set( -groundX/2, groundX/2, 0.0 );
  scene.add(wallLeft);


  var wallRight = createSideWall();
  wallRight.position.set( groundX/2, groundX/2, 0.0 );
  scene.add(wallRight);

  // var wallFront = createFrontWall();
  // wallFront.position.set(0.0, groundX/2, -groundZ/2 );
  // scene.add(wallFront);


  // var backWall= createFrontWall();
  // backWall.position.set(0.0, groundX/2, groundZ/2 );
  // scene.add(backWall);

  return ground

}


function createFrontWall() {
  material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
  geometry = new THREE.BoxGeometry( groundX, groundX, groundY );
  wall = new THREE.Mesh( geometry, material );

  wall.castShadow = true;
  wall.receiveShadow = true;

  return wall;
}

function createSideWall() {
  material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
  geometry = new THREE.BoxGeometry( groundY, groundX, groundZ );
  wall = new THREE.Mesh( geometry, material );

  wall.castShadow = true;
  wall.receiveShadow = true;

  return wall;
}

function createGround() {

  material = new THREE.MeshLambertMaterial( {color: 0xaaaaaa } );
  geometry = new THREE.BoxGeometry( groundX, groundY, groundZ );
  ground = new THREE.Mesh( geometry, material );
  ground.position.set( 0, -groundY, 0 );
  ground.castShadow = true;
  ground.receiveShadow = true;

  return ground;
}

var ballRadius = 5;
var ballSegments = 24;
var ballRings = 24;


function createBall() {

  var ballMaterial = new THREE.MeshLambertMaterial({ color: 0xD43001 });

  // Create a ball with sphere geometry
  var ball = new THREE.Mesh(  new THREE.SphereGeometry(ballRadius, ballSegments, ballRings),
                              ballMaterial);
  return ball;

}

function fillScene(scene) {
    // some objects


    // ball
    var ball = createBall();
    ball.position.y = ballRadius;
    scene.add(ball);


    // ground plane
    var ground = createAndAddPlayfield(scene); //createGround();
    //scene.add(ground);


    var paddle1 = createPaddle();
    var paddle2 = createPaddle();

    paddle1.position.z = groundZ/2 -  2 * paddleZ;
    paddle2.position.z = -groundZ/2 + 2 * paddleZ;
    paddle1.position.y = paddleZ;
    paddle2.position.y = paddleZ;



    scene.add(paddle1);
    scene.add(paddle2);

    return {'ball': ball, 'ground':ground, 'paddle1':paddle1, 'paddle2':paddle2};
}

function createClock() {
    var clock = new THREE.Clock();
    return clock;
}

function createScene() {
    var scene = new THREE.Scene();
//    scene.fog = new THREE.Fog( 0xDDDDDD, 3000, 4000 );
    // LIGHTS

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    //  Lights
    light = new THREE.AmbientLight( 0x333333);
    light.color.setHSL( 0.1, 0.5, 0.3 );
    scene.add( light );
    light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 0, 500, 0 );
    light.castShadow = true;
    light.shadowMapWidth = 2048;
    light.shadowMapHeight = 2048;
    var d = 200;
    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d * 2;
    light.shadowCameraBottom = -d * 2;
    light.shadowCameraNear = 100;
    light.shadowCameraFar = 600;
//		light.shadowCameraVisible = true;
    scene.add( light );

    var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set(00, 100, 0.0 );

  spotLight.castShadow = true;

  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;

  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;

  scene.add( spotLight );





    return scene;
}

function createRenderer(width, height) {
    var renderer = new THREE.WebGLRenderer();

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.setSize( width, height );

    renderer.setClearColor( 0xdddddd );
    //document.body.appendChild( renderer.domElement );
    var c = document.getElementById("gameCanvas");
    c.appendChild(renderer.domElement);

    /* don't clear when second viewport is drawn
     *  renderer.autoClear = false;
     */
    //renderer.autoClear = false;
    return renderer;
}

function createCamera(width, height) {

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = width/height,
        NEAR = 0.1,
        FAR = 10000;

    var camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
    //camera.position.z = 25;
    camera.position.set( 0.0, groundZ/2, groundZ );

    return camera;
}
