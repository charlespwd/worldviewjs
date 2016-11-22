'use strict';

exports.__esModule = true;

var _math = require('./math');

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