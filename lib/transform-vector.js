'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _utilsVector = require('./utils/vector');

var _utilsVector2 = _interopRequireDefault(_utilsVector);

var _utilsMatrix = require('./utils/matrix');

var _utilsMatrix2 = _interopRequireDefault(_utilsMatrix);

// x_d = x_c - t_d
var fromDocumentToContainer = function fromDocumentToContainer(_ref, vector_document) {
  var container_document = _ref.container_document;
  return _utilsVector2['default'].sub(vector_document, container_document);
};

exports.fromDocumentToContainer = fromDocumentToContainer;
// x_c = x_d + t_d
var fromContainerToDocument = function fromContainerToDocument(_ref2, vector_container) {
  var container_document = _ref2.container_document;
  return _utilsVector2['default'].add(vector_container, container_document);
};

exports.fromContainerToDocument = fromContainerToDocument;
// x_c = z*R*x_w + t_c
var fromWorldToContainer = function fromWorldToContainer(_ref3, vector_world) {
  var scale = _ref3.scale;
  var theta = _ref3.theta;
  var world_container = _ref3.world_container;
  return _utilsVector2['default'].add(_utilsVector2['default'].scale(scale, _utilsMatrix2['default'].product(_utilsMatrix.R(theta), vector_world)), world_container);
};

exports.fromWorldToContainer = fromWorldToContainer;
// x_w = 1/z*(R^-1)(x_c - t_c)
var fromContainerToWorld = function fromContainerToWorld(_ref4, vector_container) {
  var scale = _ref4.scale;
  var theta = _ref4.theta;
  var world_container = _ref4.world_container;
  return _utilsVector2['default'].scale(1 / scale, _utilsMatrix2['default'].product(_utilsMatrix.R(-theta), _utilsVector2['default'].sub(vector_container, world_container)));
};

exports.fromContainerToWorld = fromContainerToWorld;
var fromWorldToDocument = function fromWorldToDocument(state, vector_world) {
  var vector_container = fromWorldToContainer(state, vector_world);
  return fromContainerToDocument(state, vector_container);
};

exports.fromWorldToDocument = fromWorldToDocument;
var fromDocumentToWorld = function fromDocumentToWorld(state, vector_document) {
  var vector_container = fromDocumentToContainer(state, vector_document);
  return fromContainerToWorld(state, vector_container);
};
exports.fromDocumentToWorld = fromDocumentToWorld;