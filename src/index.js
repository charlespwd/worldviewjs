import { scaleVector, addVectors, minusVectors } from './utils/vector'
import { matrixMultiply, matrixSubtract, R } from './utils/matrix'
import { flow } from './utils/functional'

const pointer = ({ pageX, pageY }) => [pageX, pageY]

export default function WorldView(render/* , opts */) {
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
    minusVectors(vector_document, containerOrigin_document)
  )

  // x_c = x_d + t_d
  const fromContainerToDocument = (vector_container) => (
    addVectors(vector_container, containerOrigin_document)
  )

  // x_c = z*R*x_w + t_c
  const fromWorldToContainer = (vector_world) => (
    addVectors(scaleVector(zoom, matrixMultiply(R(theta), vector_world)), worldOrigin_container)
  )

  // x_w = 1/z*(R^-1)(x_c - t_c)
  const fromContainerToWorld = (vector_container) => (
    scaleVector(
      1 / zoom,
      matrixMultiply(
        R(-theta),
        minusVectors(vector_container, worldOrigin_container)
      )
    )
  )

  const fromWorldToDocument = flow(fromWorldToContainer, fromContainerToDocument)
  const fromDocumentToWorld = flow(fromDocumentToContainer, fromContainerToWorld)

  /// Various centers
  const center_world = () => scaleVector(1 / 2, worldSize)
  const centerWorld_document = () => fromWorldToDocument(center_world())
  const centerWorld_container = () => fromWorldToContainer(center_world())
  const center_container = () => scaleVector(1 / 2, containerSize)
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
    transform,
    transformations,
    zoomTo,
    zoomToMouse,
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

  function zoomToMouse(newZoom, e = { pageX: undefined, pageY: undefined }) {
    const pointer_world = typeof e.pageX === 'number'
      ? fromDocumentToWorld(pointer(e))
      : centerContainer_world()
    return zoomAt(newZoom, pointer_world)
  }

  function zoomTo(newZoom, pointer_document) {
    const pointer_world = pointer_document instanceof Array
      ? fromDocumentToWorld(pointer_document)
      : centerContainer_world()
    return zoomAt(newZoom, pointer_world)
  }

  function zoomAt(newZoom, pointer_world) {
    const deltaZoom = newZoom - zoom

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
    //   x_c = z*R*x_w + t_c  .. (4)
    //
    // For z is the zoom level, and t the translation vector.
    //
    // From (1), (2), (3) and (4) together we get
    //   p_c = z_i*R*p_w + t_c_i  .. (5)
    //   p_c = z_f*R*p_w + t_c_f  .. (6)
    //
    // From (5), and (6) we get
    //   t_c_f = z_i*R*p_w + t_c_i - z_f*R*p_w
    //   t_c_f = t_c_i + (z_i - z_f)*R*p_w
    //   t_c_f = t_c_i - ∆z*R*p_w
    //
    // And finally
    //   t_c_f = (z_i - z_f)*R*p_w + t_c_i
    worldOrigin_container = minusVectors(
      worldOrigin_container,
      scaleVector(
        deltaZoom,
        matrixMultiply(R(theta), pointer_world)
      )
    )

    zoom = newZoom

    return publish()
  }

  function panBy(translation_container) {
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
    //   x_w = z*R*x_c + t_c  .. (5)
    //
    // For z is the zoom level, and t the translation vector.
    //
    // From (1), (2), (3), and (5) together we get
    //   p_w = z*R*p_c_i + t_c_i  .. (6)
    //   p_w = z*R*p_c_f + t_c_f  .. (7)
    //
    // Subtract (6) from (7)
    //   t_c_f = -z*R*(p_c_f - p_c_i) + t_c_i .. (8)
    //
    // Finally, from (8) and (2)
    //   t_c_f = t_c_i - z*R*∆p_c
    worldOrigin_container = minusVectors(
      worldOrigin_container,
      scaleVector(
        zoom,
        matrixMultiply(R(theta), translation_container)
      )
    )

    return publish()
  }

  function rotateBy(degrees, pivot_container) {
    pivot_container = pivot_container || center_container()

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
    //   R = R(theta)
    // 5. A transformation container->world defined by
    //   x_w = z*R*x_c + t_c  .. (4)
    //
    // For z is the zoom level, and t the translation vector.
    //
    // From (1), (2), (3), and (5) together we get
    //   p_w = z*R_i*p_c + t_c_i  .. (6)
    //   p_w = z*R_f*p_c + t_c_f  .. (7)
    //
    // Finally, from (4), (6) and (7), we obtain
    //   t_c_f = z*(R(theta_i) - R(theta_f))*p_c + t_c_i
    const DR = matrixSubtract(R(theta), R(theta + degrees))
    worldOrigin_container = addVectors(
      scaleVector(
        zoom,
        matrixMultiply(DR, pivot_container)
      ),
      worldOrigin_container
    )

    theta = theta + degrees

    return publish()
  }

  function publish() {
    render(transform())
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
