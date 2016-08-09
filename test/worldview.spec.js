import WorldView from '../src/worldview'
import { expect } from 'chai'

describe('Module: WorldView', () => {
  let view
  let transform

  beforeEach(() => {
    view = new WorldView({
      worldSize: [100, 100],
      containerSize: [100, 100],
    })
    transform = undefined
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
    });
  });

  describe('Unit: panBy', () => {
    it('should pan the world by a translation vector', () => {
      view.panBy([2, 5])
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])

      view.panBy([2, 5])
      transform = view.transform
      expect(transform.translate).to.eql([4, 10])
    });
  });

  describe('Unit: zoomBy', () => {
    it('should zoom by a percent amount of the previous zoom', () => {
      view.zoomBy(1);
      transform = view.transform
      expect(transform.scale).to.eql(2)

      view.zoomBy(1);
      transform = view.transform
      expect(transform.scale).to.eql(4)
    });
  });

  describe('Unit: setWorldOrigin', () => {
    it('should set the translation vector', () => {
      view.setWorldOrigin(2, 5)
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])

      view.setWorldOrigin(2, 5)
      transform = view.transform
      expect(transform.translate).to.eql([2, 5])
    });
  });

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
    });
  });

  describe('Unit: setContainerOrigin', () => {
    it('should set the container origin and nothing else', () => {
      view.setContainerOrigin(100, 120)
      expect(view.state.container_document).to.eql([100, 120]);
      expect(view.transform.scale).to.eql(1);
      expect(view.transform.rotate).to.eql(0);
      expect(view.transform.translate).to.eql([0, 0]);
    });
  });

  describe('Unit: setZoom', () => {
    it('should set the zoom and nothing else', () => {
      view.setZoom(2)
      expect(view.transform.scale).to.eql(2);
      expect(view.transform.rotate).to.eql(0);
      expect(view.transform.translate).to.eql([0, 0]);
    });
  });

  describe('Unit: setWorldSize', () => {
    it('should set the container origin and nothing else', () => {
      view.setWorldSize(50, 50)
      expect(view.state.worldSize).to.eql([50, 50]);
      expect(view.transform.scale).to.eql(1);
      expect(view.transform.rotate).to.eql(0);
      expect(view.transform.translate).to.eql([0, 0]);
    });
  });

  describe('Unit: setContainerSize', () => {
    it('should set the container origin and nothing else', () => {
      view.setContainerSize(50, 50)
      expect(view.state.containerSize).to.eql([50, 50]);
      expect(view.transform.scale).to.eql(1);
      expect(view.transform.rotate).to.eql(0);
      expect(view.transform.translate).to.eql([0, 0]);
    });
  });

  describe('With options.fit', () => {
    beforeEach(() => {
      view = new WorldView({
        containerSize: [100, 100],
        worldSize: [50, 50],
      }, {
        fit: true,
      })
      transform = undefined
    })

    it('should fit', () => {
      expect(view.state.zoom).to.be.eql(2);
    });

    it('should not let you unzoom past the limit', () => {
      view.zoomTo(1)
      expect(view.state.zoom).to.be.eql(2);
      view.zoomTo(3)
      expect(view.state.zoom).to.be.eql(3);
    });

    it('should not allow to pan at zoom = zoomlimit', () => {
      const initialPan = view.state.world_container
      view.panBy([1, 1])
      expect(view.state.world_container).to.be.eql(initialPan);
      view.panBy([-1, -1])
      expect(view.state.world_container).to.be.eql(initialPan);
    });

    it('should allow you to pan within limits after zooming in', () => {
      view.zoomBy(1) // now world is twice as big as container
      view.setWorldOrigin(0, 0) // start at 0,0
      expect(view.state.world_container).to.be.eql([0, 0]);

      // Testing right limit
      view.panBy([1, 1]) // shouldn't be able to do this
      expect(view.state.world_container).to.be.eql([0, 0]);

      // Testing you can pan within the domain
      view.panBy([-1, -1]) // should be able to do this
      expect(view.state.world_container).to.be.eql([-1, -1]);
      view.setWorldOrigin(0, 0) // reset at 0,0

      // Testing you'll reach the limit at some point and max out there.
      view.panBy([-10000, -10000]) // should limit you to the max pan
      expect(view.state.world_container).to.be.eql([-100, -100]);
      view.setWorldOrigin(0, 0) // reset at 0,0
    });

    it('should not allow you to set world_document outside of domain', () => {
      view.zoomBy(1) // now world is twice as big as container
      view.setWorldOrigin(-10000, -10000) // should limit you to the max pan
      expect(view.state.world_container).to.be.eql([-100, -100]);
    });
  });
})
