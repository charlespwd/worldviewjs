import WorldView from '../src/worldview'
import { expect } from 'chai'

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
    it('should zoom about the midpoint of the container by default', () => {
      view.zoomTo(2)
      transform = view.transform
      expect(transform.translate).to.be.eql([ -50, -50 ])
      expect(transform.scale).to.be.eql(2)
    })
  })
})
