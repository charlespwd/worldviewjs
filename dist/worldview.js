(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["worldviewjs"] = factory();
	else
		root["worldviewjs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _publicApi = __webpack_require__(7);

	var _publicApi2 = _interopRequireDefault(_publicApi);

	exports['default'] = _publicApi2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	var PI = Math.PI;
	exports.PI = PI;
	var sin = function sin(degrees) {
	  return Math.sin(degrees / 180 * PI);
	};
	exports.sin = sin;
	var cos = function cos(degrees) {
	  return Math.cos(degrees / 180 * PI);
	};
	exports.cos = cos;
	var avg = function avg(a, b) {
	  return (a + b) / 2;
	};
	exports.avg = avg;
	var delta = function delta(a, b) {
	  return a - b;
	};
	exports.delta = delta;
	var bounded = function bounded(lower, x) {
	  if (lower === undefined) lower = -Infinity;
	  var upper = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];
	  return Math.min(upper, Math.max(lower, x));
	};
	exports.bounded = bounded;
	var isBounded = function isBounded(lower, x, upper) {
	  return lower <= x && x <= upper;
	};

	exports.isBounded = isBounded;
	var ops = {
	  '+': function _(a, b) {
	    return a + b;
	  },
	  '-': function _(a, b) {
	    return a - b;
	  },
	  '*': function _(a, b) {
	    return a * b;
	  },
	  '/': function _(a, b) {
	    return a / b;
	  },
	  avg: avg
	};
	exports.ops = ops;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _math = __webpack_require__(1);

	var operate = function operate(op) {
	  return function (v, u) {
	    return v.map(function (_, i) {
	      return op(v[i], u[i]);
	    });
	  };
	};

	var scale = function scale(k, v) {
	  return v.map(function (x) {
	    return k * x;
	  });
	};
	exports.scale = scale;
	var add = operate(_math.ops['+']);
	exports.add = add;
	var sub = operate(_math.ops['-']);
	exports.sub = sub;
	var dotProduct = operate(_math.ops['*']);
	exports.dotProduct = dotProduct;
	var min = operate(Math.min);
	exports.min = min;
	var max = operate(Math.max);
	exports.max = max;
	var bounded = function bounded(u, v, w) {
	  return min(max(u, v), w);
	};
	exports.bounded = bounded;
	var norm = function norm(v) {
	  return Math.sqrt(dotProduct(v, v).reduce(_math.ops['+']));
	};
	exports.norm = norm;
	var normalize = function normalize(v) {
	  return scale(1 / norm(v), v);
	};
	exports.normalize = normalize;
	var zero = Object.freeze([0, 0]);
	exports.zero = zero;
	var abs = function abs(v) {
	  return v.map(Math.abs);
	};

	exports.abs = abs;
	exports['default'] = {
	  abs: abs,
	  add: add,
	  bounded: bounded,
	  max: max,
	  min: min,
	  norm: norm,
	  normalize: normalize,
	  scale: scale,
	  sub: sub,
	  zero: zero
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsVector = __webpack_require__(2);

	var _utilsVector2 = _interopRequireDefault(_utilsVector);

	var _transformVector = __webpack_require__(4);

	/// Various centers
	var center_world = function center_world(state) {
	  return _utilsVector2['default'].scale(1 / 2, state.worldSize);
	};
	exports.center_world = center_world;
	var centerWorld_document = function centerWorld_document(state) {
	  return _transformVector.fromWorldToDocument(state, center_world(state));
	};
	exports.centerWorld_document = centerWorld_document;
	var centerWorld_container = function centerWorld_container(state) {
	  return _transformVector.fromWorldToContainer(state, center_world(state));
	};
	exports.centerWorld_container = centerWorld_container;
	var center_container = function center_container(state) {
	  return _utilsVector2['default'].scale(1 / 2, state.containerSize);
	};

	exports.center_container = center_container;
	var centerContainer_document = function centerContainer_document(state) {
	  return _transformVector.fromContainerToDocument(state, center_container(state));
	};

	exports.centerContainer_document = centerContainer_document;
	var centerContainer_world = function centerContainer_world(state) {
	  return _transformVector.fromContainerToWorld(state, center_container(state));
	};
	exports.centerContainer_world = centerContainer_world;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsVector = __webpack_require__(2);

	var _utilsVector2 = _interopRequireDefault(_utilsVector);

	var _utilsMatrix = __webpack_require__(6);

	var _utilsMatrix2 = _interopRequireDefault(_utilsMatrix);

	// x_d = x_c - t_d
	var fromDocumentToContainer = function fromDocumentToContainer(_ref, vector_document) {
	  var container_document = _ref.container_document;
	  return _utilsVector2['default'].sub(vector_document, container_document);
	};

	exports.fromDocumentToContainer = fromDocumentToContainer;
	// x_c = x_d + t_d
	var fromContainerToDocument = function fromContainerToDocument(_ref2, vector_container) {
	  var container_document = _ref2.container_document;
	  return _utilsVector2['default'].add(vector_container, container_document);
	};

	exports.fromContainerToDocument = fromContainerToDocument;
	// x_c = z*R*x_w + t_c
	var fromWorldToContainer = function fromWorldToContainer(_ref3, vector_world) {
	  var scale = _ref3.scale;
	  var theta = _ref3.theta;
	  var world_container = _ref3.world_container;
	  return _utilsVector2['default'].add(_utilsVector2['default'].scale(scale, _utilsMatrix2['default'].product(_utilsMatrix.R(theta), vector_world)), world_container);
	};

	exports.fromWorldToContainer = fromWorldToContainer;
	// x_w = 1/z*(R^-1)(x_c - t_c)
	var fromContainerToWorld = function fromContainerToWorld(_ref4, vector_container) {
	  var scale = _ref4.scale;
	  var theta = _ref4.theta;
	  var world_container = _ref4.world_container;
	  return _utilsVector2['default'].scale(1 / scale, _utilsMatrix2['default'].product(_utilsMatrix.R(-theta), _utilsVector2['default'].sub(vector_container, world_container)));
	};

	exports.fromContainerToWorld = fromContainerToWorld;
	var fromWorldToDocument = function fromWorldToDocument(state, vector_world) {
	  var vector_container = fromWorldToContainer(state, vector_world);
	  return fromContainerToDocument(state, vector_container);
	};

	exports.fromWorldToDocument = fromWorldToDocument;
	var fromDocumentToWorld = function fromDocumentToWorld(state, vector_document) {
	  var vector_container = fromDocumentToContainer(state, vector_document);
	  return fromContainerToWorld(state, vector_container);
	};
	exports.fromDocumentToWorld = fromDocumentToWorld;

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var flow = function flow() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }

	  return function (x) {
	    var f = args[0];
	    var rest = args.slice(1);

	    if (f) {
	      return flow.apply(undefined, rest)(f(x));
	    }
	    return x;
	  };
	};

	exports.flow = flow;
	var setState = function setState(state, key, value) {
	  var _extends2;

	  return _extends({}, state, (_extends2 = {}, _extends2[key] = value, _extends2));
	};
	exports.setState = setState;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _math = __webpack_require__(1);

	var isVector = function isVector(x) {
	  return x instanceof Array && typeof x[0] === 'number';
	};
	var isMatrix = function isMatrix(x) {
	  return x instanceof Array && x[0] instanceof Array && typeof x[0][0] === 'number';
	};

	// Rotation Matrix
	var R = function R(theta) {
	  return [[_math.cos(theta), -_math.sin(theta)], [_math.sin(theta), _math.cos(theta)]];
	};

	exports.R = R;
	var scale = function scale(k, A) {
	  return A.map(function (row) {
	    return row.map(function (elem) {
	      return k * elem;
	    });
	  });
	};

	exports.scale = scale;
	var product = function product(A, B) {
	  if (isVector(B)) {
	    return [A[0][0] * B[0] + A[0][1] * B[1], A[1][0] * B[0] + A[1][1] * B[1]];
	  } else if (isMatrix(B)) {
	    var _ret = (function () {
	      var result = [[undefined, undefined], [undefined, undefined]];
	      return {
	        v: result.map(function (_, i) {
	          return result.map(function (__, j) {
	            return A[i][0] * B[0][j] + A[i][1] * B[1][j];
	          });
	        })
	      };
	    })();

	    if (typeof _ret === 'object') return _ret.v;
	  }
	  throw new Error('What are you trying to do?');
	};

	exports.product = product;
	var matrixOperation = function matrixOperation(A, B, op) {
	  return [[op(A[0][0], B[0][0]), op(A[0][1], B[0][1])], [op(A[1][0], B[1][0]), op(A[1][1], B[1][1])]];
	};

	var sub = function sub(A, B) {
	  return matrixOperation(A, B, _math.ops['-']);
	};
	exports.sub = sub;
	var add = function add(A, B) {
	  return matrixOperation(A, B, _math.ops['+']);
	};

	exports.add = add;
	exports['default'] = {
	  R: R,
	  add: add,
	  product: product,
	  scale: scale,
	  sub: sub
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = PublicWorldView;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _worldview = __webpack_require__(9);

	var _worldview2 = _interopRequireDefault(_worldview);

	var _utilsVector = __webpack_require__(2);

	var _utilsVector2 = _interopRequireDefault(_utilsVector);

	var _centers = __webpack_require__(3);

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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.scaleLimit = scaleLimit;

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utilsVector = __webpack_require__(2);

	var _utilsVector2 = _interopRequireDefault(_utilsVector);

	var _utilsMatrix = __webpack_require__(6);

	var _utilsMatrix2 = _interopRequireDefault(_utilsMatrix);

	var _utilsFunctional = __webpack_require__(5);

	var _utilsMath = __webpack_require__(1);

	var math = _interopRequireWildcard(_utilsMath);

	// Transformations are simple WorldState -> WorldState mappings.
	// The simplest world transformation: change a value.
	var set = function set(key, value) {
	  return function (state) {
	    return _utilsFunctional.setState(state, key, value);
	  };
	};
	exports.set = set;
	var identity = function identity(state) {
	  return state;
	};

	exports.identity = identity;
	// Give me a set of transformations and a state and I'll give you a
	// new state. Transformations are composable.
	var reduce = function reduce(transforms, initialState) {
	  if (transforms === undefined) transforms = [];
	  return [].concat(transforms).reduce(function (state, transform) {
	    return transform(state);
	  }, initialState);
	};

	exports.reduce = reduce;
	// # Fixed point zoom transformation
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
	// For z is the scale level, and t the translation vector.
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
	var statelessZoom = function statelessZoom(zoom_f, pointer_container) {
	  return function (state) {
	    var zoom_i = state.scale;
	    var world_container_i = state.world_container;
	    var world_container_f = _utilsVector2['default'].add(pointer_container, _utilsVector2['default'].scale(zoom_f / zoom_i, _utilsVector2['default'].sub(world_container_i, pointer_container)));

	    return _extends({}, state, {
	      world_container: world_container_f,
	      scale: zoom_f
	    });
	  };
	};

	exports.statelessZoom = statelessZoom;
	// # Fixed point pan transformation
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
	// For z is the scale level, and t the translation vector.
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
	var statelessPanBy = function statelessPanBy(translation_container) {
	  return function (state) {
	    var world_container_i = state.world_container;
	    var world_container_f = _utilsVector2['default'].add(translation_container, world_container_i);

	    return _extends({}, state, {
	      world_container: world_container_f
	    });
	  };
	};

	exports.statelessPanBy = statelessPanBy;
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
	var statelessRotateBy = function statelessRotateBy(degrees) {
	  var pivot_container = arguments.length <= 1 || arguments[1] === undefined ? [0, 0] : arguments[1];
	  return function (state) {
	    var theta_i = state.theta;
	    var theta_f = state.theta + degrees;
	    var world_container_i = state.world_container;
	    var world_container_f = _utilsVector2['default'].sub(pivot_container, _utilsMatrix2['default'].product(_utilsMatrix2['default'].product(_utilsMatrix.R(theta_f), _utilsMatrix.R(-theta_i)), _utilsVector2['default'].sub(pivot_container, world_container_i)));

	    return _extends({}, state, {
	      theta: theta_f,
	      world_container: world_container_f
	    });
	  };
	};

	exports.statelessRotateBy = statelessRotateBy;
	var fit = function fit() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  return function (state) {
	    if (options.fitNoWhitespace) {
	      return fitNoWhitespace(state, options);
	    }

	    return fitWithWhitespace(state, options);
	  };
	};

	exports.fit = fit;
	// # Fitting without whitespace
	// We have two limits, the first one is on the scale, the second one is on the
	// translation vector.
	//
	// The Goal: Any points visible within the container are points within the
	// world.
	//
	// ## Part 1, the scale limit
	//
	// We have
	// 1. The size of the world
	//      W_w = wlimit_w - 0_w   .. (1)
	// 2. The size of the container
	//      C_c = climit_c - 0_c  .. (2)
	// 3. The coordinate transformation
	//      x_c = z*x_w + t_c  .. (3)
	// 4. From (3) and (1)
	//      W_c = z*W_w
	//
	// for z is the scale, t_c the translation vector, wlimit the vector pointing to
	// the limiting corner, climit the vector pointing to the corner limit of the
	// container, and 0_x the zero vector.
	//
	// When fitting at the limit, one of the world size component is equal to the
	// container size.
	//
	// Thus we have
	//      C_c_x = W_c_x = k_limit*W_w_X  ... or ... C_c_y = W_c_y = k*W_w_y
	//
	// Therefore
	//      k_limit <= k
	//      k_limit = max(C_c_x / W_w_x, C_c_y / W_w_y) <= k
	//
	// ## Part 2, the translation limit
	//
	// We have
	// 1. A container domain `C` defined as
	//   C = { x_c : 0_c <= x_c <= C_c }  .. (1)
	// 2. The world domain `W` defined as
	//   W = { x_w : 0_w <= x_w <= W_w } .. (2)
	// 3. The coordinate transformations
	//   x_c = z*x_w + t_c  .. (3)
	//   x_w = 1/z*(x_c - t_c)  .. (4)
	//
	// Since all points in the container must be contained by the world, we have
	//   C ⊆ W  ... (5)
	//
	// In an effort to obtain limits on t_c, we transform W into the container's
	// coordinate system.
	//   0_w = 1/z * (x_c_l - t_c) which implies x_c_l = t_c
	//   W_w = 1/z * (x_c_r - t_c) which implies x_c_r = z*W_w + t_c
	//   W = { x_c: x_c_l <= x_c <= x_c_r }
	//   W = { x_c: t_c <= x_c <= z*W_w + t_c }
	//
	// Since C ⊆ W, we get
	//   t_c <= 0 <= x_c <= C_c <= z*W_w + t_c
	//
	// Limit #1
	//   t_c <= 0
	//
	// Limit #2
	//   C_c - z*W_w <=  t_c
	//
	// Therefore, C_c - z*W_w <= t_c <= 0
	function fitNoWhitespace(state, options) {
	  var worldSize = state.worldSize;
	  var containerSize = state.containerSize;

	  var limit = scaleLimit(state);
	  var scale = math.bounded(options.minZoom, Math.max(limit, state.scale), options.maxZoom);
	  return _extends({}, state, {
	    scale: scale,
	    world_container: _utilsVector2['default'].bounded(_utilsVector2['default'].sub(containerSize, _utilsVector2['default'].scale(scale, worldSize)), state.world_container, _utilsVector2['default'].zero)
	  });
	}

	// # Fitting with whitespace
	//
	// Fitting with whitespace is similar to fitting without whitespace. In fact,
	// it's the very same strategy we're using EXCEPT that we enlarge the world (W) with
	// whitespace such that the transformed world (T) has the same aspect ratio as
	// the Container(C).
	//
	// We enlarge the world with whitespace such that
	//   1) it is centered within the container
	//   2) it is only enlarged in one direction
	//
	// Here's an illustration
	//
	//   ------
	//  |      |
	//  | 16x6 | World
	//  |      |
	//   ------W
	//
	//   ----------
	//  |          |
	//  |   13x3   | Container
	//  |          |
	//   ----------C
	//
	//   ----------
	//  |w|      |w|
	//  |w| 26x6 |w| Transformed World
	//  |w|      |w|
	//   --------W-T
	//
	// Thus we have the three domains
	//  1) C = { x_c | 0 <= x_c <= C_c }
	//  2) W = { x_w | 0 <= x_w <= W_w }
	//  3) T = { x_t | 0 <= x_t <= T_t }
	//
	// And following transformations from one coordinate system to the other
	//
	//  4) x_t = x_w + dx_w
	//  5) x_c = k * x_w + t_c
	//
	// Where C_c is the container size in the container coords
	// Where W_w is the world size in the world coords
	// Where T_t is the transformed world size in transformed world coords
	// Where {}_c, {}_w, {}_t define vectors in the container, world, and
	//  transformed world coordinate systems
	// Where dx_{} is the width of the whitespace
	// Where t_{} is the distance between the world and container origins
	//
	// If we say that the world is centered within the container, it means that
	//
	//  6) 2 * dx_w + W_w = C_w
	//
	// Solving for dx_w, since C_w = C_c / klimit we get
	//  7) dx_w = 0.5 * (C_w - W_w)
	//     dx_w = 0.5 * (C_c / klimit - W_w)
	//
	// Transforming 3) into container and world coords we get
	//  8) T = { x_c | x_left_c <= x_c <= x_right_c }
	//       = { x_w | x_left_w <= x_c <= x_right_w }
	//
	// From 4) and 8), we get
	//  9) x_left_w  = 0   - dx_w   AND
	//     x_right_w = T_t - dx_w = W_w + dx_w
	//
	// From 5) and 9), we get
	//  10) x_left_c  = k * (-dx_w)      + t_c  AND
	//      x_rigth_c = k * (W_w + dx_w) + t_c
	//
	// Since all points in the container must be contained by the transformed world, we have
	//  11) C ⊆ T
	//
	// Thus,
	//  12) x_left_c <= 0 <= x_c <= C_c <= x_right_c
	//
	// Which implies, from 10)
	//  13) -k * dx_w + t_c <= 0  AND
	//                  C_c <= k * (W_w + dx_w) + t_c
	//
	// Finally, solving for t_c, we get our translation limits
	//  14) t_c <= k * dx_w  AND
	//      t_c >= C_c - k * (W_w + dx_w)
	function fitWithWhitespace(state, options) {
	  var worldSize = state.worldSize;
	  var containerSize = state.containerSize;

	  var limit = scaleLimit(state, Math.min);

	  // dx_w = 0.5 * (C_c / klimit - W_w)
	  var dx_w = _utilsVector2['default'].scale(0.5, _utilsVector2['default'].sub(_utilsVector2['default'].scale(1 / limit, containerSize), worldSize));

	  var scale = math.bounded(options.minZoom, Math.max(limit, state.scale), options.maxZoom);

	  // C_c - k * (W_w + dx_w) <= t_c <= k * dx_w
	  var t_c = _utilsVector2['default'].bounded(
	  // C_c - k * (W_w + dx_w)
	  _utilsVector2['default'].sub(containerSize, _utilsVector2['default'].scale(scale, _utilsVector2['default'].add(worldSize, dx_w))),
	  // t_c
	  state.world_container,
	  // k * dx_w
	  _utilsVector2['default'].scale(scale, dx_w));

	  return _extends({}, state, {
	    scale: scale,
	    world_container: t_c
	  });
	}

	function scaleLimit(_ref) {
	  var worldSize = _ref.worldSize;
	  var containerSize = _ref.containerSize;
	  var comparator = arguments.length <= 1 || arguments[1] === undefined ? Math.max : arguments[1];

	  var scalelimit_x = containerSize[0] / worldSize[0];
	  var scalelimit_y = containerSize[1] / worldSize[1];
	  return comparator(scalelimit_x, scalelimit_y);
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports['default'] = WorldView;

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _centers = __webpack_require__(3);

	var _utilsFunctional = __webpack_require__(5);

	var _transformVector = __webpack_require__(4);

	var _utilsMath = __webpack_require__(1);

	var math = _interopRequireWildcard(_utilsMath);

	var _transformWorld = __webpack_require__(8);

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

	    var limit = _transformWorld.scaleLimit(state, options.fitNoWhitespace ? Math.max : Math.min);
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

/***/ }
/******/ ])
});
;