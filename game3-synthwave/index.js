import './importer'
import {
  DirectionLight, Floor, FlyCameraControl, Skybox,
  Road, StreetLight, Billboard, Mp3Player, Car
} from './objects/index.js'
import Mountain from './objects/mountains/mountain1'

import { EffectComposer } from 'lib/postprocessing/EffectComposer'
import { RenderPass } from 'lib/postprocessing/RenderPass'
import { FilmPass } from 'lib/postprocessing/FilmPass'
import { AnaglyphEffect } from 'lib/effects/AnaglyphEffect'

import Stats from 'lib/stats.js'
import handleListeners from './listeners'

const scene = new THREE.Scene()
const clock = new THREE.Clock()
const stats = new Stats()
const state = {
  camera: { angle: 75, far: 5000, near: .001 },
  rideSpeed: 4.2,
  renderer: { antialias: false },
  pixelRatio: 1,
  anagliph: false
}

/* camera */
const camera = new THREE.PerspectiveCamera(
  state.camera.angle, window.innerWidth / window.innerHeight,
  state.camera.near, state.camera.far)
camera.position.x = -0.079
camera.position.y = 0.225
camera.position.z = -0.958

/* renderer */
let renderer = new THREE.WebGLRenderer(state.renderer)
renderer.setPixelRatio(devicePixelRatio * state.pixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMapSoft = true
renderer.shadowCameraNear = state.camera.near
renderer.shadowCameraFar = state.camera.far
renderer.shadowCameraFov = 50
renderer.shadowMapBias = 0.0039
renderer.shadowMapDarkness = .5
renderer.shadowMapWidth = 1024
renderer.shadowMapHeight = 1024

renderer.domElement.id = 'renderer'
document.body.appendChild(renderer.domElement)

/* filters / shaders */
const composer = new EffectComposer(renderer)
const renderPass = new RenderPass(scene, camera)
// const bloomPass = new BloomPass()
const filmPass = new FilmPass(0.2, 0.2, 648, false)
      filmPass.enabled = false
composer.addPass(renderPass)
composer.addPass(filmPass)

const anaglyphEffect = new AnaglyphEffect(renderer)
      anaglyphEffect.setSize(window.innerWidth, window.innerHeight)

/* global. listeners */
handleListeners(
  camera, renderer, composer,
  filmPass, stats, anaglyphEffect,
  state
)
// {x: -0.08, y: 0.25, z: -0.95}
/* After initialize */
/* objects */
Skybox(scene, renderer)
// Mp3Player()
Car(scene)
DirectionLight(scene)
let mountains = []
for (let i = 0; i < 6; i++) {
  let mountainL = Mountain()
  let mountainR = Mountain()
  mountainL.position.z = (-i * 10) - 5
  mountainL.position.x = -Math.randInt(7, 12)
  mountainR.position.z = (-i * 10) - 5
  mountainR.position.x = Math.randInt(7, 12)

  scene.add(mountainL)
  scene.add(mountainR)
  mountains.push(mountainL)
  mountains.push(mountainR)
}

const updateMountains = delta => {
  for (let i = 0; i < mountains.length; i++) {
    mountains[i].position.z += state.rideSpeed * delta

    if (mountains[i].position.z > 5) {
      let newMountain = Mountain(scene)
      newMountain.position.x = mountains[i].position.x
      newMountain.position.z = -50

      scene.remove(mountains[i])
      mountains.splice(i, 1)

      scene.add(newMountain)
      mountains.push(newMountain)
    }
  }
}

let billboard = Billboard(scene, -50)
const floorTexture = Floor(scene)
const roadTexture = Road(scene)

const updateFlyCamera = FlyCameraControl(camera, document)

scene.fog = new THREE.Fog(0x000000, .1, 50)

const streetLights = []
for (let i = 0; i < 6; i++) {
  streetLights.push(StreetLight(scene, (i * -10) + 10))
}

const updateStreetLights = delta => {
  for (let i = 0; i < streetLights.length; i++) {
    streetLights[i].position.z += state.rideSpeed * delta
    streetLights[i].children[3].intensity = 2

    if (streetLights[i].position.z > 10) {
      scene.remove(streetLights[i])
      streetLights.splice(i, 1)
      streetLights.push(StreetLight(scene, -50))
    }
  }
}

const updateBillboards = delta => {
  if (billboard.position.z > 10) {scene.remove(billboard); billboard = null}
  if (!billboard) billboard = Billboard(scene, -50)
  billboard.position.z += state.rideSpeed * delta
}

/* action */
const action = (time, delta) => {
  stats.showFps()
  updateFlyCamera(delta)
  updateBillboards(delta)
  updateStreetLights(delta)
  updateMountains(delta)

  roadTexture.offset.y += state.rideSpeed * delta
  floorTexture.offset.y += state.rideSpeed * delta * 2
}

const animate = (time, delta = clock.getDelta()) => {
  action(time, delta)

  if (state.anagliph) {
    anaglyphEffect.render(scene, camera)
  } else {
    composer.render(delta)
  }

  requestAnimationFrame(animate)
}; animate()
