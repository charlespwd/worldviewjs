'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PI = exports.PI = Math.PI;
var sin = exports.sin = function sin(degrees) {
  return Math.sin(degrees / 180 * PI);
};
var cos = exports.cos = function cos(degrees) {
  return Math.cos(degrees / 180 * PI);
};
var avg = exports.avg = function avg(a, b) {
  return (a + b) / 2;
};
var delta = exports.delta = function delta(a, b) {
  return a - b;
};
var bounded = exports.bounded = function bounded() {
  var lower = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -Infinity;
  var x = arguments[1];
  var upper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
  return Math.min(upper, Math.max(lower, x));
};
var isBounded = exports.isBounded = function isBounded(lower, x, upper) {
  return lower <= x && x <= upper;
};

var ops = exports.ops = {
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