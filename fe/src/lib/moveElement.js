const moveableElementClassName = 'moveable'
const controlButtonClassName = 'moveable-button'

window.addEventListener('load', () => {
  let isMouseDown = false
  let currentElement, offset
  const elements = document.getElementsByClassName(moveableElementClassName)

  const onMouseMove = event => {
    if (isMouseDown) {
      currentElement.style.left = (event.clientX + offset[0]) + 'px'
      currentElement.style.top  = (event.clientY + offset[1]) + 'px'
    }
  }

  const mouseDown = (event, element) => {
    const classes = new Set(event.target.classList)
    if (classes.has(controlButtonClassName)) {
      isMouseDown = true
      currentElement = element
      offset = [
        currentElement.offsetLeft - event.clientX,
        currentElement.offsetTop - event.clientY
      ]
    }
  }

  const stopMove = event => {
    isMouseDown = false

    if (currentElement) {
      localStorage.setItem(currentElement.name, JSON.stringify(
        [currentElement.style.left, currentElement.style.top]
      ))
    }
  }

  for (let i = 0; i < elements.length; i++) {
    const elemName = `${moveableElementClassName}-${i}`
    const storageElem = localStorage.getItem(elemName)

    elements[i].addEventListener('mousedown', (e) => mouseDown(e, elements[i]))
    elements[i].name = elemName;
    elements[i].style.position = 'absolute';

    if (storageElem) {
      elements[i].style.left = JSON.parse(storageElem)[0]
      elements[i].style.top = JSON.parse(storageElem)[1]
    }
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', stopMove)
})
