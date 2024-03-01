import * as Textures from '../assets/textures/skybox'
// import sb from '../assets/textures/skybox.png'

export default (scene, renderer) => {
  scene.background = new THREE.CubeTextureLoader().load(
    Array(6).fill().map((_, i) => Textures['T' + (i + 1)])
  )

  // const texture = new THREE.TextureLoader().load(
  //   sb,
  //   () => {
  //     const rt = new THREE.WebGLCubeRenderTarget(texture.image.height)
  //     rt.fromEquirectangularTexture(renderer, texture)
  //     scene.background = rt
  //   }
  // )
}
