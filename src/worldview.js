import vector from './utils/vector'
import matrix, { R } from './utils/matrix'
import { fromDocumentToContainer } from './transformations'
import { center_container } from './centers'

export default function WorldView(/* opts */) {
  /// State
  const state = {
    // scale level
    zoom: 1,

    // rotation angle in degrees
    theta: 0,

    // The container's origin relative to the document's
    containerOrigin_document: [0, 0],

    // The world's origin relative to the container's
    worldOrigin_container: [0, 0],

    // The unscaled size of the world
    worldSize: [0, 0],

    // The size of the container (viewport)
    containerSize: [0, 0],
  }

  /// Public API
  return {
    get state() { return state },
    get transform() { return transform() },
    panBy,
    rotateBy,
    setContainerSize,
    setContainerOrigin,
    setWorldSize,
    setWorldOrigin,
    setZoom,
    setTheta,
    zoomTo,
    zoomBy,
  }

  function setWorldSize(width, height) {
    state.worldSize = [width, height]
  }

  function setContainerSize(width, height) {
    state.containerSize = [width, height]
  }

  function setContainerOrigin(x_document, y_document) {
    state.containerOrigin_document = [x_document, y_document]
  }

  function setWorldOrigin(x_container, y_container) {
    state.worldOrigin_container = [x_container, y_container]
  }

  function setTheta(degrees) {
    state.theta = degrees
  }

  function setZoom(scale) {
    state.zoom = scale
  }

  function zoomBy(change = 0, pointer_document) {
    const newZoom = state.zoom * (1 + change);
    zoomTo(newZoom, pointer_document);
  }

  function zoomTo(newZoom, pointer_document) {
    const pointer_container = pointer_document instanceof Array
      ? fromDocumentToContainer(state, pointer_document)
      : center_container(state)
    zoomAt(newZoom, pointer_container)
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
    state.worldOrigin_container = vector.add(
      pointer_container,
      vector.scale(
        newZoom / state.zoom,
        vector.sub(
          state.worldOrigin_container,
          pointer_container
        )
      )
    )

    state.zoom = newZoom
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
    state.worldOrigin_container = vector.add(
      translation_container,
      state.worldOrigin_container
    )
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
    pivot_container = pivot_container || center_container(state)
    state.worldOrigin_container = vector.sub(
      pivot_container,
      matrix.product(
        matrix.product(R(state.theta + degrees), R(-state.theta)),
        vector.sub(pivot_container, state.worldOrigin_container)
      )
    )

    state.theta = state.theta + degrees
  }

  function transform() {
    return {
      translate: state.worldOrigin_container,
      rotate: state.theta,
      scale: state.zoom,
    }
  }
}
