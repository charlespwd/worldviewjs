'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.scaleLimit = scaleLimit;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsVector = require('./utils/vector');

var _utilsVector2 = _interopRequireDefault(_utilsVector);

var _utilsMatrix = require('./utils/matrix');

var _utilsMatrix2 = _interopRequireDefault(_utilsMatrix);

var _utilsFunctional = require('./utils/functional');

var _utilsMath = require('./utils/math');

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
// Fitting with whitespace is similar to the noWhitespace fitting except that it
// allows for zooming in the zone where
//   min(scaleLimit) <= scale <= max(scaleLimit).
//
// When that happens, we want to
//   1) center the world within the limiting direction, and
//   2) allow for fitted panning in the perpendicular direction.
//
// Here's a drawing of the situation
//
//           |---> midline                |---> midline
//           |                            |
//        ---|---                         |
//    ---|---|---|---              ---- --|-- ----
//   |xxx|   |   |xxx|            |xxxx|  |  |xxxx|
//   |xxx|   |   |xxx|            |xxxx|  |  |xxxx|
//   |xxx|   |   |xxx|            |xxxx|  |  |xxxx|
//   |xxx|   |   |xxx|            |xxxx|  |  |xxxx|
//    ---|---|---|---C             ---- --|--W----C
//       |   |   |                        |
//        ---|---W                        |---> midline
//           |
//           |---> midline
//
//          (A)                          (B)
//
//  In (A), min(scaleLimit) < scale < max(scaleLimit)
//  In (B), min(scaleLimit) = scale
//
// Thus, in this mode we have three limitting factors
//
//  1) The scale limit
//  2) The centered world within the whitespaced direction
//  3) Fitted panning in the perpendicular direction
//
// ## The scale limit
//
// When the aspect ratio is not equal, we either have
//
//     C_c_x > W_c_x  AND  C_c_y = W_c_y
//     C_c_x = W_c_x  AND  C_c_y > W_c_y
//
// Transforming the world size into world coordinates and solving for the
// scale, we get
//
//     k_limit = min(C_c_x / W_w_x, C_c_y / W_w_y) <= k
//
// ## Centered world about the whitespaced direction
//
// When that happens, we fix the translation vector such that the world is
// centered in whitespaced direction.
//
// In other words,
//
//  (W_w_centered / 2)_c = C_c_centered / 2
//  (k * W_w_centered / 2 + t_c_centered) = C_c_centered / 2
//
// Which implies
//
//     t_c_centered = 0.5 * (C_c_centered - k * W_w_centered)
//
// ## Fitted pan in the non-whitespaced direction
//
// This is a copy paste of the condition for noWhitespace fitting. Therefore,
//
//     C_c_opposite - k * W_w_other <= t_c_other <= 0
function fitWithWhitespace(state, options) {
  var worldSize = state.worldSize;
  var containerSize = state.containerSize;

  var limit = scaleLimit(state, Math.min);
  var scale = math.bounded(options.minZoom, Math.max(limit, state.scale), options.maxZoom);

  // When the scale is greater than both limiting fitting scales, revert to
  // noWhitespace fitting.
  if (scale >= scaleLimit(state, Math.max)) {
    return fitNoWhitespace(state, options);
  }

  // t_c_centered = 0.5 * (C_c - k * W_w)
  var centered = _utilsVector2['default'].scale(0.5, _utilsVector2['default'].sub(containerSize, _utilsVector2['default'].scale(scale, worldSize)));

  // C_c - k * W_w <= t_c <= 0
  var fitted = _utilsVector2['default'].bounded(_utilsVector2['default'].sub(containerSize, _utilsVector2['default'].scale(scale, worldSize)), state.world_container, _utilsVector2['default'].zero);

  var conditions = {
    centered: centered,
    fitted: fitted
  };

  return _extends({}, state, {
    scale: scale,
    world_container: limitingConditions(state).map(function (name, i) {
      return conditions[name][i];
    })
  });
}

function limitingConditions(_ref) {
  var worldSize = _ref.worldSize;
  var containerSize = _ref.containerSize;

  var scalelimit_x = containerSize[0] / worldSize[0];
  var scalelimit_y = containerSize[1] / worldSize[1];
  return scalelimit_x <= scalelimit_y ? ['fitted', 'centered'] : ['centered', 'fitted'];
}

function scaleLimit(_ref2) {
  var worldSize = _ref2.worldSize;
  var containerSize = _ref2.containerSize;
  var comparator = arguments.length <= 1 || arguments[1] === undefined ? Math.max : arguments[1];

  var scalelimit_x = containerSize[0] / worldSize[0];
  var scalelimit_y = containerSize[1] / worldSize[1];
  return comparator(scalelimit_x, scalelimit_y);
}