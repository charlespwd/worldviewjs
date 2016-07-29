import PanZoom from '../src';
import { expect } from 'chai';
import sinon from 'sinon';

const pointer = (pageX, pageY) => ({ pageX, pageY });

describe('Module: PanZoom', () => {
  let zoom, renderSpy, t;

  beforeEach(() => {
    renderSpy = sinon.spy();
    zoom = new PanZoom(renderSpy);
    zoom.setDimensions(100, 100)
    t = zoom.transform;
  })

  describe('Unit: transform', () => {
    it('fromDocumentToContainer should work', () => {
      expect(t.fromDocumentToContainer([50, 50])).to.eql([50,50]);
      zoom.setContainerOrigin(1, 1);
      expect(t.fromDocumentToContainer([50, 50])).to.eql([49, 49])
      zoom.zoomTo(undefined, 2);
      expect(t.fromDocumentToContainer([50, 50])).to.eql([49, 49])
    });

    it('fromContainerToDocument should work', () => {
      expect(t.fromContainerToDocument([50, 50])).to.eql([50, 50]);
      zoom.setContainerOrigin(1, 1);
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
      zoom.zoomTo(undefined, 2);
      expect(t.fromContainerToDocument([49, 49])).to.eql([50, 50])
    });

    it('fromWorldToContainer should work', () => {
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50]);

      zoom.setContainerOrigin(1, 1);
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      zoom.setContainerOrigin(0, 0);
      expect(zoom.debug().worldOrigin_container).to.eql([0, 0]);

      zoom.zoomTo(pointer(50, 50), 2);
      expect(zoom.debug().worldOrigin_container).to.eql([-50, -50]);
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])

      zoom.setContainerOrigin(1, 1);
      expect(t.fromWorldToContainer([50, 50])).to.eql([50, 50])
    });

    it('fromContainerToWorld should work', () => {
      expect(t.fromContainerToWorld([50, 50])).to.eql([50, 50]);

      zoom.setContainerOrigin(1, 1);
      expect(t.fromContainerToWorld([50, 50])).to.eql([50, 50]);

      zoom.setContainerOrigin(0, 0);
      zoom.zoomTo(pointer(0, 0), 2)
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])

      zoom.setContainerOrigin(1, 1);
      expect(t.fromContainerToWorld([50, 50])).to.eql([25, 25])
    });

    it('fromWorldToDocument should work', () => {
      zoom.setContainerOrigin(200, 200);
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250]);

      zoom.zoomTo(pointer(250, 250), 2);
      expect(t.fromWorldToDocument([50, 50])).to.eql([250, 250]);
    });

    it('fromDocumentToWorld should work', () => {
      zoom.setContainerOrigin(200, 200);
      expect(t.fromDocumentToWorld([250, 250])).to.eql([50, 50]);

      zoom.zoomTo(pointer(250, 250), 2);
      expect(t.fromDocumentToWorld(zoom.debug().centerWorld_document())).to.eql([50, 50])
    });
  });

  it('should give the coordinates of the center of the world', () => {
    expect(zoom.debug().centerWorld_document()).to.eql([50, 50]);
  });

  it('should give the coordinates of the center of the moved world', () => {
    expect(zoom.debug().centerWorld_document()).to.eql([50, 50]);
    zoom.setContainerOrigin(200, 0);
    expect(zoom.debug().centerWorld_document()).to.eql([250, 50]);
  });

  it('should render the transformation respective to container', () => {
    zoom.setContainerOrigin(200, 200);
    zoom.zoomTo(pointer(250, 250), 2); // offset by -50, -50, origin should be at 150, 150
    expect(renderSpy).to.have.been.calledWith([-50, -50], 2);
  });

  it('should zoom about the origin', () => {
    zoom.zoomTo(pointer(0, 0), 2);
    expect(renderSpy).to.have.been.calledWith([ 0, 0 ], 2)
  });

  it('should do nothing when zoom is 0', () => {
    zoom.zoomTo(pointer(0, 0), 1);
    expect(renderSpy).to.have.been.calledWith([ 0, 0 ], 1)

    // even if zoomed from somewhere
    zoom.zoomTo(pointer(2, 2), 1);
    expect(renderSpy).to.have.been.calledWith([ 0, 0 ], 1)
  });

  it('should zoom about the midpoint by default', () => {
    zoom.zoomTo(undefined, 2);
    expect(renderSpy).to.have.been.calledWith([ -50, -50 ], 2)
  });
});
