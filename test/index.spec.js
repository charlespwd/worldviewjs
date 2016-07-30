import WorldView from '../src'
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
    it('should render the transformation respective to container', () => {
      view.setContainerOrigin(200, 200)
      // offset by -50, -50, origin should be at 150, 150
      transform = view.zoomTo(pointer(250, 250), 2)
      expect(transform.translate).to.be.approxEqual([-50, -50])
      expect(transform.scale).to.be.approxEqual(2)
    })

    it('should view about the origin', () => {
      transform = view.zoomTo(pointer(0, 0), 2)
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(2)
    })

    it('should do nothing when zoom does not change', () => {
      transform = view.zoomTo(pointer(0, 0), 1)
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(1)

      // even if zoomed from somewhere
      transform = view.zoomTo(pointer(2, 2), 1)
      expect(transform.translate).to.be.approxEqual([ 0, 0 ])
      expect(transform.scale).to.be.approxEqual(1)
    })

    it('should zoom about the midpoint of the container by default', () => {
      transform = view.zoomTo(undefined, 2)
      expect(transform.translate).to.be.approxEqual([ -50, -50 ])
      expect(transform.scale).to.be.approxEqual(2)
    })
  })

  describe('Unit: panBy', () => {
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
      view.zoomTo(undefined, 2)
      expect(t.fromDocumentToContainer([50, 50])).to.eql([49, 49])
    })

    it('fromContainerToDocument should work', () => {
      expect(t.fromContainerToDocument([50, 50])).to.eql([50, 50])
      view.setContainerOrigin(1, 1)
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
      view.zoomTo(undefined, 2)
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
    })

    it('fromWorldToContainer should work', () => {
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(1, 1)
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      view.setContainerOrigin(0, 0)
      expect(view.debug().worldOrigin_container).to.eql([0, 0])

      view.zoomTo(pointer(50, 50), 2)
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
      view.zoomTo(pointer(0, 0), 2)
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])

      view.setContainerOrigin(1, 1)
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])
    })

    it('fromWorldToDocument should work', () => {
      view.setContainerOrigin(200, 200)
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250])

      view.zoomTo(pointer(250, 250), 2)
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250])
    })

    it('fromDocumentToWorld should work', () => {
      view.setContainerOrigin(200, 200)
      expect(t.fromDocumentToWorld([250, 250])).to.eql([50, 50])

      view.zoomTo(pointer(250, 250), 2)
      expect(t.fromDocumentToWorld(view.debug().centerWorld_document)).to.eql([50, 50])
    })
  })
})
