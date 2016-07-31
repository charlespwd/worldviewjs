import vector from './utils/vector'
import matrix, { R } from './utils/matrix'
import { flow } from './utils/functional'

export default function WorldView(/* opts */) {
  /// State
  // scale level
  let zoom = 1

  // rotation angle in degrees
  let theta = 0

  // The container's origin relative to the document's
  let containerOrigin_document = [0, 0]

  // The world's origin relative to the container's
  let worldOrigin_container = [0, 0]

  // The unscaled size of the world
  let worldSize = [0, 0]

  // The size of the container (viewport)
  let containerSize = [0, 0]

  /// Transformations
  // x_d = x_c - t_d
  const fromDocumentToContainer = (vector_document) => (
    vector.sub(vector_document, containerOrigin_document)
  )

  // x_c = x_d + t_d
  const fromContainerToDocument = (vector_container) => (
    vector.add(vector_container, containerOrigin_document)
  )

  // x_c = z*R*x_w + t_c
  const fromWorldToContainer = (vector_world) => (
    vector.add(
      vector.scale(zoom, matrix.product(R(theta), vector_world)),
      worldOrigin_container
    )
  )

  // x_w = 1/z*(R^-1)(x_c - t_c)
  const fromContainerToWorld = (vector_container) => (
    vector.scale(
      1 / zoom,
      matrix.product(
        R(-theta),
        vector.sub(vector_container, worldOrigin_container)
      )
    )
  )

  const fromWorldToDocument = flow(fromWorldToContainer, fromContainerToDocument)
  const fromDocumentToWorld = flow(fromDocumentToContainer, fromContainerToWorld)

  /// Various centers
  const center_world = () => vector.scale(1 / 2, worldSize)
  const centerWorld_document = () => fromWorldToDocument(center_world())
  const centerWorld_container = () => fromWorldToContainer(center_world())
  const center_container = () => vector.scale(1 / 2, containerSize)
  const centerContainer_document = () => fromContainerToDocument(center_container())
  const centerContainer_world = () => fromContainerToWorld(center_container())

  const transformations = {
    fromContainerToDocument,
    fromContainerToWorld,
    fromDocumentToContainer,
    fromDocumentToWorld,
    fromWorldToContainer,
    fromWorldToDocument,
  }

  /// Public API
  return {
    debug,
    panBy,
    rotateBy,
    setContainerDimensions,
    setContainerOrigin,
    setWorldDimensions,
    setWorldOrigin,
    setZoom,
    setTheta,
    transform,
    transformations,
    zoomTo,
  }

  function debug() {
    return {
      centerContainer_document: centerContainer_document(),
      centerContainer_world: centerContainer_world(),
      centerWorld_container: centerWorld_container(),
      centerWorld_document: centerWorld_document(),
      center_container: center_container(),
      center_world: center_world(),
      worldOrigin_container,
      theta,
      zoom,
      worldSize,
      containerSize,
    }
  }

  function setWorldDimensions(width, height) {
    worldSize = [width, height]
  }

  function setContainerDimensions(width, height) {
    containerSize = [width, height]
  }

  function setContainerOrigin(x_document, y_document) {
    containerOrigin_document = [x_document, y_document]
  }

  function setWorldOrigin(x_container, y_container) {
    worldOrigin_container = [x_container, y_container]
  }

  function setTheta(degrees) {
    theta = degrees
  }

  function setZoom(scale) {
    zoom = scale
  }

  function zoomTo(newZoom, pointer_document) {
    const pointer_container = pointer_document instanceof Array
      ? fromDocumentToContainer(pointer_document)
      : center_container()
    return zoomAt(newZoom, pointer_container)
  }

  /// Fixed point zoom
  // For {}_i and {}_f denotes initial and final transformation, we have
  //
  // 1. A constant rotation,
  //   R = R_i = R_f  .. (1)
  // 2. A constant pointer position relative to the container,
  //   p_c = p_c_i = p_c_f  .. (2)
  // 3. A constant pointer position relative to the world,
  //   p_w = p_w_i = p_w_f .. (3)
  // 4. A transformation world->container defined by
  //   x_w = 1/z*R^-1*(x_c - t_c) .. (4)
  //
  // For z is the zoom level, and t the translation vector.
  //
  // From (1), (2), (3) and (4) together we get
  //   p_c = 1/z_i*R^-1*(p_c - t_c_i)  .. (5)
  //   p_c = 1/z_f*R^-1*(p_c - t_c_f)  .. (6)
  //
  // From (5), and (6) we get
  //   z_f*R^-1*(p_c - t_c_i) = z_i*R^-1*(p_c - t_c_f)
  //
  // Multiply both sides by R
  //   z_f*(p_c - t_c_i) = z_i*(p_c - t_c_f)
  //
  // And finally
  //   t_c_f = p_c + z_f / z_i * (t_c_i - p_c)
  function zoomAt(newZoom, pointer_container) {
    worldOrigin_container = vector.add(
      pointer_container,
      vector.scale(
        newZoom / zoom,
        vector.sub(
          worldOrigin_container,
          pointer_container
        )
      )
    )

    zoom = newZoom

    return transform()
  }

  /// Fixed point pan
  // For {}_i and {}_f denotes initial and final transformation, we have
  //
  // 1. A constant rotation,
  //   R = R_i = R_f  .. (1)
  // 2. A constant zoom,
  //   z = z_i = z_f  .. (2)
  // 3. A constant pointer position relative to the world,
  //   p_w = p_w_i = p_w_f  .. (3)
  // 4. A translation vector defined in the container coordinate system,
  //   ∆p_c = p_c_f - p_c_i  .. (4)
  // 5. A transformation container->world defined by
  //   x_w = 1/z*R^-1*(x_c - t_c) .. (4)
  //
  // For z is the zoom level, and t the translation vector.
  //
  // From (1), (2), (3), and (5) together we get
  //   p_c_i = z*R*p_w + t_c_i  .. (6)
  //   p_c_f = z*R*p_w + t_c_f  .. (7)
  //
  // Subtract (6) from (7)
  //   p_c_f - p_c_i = t_c_f - t_c_i .. (8)
  //
  // Finally, from (8) and (2)
  //   t_c_f = ∆p_c + t_c_i
  function panBy(translation_container) {
    worldOrigin_container = vector.add(
      translation_container,
      worldOrigin_container
    )

    return transform()
  }

  /// Fixed point rotation
  // For {}_i and {}_f denotes initial and final transformation, we have
  //
  // 1. A constant zoom,
  //   z = z_i = z_f  .. (1)
  // 2. A constant pointer position relative to the container,
  //   p_c = p_c_i = p_c_f  .. (2)
  // 3. A constant pointer position relative to the world,
  //   p_w = p_w_i = p_w_f  .. (3)
  // 4. A rotation matrix defined by an angle theta
  //      R = R(theta)  .. (4.1)
  //   R^-1 = R(-theta) .. (4.2)
  // 5. A transformation container->world defined by
  //   x_w = 1/z*(R^-1)(x_c - t_c)
  //
  // For z is the zoom level, and t the translation vector.
  //
  // From (1), (2), (3), (4) and (5) together we get
  //   p_c = 1/z*R(-theta_i)*(p_c - t_c_i)  .. (6)
  //   p_c = 1/z*R(-theta_f)*(p_c - t_c_f)  .. (7)
  //
  // Finally, from (6) and (7), we obtain
  //   t_c_f = p_c - R(theta_f) * R(-theta_i) * (p_c - t_c_i)
  function rotateBy(degrees, pivot_container) {
    pivot_container = pivot_container || center_container()
    worldOrigin_container = vector.sub(
      pivot_container,
      matrix.product(
        matrix.product(R(theta + degrees), R(-theta)),
        vector.sub(pivot_container, worldOrigin_container)
      )
    )

    theta = theta + degrees

    return transform()
  }

  function transform() {
    return {
      translate: worldOrigin_container,
      rotate: theta,
      scale: zoom,
    }
  }
}
