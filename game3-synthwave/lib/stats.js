export default class Stats {
  constructor() {
    const style = `color: orange; position: absolute; bottom: 0; left: 0; font-size: .6cm; font-family: Arial;
                   font-size: 10px;`
    const fpsEl = document.createElement('div')
          fpsEl.id = 'fps'
          fpsEl.style.cssText = style
    document.body.appendChild(fpsEl)

    const memory = document.createElement('div')
          memory.id = 'memory'
          memory.style.cssText = style + 'bottom: 1em;'
    document.body.appendChild(memory)

    this.fpsEl = fpsEl
    this.memoryEl = memory
  }

  counter = 0
  lastCalledTime = performance.now()
  fps = 0
  delta = 0
  updatesPerSecond = 60 / 5

  showFps() {
    if (++this.counter != this.updatesPerSecond) { return this } else this.counter = 0;

    this.delta = (performance.now() - this.lastCalledTime) / 1000 / this.updatesPerSecond;
    this.lastCalledTime = performance.now();
    this.fps = Math.floor(1 / this.delta)
    this.fpsEl.innerHTML = this.fps

    return this
  }

  showMemory() {
    if (this.counter != 0) return this

    this.memoryEl.innerHTML = performance.memory.usedJSHeapSize.fileSize()

    return this
  }
}
