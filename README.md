# WASD first person control in p5.js

[Try out the DEMO here](https://datramt.github.io/WASD-first-person-control-in-p5.js/)

This is a simple Implementation of a WASD + mouse first-person character controller in p5.js. WASD first-person control requires a “Pointer Locker” whereas the mouse cursor becomes invisible and locked within the bounds of the canvas. Without a cursor locker, it becomes extremely difficult to simulate a 360° rotation of the character camera without the mouse cursor exiting the canvas bounds, and terminating movement when the cursor collides with the edge of the user’s screen. The Pointer Lock API allows for limitless x/y mouse motion. 

[Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)

### pointer lock code

Add event listeners
```
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
```

Define pointer lock function 

```
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
}

```
Define movement mouse movement callbacks
```
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
```

Get indefinite mouse movement data 
```
function updatePosition(endless) {
  endlessMouseX += endless.movementX*mouseSensitivity;
  endlessMouseY += endless.movementY*mouseSensitivity;
  theta = (endlessMouseX-PI/2)%TWO_PI;
}
```

Call PointerLock() within the setup() function
```
PointerLock();
```

### Camera math

with indefinite mouse movement detection, we can then use variables “endlessMouseX” and “endlessMouseY” as angles for the p5.js camera:

```
  camera(
    playerPos.x, 0, (height/2) / tan(PI/6)+playerPos.y, -cos(endlessMouseX)*1000000+playerPos.x,
    endlessMouseY*1000000, -sin(endlessMouseX)*1000000+playerPos.y,
    0, 1, 0
  );
```

…convert the polar coordinates to cartesian

```
function polToCar(r, theta) {
  return createVector(r * cos(theta), r * sin(theta));
}
```

…and add that vector to the player’s current position

```
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
```

Feel free to use the code for your own 3D WASD first-person control games! add collision boxes/detection, gravity, jumping, shooting, etc. Mentions of my contribution in your code would be much appreciated :)

![alt text](https://raw.githubusercontent.com/datramt/WASD-first-person-control-in-p5.js/gh-pages/WASD.png)
