// import { OBJLoader2 } from 'lib/loaders/OBJLoader2'
import { FBXLoader } from 'lib/loaders/FBXLoader'
// const loader = new OBJLoader2();
const loader = new FBXLoader()

export default scene => {
  loader.load(
    'models/mustang/mustang.fbx',
    object => {
      object.scale.x = object.scale.y = object.scale.z = 0.001
      object.position.z = -1
      scene.add(object)
    }
  )
}
