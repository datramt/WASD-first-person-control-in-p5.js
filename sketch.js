//3d WASD control in p5.js
// © Dan Tramte 2018

let starfield = [];
let starquantity;
let scrolldelta;
let playerPos;
let endlessMouseX;
var endlessMouseY;
let mouseSensitivity;
let theta;
let keyW = false;
let keyA = false;
let keyS = false;
let keyD = false;

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

function polToCar(r, theta) {
  return createVector(r * cos(theta), r * sin(theta));
}

function setup() {
  createCanvas(600, 600, WEBGL);
  PointerLock();
  randomSeed(5);
  starquantity = 100;
  ambientMaterial(250, 30, 40);
  directionalLight(255, 255, 255, 30, 100, -500);
  noStroke();
	mouseSensitivity = 0.005;
  playerPos = createVector(0, 0);
  theta = 0;

  for (let i = 0; i < starquantity; i++) {
  	starfield[i] = createVector(random(-2000, 2000), random(-2000, -300), random(-2000, 2000));
  }
  endlessMouseX = PI/2;
	endlessMouseY = 0;
  scrolldelta = 0;
}

function draw() {
  background(40);

  camera(
    playerPos.x, 0, (height/2) / tan(PI/6)+playerPos.y, -cos(endlessMouseX)*1000000+playerPos.x,
    endlessMouseY*1000000, -sin(endlessMouseX)*1000000+playerPos.y,
    0, 1, 0
  );
  //draw stars
  ambientMaterial(200, 150, 205);
  directionalLight(255, 255, 255, 30, 100, -500);
 	for (let i = 0; i < starquantity; i++) {
    push();
  	translate(starfield[i].x, starfield[i].y, starfield[i].z);
    sphere(4);
    pop();
  }
  //drawobject
  ambientMaterial(250, 30, 40);
  push();
  translate(0, 0, -500);
  box(50, 50);
  pop();
  //draw terrain
  fill(80);
  push();
  translate(0, 100, 0);
  box(100000, 1, 100000);
  pop();
  wasd();
}

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    document.removeEventListener("mousemove", updatePosition, false);
  }
}

function updatePosition(endless) {
  endlessMouseX += endless.movementX*mouseSensitivity;
  endlessMouseY += endless.movementY*mouseSensitivity;
  theta = (endlessMouseX-PI/2)%TWO_PI;
}

//removes cursur & allows infinite x/y input
function PointerLock() {
  canvas = document.querySelector('canvas');
  canvas.requestPointerLock = canvas.requestPointerLock ||
   	                        	canvas.mozRequestPointerLock;
	document.exitPointerLock = 	document.exitPointerLock ||
   	                       		document.mozExitPointerLock;
	canvas.onclick = function() {
    if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    } else {
		canvas.requestPointerLock();
    }
	};
}

//optionally, walk forward/backward using mouse wheel
function mouseWheel(event) {
  scrolldelta += event.delta;
  let step = polToCar(-event.delta*0.1, (theta-PI/2));
  playerPos.add(step);
  return false;
}

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = true;
      break;
    case 83: //s
      keyS = true;
      break;
    case 65: //a
      keyA = true;
      break;
    case 87: //w
      keyW = true;
      break;
  }
}

function onKeyUp(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 68: //d
      keyD = false;
      break;
    case 83: //s
      keyS = false;
      break;
    case 65: //a
      keyA = false;
      break;
    case 87: //w
      keyW = false;
      break;
  }
}

function wasd() {
	let forwardstep = polToCar(5, (theta-PI/2));
  let backstep = polToCar(-5, (theta-PI/2));
  let rightstep = polToCar(5, (theta));
  let leftstep = polToCar(-5, (theta));
  if (keyD == true) {
    playerPos.add(rightstep);
  }
  if (keyS == true) {
    playerPos.add(backstep);
  }
  if (keyA == true) {
    playerPos.add(leftstep);
  }
  if (keyW == true) {
    playerPos.add(forwardstep);
  }
}
