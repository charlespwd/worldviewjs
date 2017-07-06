'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = WorldView;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _centers = require('./centers');

var _utilsFunctional = require('./utils/functional');

var _transformVector = require('./transform-vector');

var _utilsMath = require('./utils/math');

var math = _interopRequireWildcard(_utilsMath);

var _transformWorld = require('./transform-world');

function WorldView(opts) {
  /// State
  var state = {
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
    containerSize: [1, 1]
  };

  /// Options
  var options = _extends({
    // Fit the world to the container when zooming and panning
    fit: false,

    // Fit the world to the container so that no whitespace can
    // be visible
    fitNoWhitespace: true,

    // Force some whitespace to appear at min zoom around the world.
    // The margin is in the container's coordinate system units.
    fitMarginX: 0,
    firMarginY: 0,

    // Don't let the user zoom more than maxZoom
    maxZoom: undefined,

    // Don't let the user zoom less than minZoom
    minZoom: undefined

  }, opts);

  /// Public API
  return Object.defineProperties({
    panBy: panBy,
    resetContainerSize: resetContainerSize,
    resetZoom: resetZoom,
    rotateBy: rotateBy,
    setContainerOrigin: setContainerOrigin,
    setContainerSize: setContainerSize,
    setOptions: setOptions,
    setTheta: setTheta,
    setWorldOrigin: setWorldOrigin,
    setWorldSize: setWorldSize,
    setZoom: setZoom,
    zoomBy: zoomBy,
    zoomTo: zoomTo,
    isZoomedOut: isZoomedOut
  }, {
    options: {
      get: function get() {
        return options;
      },
      configurable: true,
      enumerable: true
    },
    state: {
      get: function get() {
        return state;
      },
      configurable: true,
      enumerable: true
    },
    transform: {
      get: function get() {
        return {
          translate: state.world_container,
          rotate: state.theta,
          scale: state.scale
        };
      },
      configurable: true,
      enumerable: true
    }
  });

  function bounded(scale) {
    return math.bounded(options.minZoom, scale, options.maxZoom);
  }

  function setOptions() {
    var newOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    options = _extends({}, options, newOptions);
  }

  function setWorldSize(width, height) {
    var transformations = withFit(_transformWorld.set('worldSize', [width, height]));
    state = _transformWorld.reduce(transformations, state);
  }

  function setContainerSize(width, height) {
    var transformations = withFit(_transformWorld.set('containerSize', [width, height]));
    state = _transformWorld.reduce(transformations, state);
  }

  function setContainerOrigin(x_document, y_document) {
    state = _utilsFunctional.setState(state, 'container_document', [x_document, y_document]);
  }

  function setWorldOrigin(x_container, y_container) {
    var transformations = withFit(_transformWorld.set('world_container', [x_container, y_container]));
    state = _transformWorld.reduce(transformations, state);
  }

  function setTheta(degrees) {
    state = _utilsFunctional.setState(state, 'theta', degrees);
  }

  function setZoom(scale) {
    var transformations = withFit(_transformWorld.set('scale', bounded(scale)));
    state = _transformWorld.reduce(transformations, state);
  }

  // Change the container size but keep what you see in the view the same.
  // Use this to keep things responsive.
  function resetContainerSize(width, height) {
    var change = width / state.containerSize[0];
    var transformations = [_transformWorld.statelessZoom(change * state.scale, [0, 0]), _transformWorld.set('containerSize', [width, height])];
    state = _transformWorld.reduce(transformations, state);
  }

  function resetZoom() {
    if (options.fit) {
      state = _transformWorld.reduce([_transformWorld.set('scale', -1), _transformWorld.fit(options)], // use the limiting scale, and refit
      state);
    } else {
      state = _transformWorld.reduce(_transformWorld.set('scale', bounded(1)), state);
    }
  }

  // Scale previous scale by change amount
  function zoomBy(change, pointer_document) {
    if (change === undefined) change = 1;

    if (change <= 0) throw new Error('zoomBy:: Change must be a positive ratio.');
    var newZoom = bounded(state.scale * change);
    zoomTo(newZoom, pointer_document);
  }

  // Zoom to a set value at a point in the document
  function zoomTo(newZoom, pointer_document) {
    var pointer_container = pointer_document instanceof Array ? _transformVector.fromDocumentToContainer(state, pointer_document) : _centers.center_container(state);
    var transformations = withFit(_transformWorld.statelessZoom(bounded(newZoom), pointer_container));
    state = _transformWorld.reduce(transformations, state);
  }

  // Pan by a translation vector
  function panBy(translation_document) {
    var transformations = withFit(_transformWorld.statelessPanBy(translation_document));
    state = _transformWorld.reduce(transformations, state);
  }

  // Rotate by amount of degrees at a pivot position in the document
  function rotateBy(degrees, pivot_document) {
    var pivot_container = pivot_document instanceof Array ? _transformVector.fromDocumentToContainer(state, pivot_document) : _centers.center_container(state);
    var transformation = _transformWorld.statelessRotateBy(degrees, pivot_container);
    state = transformation(state);
  }

  // Wrap a transformation with an optional fit to the size of the world.
  function withFit(transformations) {
    return [].concat(transformations, options.fit ? _transformWorld.fit(options) : _transformWorld.identity);
  }

  function isZoomedOut() {
    var tolerance = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var limit = _transformWorld.scaleLimit(state, options, options.fitNoWhitespace ? Math.max : Math.min);
    var isAtMinZoom = state.scale <= options.minZoom + tolerance;
    var isAtFitZoom = state.scale <= limit + tolerance;

    if (options.fit && options.minZoom) {
      return isAtMinZoom || isAtFitZoom;
    }

    if (options.fit) {
      return isAtFitZoom;
    }

    if (options.minZoom) {
      return isAtMinZoom;
    }

    return false;
  }
}

module.exports = exports['default'];