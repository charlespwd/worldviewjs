import worldView from './worldview';
import { center_world } from './centers';

const fromEventToVector = ({ pageX, pageY }) => [pageX, pageY]

export default function PublicWorldView(render, opts) {
  const view = worldView(render, opts);

  /// Public API
  this.zoomAtMouse = zoomAtMouse
  this.debug = {
    decorate,
    ...view,
  }

  function zoomAtMouse(zoom, e = { pageX: undefined, pageY: undefined }) {
    const change = zoom > 0 ? 0.03 : -0.03; // %
    const pointer_document = typeof e.pageX === 'number' ? fromEventToVector(e) : undefined
    const transform = view.zoomBy(change, pointer_document)
    render(decorate(transform))
    return transform
  }

  function decorate({ translate, rotate, scale }) {
    // The default origin of transform operations is 50%, 50%. The math in this
    // library assumes that the origin is located at the top left corner (as it
    // should be). Because SVG does not support the CSS property transform-origin.
    // I prefer to do it the old way and translate my transformations to the
    // correct origin before doing them, and then placing it back.
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
}
