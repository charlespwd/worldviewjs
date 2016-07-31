import WorldView from '../src'
import { minusVectors } from '../src/utils/vector'
import { expect } from 'chai'
import sinon from 'sinon'

const pointer = (pageX, pageY) => ({ pageX, pageY })

describe('Module: WorldView', () => {
  let view
  let renderSpy
  let t
  let transform

  beforeEach(() => {
    renderSpy = sinon.spy()
    view = new WorldView(renderSpy)
    view.setWorldDimensions(100, 100)
    view.setContainerDimensions(100, 100)
    t = view.transformations
    transform = undefined
  })

  describe('Unit: zoomTo', () => {
    it('should have constant rotation', () => {
      const theta_i = 45
      view.rotateBy(45)
      const { rotate: theta_f } = view.zoomTo(2, pointer([25, 25]))
      expect(theta_f).to.be.approxEqual(theta_i)
    });

    it('should have constant p_c', () => {
      const p_w = [25, 25]
      const p_c_i = view.transformations.fromWorldToDocument(p_w)
      view.zoomTo(2, pointer(p_c_i))
      const p_c_f = view.transformations.fromWorldToDocument(p_w)
      expect(p_c_f).to.be.approxEqual(p_c_i)
    })

    it('should have constant p_w', () => {
      const p_c = [25, 25]
      const p_w_i = view.transformations.fromContainerToWorld(p_c)
      view.zoomTo(2, pointer(p_c))
      const p_w_f = view.transformations.fromContainerToWorld(p_c)
      expect(p_w_f).to.be.approxEqual(p_w_i)
    });

    it('should render the transformation respective to container', () => {
      view.setContainerOrigin(200, 200)
      // offset by -50, -50, origin should be at 150, 150
      transform = view.zoomTo(2, pointer(250, 250))
      expect(transform.translate).to.be.approxEqual([-50, -50])
      expect(transform.scale).to.be.approxEqual(2)

      transform = view.zoomTo(3, pointer(250, 250)) // should still be at center
      expect(transform.translate).to.be.approxEqual([-100, -100])
      expect(transform.scale).to.be.approxEqual(3)
    })

    it('should zoom about the origin correctly', () => {
      transform = view.zoomTo(2, pointer(0, 0))
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(2)
    })

    it('should zoom offset correctly', () => {
      transform = view.zoomTo(2, pointer(50, 0))
      expect(transform.translate).to.be.approxEqual([ -50, 0 ])
      expect(transform.scale).to.be.approxEqual(2)
    });

    it('should do nothing when zoom is constant', () => {
      transform = view.zoomTo(1, pointer(0, 0))
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(1)

      // even if zoomed from somewhere
      transform = view.zoomTo(1, pointer(2, 2))
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(1)
    })

    it('should zoom about the midpoint of the container by default', () => {
      transform = view.zoomTo(2)
      expect(transform.translate).to.be.approxEqual([ -50, -50 ])
      expect(transform.scale).to.be.approxEqual(2)
    })
  })

  describe('Unit: panBy', () => {
    it('should have a constant rotation', () => {
      const theta_i = 45
      view.rotateBy(45)
      const { rotate: theta_f } = view.panBy([25, 15])
      expect(theta_f).to.be.approxEqual(theta_i)
    });

    it('should have a constant zoom', () => {
      const zoom_i = 2
      view.zoomTo(2)
      const { scale: zoom_f } = view.panBy([25, 15])
      expect(zoom_f).to.be.approxEqual(zoom_i)
    });

    it('should have constant p_w', () => {
      const p_c_i = [25, 25]
      const p_c_f = [50, 30]
      const p_w_i = view.transformations.fromContainerToWorld(p_c_i)
      view.panBy(minusVectors(p_c_f, p_c_i))
      const p_w_f = view.transformations.fromContainerToWorld(p_c_f)
      expect(p_w_f).to.be.approxEqual(p_w_i)
    });

    it('should translate the world with respect to the container', () => {
      transform = view.panBy([1, 1])
      expect(transform.translate).to.be.approxEqual([1, 1])
      transform = view.panBy([1, 2])
      expect(transform.translate).to.be.approxEqual([2, 3])
      view.setContainerOrigin([50, 50]) // setting the origin shouldn't do anything
      transform = view.panBy([1, 1])
      expect(transform.translate).to.be.approxEqual([3, 4])
    })
  })

  describe('Unit: rotateBy', () => {
    it('should rotate about a pivot', () => {
      transform = view.rotateBy(90, [50, 50])
      expect(transform.translate).to.approxEqual([100, 0])
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
    })

    it('should not rotate when degrees == 0', () => {
      transform = view.rotateBy(0, [0, 0])
      expect(transform.translate).to.be.approxEqual([0, 0])
      expect(transform.rotate).to.eql(0)
      expect(transform.scale).to.eql(1)
    })
  })

  describe('Unit: transformations', () => {
    it('fromDocumentToContainer should work', () => {
      expect(t.fromDocumentToContainer([50, 50])).to.eql([50, 50])
      view.setContainerOrigin(1, 1)
      expect(t.fromDocumentToContainer([50, 50])).to.eql([49, 49])
      view.zoomTo(2)
      expect(t.fromDocumentToContainer([50, 50])).to.eql([49, 49])
    })

    it('fromContainerToDocument should work', () => {
      expect(t.fromContainerToDocument([50, 50])).to.eql([50, 50])
      view.setContainerOrigin(1, 1)
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
      view.zoomTo(2)
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
    })

    it('fromWorldToContainer should work', () => {
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(1, 1)
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(0, 0)
      expect(view.debug().worldOrigin_container).to.eql([0, 0])

      view.zoomTo(2, pointer(50, 50))
      expect(view.debug().worldOrigin_container).to.eql([-50, -50])
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(1, 1)
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])
    })

    it('fromContainerToWorld should work', () => {
      expect(t.fromContainerToWorld([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(1, 1)
      expect(t.fromContainerToWorld([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(0, 0)
      view.zoomTo(2, pointer(0, 0))
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])

      view.setContainerOrigin(1, 1)
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])
    })

    it('fromWorldToDocument should work', () => {
      view.setContainerOrigin(200, 200)
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250])

      view.zoomTo(2, pointer(250, 250))
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250])
    })

    it('fromDocumentToWorld should work', () => {
      view.setContainerOrigin(200, 200)
      expect(t.fromDocumentToWorld([250, 250])).to.eql([50, 50])

      view.zoomTo(2, pointer(250, 250))
      expect(t.fromDocumentToWorld(view.debug().centerWorld_document)).to.eql([50, 50])
    })
  })
})
