import WorldView from '../src/worldview'
import { expect } from 'chai'

describe('Module: WorldView', () => {
  let view
  let transform

  beforeEach(() => {
    view = new WorldView()
    view.setContainerSize(100, 100)
    view.setWorldSize(100, 100)
    transform = undefined
  })

  describe('Unit: setOptions', () => {
    it('should update the options', () => {
      const initialOptions = view.options
      expect(initialOptions).to.have.property('fit', false)
      expect(initialOptions).not.to.have.property('test123')
      view.setOptions({ test123: true })
      expect(initialOptions).to.have.property('fit', false)
      expect(view.options).to.have.property('test123', true)
    })
  })

  describe('Unit: resetZoom', () => {
    it('should reset the zoom to 1 when fit is false', () => {
      // setup
      view = new WorldView({ fit: false })
      view.setZoom(2)
      expect(view.transform.scale).to.be.eql(2)

      // execute
      view.resetZoom()

      // verify
      expect(view.transform.scale).to.be.eql(1)
    })

    it('should reset the zoom to the limit when fit is true', () => {
      // setup
      view = new WorldView({ fit: true })
      view.setContainerSize(50, 50)
      view.setWorldSize(100, 100)
      view.setZoom(5)
      expect(view.transform.scale).to.be.eql(5)

      // execute
      view.resetZoom()

      // verify
      expect(view.transform.scale).to.be.eql(0.5)
      expect(view.transform.translate).to.be.eql([0, 0])
    })
  })

  describe('Unit: zoomTo', () => {
    it('should zoom about the midpoint of the container by default', () => {
      view.zoomTo(2)
      transform = view.transform
      expect(transform.translate).to.be.eql([ -50, -50 ])
      expect(transform.scale).to.be.eql(2)
    })
  })

  describe('Unit: rotateBy', () => {
    it('should rotate about the midpoint of the container by default', () => {
      view.rotateBy(90)
      transform = view.transform
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
      expect(transform.translate).to.eql([100, 0])

      view.rotateBy(90)
      transform = view.transform
      expect(transform.rotate).to.eql(180)
      expect(transform.scale).to.eql(1)
      expect(transform.translate).to.eql([100, 100])
    })
  })

  describe('Unit: panBy', () => {
    it('should pan the world by a translation vector', () => {
      view.panBy([2, 5])
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])

      view.panBy([2, 5])
      transform = view.transform
      expect(transform.translate).to.eql([4, 10])
    })
  })

  describe('Unit: zoomBy', () => {
    it('should throw if change is smaller or equal to 0', () => {
      expect(() => view.zoomBy(0)).to.throw(Error, /positive ratio/)
      expect(() => view.zoomBy(-1)).to.throw(Error, /positive ratio/)
    })

    it('should zoom by a percent amount of the previous zoom', () => {
      view.zoomBy(2)
      transform = view.transform
      expect(transform.scale).to.eql(2)

      view.zoomBy(2)
      transform = view.transform
      expect(transform.scale).to.eql(4)
    })
  })

  describe('Unit: setWorldOrigin', () => {
    it('should set the translation vector', () => {
      view.setWorldOrigin(2, 5)
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])

      view.setWorldOrigin(2, 5)
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])
    })
  })

  describe('Unit: setTheta', () => {
    it('should set the rotation', () => {
      view.setTheta(90)
      transform = view.transform
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
      expect(transform.translate).to.eql([0, 0])

      view.setTheta(90)
      transform = view.transform
      expect(transform.rotate).to.eql(90)
      expect(transform.scale).to.eql(1)
      expect(transform.translate).to.eql([0, 0])
    })
  })

  describe('Unit: setContainerOrigin', () => {
    it('should set the container origin and nothing else', () => {
      view.setContainerOrigin(100, 120)
      expect(view.state.container_document).to.eql([100, 120])
      expect(view.transform.scale).to.eql(1)
      expect(view.transform.rotate).to.eql(0)
      expect(view.transform.translate).to.eql([0, 0])
    })
  })

  describe('Unit: setZoom', () => {
    it('should set the zoom and nothing else', () => {
      view.setZoom(2)
      expect(view.transform.scale).to.eql(2)
      expect(view.transform.rotate).to.eql(0)
      expect(view.transform.translate).to.eql([0, 0])
    })
  })

  describe('Unit: setWorldSize', () => {
    it('should set the container origin and nothing else', () => {
      view.setWorldSize(50, 50)
      expect(view.state.worldSize).to.eql([50, 50])
      expect(view.transform.scale).to.eql(1)
      expect(view.transform.rotate).to.eql(0)
      expect(view.transform.translate).to.eql([0, 0])
    })
  })

  describe('Unit: setContainerSize', () => {
    it('should set the container origin and nothing else', () => {
      view.setContainerSize(50, 50)
      expect(view.state.containerSize).to.eql([50, 50])
      expect(view.transform.scale).to.eql(1)
      expect(view.transform.rotate).to.eql(0)
      expect(view.transform.translate).to.eql([0, 0])
    })
  })

  describe('Unit: resetContainerSize', () => {
    it('should maintain the viewbox', () => {
      // setup, the view box shows the world in the top right quadrant
      view.setWorldSize(1, 1)
      view.setWorldOrigin(1, 0) // offset by half the viewport
      view.setContainerSize(2, 2)

      // execute
      view.resetContainerSize(4, 4)

      // test
      expect(view.state.containerSize).to.be.eql([4, 4])
      expect(view.state.worldSize).to.be.eql([1, 1])
      expect(view.state.scale).to.be.eql(2)
      expect(view.state.world_container).to.be.eql([2, 0])
    })
  })

  describe('With options.fit and fitNoWhitespace === false', () => {
    beforeEach(() => {
      view = new WorldView({
        fit: true,
        fitNoWhitespace: false,
      })
    })

    it('should limit the zoom to the minimum scale limit', () => {
      // The following setup has
      //   - min(scaleLimit) === 2  since ContainerHeight = 2  * WorldHeight
      //   - max(scaleLimit) === 10 since ContainerWidth  = 10 * WorldWidth
      view.setWorldSize(10, 50)
      view.setContainerSize(100, 100)

      view.setZoom(0.1)
      expect(view.state.scale).to.eql(2)
    })

    describe('when max(scaleLimit) <= scale', () => {
      it('should behave like fitNoWhitespace when the scale is greater than the non-limiting directions fit scale', () => { // eslint-disable-line
        view.setWorldSize(50, 50)
        view.setContainerSize(100, 100)
        view.setZoom(4) // now world is twice as big as container
        view.setWorldOrigin(0, 0) // start at 0,0
        expect(view.state.scale).to.eql(4)
        expect(view.state.world_container).to.be.eql([0, 0])

        // Testing right limit
        view.panBy([1, 1]) // shouldn't be able to do this
        expect(view.state.world_container).to.be.eql([0, 0])

        // Testing you can pan within the domain
        view.panBy([-1, -1]) // should be able to do this
        expect(view.state.world_container).to.be.eql([-1, -1])
        view.setWorldOrigin(0, 0) // reset at 0,0

        // Testing you'll reach the limit at some point and max out there.
        view.panBy([-10000, -10000]) // should limit you to the max pan
        expect(view.state.world_container).to.be.eql([-100, -100])
        view.setWorldOrigin(0, 0) // reset at 0,0
      })
    })

    describe('when min(scaleLimit) <= scale <= max(scaleLimit)', () => {
      beforeEach(() => {
        // The setup below has
        //   - min(scaleLimit) === 1 since the heights are equal
        //   - max(scaleLimit) === 2 since ContainerWidth = 2 * WorldWidth
        view.setWorldSize(50, 100)
        view.setContainerSize(100, 100)

        // Set the scale to a value between 1 and 2
        view.setZoom(1.5)
      })

      it('should center the limiting direction within the container', () => {
        // testing c_height < w_height
        view.setWorldSize(10, 100)
        view.setContainerSize(100, 100)
        view.setZoom(1)

        expect(view.state.scale).to.eql(1)
        expect(view.state.world_container[0]).to.be.at.least(0)
        expect(view.state.world_container[0]).to.be.at.most(90)
        expect(view.state.world_container[1]).to.be.at.least(0)
        expect(view.state.world_container[1]).to.be.at.most(0)

        // testing w_height < c_height
        view.setWorldSize(100, 10)
        view.setContainerSize(100, 100)
        view.setZoom(1)

        expect(view.state.scale).to.eql(1)
        expect(view.state.world_container[0]).to.be.at.least(0)
        expect(view.state.world_container[0]).to.be.at.most(0)
        expect(view.state.world_container[1]).to.be.at.least(0)
        expect(view.state.world_container[1]).to.be.at.most(90)
      })

      it('should allow you to pan in the limiting direction outside the world', () => { // eslint-disable-line
        // testing right limit
        view.panBy([10000, 0])
        expect(view.state.world_container[0]).to.eql(37.5)

        // testing left limit
        view.panBy([-100000, 0])
        expect(view.state.world_container[0]).to.eql(-12.5)
      })

      it('should allow you to pan within the fittable direction', () => {
        // testing top limit
        view.panBy([0, -10000])
        expect(view.state.world_container[1]).to.eql(-50)

        // testing bottom limit
        view.panBy([0, 100000])
        expect(view.state.world_container[1]).to.eql(0)
      })
    })
  })

  describe('When options.fit and fitNoWhitespace === false and the aspect ratios are equal', () => {
    beforeEach(() => {
      view = new WorldView({
        fit: true,
        fitNoWhitespace: false,
      })
      view.setWorldSize(50, 50)
      view.setContainerSize(100, 100)
    })

    it('it should behave like normal fit at the fit scale', () => {
      view.setZoom(2) // now world size === containerSize
      view.setWorldOrigin(0, 0) // start at 0,0
      expect(view.state.scale).to.eql(2)
      expect(view.state.world_container).to.be.eql([0, 0])

      // Testing right limit
      view.panBy([1, 1]) // shouldn't be able to do this
      expect(view.state.world_container).to.be.eql([0, 0])

      // Testing left limit
      view.panBy([-1, -1]) // shouldn't be able to do this
      expect(view.state.world_container).to.be.eql([0, 0])
    })
  })

  describe('With options.fit', () => {
    beforeEach(() => {
      view = new WorldView({
        fit: true,
      })
      view.setWorldSize(50, 50)
      view.setContainerSize(100, 100)
      transform = undefined
    })

    it('should fit', () => {
      expect(view.state.scale).to.be.eql(2)
    })

    it('should not let you unzoom past the limit', () => {
      view.zoomTo(1)
      expect(view.state.scale).to.be.eql(2)
      view.zoomTo(3)
      expect(view.state.scale).to.be.eql(3)
    })

    it('should not allow to pan at scale = zoomlimit', () => {
      const initialPan = view.state.world_container
      view.panBy([1, 1])
      expect(view.state.world_container).to.be.eql(initialPan)
      view.panBy([-1, -1])
      expect(view.state.world_container).to.be.eql(initialPan)
    })

    it('should allow you to pan within limits after zooming in', () => {
      view.zoomBy(2) // now world is twice as big as container
      view.setWorldOrigin(0, 0) // start at 0,0
      expect(view.state.world_container).to.be.eql([0, 0])

      // Testing right limit
      view.panBy([1, 1]) // shouldn't be able to do this
      expect(view.state.world_container).to.be.eql([0, 0])

      // Testing you can pan within the domain
      view.panBy([-1, -1]) // should be able to do this
      expect(view.state.world_container).to.be.eql([-1, -1])
      view.setWorldOrigin(0, 0) // reset at 0,0

      // Testing you'll reach the limit at some point and max out there.
      view.panBy([-10000, -10000]) // should limit you to the max pan
      expect(view.state.world_container).to.be.eql([-100, -100])
      view.setWorldOrigin(0, 0) // reset at 0,0
    })

    it('should not allow you to set world_document outside of domain', () => {
      view.zoomBy(2) // now world is twice as big as container
      view.setWorldOrigin(-10000, -10000) // should limit you to the max pan
      expect(view.state.world_container).to.be.eql([-100, -100])
    })
  })

  describe('With option.maxZoom and option.minZoom', () => {
    let maxZoom
    let minZoom
    beforeEach(() => {
      minZoom = 0.5
      maxZoom = 2
      view = new WorldView({
        maxZoom,
        minZoom,
      })
    })

    it('should not let you zoom more than the max zoom level with zoomBy', () => {
      expect(view.state.scale).to.be.equal(1)
      view.zoomBy(10)
      expect(view.state.scale).to.be.equal(maxZoom)
    })

    it('should not let you zoom more than the max zoom level with zoomTo', () => {
      expect(view.state.scale).to.be.equal(1)
      view.zoomTo(10)
      expect(view.state.scale).to.be.equal(maxZoom)
    })

    it('should not let you zoom less than the min zoom level with zoomBy', () => {
      expect(view.state.scale).to.be.equal(1)
      view.zoomBy(0.1)
      expect(view.state.scale).to.be.equal(minZoom)
    })

    it('should not let you zoom less than the min zoom level with zoomTo', () => {
      expect(view.state.scale).to.be.equal(1)
      view.zoomTo(0.1)
      expect(view.state.scale).to.be.equal(minZoom)
    })

    it('should not let you zoom more than the max zoom with setZoom', () => {
      expect(view.state.scale).to.be.equal(1)
      view.setZoom(5)
      expect(view.state.scale).to.be.equal(maxZoom)
    })

    it('should not let you zoom less than the min zoom with setZoom', () => {
      expect(view.state.scale).to.be.equal(1)
      view.setZoom(0.1)
      expect(view.state.scale).to.be.equal(minZoom)
    })

    it('should not let you reset the zoom to more than maxZoom', () => {
      view = new WorldView({
        maxZoom: 0.5,
      })

      view.zoomTo(0.1)
      expect(view.state.scale).to.be.equal(0.1)

      view.resetZoom()
      expect(view.state.scale).to.be.equal(0.5)
    })

    it('should not let you reset the zoom to less than minZoom', () => {
      view = new WorldView({
        minZoom: 2,
      })

      view.zoomTo(5)
      expect(view.state.scale).to.be.equal(5)

      view.resetZoom()
      expect(view.state.scale).to.be.equal(2)
    })
  })

  describe('With option.maxZoom, option.minZoom and option.fit', () => {
    beforeEach(() => {
      view = new WorldView({
        maxZoom: 1.5,
        minZoom: 0.5,
        fit: true,
      })
    })

    it('should not zoom more than maxZoom even if asking to fit.', () => {
      // implying fit zoom = 2
      view.setWorldSize(50, 50)
      view.setContainerSize(100, 100)

      expect(view.state.scale).to.be.equal(1.5)
    })

    it('should not zoom less than minZoom even if asking to fit', () => {
      view = new WorldView({
        minZoom: 5,
        fit: true,
      })
      // implying fit zoom = 2
      view.setWorldSize(50, 50)
      view.setContainerSize(100, 100)
      expect(view.state.scale).to.eql(5)
    })
  })

  describe('Unit: isZoomedOut', () => {
    it('should return true when the zoom level is equal to minZoom', () => {
      view = new WorldView({
        minZoom: 1.0,
      })

      // implying zoom = 1
      view.setWorldSize(50, 50)
      view.setContainerSize(50, 50)
      expect(view.isZoomedOut()).to.be.true

      view.setZoom(2)
      expect(view.isZoomedOut()).to.be.false
    })

    it('should return true when the zoom level is equal to the minimum fit zoom level', () => {
      view = new WorldView({
        fit: true,
      })

      // implying fit zoom = 2
      view.setWorldSize(50, 100)
      view.setContainerSize(100, 100)
      expect(view.state.scale).to.equal(2)
      expect(view.isZoomedOut()).to.be.true

      view.setZoom(3)
      expect(view.state.scale).to.equal(3)
      expect(view.isZoomedOut()).to.be.false

      // implying fit zoom = 1
      view.setOptions({ fitNoWhitespace: false });
      view.setZoom(0.1)
      expect(view.state.scale).to.equal(1)
      expect(view.isZoomedOut()).to.be.true

      view.setZoom(3)
      expect(view.state.scale).to.equal(3)
      expect(view.isZoomedOut()).to.be.false
    })
  })
})
