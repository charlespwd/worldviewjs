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

  // Transformations
  const fromDocumentToContainer = (vector_document) => (
    minusVectors(vector_document, containerOrigin_document)
  )

  const fromContainerToDocument = (vector_container) => (
    addVectors(vector_container, containerOrigin_document)
  )

  const fromWorldToContainer = (vector_world) => (
    addVectors(scaleVector(zoom, vector_world), worldOrigin_container)
  )

  const fromContainerToWorld = (vector_container) => (
    scaleVector(1 / zoom, minusVectors(vector_container, worldOrigin_container))
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

  return {
    debug,
    panBy,
    rotateBy,
    setContainerDimensions,
    setContainerOrigin,
    setWorldDimensions,
    transformations,
    transform,
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

  // When zooming at a fixed point in the container
  function zoomTo(e = { pageX: undefined, pageY: undefined }, newZoom) {
    const pointer_container = typeof e.pageX === 'number'
      ? fromDocumentToContainer(pointer(e))
      : center_container()
    return zoomAt(pointer_container, newZoom)
  }

  function zoomAt(pointer_container, newZoom) {
    const deltaZoom = zoom - newZoom
    zoom = newZoom

    worldOrigin_container = minusVectors(
      scaleVector(deltaZoom, pointer_container),
      worldOrigin_container
    )

    return publish()
  }

  function panBy(translation_container) {
    worldOrigin_container = addVectors(
      translation_container,
      worldOrigin_container
    )

    return publish()
  }

  function rotateBy(degrees, pivot_container) {
    pivot_container = pivot_container || center_container()

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
