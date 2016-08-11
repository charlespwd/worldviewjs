import vector from '../src/utils/vector'
import { expect } from 'chai'
import {
  set,
  reduce,
  statelessZoom,
  statelessPanBy,
  statelessRotateBy,
} from '../src/transform-world'
import {
  fromContainerToWorld,
  fromDocumentToWorld,
  fromWorldToContainer,
  fromWorldToDocument,
} from '../src/transform-vector'

describe('Module: TransformWorld', () => {
  let state
  let transform
  let transforms
  let newState

  beforeEach(() => {
    state = {
      scale: 1,
      theta: 0,
      world_container: [0, 0],
      container_document: [0, 0],
      worldSize: [100, 100],
      containerSize: [100, 100],
    }
    transform = undefined
  })

  describe('Unit: reduce', () => {
    it('should compose state transformations', () => {
      expect(reduce([
        set('theta', 30),
        set('scale', 2),
      ], state)).to.eql({
        ...state,
        theta: 30,
        scale: 2,
      })
    });

    it('should handle undefined transforms', () => {
      expect(reduce(undefined, state)).to.eql(state)
      expect(reduce([], state)).to.eql(state)
    });

    it('should handle a singular transform as first argument', () => {
      expect(reduce(set('theta', 30), state)).to.eql({
        ...state,
        theta: 30,
      })
    });
  });

  describe('Unit: statelessZoom', () => {
    it('should have constant rotation', () => {
      const theta = 45
      transforms = [
        set('theta', theta),
        statelessZoom(2, [25, 25]),
      ]
      expect(reduce(transforms, state).theta).to.be.eql(theta)
    })

    it('should have constant p_c', () => {
      const p_w = [25, 25]
      const p_c_i = fromWorldToDocument(state, p_w)
      newState = statelessZoom(2, p_c_i)(state)
      const p_c_f = fromWorldToDocument(newState, p_w)
      expect(p_c_f).to.be.eql(p_c_i)
    })

    it('should have constant p_w', () => {
      const p_c = [25, 25]
      const p_w_i = fromContainerToWorld(state, p_c)
      newState = statelessZoom(2, p_c)(state)
      const p_w_f = fromContainerToWorld(newState, p_c)
      expect(p_w_f).to.be.eql(p_w_i)
    })

    it('should zoom about the origin correctly', () => {
      transform = statelessZoom(2, [0, 0])
      newState = transform(state)
      expect(newState.world_container).to.be.eql([ 0, 0 ])
      expect(newState.scale).to.be.eql(2)
      expect(fromContainerToWorld(newState, [50, 50])).to.be.eql([25, 25])
      expect(fromContainerToWorld(newState, [0, 100])).to.be.eql([0, 50])
      expect(fromContainerToWorld(newState, [100, 0])).to.be.eql([50, 0])
      expect(fromWorldToContainer(newState, [100, 0])).to.be.eql([200, 0])
    })

    it('should zoom offset correctly', () => {
      transform = statelessZoom(2, [50, 0])
      newState = transform(state)
      expect(newState.world_container).to.be.eql([ -50, 0 ])
      expect(newState.scale).to.be.eql(2)
    })

    it('should do nothing when zoom is constant', () => {
      transform = statelessZoom(1, [0, 0])
      newState = transform(state)
      expect(newState).to.eql(state)

      // even if zoomed from somewhere
      transform = statelessZoom(1, [2, 2])
      newState = transform(state)
      expect(transform(state)).to.eql(state)
    })
  })

  describe('Unit: panBy', () => {
    it('should translate correctly', () => {
      transform = statelessPanBy([1, 1])
      newState = transform(state)
      expect(fromWorldToContainer(newState, [0, 0])).to.eql([1, 1])
    })

    it('should have a constant rotation', () => {
      const theta_i = 45
      transforms = [
        set('theta', theta_i),
        statelessPanBy([25, 15]),
      ]
      newState = reduce(transforms, state)
      expect(newState.theta).to.be.eql(theta_i)
    })

    it('should have a constant zoom', () => {
      const zoom_i = 2
      transforms = [
        set('scale', zoom_i),
        statelessPanBy([25, 15]),
      ]
      newState = reduce(transforms, state)
      expect(newState.scale).to.eql(zoom_i)
    })

    it('should have constant p_w', () => {
      const p_c_i = [25, 25]
      const p_c_f = [50, 30]
      transform = statelessPanBy(vector.sub(p_c_f, p_c_i))
      newState = transform(state)
      const p_w_i = fromContainerToWorld(state, p_c_i)
      const p_w_f = fromContainerToWorld(newState, p_c_f)
      expect(p_w_f).to.be.eql(p_w_i)
    })

    it('should translate the world with respect to the container', () => {
      transform = statelessPanBy([1, 1])
      newState = transform(state)
      expect(newState.world_container).to.be.eql([1, 1])

      transform = statelessPanBy([1, 2])
      newState = transform(newState)
      expect(newState.world_container).to.be.eql([2, 3])
    })

    it('should compose', () => {
      transforms = [
        statelessPanBy([1, 0]),
        statelessPanBy([0, 1]),
        statelessPanBy([1, 1]),
      ]
      newState = reduce(transforms, state)
      expect(newState.world_container).to.eql([2, 2])
    });
  })

  describe('Unit: rotateBy', () => {
    it('should have a constant zoom', () => {
      const zoom_i = 2
      transforms = [
        set('scale', zoom_i),
        statelessRotateBy(45, [0, 0]),
      ]
      newState = reduce(transforms, state)
      expect(newState.scale).to.be.eql(zoom_i)
    })

    it('should have a constant p_w', () => {
      const p_c_i = [25, 25]
      const p_w_i = fromDocumentToWorld(state, p_c_i)
      transform = statelessRotateBy(45, p_c_i)
      newState = transform(state)
      const p_c_f = p_c_i // assumed to be true
      const p_w_f = fromWorldToContainer(newState, p_c_f)
      expect(p_w_f).to.almost.eql(p_w_i)
    })

    it('should have a constant p_c', () => {
      const p_w_i = [25, 25]
      const p_c_i = fromWorldToContainer(state, p_w_i)
      transform = statelessRotateBy(45, p_c_i)
      newState = transform(state)
      const p_w_f = p_w_i // assumed to be true
      const p_c_f = fromWorldToContainer(newState, p_w_f)
      expect(p_c_f).to.almost.eql(p_c_i)
    })

    it('should rotate about the center', () => {
      transform = statelessRotateBy(90, [50, 50])
      newState = transform(state)
      expect(newState.world_container).to.almost.eql([100, 0])
      expect(newState.theta).to.eql(90)
      expect(newState.scale).to.eql(1)
    })

    it('should rotate about a point', () => {
      transform = statelessRotateBy(90, [100, 100])
      newState = transform(state)
      expect(newState.world_container).to.almost.eql([200, 0])
      expect(newState.theta).to.eql(90)
      expect(newState.scale).to.eql(1)
      expect(fromContainerToWorld(newState, [100, 0])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [100, 100])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([200, 200])
      expect(newState.theta).to.eql(180)
      expect(newState.scale).to.eql(1)
      expect(fromContainerToWorld(newState, [200, 100])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [100, 100])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([0, 200])
      expect(newState.theta).to.eql(270)
      expect(newState.scale).to.eql(1)
      expect(fromContainerToWorld(newState, [100, 200])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [100, 100])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([0, 0])
      expect(newState.theta).to.eql(360)
      expect(newState.scale).to.eql(1)
      expect(fromContainerToWorld(newState, [0, 100])).to.almost.eql([0, 100])
    })

    it('should rotate and hold the zoom correctly', () => {
      state.scale = (2)

      transform = statelessRotateBy(90, [200, 200])
      newState = transform(state)
      expect(newState.world_container).to.almost.eql([400, 0])
      expect(newState.theta).to.eql(90)
      expect(newState.scale).to.eql(2)
      expect(fromContainerToWorld(newState, [200, 0])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [200, 200])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([400, 400])
      expect(newState.theta).to.eql(180)
      expect(newState.scale).to.eql(2)
      expect(fromContainerToWorld(newState, [400, 200])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [200, 200])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([0, 400])
      expect(newState.theta).to.eql(270)
      expect(newState.scale).to.eql(2)
      expect(fromContainerToWorld(newState, [200, 400])).to.almost.eql([0, 100])

      transform = statelessRotateBy(90, [200, 200])
      newState = transform(newState)
      expect(newState.world_container).to.almost.eql([0, 0])
      expect(newState.theta).to.eql(360)
      expect(newState.scale).to.eql(2)
      expect(fromContainerToWorld(newState, [0, 200])).to.almost.eql([0, 100])
    })

    it('should not rotate when degrees == 0', () => {
      transform = statelessRotateBy(0, [0, 0])
      newState = transform(state)
      expect(newState.world_container).to.be.eql([0, 0])
      expect(newState.theta).to.eql(0)
      expect(newState.scale).to.eql(1)
    })
  })
});
