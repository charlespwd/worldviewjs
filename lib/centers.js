'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.centerContainer_world = exports.centerContainer_document = exports.center_container = exports.centerWorld_container = exports.centerWorld_document = exports.center_world = undefined;

var _vector = require('./utils/vector');

var _vector2 = _interopRequireDefault(_vector);

var _transformVector = require('./transform-vector');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/// Various centers
var center_world = exports.center_world = function center_world(state) {
  return _vector2.default.scale(1 / 2, state.worldSize);
};
var centerWorld_document = exports.centerWorld_document = function centerWorld_document(state) {
  return (0, _transformVector.fromWorldToDocument)(state, center_world(state));
};
var centerWorld_container = exports.centerWorld_container = function centerWorld_container(state) {
  return (0, _transformVector.fromWorldToContainer)(state, center_world(state));
};
var center_container = exports.center_container = function center_container(state) {
  return _vector2.default.scale(1 / 2, state.containerSize);
};

var centerContainer_document = exports.centerContainer_document = function centerContainer_document(state) {
  return (0, _transformVector.fromContainerToDocument)(state, center_container(state));
};

var centerContainer_world = exports.centerContainer_world = function centerContainer_world(state) {
  return (0, _transformVector.fromContainerToWorld)(state, center_container(state));
};