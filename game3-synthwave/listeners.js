export default function listeners(
  camera, renderer, composer,
  filmPass, stats, anaglyphEffect,
  state
) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
    anaglyphEffect.setSize(window.innerWidth, window.innerHeight)
  }, false)

  window.addEventListener('keydown', e => {
    if (e.keyCode == 192) {
      document.exitPointerLock()
      document.getElementById('menu').classList.toggle('show')
    }
  })

  document.getElementById('tvEffect').addEventListener('change', e => {
    filmPass.enabled = e.target.checked
  })

  document.getElementById('hideFps').addEventListener('change', e => {
    e.target.checked
      ? stats.fpsEl.classList.add('hide')
      : stats.fpsEl.classList.remove('hide')
  })

  document.getElementById('anaglyphEffect').addEventListener('change', e => {
    state.anagliph = e.target.checked
  })
}
