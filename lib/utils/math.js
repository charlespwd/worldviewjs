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