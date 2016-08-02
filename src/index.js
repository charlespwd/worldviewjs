import worldView from './worldview';
import vector from './utils/vector';
import { center_world } from './centers';

const fromEventToVector = ({ pageX, pageY }) => [pageX, pageY]

const validateEventPosition = (method, e) => {
  if (typeof e.pageX !== 'number' || typeof e.pageY !== 'number') {
    throw new Error(
      `Trying to ${method} without { pageX, pageY }. Check your event handler.`
    )
  }
}

export default function PublicWorldView(render, opts) {
  const view = worldView(opts);
  const state = {
    isPanning: false,
    panStart: null,
    panEnd: null,
  }

  /// Public API
  this.zoomAtMouse = zoomAtMouse
  this.panStart = panStart
  this.panMove = panMove
  this.panEnd = panEnd
  this.debug = {
    decorate,
    ...view,
  }

  function zoomAtMouse(wheelDelta, e = { pageX: undefined, pageY: undefined }) {
    const change = wheelDelta > 0 ? 0.03 : -0.03; // %
    const pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined
    view.zoomBy(change, pointer_document)
    publish()
  }

  function panStart(e = { pageX: undefined, pageY: undefined }) {
    validateEventPosition('panStart', e)
    state.isPanning = true;
    state.panStart = [ e.pageX, e.pageY ]
  }

  function panMove(e = { pageX: undefined, pageY: undefined }) {
    if (!state.isPanning) return;
    validateEventPosition('panMove', e);
    state.panEnd = [ e.pageX, e.pageY ]
    view.panBy(vector.sub(state.panEnd, state.panStart))
    state.panStart = state.panEnd
    publish()
  }

  function panEnd(e = { pageX: undefined, pageY: undefined }) {
    if (!state.isPanning) return;
    validateEventPosition('panEnd', e)
    state.isPanning = false
    state.panEnd = [ e.pageX, e.pageY ]
  }

  function decorate({ translate, rotate, scale }) {
    // The default origin of transform operations is 50%, 50%. The math in this
    // library assumes that the origin is located at the top left corner (as it
    // should be). Because SVG does not support the CSS property transform-origin.
    // I prefer to do it the old way and translate my transformations to the
    // correct origin before doing them, and then placing it back. It's a
    // tricky kind of thing that I wouldn't want my best friend to try to
    // debug. For developer happiness' sake I'll just handle it for you.
    const transformFromTopLeft = (transform, [cx, cy]) => `
      translate(${-cx}px, ${-cy}px)
      ${transform}
      translate(${cx}px, ${cy}px)
    `

    return {
      translate,
      rotate,
      scale,
      transform: transformFromTopLeft(
        `
          translate(${translate[0]}px, ${translate[1]}px)
          rotate(${rotate})
          scale(${scale})
        `,
        center_world(view.state)
      ),
    }
  }

  function publish() {
    const result = decorate(view.transform);
    render(result)
    return result;
  }
}
