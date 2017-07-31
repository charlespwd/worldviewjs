'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromDocumentToWorld = exports.fromWorldToDocument = exports.fromContainerToWorld = exports.fromWorldToContainer = exports.fromContainerToDocument = exports.fromDocumentToContainer = undefined;

var _vector = require('./utils/vector');

var _vector2 = _interopRequireDefault(_vector);

var _matrix = require('./utils/matrix');

var _matrix2 = _interopRequireDefault(_matrix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// x_d = x_c - t_d
var fromDocumentToContainer = exports.fromDocumentToContainer = function fromDocumentToContainer(_ref, vector_document) {
  var container_document = _ref.container_document;
  return _vector2.default.sub(vector_document, container_document);
};

// x_c = x_d + t_d
var fromContainerToDocument = exports.fromContainerToDocument = function fromContainerToDocument(_ref2, vector_container) {
  var container_document = _ref2.container_document;
  return _vector2.default.add(vector_container, container_document);
};

// x_c = z*R*x_w + t_c
var fromWorldToContainer = exports.fromWorldToContainer = function fromWorldToContainer(_ref3, vector_world) {
  var scale = _ref3.scale,
      theta = _ref3.theta,
      world_container = _ref3.world_container;
  return _vector2.default.add(_vector2.default.scale(scale, _matrix2.default.product((0, _matrix.R)(theta), vector_world)), world_container);
};

// x_w = 1/z*(R^-1)(x_c - t_c)
var fromContainerToWorld = exports.fromContainerToWorld = function fromContainerToWorld(_ref4, vector_container) {
  var scale = _ref4.scale,
      theta = _ref4.theta,
      world_container = _ref4.world_container;
  return _vector2.default.scale(1 / scale, _matrix2.default.product((0, _matrix.R)(-theta), _vector2.default.sub(vector_container, world_container)));
};

var fromWorldToDocument = exports.fromWorldToDocument = function fromWorldToDocument(state, vector_world) {
  var vector_container = fromWorldToContainer(state, vector_world);
  return fromContainerToDocument(state, vector_container);
};

var fromDocumentToWorld = exports.fromDocumentToWorld = function fromDocumentToWorld(state, vector_document) {
  var vector_container = fromDocumentToContainer(state, vector_document);
  return fromContainerToWorld(state, vector_container);
};