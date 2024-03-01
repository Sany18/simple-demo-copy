export default (camera, iframeDocument)  => {
  let moveForward = false
  let moveBackward = false
  let moveLeft = false
  let moveRight = false
  let rotationLeft = false
  let rotationRight = false
  let moveUp = false
  let moveDown = false
  let euler = new THREE.Euler(0, 0, 0, 'YXZ')
  let direction = new THREE.Vector3(0, 0, 0)
  let config = {
    moveSpeed: 0.1
  }

  iframeDocument.getElementById('renderer')
                .addEventListener('click', () => iframeDocument.body.requestPointerLock())
  iframeDocument.addEventListener('mousemove', event => {
    if (!iframeDocument.pointerLockElement) return

    let movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0
    let movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0

    euler.y -= movementX * 0.002
    euler.x -= movementY * 0.002
    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))

    camera.quaternion.setFromEuler(euler).normalize()
  }, false)

  iframeDocument.addEventListener('keydown', event => {
    switch (event.keyCode) {
      case 38: case 87: moveForward = true; break;  // W forward
      case 40: case 83: moveBackward = true; break; // S back
      case 37: case 65: moveLeft = true; break;     // A left
      case 39: case 68: moveRight = true; break;    // D right
      case 32: moveUp = true; break;                // Space up
      case 16: moveDown = true; break;              // Shift down
      case 81: rotationLeft = true; break;          // Q rotation left
      case 69: rotationRight = true; break;         // E rotation right
      default: break;
    }
  })

  iframeDocument.addEventListener('keyup', event => {
    switch (event.keyCode) {
      case 38: case 87: moveForward = false; break;  // forward
      case 40: case 83: moveBackward = false; break; // back
      case 37: case 65: moveLeft = false; break;     // left
      case 39: case 68: moveRight = false; break;    // right
      case 32: moveUp = false; break;                // Space up
      case 16: moveDown = false; break;              // Shift down
      case 81: rotationLeft = false; break;          // rotation left
      case 69: rotationRight = false; break;         // rotation right
      default: break;
    }
  })

  direction.y = camera.position.y
  const control = delta => {
    direction.z = +moveForward - +moveBackward
    direction.x = +moveLeft - +moveRight
    direction.y = +moveUp - +moveDown
    euler.y += (+rotationLeft - +rotationRight) * delta

    if (moveForward || moveBackward) { direction.z = direction.z * config.moveSpeed * -delta }
    if (moveLeft || moveRight)       { direction.x = direction.x * config.moveSpeed * -delta }
    if (moveUp || moveDown)          { direction.y = direction.y * config.moveSpeed * delta }

    camera.translateX(direction.x)
    camera.translateZ(direction.z)
    camera.translateY(direction.y)
    camera.quaternion.setFromEuler(euler).normalize()
  }

  return control
}
