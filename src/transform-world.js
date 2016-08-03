import vector from './utils/vector'
import matrix, { R } from './utils/matrix'
import { setState } from './utils/functional'

// Transformations are simple WorldState -> WorldState mappings.
// The simplest world transformation: change a value.
export const set = (key, value) => (state) => setState(state, key, value)

// Give me a set of transformations and a state and I'll give you a
// new state. Transformations are composable.
export const reduce = (transforms = [], initialState) => (
  transforms.reduce((state, transform) => transform(state), initialState)
);

/// Fixed point zoom transformation
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
export const statelessZoom = (zoom_f, pointer_container) => (state) => {
  const zoom_i = state.zoom
  const world_container_i = state.world_container
  const world_container_f = vector.add(
    pointer_container,
    vector.scale(
      zoom_f / zoom_i,
      vector.sub(
        world_container_i,
        pointer_container
      )
    )
  )

  return {
    ...state,
    world_container: world_container_f,
    zoom: zoom_f,
  }
}

/// Fixed point pan transformation
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
export const statelessPanBy = (translation_container) => (state) => {
  const world_container_i = state.world_container
  const world_container_f = vector.add(
    translation_container,
    world_container_i
  )

  return {
    ...state,
    world_container: world_container_f,
  }
}

/// Fixed point rotation transformation
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
export const statelessRotateBy = (degrees, pivot_container = [0, 0]) => (state) => {
  const theta_i = state.theta
  const theta_f = state.theta + degrees
  const world_container_i = state.world_container
  const world_container_f = vector.sub(
    pivot_container,
    matrix.product(
      matrix.product(R(theta_f), R(-theta_i)),
      vector.sub(pivot_container, world_container_i)
    )
  )

  return {
    ...state,
    theta: theta_f,
    world_container: world_container_f,
  }
}
