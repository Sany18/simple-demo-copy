import * as THREE from 'three';
import * as OIMO from 'oimo';
import 'lib/global';
import 'assets/synthwave.scss';

window.THREE = THREE;
window.OIMO = OIMO;

if (process.env.NODE_ENV != 'development') {
  console.log(`License: without liense`);
}

window.loadTexture = name => {
  return new THREE.TextureLoader().load(
    `/textures/${name}`,
    texture => {},
    xhr => console.info((xhr.loaded / xhr.total * 100) + ' % loaded'), // temporarily unavailable
    xhr => console.info('Texture not loaded ' + name)
  )
}
