const scaleVector = (k, v) => v.map(x => k * x);
const addVectors = (v, u) => v.map((x, i) => x + u[i]);
const minusVectors = (v, u) => v.map((x, i) => x - u[i]);
const pointer = ({ pageX, pageY }) => [pageX, pageY];

export default function PanZoom(render /* , opts */ ) {
  let zoom = 1;
  let containerOrigin_document = [0, 0]; // default, the position of the origin of the unscaled coords
  let worldOrigin_container = [0, 0]; // default, the position of the origin of the scaled coords relative to the container
  let worldSize = [0, 0];

  const flow = (f, g) => (x) => g(f(x))
  const fromDocumentToContainer = (vector_document) => (
    minusVectors(vector_document, containerOrigin_document)
  )
  const fromContainerToDocument = (vector_container) => (
    addVectors(vector_container, containerOrigin_document)
  )
  const fromWorldToContainer = (vector_world) => (
    addVectors(scaleVector(zoom, vector_world), worldOrigin_container)
  )
  const fromContainerToWorld = (vector_container) => (
    scaleVector(1 / zoom, minusVectors(vector_container, worldOrigin_container))
  )
  const fromWorldToDocument = flow(fromWorldToContainer, fromContainerToDocument)
  const fromDocumentToWorld = flow(fromDocumentToContainer, fromContainerToWorld)

  const transform = {
    fromContainerToDocument,
    fromContainerToWorld,
    fromDocumentToContainer,
    fromDocumentToWorld,
    fromWorldToContainer,
    fromWorldToDocument,
  };

  return {
    debug,
    transform,
    setDimensions,
    setContainerOrigin,
    zoomTo,
  };

  function debug() {
    return {
      worldOrigin_container,
      center_world,
      centerWorld_document,
      centerWorld_container,
    }
  }

  function center_world() {
    return scaleVector(1/2, worldSize);
  }

  function centerWorld_document() {
    return transform.fromWorldToDocument(center_world());
  }

  function centerWorld_container(argument) {
    return transform.fromWorldToContainer(center_world());
  }

  function setDimensions(worldWidth, worldHeight) {
    worldSize = [worldWidth, worldHeight];
  }

  function setContainerOrigin(x, y) {
    containerOrigin_document = [x, y];
  }

  // When zooming at a fixed point in the container
  function zoomTo(e = {} , newZoom) {
    const pointer_document = typeof e.pageX === 'number'
      ? pointer(e)
      : centerWorld_document();
    const pointer_container = (
      transform.fromDocumentToContainer(pointer_document)
    );

    const deltaZoom = zoom - newZoom;
    zoom = newZoom;

    worldOrigin_container = minusVectors(
      scaleVector(deltaZoom, pointer_container),
      worldOrigin_container
    );

    render(worldOrigin_container, zoom);
  }

  function panStart() {

  }
}
