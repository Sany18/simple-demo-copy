import MeshTexture from 'assets/textures/mesh.png'

export default scene => {
  const texture = new THREE.TextureLoader().load(MeshTexture)
  const geometry = new THREE.PlaneGeometry(40, 50)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const plane = new THREE.Mesh(geometry, material)

  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.NearestFilter
  texture.wrapS = THREE.RepeatWrapping 
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(80, 100)

  plane.position.y = -0.01
  plane.position.z = -25
  plane.rotation.x = -Math.PI / 2
  scene.add(plane)
  return texture
}
