'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = PublicWorldView;

var _worldview = require('./worldview');

var _worldview2 = _interopRequireDefault(_worldview);

var _vector = require('./utils/vector');

var _vector2 = _interopRequireDefault(_vector);

var _centers = require('./centers');

var _transformWorld = require('./transform-world');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromEventToVector = function fromEventToVector(_ref) {
  var pageX = _ref.pageX,
      pageY = _ref.pageY;
  return [pageX, pageY];
};

var validateEventPosition = function validateEventPosition(method, e) {
  if (typeof e.pageX !== 'number' || typeof e.pageY !== 'number') {
    throw new Error('Trying to ' + method + ' without { pageX, pageY }. Check your event handler.');
  }
};

function PublicWorldView(render, opts) {
  var view = new _worldview2.default(opts);
  var state = {
    isPanning: false,
    panStart: null,
    panEnd: null

    /// Public API
  };return {
    get state() {
      return view.state;
    },
    get transform() {
      return view.transform;
    },
    get options() {
      return view.options;
    },
    get scale() {
      return view.state.scale;
    },
    get translate() {
      return view.state.world_container;
    },
    get offset() {
      return view.state.container_document;
    },
    get rotation() {
      return view.state.theta;
    },
    get worldSize() {
      return view.state.worldSize;
    },
    get containerSize() {
      return view.state.containerSize;
    },
    get theta() {
      return view.state.theta;
    },
    get minZoom() {
      return (0, _transformWorld.scaleLimit)(view.state, view.options, view.options.fitNoWhitespace ? Math.max : Math.min);
    },
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
  };

  function isZoomedOut() {
    var tolerance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

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
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { pageX: undefined, pageY: undefined };

    var change = wheelDelta > 0 ? 1.03 : 0.97; // %
    var pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined;
    view.zoomBy(change, pointer_document);
    publish();
  }

  // Where change is the ratio between the previous and the future scale level
  function zoomBy(change) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { pageX: undefined, pageY: undefined };

    var pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined;
    view.zoomBy(change, pointer_document);
    publish();
  }

  function panStart() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { pageX: undefined, pageY: undefined };

    validateEventPosition('panStart', e);
    state.isPanning = true;
    state.panStart = [e.pageX, e.pageY];
  }

  function panMove() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { pageX: undefined, pageY: undefined };

    if (!state.isPanning) return;
    validateEventPosition('panMove', e);
    state.panEnd = [e.pageX, e.pageY];
    view.panBy(_vector2.default.sub(state.panEnd, state.panStart));
    state.panStart = state.panEnd;
    publish();
  }

  function panEnd() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { pageX: undefined, pageY: undefined };

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
    var translate = _ref2.translate,
        rotate = _ref2.rotate,
        scale = _ref2.scale;

    // The default transform-origin for divs is '50% 50%'. The math in this
    // library assumes that the origin is located at the top left corner.
    var transformFromTopLeft = function transformFromTopLeft(transform, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          cx = _ref4[0],
          cy = _ref4[1];

      return '\n      translate(' + -cx + 'px, ' + -cy + 'px)\n      ' + transform + '\n      translate(' + cx + 'px, ' + cy + 'px)\n    ';
    };

    return {
      translate: translate,
      rotate: rotate,
      scale: scale,

      // transformTopLeft assumes transform-origin is 'top left', default in svg
      transformTopLeft: '\n        translate(' + translate[0] + 'px, ' + translate[1] + 'px)\n        rotate(' + rotate + ')\n        scale(' + scale + ')\n      ',

      // transform5050 assumes transform-origin is '50% 50%', default for divs
      transform5050: transformFromTopLeft('\n          translate(' + translate[0] + 'px, ' + translate[1] + 'px)\n          rotate(' + rotate + ')\n          scale(' + scale + ')', (0, _centers.center_world)(view.state))
    };
  }

  function publish() {
    var result = decorate(view.transform);
    render(result);
    return result;
  }
}