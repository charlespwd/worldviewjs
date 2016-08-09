import { center_container } from './centers'
import { setState } from './utils/functional'
import { fromDocumentToContainer } from './transform-vector'
import {
  fit,
  identity,
  reduce,
  set,
  statelessPanBy,
  statelessRotateBy,
  statelessZoom,
} from './transform-world'

export default function WorldView(initialState, opts) {
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
    worldSize: [1, 1],

    // The size of the container (viewport)
    containerSize: [1, 1],

    ...initialState,
  }

  const options = {
    // Fit the world to the container when zooming and panning
    fit: false,

    ...opts,
  }

  if (options.fit) {
    state = fit(state)
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

  function withFit(transformation) {
    return [
      transformation,
      options.fit ? fit : identity,
    ];
  }

  function setWorldSize(width, height) {
    const transformations = withFit(set('worldSize', [width, height]))
    state = reduce(transformations, state);
  }

  function setContainerSize(width, height) {
    const transformations = withFit(set('containerSize', [width, height]))
    state = reduce(transformations, state)
  }

  function setContainerOrigin(x_document, y_document) {
    state = setState(state, 'container_document', [x_document, y_document])
  }

  function setWorldOrigin(x_container, y_container) {
    const transformations = withFit(set('world_container', [x_container, y_container]))
    state = reduce(transformations, state)
  }

  function setTheta(degrees) {
    state = setState(state, 'theta', degrees)
  }

  function setZoom(scale) {
    const transformations = withFit(set('zoom', scale))
    state = reduce(transformations, state)
  }

  function zoomBy(change = 0, pointer_document) {
    const newZoom = state.zoom * (1 + change)
    zoomTo(newZoom, pointer_document)
  }

  function zoomTo(newZoom, pointer_document) {
    const pointer_container = pointer_document instanceof Array
      ? fromDocumentToContainer(state, pointer_document)
      : center_container(state)
    const transformations = withFit(statelessZoom(newZoom, pointer_container))
    state = reduce(transformations, state)
  }

  function panBy(translation_container) {
    const transformations = withFit(statelessPanBy(translation_container))
    state = reduce(transformations, state)
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
