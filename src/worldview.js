import { center_container } from './centers'
import { setState } from './utils/functional'
import { fromDocumentToContainer } from './transform-vector'
import * as math from './utils/math'
import {
  fit,
  identity,
  reduce,
  scaleLimit,
  set,
  statelessPanBy,
  statelessRotateBy,
  statelessZoom,
} from './transform-world'

export default function WorldView(opts) {
  /// State
  let state = {
    // scale level
    scale: 1,

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
  }

  /// Options
  let options = {
    // Fit the world to the container when zooming and panning
    fit: false,

    // Don't let the user zoom more than maxZoom
    maxZoom: undefined,

    // Don't let the user zoom less than minZoom
    minZoom: undefined,

    ...opts,
  }

  /// Public API
  return {
    get options() {
      return options
    },
    get state() {
      return state
    },
    get transform() {
      return {
        translate: state.world_container,
        rotate: state.theta,
        scale: state.scale,
      }
    },
    panBy,
    resetContainerSize,
    resetZoom,
    rotateBy,
    setContainerOrigin,
    setContainerSize,
    setOptions,
    setTheta,
    setWorldOrigin,
    setWorldSize,
    setZoom,
    zoomBy,
    zoomTo,
    isZoomedOut,
  }

  function bounded(scale) {
    return math.bounded(options.minZoom, scale, options.maxZoom)
  }

  function setOptions(newOptions = {}) {
    options = {
      ...options,
      ...newOptions,
    }
  }

  function setWorldSize(width, height) {
    const transformations = withFit(set('worldSize', [width, height]))
    state = reduce(transformations, state)
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
    const transformations = withFit(set('scale', bounded(scale)))
    state = reduce(transformations, state)
  }

  // Change the container size but keep what you see in the view the same.
  // Use this to keep things responsive.
  function resetContainerSize(width, height) {
    const change = width / state.containerSize[0]
    const transformations = [
      statelessZoom(change * state.scale, [0, 0]),
      set('containerSize', [width, height]),
    ]
    state = reduce(transformations, state)
  }

  function resetZoom() {
    if (options.fit) {
      state = reduce([
        set('scale', -1),
        fit(options), // use the limiting scale, and refit
      ], state)
    } else {
      state = reduce(set('scale', bounded(1)), state)
    }
  }

  // Scale previous scale by change amount
  function zoomBy(change = 1, pointer_document) {
    if (change <= 0) throw new Error('zoomBy:: Change must be a positive ratio.')
    const newZoom = bounded(state.scale * change)
    zoomTo(newZoom, pointer_document)
  }

  // Zoom to a set value at a point in the document
  function zoomTo(newZoom, pointer_document) {
    const pointer_container = pointer_document instanceof Array
      ? fromDocumentToContainer(state, pointer_document)
      : center_container(state)
    const transformations = withFit(statelessZoom(bounded(newZoom), pointer_container))
    state = reduce(transformations, state)
  }

  // Pan by a translation vector
  function panBy(translation_document) {
    const transformations = withFit(statelessPanBy(translation_document))
    state = reduce(transformations, state)
  }

  // Rotate by amount of degrees at a pivot position in the document
  function rotateBy(degrees, pivot_document) {
    const pivot_container = pivot_document instanceof Array
      ? fromDocumentToContainer(state, pivot_document)
      : center_container(state)
    const transformation = statelessRotateBy(degrees, pivot_container)
    state = transformation(state)
  }

  // Wrap a transformation with an optional fit to the size of the world.
  function withFit(transformations) {
    return [].concat(
      transformations,
      options.fit ? fit(options) : identity
    )
  }

  function isZoomedOut() {
    const limit = scaleLimit(state);
    return state.scale === options.minZoom || state.scale === limit;
  }
}
