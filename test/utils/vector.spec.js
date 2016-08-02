import { expect } from 'chai'
import vector from '../../src/utils/vector'

describe('Module: vector', () => {
  describe('Unit: min, max', () => {
    it('should return the min values of both vectors', () => {
      expect(vector.min([1, 1], [0, 0])).to.eql([0, 0])
      expect(vector.min([1, 0], [0, 1])).to.eql([0, 0])
      expect(vector.min([0, 0], [1, 1])).to.eql([0, 0])
      expect(vector.min([0, 1], [1, 0])).to.eql([0, 0])
    })

    it('should return the min values of both vectors', () => {
      expect(vector.max([1, 1], [0, 0])).to.eql([1, 1])
      expect(vector.max([1, 0], [0, 1])).to.eql([1, 1])
      expect(vector.max([0, 0], [1, 1])).to.eql([1, 1])
      expect(vector.max([0, 1], [1, 0])).to.eql([1, 1])
    })
  })

  describe('Unit: bounded', () => {
    it('should return a vector that is bounded by its left and right counterparts', () => {
      const min = [-1, -1]
      const max = [1, 1]
      expect(vector.bounded(min, [0, 0], max)).to.be.eql([0, 0])

      // testing bounded by max
      expect(vector.bounded(min, [2, 0], max)).to.be.eql([1, 0])
      expect(vector.bounded(min, [0, 2], max)).to.be.eql([0, 1])
      expect(vector.bounded(min, [2, 2], max)).to.be.eql([1, 1])

      // testing bounded by min
      expect(vector.bounded(min, [-2,  0], max)).to.be.eql([-1,  0])
      expect(vector.bounded(min, [ 0, -2], max)).to.be.eql([ 0, -1])
      expect(vector.bounded(min, [-2, -2], max)).to.be.eql([-1, -1])
    });
  });
})
