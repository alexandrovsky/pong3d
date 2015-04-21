var App = {};




//gui.add(params, 'interation')

App.init = function () {
    App.clock = createClock();

    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    App.renderer = createRenderer(WIDTH, HEIGHT); // new THREE.WebGLRenderer();
    App.camera = createCamera(WIDTH, HEIGHT);

    App.scene = createScene();
    App.scene.add(App.camera);

    var result = fillScene(App.scene);
    App.ball = result['ball'];
    App.ground = result['ground'];
    App.paddle1 = result['paddle1'];
    App.paddle2 = result['paddle2'];
    App.cameraControls = new THREE.TrackballControls(App.camera, App.renderer.domElement);


    window.addEventListener( 'resize', App.onWindowResize, false )

    document.addEventListener("keydown", App.onKeyDownEvent, false);
    document.addEventListener("keyup", App.onKeyUpEvent, false);
};

App.start = function() {
    App.gameOver = false;
    App.animate();
};


var ballSpeed = 100.0
var ballDir = new THREE.Vector3(-1.0, 0.0, -1.0);
var raycaster = new THREE.Raycaster(new THREE.Vector3(0.0, 0.0, 0.0), ballDir, 0, groundX);
var lastDistance = groundX;
var player1Score = 0;
var player2Score = 0;

function resetBall(ball, player){
  ball.position.x = 0.0;
  //ball.position.y = 0.0;
  ball.position.z = 0.0;

  ballDir.x =  1.0;
  ballDir.y =  0.0;
  ballDir.z =  player == 1 ? 1.0 : -1.0;
}

function updateScore(score1, score2){
  // update scoreboard HTML
	document.getElementById("scores").innerHTML = score1 + "-" + score2;
};
function updateBall(scene, ball, deltaTime, ballDirection) {

    ball.position.x += ballDirection.x * ballSpeed * deltaTime;
    //ball.position.y += ballDirection.y * ballSpeed * deltaTime;
    ball.position.z += ballDirection.z * ballSpeed * deltaTime;


    // if(ball.position.x < -groundX/2) {
    //   ball.position.x = -groundX/2 + 2*ballRadius;
    // }else if(ball.position.x > groundX/2) {
    //   ball.position.x = groundX/2 - 2*ballRadius;
    // }
    //
    //
    // if(ball.position.z < -groundZ/2) {
    //   ball.position.z = -groundZ/2 + 2*ballRadius;
    // }else if(ball.position.z > groundZ/2) {
    //   ball.position.z = groundZ/2 - 2*ballRadius;
    // }


    // check goal:
    if(ball.position.z > groundZ/2) {
      // player 2 gets point
      player2Score++;
      updateScore(player1Score, player2Score);
      resetBall(ball, 2);
    }else if(ball.position.z < -groundZ/2){
      // player 1 gets point
      player1Score++;
      updateScore(player1Score, player2Score);
      resetBall(ball, 1);
    }

    raycaster.set(ball.position, ballDir);
    var intersects = raycaster.intersectObjects( scene.children );

    if (intersects.length > 0){

      var distance = intersects[0].distance;

      if(distance < ballRadius) {
        intersects[0].object.material.color.set( 0xff0000 );
        var normal = intersects[0].face.normal;
        ballDir = ballDirection.reflect(normal);
        lastDistance = distance;
      }

    }else {
      // handle goal here....
    }


}


var paddle1Dir = new THREE.Vector3(0.0, 0.0, 0.0);
var paddle2Dir = new THREE.Vector3(0.0, 0.0, 0.0);
var paddleSpeed = ballSpeed;



function updatePaddle(paddle, paddleSpeed, deltaTime, paddleDirection) {

  var newPos = new THREE.Vector3(paddleDirection.x * paddleSpeed * deltaTime,
                                 paddleDirection.y * paddleSpeed * deltaTime,
                                 paddleDirection.z * paddleSpeed * deltaTime);

  paddle.position.x += newPos.x;
  paddle.position.y += newPos.y
  paddle.position.z += newPos.z;


  if(paddle.position.x - paddleX/2 < -groundX/2) {
    paddle.position.x = -groundX/2 + paddleX/2;
  }else if(paddle.position.x + paddleX/2 > groundX/2) {
    paddle.position.x = groundX/2 - paddleX/2;
  }



}
var difficulty = 14;
// var paddle2BallDir = 0.0;
function updatePaddleAI(paddle, ball, paddleSpeed, deltaTime){

  var dir = new THREE.Vector3(0,0,0);
  if(ball.position.x < paddle.position.x){
    dir.x = -1;
  }else {
    dir.x = 1;
  }

  paddle2BallDir = (ball.position.x - paddle.position.x) * difficulty;

  if (Math.abs(paddle2BallDir) <= paddleSpeed)
  {
      paddle.position.x += paddle2BallDir * deltaTime;
  }
  // if the lerp value is too high, we have to limit speed to paddleSpeed
  else
  {
  	// if paddle is lerping in +ve direction
  	if (paddle2BallDir > paddleSpeed)
  	{
  		paddle.position.x += paddleSpeed * deltaTime;
  	}
  	// if paddle is lerping in -ve direction
  	else if (paddle2BallDir < -paddleSpeed)
  	{
  		paddle.position.x -= paddleSpeed * deltaTime;
  	}
  }






  return dir;

}
App.update = function(deltaTime) {

  updateBall(App.scene, App.ball, deltaTime, ballDir);
  updatePaddle(App.paddle1, paddleSpeed, deltaTime, paddle1Dir);

  paddle2Dir = updatePaddleAI(App.paddle2, App.ball, paddleSpeed, deltaTime);
  //updatePaddle(App.paddle2, paddleSpeed, deltaTime, paddle2Dir);

}

App.animate = function() {
	var delta = App.clock.getDelta();
  App.cameraControls.update();
  App.update(delta);
	App.renderer.render(App.scene, App.camera);



	if(!App.gameOver) window.requestAnimationFrame(App.animate);
};


App.onWindowResize = function onWindowResize() {

				App.camera.aspect = window.innerWidth / window.innerHeight;
				App.camera.updateProjectionMatrix();

				App.renderer.setSize( window.innerWidth, window.innerHeight );

			}

App.onKeyDownEvent = function(event) {
  var keyCode = event.which;
  switch(keyCode){
    case 37:
      paddle1Dir.x = -1.0;
      break;
    case 39:
      paddle1Dir.x = 1.0;
      break;
  }
};

App.onKeyUpEvent = function(event) {
  var keyCode = event.which;
  switch(keyCode){
    case 37:
    case 39:
      paddle1Dir.x = 0.0;
      break;
  }
};


function main(){
    App.init();
    App.start();
}
window.addEventListener("load", main);
