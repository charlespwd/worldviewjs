import { expect } from 'chai'
import sinon from 'sinon'
import mockery from 'mockery'

const pointer = (pageX, pageY) => ({ pageX, pageY })

describe('Module: PublicApi', () => {
  let renderSpy
  let view
  let wvMock

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregisted: false,
    })

    wvMock = {
      setContainerOrigin: sinon.stub(),
      transform: {
        translate: [0, 0],
        rotate: 90,
        scale: 1,
      },
    }

    mockery.registerMock('./worldview', () => wvMock);
    mockery.registerMock('./centers', {
      center_world: sinon.stub().returns([0, 0]),
    })

    renderSpy = sinon.spy()
    const PublicWorldView = require('../src/index') // eslint-disable-line
    view = new PublicWorldView(renderSpy)
  })

  afterEach(() => {
    mockery.disable()
  })

  describe('Unit: setDimensions', () => {
    beforeEach(() => {
      wvMock.setContainerSize = sinon.spy()
      wvMock.setWorldSize = sinon.spy()
    })

    it('should publish', () => {
      view.setDimensions(10, 10, 20, 20)
      expect(renderSpy).to.have.been.called
    });

    it('should set the worldSize, then the containerSize', () => {
      view.setDimensions(10, 11, 20, 21)
      sinon.assert.callOrder(wvMock.setWorldSize, wvMock.setContainerSize)
      expect(wvMock.setWorldSize).to.have.been.calledWith(10, 11)
      expect(wvMock.setContainerSize).to.have.been.calledWith(20, 21)
    });
  });

  describe('Unit: resetContainerSize', () => {
    beforeEach(() => {
      wvMock.resetContainerSize = sinon.spy()
    })

    it('should publish', () => {
      view.resetContainerSize(20, 20)
      expect(renderSpy).to.have.been.called
    });

    it('should pass the message to the worldview', () => {
      view.resetContainerSize(20, 21)
      expect(wvMock.resetContainerSize).to.have.been.calledWith(20, 21)
    });
  });

  describe('Unit: panStart, panMove, panEnd', () => {
    beforeEach(() => {
      wvMock.panBy = sinon.spy()
    })

    it('should continously pan between panStart and panEnd, and publish on pan', () => {
      view.panMove(pointer(0, 0))
      expect(wvMock.panBy).not.to.have.been.called
      expect(renderSpy).not.to.have.been.called

      view.panStart(pointer(0, 0))
      expect(wvMock.panBy).not.to.have.been.called
      expect(renderSpy).not.to.have.been.called

      view.panMove(pointer(1, 0))
      expect(wvMock.panBy).to.have.been.calledWith([1, 0])
      expect(renderSpy).to.have.been.called
      wvMock.panBy.reset()
      renderSpy.reset()

      view.panMove(pointer(2, 0))
      expect(wvMock.panBy).to.have.been.calledWith([1, 0])
      expect(renderSpy).to.have.been.called
      wvMock.panBy.reset()
      renderSpy.reset()

      view.panEnd(pointer(3, 0))
      expect(wvMock.panBy).not.to.have.been.called
      expect(renderSpy).not.to.have.been.called

      view.panMove(pointer(4, 0))
      expect(wvMock.panBy).not.to.have.been.called
      expect(renderSpy).not.to.have.been.called
    });

    it('should be throwing if panStart doesnt receive pointer positions', () => {
      expect(() => view.panStart()).to.throw(Error)
    });

    it('should be throwing if panMove doesnt receive pointer positions (after panStart)', () => {
      expect(() => view.panMove()).not.to.throw(Error)
      view.panStart(pointer(10, 10))
      expect(() => view.panMove()).to.throw(Error)
    });

    it('should be throwing if panEnd doesnt receive pointer positions (after panStart)', () => {
      expect(() => view.panEnd()).not.to.throw(Error)
      view.panStart(pointer(10, 10))
      expect(() => view.panEnd()).to.throw(Error)
    });
  });

  describe('Unit: zoomAtMouse', () => {
    beforeEach(() => {
      wvMock.zoomBy = sinon.spy()
    })

    it('should publish', () => {
      view.zoomAtMouse(10)
      expect(renderSpy).to.have.been.called
    });

    it('should zoom positively by 3% when the wheel delta is positive', () => {
      view.zoomAtMouse(10)
      expect(wvMock.zoomBy).to.have.been.calledWith(0.03)
    });

    it('should zoom negatively by 3% when the wheel delta is negative', () => {
      view.zoomAtMouse(-10)
      expect(wvMock.zoomBy).to.have.been.calledWith(-0.03)
    });

    it('should turn the event position into a vector', () => {
      view.zoomAtMouse(-10, pointer(10, 10))
      expect(wvMock.zoomBy).to.have.been.calledWith(-0.03, [10, 10])
    });
  });
})
