import * as THREE from 'three';

export const loadTexture = (name: string) => {
  return new THREE.TextureLoader().load(
    `${process.env.REST_PATH_PREFIX || ''}/assets/textures/${name}`,
    texture => {},
    xhr => console.info((xhr.loaded / xhr.total * 100) + ' % loaded'), // temporarily unavailable
    xhr => console.warn('Texture not loaded ' + name)
  )
}
