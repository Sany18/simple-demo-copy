import RoadTexture from '../assets/textures/road.png'

export default scene => {
  const state = {
    repeatTexture: 50,
    size: 2
  }

  const texture = new THREE.TextureLoader().load(RoadTexture)
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.minFilter = THREE.LinearFilter
  texture.repeat.set(1, state.repeatTexture)

  const material = new THREE.MeshLambertMaterial({
    map: texture
  })
  const geometry = new THREE.PlaneGeometry(state.size, state.repeatTexture)

  const plane = new THREE.Mesh(geometry, material)
  plane.rotation.x = -Math.PI / 2
  plane.position.set(0, .001, -25)

  scene.add(plane)
  return texture
}
