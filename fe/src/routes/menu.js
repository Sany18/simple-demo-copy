import * as THREE from 'three';

import 'assets/menu.scss';
import 'lib/moveElement';

window.THREE = THREE;

const segSize = 5;
const segAmount = 5;
const c = Array(segAmount).fill(0).map(_ => ({ x: 0, y: 0, angle: 0 }));
const sircleStyle = `z-index: 1; position: absolute; background-color: #fff4; top: 0; left: 0; border-radius: 50%;`;
const cursorStyle = `z-index: 1; position: absolute; top: 0; left: 0; margin: -11px 0 0 -11px; width: 26px; height: 26px; border: 1px solid #fff2;`;
const template = `
  <div class="links-list" style="display: flex; flex-wrap: wrap; gap: -5px;">
    <a class="link" href='/tetris/'>Tetris</a>
    <a class="link" href='/synthwave/'>Synthwave (demo)</a>
    <a class="link" href='/3d-shooter'>3D Shooter (demo)</a>
    <a class="link" href='/editor'>Editor (demo)</a>
  </div>

  ${c.map((_, i) => (
    i
      ? `<div
          class=${"cursors-circle cursors-circle-" + (i + 1)}"
          style="${sircleStyle} width: ${segSize - (i * 0.5) + 'px'}; height: ${segSize - (i * 0.5) + 'px'};
                marginTop: ${(-segSize / i) / 2 + 'px'}; marginLeft: ${(-segSize / i) / 2 + 'px'};">
        </div>`
      : `<div style="${cursorStyle}" class="cursors-circle-main"></div>`
  )).join('')}
`
document.body.innerHTML = template;


document.addEventListener('contextmenu', event => {
  event.preventDefault()
  const el = document.querySelector('.context-menu')
  if (el) el.remove()
  const links = `
    <a href='/'>Go home</a>
    <div onclick="alert('a')">Alert</div>
    <div onclick="console.log('yep, log')">Take a log</div>
  `

  const menu = document.createElement('div')
  menu.style.cssText = `top: ${event.clientY}px; left: ${event.clientX}px;`
  menu.classList.add('context-menu')
  menu.innerHTML = links
  document.body.appendChild(menu)
}, false)

document.addEventListener('click', event => {
  const el = document.querySelector('.context-menu')
  if (el) el.remove()
}, false)


const cursorCircles = document.getElementsByClassName('cursors-circle')
const circles = document.getElementsByClassName('cursors-circle-main')
const segLength = 30

const mouseMove = e => {
  segment(0, e.clientX, e.clientY)

  for (let i = 0; i < segAmount - 1; ++i) {
    segment(i + 1, c[i].x, c[i].y)
  }

  function segment(i, xin, yin) {
    let dx = xin - c[i].x
    let dy = yin - c[i].y

    c[i].angle = Math.atan2(dy, dx)
    c[i].x = xin - Math.cos(c[i].angle) * segLength
    c[i].y = yin - Math.sin(c[i].angle) * segLength
  }

  circles[0].style.transform = `translate(${e.clientX}px, ${e.clientY}px)`

  for (let i = 0; i < segAmount - 1; i++) {
    cursorCircles[i].style.transform = `translate(${c[i].x}px, ${c[i].y}px) rotate(${c[i].angle}deg)`
  }
}

document.addEventListener('mousemove', mouseMove)


const vanta = document.createElement('script')
vanta.setAttribute('src', 'vanta.min.js')
document.head.appendChild(vanta)

vanta.addEventListener('load', () => {
  const vantaUsage = document.createElement('script')
  vantaUsage.innerHTML = 'VANTA.NET({ el: "body", color: 0x3e3e3e, backgroundColor: 0x0, maxDistance: 10, spacing: 30, points: 20 })'
  document.body.appendChild(vantaUsage)
})
