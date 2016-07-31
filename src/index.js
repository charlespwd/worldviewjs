import WorldView from './worldview';

const fromEventToVector = ({ pageX, pageY }) => [pageX, pageY]

export function PublicWorldView(render, opts) {
  const view = new WorldView(render, opts);
  const transformations = view.transformations;

  /// Public API
  return {
    zoomAtMouse,
    // panStart,
    // panMove,
    // panEnd,
    // rotateStart,
    // rotateMove,
    // rotateEnd,
  }

  function zoomAtMouse(newZoom, e = { pageX: undefined, pageY: undefined }) {
    const pointer_world = typeof e.pageX === 'number'
      ? transformations.fromDocumentToWorld(fromEventToVector(e))
      : undefined
    return view.zoomAt(newZoom, pointer_world)
  }
}
