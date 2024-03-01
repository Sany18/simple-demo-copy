import MeshTexture from 'assets/textures/mesh.png'

export default () => {
  const width = 6
  const long = 6

  const texture = new THREE.TextureLoader().load(MeshTexture)
  const geometry = new THREE.PlaneGeometry(width * 2 - 2, long * 2 - 2, width, long)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mountain = new THREE.Mesh(geometry, material)

  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.NearestFilter
  texture.wrapS = THREE.RepeatWrapping 
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(width * 4, long * 4)

  setVertices(geometry)

  mountain.position.y = -0.01
  mountain.position.z = 5
  mountain.rotation.x = -Math.PI / 2

  return mountain
}

function setVertices(geometry) {
  const { widthSegments, heightSegments } = geometry.parameters
  
  updateVertices(geometry.vertices, widthSegments, heightSegments)
}

function updateVertices(vertices, x, y) {
  let plane = chunks(vertices, x + 1)

  const updatedVertices = plane.map((xLine, xIndex) => {
    if (xIndex == 0 || xIndex == x) {
      return xLine
    } else {
      return xLine.map((yPoint, yIndex) => {
        if (yIndex == 0 || yIndex == y) {
          return yPoint
        } else {
          return yPoint.z += Math.random() * 3 // update there
        }
      })
    }
  })

  return updatedVertices.flat()
}

function chunks(arr, size) {
  let result = []

  for (var i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i))
  }
  return result
}
