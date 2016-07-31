import WorldView from '../src/worldview'
import vector from '../src/utils/vector'
import { expect } from 'chai'
import {
  fromContainerToWorld,
  fromDocumentToWorld,
  fromWorldToContainer,
  fromWorldToDocument,
} from '../src/transformations';

describe('Module: WorldView', () => {
  let view
  let transform

  beforeEach(() => {
    view = new WorldView()
    view.setWorldSize(100, 100)
    view.setContainerSize(100, 100)
    transform = undefined
  })

  describe('Unit: zoomTo', () => {
    it('should have constant rotation', () => {
      const theta_i = 45
      view.setTheta(theta_i)
      const { rotate: theta_f } = view.zoomTo(2, [25, 25])
      expect(theta_f).to.be.eql(theta_i)
    })

    it('should have constant p_c', () => {
      const p_w = [25, 25]
      const p_c_i = fromWorldToDocument(view.state, p_w)
      view.zoomTo(2, p_c_i)
      const p_c_f = fromWorldToDocument(view.state, p_w)
      expect(p_c_f).to.be.eql(p_c_i)
    })

    it('should have constant p_w', () => {
      const p_c = [25, 25]
      const p_w_i = fromContainerToWorld(view.state, p_c)
      view.zoomTo(2, p_c)
      const p_w_f = fromContainerToWorld(view.state, p_c)
      expect(p_w_f).to.be.eql(p_w_i)
    })

    it('should render the transformation respective to container', () => {
      view.setContainerOrigin(200, 200)
      // offset by -50, -50, origin should be at 150, 150
      transform = view.zoomTo(2, [250, 250])
      expect(transform.translate).to.be.eql([-50, -50])
      expect(transform.scale).to.be.eql(2)

      transform = view.zoomTo(3, [250, 250]) // should still be at center
      expect(transform.translate).to.be.eql([-100, -100])
      expect(transform.scale).to.be.eql(3)
    })

    it('should zoom about the origin correctly', () => {
      transform = view.zoomTo(2, [0, 0])
      expect(transform.translate).to.be.eql([ 0, 0 ])
      expect(transform.scale).to.be.eql(2)
      expect(fromContainerToWorld(view.state, [50, 50])).to.be.eql([25, 25])
      expect(fromContainerToWorld(view.state, [0, 100])).to.be.eql([0, 50])
      expect(fromContainerToWorld(view.state, [100, 0])).to.be.eql([50, 0])
      expect(fromWorldToContainer(view.state, [100, 0])).to.be.eql([200, 0])
    })

    it('should zoom offset correctly', () => {
      transform = view.zoomTo(2, [50, 0])
      expect(transform.translate).to.be.eql([ -50, 0 ])
      expect(transform.scale).to.be.eql(2)
    })

    it('should zoom and maintain rotation', () => {
      view.setTheta(90)
      view.setWorldOrigin(100, 0)
      expect(fromWorldToContainer(view.state, [0, 0])).to.eql([100, 0])
      expect(fromWorldToContainer(view.state, [100, 0])).to.almost.eql([100, 100])
      view.zoomTo(2, [0, 0])
      expect(fromWorldToContainer(view.state, [0, 0])).to.almost.eql([200, 0])
      expect(fromWorldToContainer(view.state, [100, 0])).to.almost.eql([200, 200])
    })

    it('should do nothing when zoom is constant', () => {
      transform = view.zoomTo(1, [0, 0])
      expect(transform.translate).to.be.eql([ 0, 0 ])
      expect(transform.scale).to.be.eql(1)
      expect(transform.rotate).to.be.eql(0)

      // even if zoomed from somewhere
      transform = view.zoomTo(1, [2, 2])
      expect(transform.translate).to.be.eql([ 0, 0 ])
      expect(transform.scale).to.be.eql(1)
      expect(transform.rotate).to.be.eql(0)
    })

    it('should zoom about the midpoint of the container by default', () => {
      transform = view.zoomTo(2)
      expect(transform.translate).to.be.eql([ -50, -50 ])
      expect(transform.scale).to.be.eql(2)
    })
  })

  describe('Unit: panBy', () => {
    it('should translate correctly', () => {
      const p_c_f = [1, 1]
      const p_c_i = [0, 0]
      view.panBy(vector.sub(p_c_f, p_c_i))
      expect(fromWorldToContainer(view.state, [0, 0])).to.eql([1, 1])
    })

    it('should have a constant rotation', () => {
      const theta_i = 45
      view.setTheta(theta_i)
      const { rotate: theta_f } = view.panBy([25, 15])
      expect(theta_f).to.be.eql(theta_i)
    })

    it('should have a constant zoom', () => {
      const zoom_i = 2
      view.setZoom(2)
      const { scale: zoom_f } = view.panBy([25, 15])
      expect(zoom_f).to.be.eql(zoom_i)
    })

    it('should have constant p_w', () => {
      const p_c_i = [25, 25]
      const p_c_f = [50, 30]
      const p_w_i = fromContainerToWorld(view.state, p_c_i)
      view.panBy(vector.sub(p_c_f, p_c_i))
      const p_w_f = fromContainerToWorld(view.state, p_c_f)
      expect(p_w_f).to.be.eql(p_w_i)
    })

    it('should translate the world with respect to the container', () => {
      transform = view.panBy([1, 1])
      expect(transform.translate).to.be.eql([1, 1])
      transform = view.panBy([1, 2])
      expect(transform.translate).to.be.eql([2, 3])
      // setting the origin shouldn'view.transformations do anything
      view.setContainerOrigin([50, 50])
      transform = view.panBy([1, 1])
      expect(transform.translate).to.be.eql([3, 4])
    })
  })

  describe('Unit: rotateBy', () => {
    it('should have a constant zoom', () => {
      const zoom_i = 2
      view.setZoom(zoom_i)
      const { scale: zoom_f } = view.rotateBy(45)
      expect(zoom_f).to.be.eql(zoom_i)
    })

    it('should have a constant p_w', () => {
      const p_c_i = [25, 25]
      const p_w_i = fromDocumentToWorld(view.state, p_c_i)
      view.rotateBy(45, p_c_i)
      const p_c_f = p_c_i // assumed to be true
      const p_w_f = fromWorldToContainer(view.state, p_c_f)
      expect(p_w_f).to.almost.eql(p_w_i)
    })

    it('should have a constant p_c', () => {
      const p_w_i = [25, 25]
      const p_c_i = fromWorldToContainer(view.state, p_w_i)
      view.rotateBy(45, p_c_i)
      const p_w_f = p_w_i // assumed to be true
      const p_c_f = fromWorldToContainer(view.state, p_w_f)
      expect(p_c_f).to.almost.eql(p_c_i)
    })

    it('should rotate about the center', () => {
      transform = view.rotateBy(90, [50, 50])
      expect(transform.translate).to.almost.eql([100, 0])
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
    })

    it('should rotate about a point', () => {
      transform = view.rotateBy(90, [100, 100])
      expect(transform.translate).to.almost.eql([200, 0])
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
      expect(fromContainerToWorld(view.state, [100, 0])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [100, 100])
      expect(transform.translate).to.almost.eql([200, 200])
      expect(transform.rotate).to.eql(180)
      expect(transform.scale).to.eql(1)
      expect(fromContainerToWorld(view.state, [200, 100])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [100, 100])
      expect(transform.translate).to.almost.eql([0, 200])
      expect(transform.rotate).to.eql(270)
      expect(transform.scale).to.eql(1)
      expect(fromContainerToWorld(view.state, [100, 200])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [100, 100])
      expect(transform.translate).to.almost.eql([0, 0])
      expect(transform.rotate).to.eql(360)
      expect(transform.scale).to.eql(1)
      expect(fromContainerToWorld(view.state, [0, 100])).to.almost.eql([0, 100])
    })

    it('should rotate and hold the zoom correctly', () => {
      view.setZoom(2)

      transform = view.rotateBy(90, [200, 200])
      expect(transform.translate).to.almost.eql([400, 0])
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(2)
      expect(fromContainerToWorld(view.state, [200, 0])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [200, 200])
      expect(transform.translate).to.almost.eql([400, 400])
      expect(transform.rotate).to.eql(180)
      expect(transform.scale).to.eql(2)
      expect(fromContainerToWorld(view.state, [400, 200])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [200, 200])
      expect(transform.translate).to.almost.eql([0, 400])
      expect(transform.rotate).to.eql(270)
      expect(transform.scale).to.eql(2)
      expect(fromContainerToWorld(view.state, [200, 400])).to.almost.eql([0, 100])

      transform = view.rotateBy(90, [200, 200])
      expect(transform.translate).to.almost.eql([0, 0])
      expect(transform.rotate).to.eql(360)
      expect(transform.scale).to.eql(2)
      expect(fromContainerToWorld(view.state, [0, 200])).to.almost.eql([0, 100])
    })

    it('should not rotate when degrees == 0', () => {
      transform = view.rotateBy(0, [0, 0])
      expect(transform.translate).to.be.eql([0, 0])
      expect(transform.rotate).to.eql(0)
      expect(transform.scale).to.eql(1)
    })
  })
})
