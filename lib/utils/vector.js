'use strict';

exports.__esModule = true;

var _math = require('./math');

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
exports['default'] = {
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