'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsVector = require('./utils/vector');

var _utilsVector2 = _interopRequireDefault(_utilsVector);

var _transformVector = require('./transform-vector');

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