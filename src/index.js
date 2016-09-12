import WorldView from './worldview'
import vector from './utils/vector'
import { center_world } from './centers'

const fromEventToVector = ({ pageX, pageY }) => [pageX, pageY]

const validateEventPosition = (method, e) => {
  if (typeof e.pageX !== 'number' || typeof e.pageY !== 'number') {
    throw new Error(
      `Trying to ${method} without { pageX, pageY }. Check your event handler.`
    )
  }
}

export default function PublicWorldView(render, opts) {
  const view = new WorldView(opts)
  const state = {
    isPanning: false,
    panStart: null,
    panEnd: null,
  }

  /// Public API
  return {
    setContainerOrigin: view.setContainerOrigin,
    zoomAtMouse,
    zoomBy,
    panBy,
    panStart,
    panMove,
    panEnd,
    setDimensions,
    resetContainerSize,
    publish,
    debug: {
      decorate,
      view,
    },
  }

  function setDimensions(worldWidth, worldHeight, containerWidth, containerHeight) {
    view.setWorldSize(worldWidth, worldHeight)
    view.setContainerSize(containerWidth, containerHeight)
    view.resetZoom()
    publish()
  }

  function resetContainerSize(containerWidth, containerHeight) {
    view.resetContainerSize(containerWidth, containerHeight)
    publish()
  }

  function zoomAtMouse(wheelDelta, e = { pageX: undefined, pageY: undefined }) {
    const change = wheelDelta > 0 ? 1.03 : 0.97 // %
    const pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined
    view.zoomBy(change, pointer_document)
    publish()
  }

  // Where change is the ratio between the previous and the future scale level
  function zoomBy(change, e = { pageX: undefined, pageY: undefined }) {
    const pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined
    view.zoomBy(change, pointer_document)
    publish()
  }

  function panStart(e = { pageX: undefined, pageY: undefined }) {
    validateEventPosition('panStart', e)
    state.isPanning = true
    state.panStart = [ e.pageX, e.pageY ]
  }

  function panMove(e = { pageX: undefined, pageY: undefined }) {
    if (!state.isPanning) return
    validateEventPosition('panMove', e)
    state.panEnd = [ e.pageX, e.pageY ]
    view.panBy(vector.sub(state.panEnd, state.panStart))
    state.panStart = state.panEnd
    publish()
  }

  function panEnd(e = { pageX: undefined, pageY: undefined }) {
    if (!state.isPanning) return
    validateEventPosition('panEnd', e)
    state.isPanning = false
    state.panEnd = [ e.pageX, e.pageY ]
  }

  function panBy(dx, dy) {
    if (dx === undefined || dy === undefined) {
      throw new Error(`InvalidArguments: panBy(dx, dy) called with ${dx}, ${dy}`)
    }
    view.panBy([dx, dy])
    publish()
  }

  function decorate({ translate, rotate, scale }) {
    // The default transform-origin for divs is '50% 50%'. The math in this
    // library assumes that the origin is located at the top left corner.
    const transformFromTopLeft = (transform, [cx, cy]) => `
      translate(${-cx}px, ${-cy}px)
      ${transform}
      translate(${cx}px, ${cy}px)
    `

    return {
      translate,
      rotate,
      scale,

      // transformTopLeft assumes transform-origin is 'top left', default in svg
      transformTopLeft: `
        translate(${translate[0]}px, ${translate[1]}px)
        rotate(${rotate})
        scale(${scale})
      `,

      // transform5050 assumes transform-origin is '50% 50%', default for divs
      transform5050: transformFromTopLeft(`
          translate(${translate[0]}px, ${translate[1]}px)
          rotate(${rotate})
          scale(${scale})`,
        center_world(view.state)
      ),
    }
  }

  function publish() {
    const result = decorate(view.transform)
    render(result)
    return result
  }
}
