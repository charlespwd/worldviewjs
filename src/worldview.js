import { center_container } from './centers'
import { setState } from './utils/functional'
import { fromDocumentToContainer } from './transform-vector'
import {
  statelessZoom,
  statelessPanBy,
  statelessRotateBy,
} from './transform-world'

export default function WorldView(/* opts */) {
  /// State
  let state = {
    // scale level
    zoom: 1,

    // rotation angle in degrees
    theta: 0,

    // The container's origin relative to the document's
    container_document: [0, 0],

    // The world's origin relative to the container's
    world_container: [0, 0],

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
    state = setState(state, 'worldSize', [width, height])
  }

  function setContainerSize(width, height) {
    state = setState(state, 'containerSize', [width, height])
  }

  function setContainerOrigin(x_document, y_document) {
    state = setState(state, 'container_document', [x_document, y_document])
  }

  function setWorldOrigin(x_container, y_container) {
    state = setState(state, 'world_container', [x_container, y_container])
  }

  function setTheta(degrees) {
    state = setState(state, 'theta', degrees)
  }

  function setZoom(scale) {
    state = setState(state, 'zoom', scale)
  }

  function zoomBy(change = 0, pointer_document) {
    const newZoom = state.zoom * (1 + change);
    zoomTo(newZoom, pointer_document);
  }

  function zoomTo(newZoom, pointer_document) {
    const pointer_container = pointer_document instanceof Array
      ? fromDocumentToContainer(state, pointer_document)
      : center_container(state)
    const transformation = statelessZoom(newZoom, pointer_container)
    state = transformation(state)
  }

  function panBy(translation_container) {
    const transformation = statelessPanBy(translation_container)
    state = transformation(state)
  }

  function rotateBy(degrees, pivot_container) {
    pivot_container = pivot_container || center_container(state)
    const transformation = statelessRotateBy(degrees, pivot_container)
    state = transformation(state)
  }

  function transform() {
    return {
      translate: state.world_container,
      rotate: state.theta,
      scale: state.zoom,
    }
  }
}
