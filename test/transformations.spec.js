import {
  fromContainerToDocument,
  fromContainerToWorld,
  fromDocumentToContainer,
  fromDocumentToWorld,
  fromWorldToContainer,
  fromWorldToDocument,
} from '../src/transformations';
import { flow } from '../src/utils/functional'
import { expect } from 'chai'

describe('Module: Transformations', () => {
  let state = {}
  beforeEach(() => {
    state = {
      zoom: 1,
      theta: 0,
      worldOrigin_container: [0, 0],
      containerOrigin_document: [0, 0],
      worldSize: [100, 100],
      containerSize: [100, 100],
    }
  })

  describe('Unit: fromDocumentToContainer, fromContainerToDocument', () => {
    it('should be the inverse of each other', () => {
      state.zoom = 2
      state.theta = 150
      state.worldOrigin_container = [158, 23]
      state.containerOrigin_document = [40, 2]
      const aToB = flow(
        fromDocumentToContainer.bind(null, state),
        fromContainerToDocument.bind(null, state)
      )
      const bToA = flow(
        fromContainerToDocument.bind(null, state),
        fromDocumentToContainer.bind(null, state)
      )
      expect(aToB([1, 2])).to.eql([1, 2])
      expect(bToA([1, 2])).to.eql([1, 2])
    })

    it('should offset the container origin', () => {
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([1, 1])
      state.containerOrigin_document = [1, 1]
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([0, 0])
    })

    it('should not depend on the rotation', () => {
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([1, 1])
      state.theta = 90
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([1, 1])
    })

    it('should not depend on the scale', () => {
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([1, 1])
      state.zoom = 2
      expect(fromDocumentToContainer(state, [1, 1])).to.eql([1, 1])
    })
  })

  describe('Unit: fromWorldToContainer, fromContainerToWorld', () => {
    it('should not depend on the container origin', () => {
      expect(fromWorldToContainer(state, [50, 50])).to.eql([50, 50])
      state.containerOrigin_document = [1, 1]
      expect(fromWorldToContainer(state, [50, 50])).to.eql([50, 50])
    })

    it('should depend on the zoom level', () => {
      state.zoom = 2
      expect(fromWorldToContainer(state, [100, 100])).to.eql([200, 200])
      expect(fromWorldToContainer(state, [50, 50])).to.eql([100, 100])
      expect(fromWorldToContainer(state, [0, 0])).to.eql([0, 0])
    })

    it('should depend on the rotation', () => {
      state.theta = 90
      expect(fromWorldToContainer(state, [1, 0])).to.almost.eql([0, 1])
      expect(fromWorldToContainer(state, [0, 1])).to.almost.eql([-1, 0])
      expect(fromWorldToContainer(state, [-1, 0])).to.almost.eql([0, -1])
      expect(fromWorldToContainer(state, [0, -1])).to.almost.eql([1, 0])
    })

    it('should depend on the world origin relative to the container', () => {
      state.worldOrigin_container = [1, 1]
      expect(fromWorldToContainer(state, [0, 0])).to.almost.eql([1, 1])
      expect(fromWorldToContainer(state, [1, 1])).to.almost.eql([2, 2])
      expect(fromWorldToContainer(state, [10, 0])).to.almost.eql([11, 1])
    })

    it('should be the inverse of each other', () => {
      state.zoom = 2
      state.theta = 150
      state.worldOrigin_container = [158, 23]
      state.containerOrigin_document = [40, 2]
      const aToB = flow(
        fromWorldToContainer.bind(null, state),
        fromContainerToWorld.bind(null, state)
      )
      const bToA = flow(
        fromContainerToWorld.bind(null, state),
        fromWorldToContainer.bind(null, state)
      )
      expect(aToB([1, 2])).to.almost.eql([1, 2])
      expect(bToA([1, 2])).to.almost.eql([1, 2])
    })
  })

  describe('Unit: fromWorldToDocument, fromDocumentToWorld', () => {
    it('should be the inverse of each other', () => {
      state.zoom = 2
      state.theta = 150
      state.worldOrigin_container = [158, 23]
      state.containerOrigin_document = [40, 2]
      const aToB = flow(
        fromWorldToDocument.bind(null, state),
        fromDocumentToWorld.bind(null, state)
      )
      const bToA = flow(
        fromDocumentToWorld.bind(null, state),
        fromWorldToDocument.bind(null, state)
      )
      expect(aToB([1, 2])).to.almost.eql([1, 2])
      expect(bToA([1, 2])).to.almost.eql([1, 2])
    })

    it('should be the composition of the other two transformations', () => {
      state.zoom = 2
      state.theta = 150
      state.worldOrigin_container = [158, 23]
      state.containerOrigin_document = [24, 42]
      expect(fromWorldToDocument(state, [1, 2])).to.eql(
        fromContainerToDocument(state, fromWorldToContainer(state, [1, 2]))
      )
      expect(fromDocumentToWorld(state, [1, 2])).to.eql(
        fromContainerToWorld(state, fromDocumentToContainer(state, [1, 2]))
      )
    })
  })
})
