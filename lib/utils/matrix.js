'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = exports.sub = exports.product = exports.scale = exports.R = undefined;

var _math = require('./math');

var isVector = function isVector(x) {
  return x instanceof Array && typeof x[0] === 'number';
};
var isMatrix = function isMatrix(x) {
  return x instanceof Array && x[0] instanceof Array && typeof x[0][0] === 'number';
};

// Rotation Matrix
var R = exports.R = function R(theta) {
  return [[(0, _math.cos)(theta), -(0, _math.sin)(theta)], [(0, _math.sin)(theta), (0, _math.cos)(theta)]];
};

var scale = exports.scale = function scale(k, A) {
  return A.map(function (row) {
    return row.map(function (elem) {
      return k * elem;
    });
  });
};

var product = exports.product = function product(A, B) {
  if (isVector(B)) {
    return [A[0][0] * B[0] + A[0][1] * B[1], A[1][0] * B[0] + A[1][1] * B[1]];
  } else if (isMatrix(B)) {
    var result = [[undefined, undefined], [undefined, undefined]];
    return result.map(function (_, i) {
      return result.map(function (__, j) {
        return A[i][0] * B[0][j] + A[i][1] * B[1][j];
      });
    });
  }
  throw new Error('What are you trying to do?');
};

var matrixOperation = function matrixOperation(A, B, op) {
  return [[op(A[0][0], B[0][0]), op(A[0][1], B[0][1])], [op(A[1][0], B[1][0]), op(A[1][1], B[1][1])]];
};

var sub = exports.sub = function sub(A, B) {
  return matrixOperation(A, B, _math.ops['-']);
};
var add = exports.add = function add(A, B) {
  return matrixOperation(A, B, _math.ops['+']);
};

exports.default = {
  R: R,
  add: add,
  product: product,
  scale: scale,
  sub: sub
};