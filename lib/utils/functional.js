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