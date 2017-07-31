'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abs = exports.zero = exports.normalize = exports.norm = exports.bounded = exports.max = exports.min = exports.dotProduct = exports.sub = exports.add = exports.scale = undefined;

var _math = require('./math');

var operate = function operate(op) {
  return function (v, u) {
    return v.map(function (_, i) {
      return op(v[i], u[i]);
    });
  };
};

var scale = exports.scale = function scale(k, v) {
  return v.map(function (x) {
    return k * x;
  });
};
var add = exports.add = operate(_math.ops['+']);
var sub = exports.sub = operate(_math.ops['-']);
var dotProduct = exports.dotProduct = operate(_math.ops['*']);
var min = exports.min = operate(Math.min);
var max = exports.max = operate(Math.max);
var bounded = exports.bounded = function bounded(u, v, w) {
  return min(max(u, v), w);
};
var norm = exports.norm = function norm(v) {
  return Math.sqrt(dotProduct(v, v).reduce(_math.ops['+']));
};
var normalize = exports.normalize = function normalize(v) {
  return scale(1 / norm(v), v);
};
var zero = exports.zero = Object.freeze([0, 0]);
var abs = exports.abs = function abs(v) {
  return v.map(Math.abs);
};

exports.default = {
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