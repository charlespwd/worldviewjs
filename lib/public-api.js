'use strict';

exports.__esModule = true;
exports['default'] = PublicWorldView;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _worldview = require('./worldview');

var _worldview2 = _interopRequireDefault(_worldview);

var _utilsVector = require('./utils/vector');

var _utilsVector2 = _interopRequireDefault(_utilsVector);

var _centers = require('./centers');

var fromEventToVector = function fromEventToVector(_ref) {
  var pageX = _ref.pageX;
  var pageY = _ref.pageY;
  return [pageX, pageY];
};

var validateEventPosition = function validateEventPosition(method, e) {
  if (typeof e.pageX !== 'number' || typeof e.pageY !== 'number') {
    throw new Error('Trying to ' + method + ' without { pageX, pageY }. Check your event handler.');
  }
};

function PublicWorldView(render, opts) {
  var view = new _worldview2['default'](opts);
  var state = {
    isPanning: false,
    panStart: null,
    panEnd: null
  };

  /// Public API
  return Object.defineProperties({
    isZoomedOut: isZoomedOut,
    setDimensions: setDimensions,
    setOptions: view.setOptions,
    setContainerOrigin: view.setContainerOrigin,
    zoomAtMouse: zoomAtMouse,
    zoomBy: zoomBy,
    panBy: panBy,
    panStart: panStart,
    panMove: panMove,
    panEnd: panEnd,
    resetContainerSize: resetContainerSize,
    publish: publish,
    debug: {
      decorate: decorate,
      view: view
    }
  }, {
    state: {
      get: function get() {
        return view.state;
      },
      configurable: true,
      enumerable: true
    },
    transform: {
      get: function get() {
        return view.transform;
      },
      configurable: true,
      enumerable: true
    },
    options: {
      get: function get() {
        return view.options;
      },
      configurable: true,
      enumerable: true
    },
    scale: {
      get: function get() {
        return view.state.scale;
      },
      configurable: true,
      enumerable: true
    },
    translate: {
      get: function get() {
        return view.state.world_container;
      },
      configurable: true,
      enumerable: true
    },
    offset: {
      get: function get() {
        return view.state.container_document;
      },
      configurable: true,
      enumerable: true
    },
    rotation: {
      get: function get() {
        return view.state.theta;
      },
      configurable: true,
      enumerable: true
    },
    worldSize: {
      get: function get() {
        return view.state.worldSize;
      },
      configurable: true,
      enumerable: true
    },
    containerSize: {
      get: function get() {
        return view.state.containerSize;
      },
      configurable: true,
      enumerable: true
    },
    theta: {
      get: function get() {
        return view.state.theta;
      },
      configurable: true,
      enumerable: true
    }
  });

  function isZoomedOut() {
    var tolerance = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    return view.isZoomedOut(tolerance);
  }

  function setDimensions(worldWidth, worldHeight, containerWidth, containerHeight) {
    view.setWorldSize(worldWidth, worldHeight);
    view.setContainerSize(containerWidth, containerHeight);
    view.resetZoom();
    publish();
  }

  function resetContainerSize(containerWidth, containerHeight) {
    view.resetContainerSize(containerWidth, containerHeight);
    publish();
  }

  function zoomAtMouse(wheelDelta) {
    var e = arguments.length <= 1 || arguments[1] === undefined ? { pageX: undefined, pageY: undefined } : arguments[1];

    var change = wheelDelta > 0 ? 1.03 : 0.97; // %
    var pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined;
    view.zoomBy(change, pointer_document);
    publish();
  }

  // Where change is the ratio between the previous and the future scale level
  function zoomBy(change) {
    var e = arguments.length <= 1 || arguments[1] === undefined ? { pageX: undefined, pageY: undefined } : arguments[1];

    var pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined;
    view.zoomBy(change, pointer_document);
    publish();
  }

  function panStart() {
    var e = arguments.length <= 0 || arguments[0] === undefined ? { pageX: undefined, pageY: undefined } : arguments[0];

    validateEventPosition('panStart', e);
    state.isPanning = true;
    state.panStart = [e.pageX, e.pageY];
  }

  function panMove() {
    var e = arguments.length <= 0 || arguments[0] === undefined ? { pageX: undefined, pageY: undefined } : arguments[0];

    if (!state.isPanning) return;
    validateEventPosition('panMove', e);
    state.panEnd = [e.pageX, e.pageY];
    view.panBy(_utilsVector2['default'].sub(state.panEnd, state.panStart));
    state.panStart = state.panEnd;
    publish();
  }

  function panEnd() {
    var e = arguments.length <= 0 || arguments[0] === undefined ? { pageX: undefined, pageY: undefined } : arguments[0];

    if (!state.isPanning) return;
    validateEventPosition('panEnd', e);
    state.isPanning = false;
    state.panEnd = [e.pageX, e.pageY];
  }

  function panBy(dx, dy) {
    if (dx === undefined || dy === undefined) {
      throw new Error('InvalidArguments: panBy(dx, dy) called with ' + dx + ', ' + dy);
    }
    view.panBy([dx, dy]);
    publish();
  }

  function decorate(_ref2) {
    var translate = _ref2.translate;
    var rotate = _ref2.rotate;
    var scale = _ref2.scale;

    // The default transform-origin for divs is '50% 50%'. The math in this
    // library assumes that the origin is located at the top left corner.
    var transformFromTopLeft = function transformFromTopLeft(transform, _ref3) {
      var cx = _ref3[0];
      var cy = _ref3[1];
      return '\n      translate(' + -cx + 'px, ' + -cy + 'px)\n      ' + transform + '\n      translate(' + cx + 'px, ' + cy + 'px)\n    ';
    };

    return {
      translate: translate,
      rotate: rotate,
      scale: scale,

      // transformTopLeft assumes transform-origin is 'top left', default in svg
      transformTopLeft: '\n        translate(' + translate[0] + 'px, ' + translate[1] + 'px)\n        rotate(' + rotate + ')\n        scale(' + scale + ')\n      ',

      // transform5050 assumes transform-origin is '50% 50%', default for divs
      transform5050: transformFromTopLeft('\n          translate(' + translate[0] + 'px, ' + translate[1] + 'px)\n          rotate(' + rotate + ')\n          scale(' + scale + ')', _centers.center_world(view.state))
    };
  }

  function publish() {
    var result = decorate(view.transform);
    render(result);
    return result;
  }
}

module.exports = exports['default'];