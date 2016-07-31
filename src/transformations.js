import vector from './utils/vector'
import matrix, { R } from './utils/matrix'

// x_d = x_c - t_d
export const fromDocumentToContainer = ({ containerOrigin_document }, vector_document) => (
  vector.sub(vector_document, containerOrigin_document)
)

// x_c = x_d + t_d
export const fromContainerToDocument = ({ containerOrigin_document }, vector_container) => (
  vector.add(vector_container, containerOrigin_document)
)

// x_c = z*R*x_w + t_c
export const fromWorldToContainer = ({ zoom, theta, worldOrigin_container }, vector_world) => (
  vector.add(
    vector.scale(zoom, matrix.product(R(theta), vector_world)),
    worldOrigin_container
  )
)

// x_w = 1/z*(R^-1)(x_c - t_c)
export const fromContainerToWorld = ({ zoom, theta, worldOrigin_container }, vector_container) => (
  vector.scale(
    1 / zoom,
    matrix.product(
      R(-theta),
      vector.sub(vector_container, worldOrigin_container)
    )
  )
)

export const fromWorldToDocument = (state, vector_world) => {
  const vector_container = fromWorldToContainer(state, vector_world);
  return fromContainerToDocument(state, vector_container);
}

export const fromDocumentToWorld = (state, vector_document) => {
  const vector_container = fromDocumentToContainer(state, vector_document);
  return fromContainerToWorld(state, vector_container);
}
