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

  describe('Unit: norm', () => {
    it('should return the norm of the vector', () => {
      expect(vector.norm([0, 0])).to.eql(0)
      expect(vector.norm([1, 0])).to.eql(1)
      expect(vector.norm([3, 4])).to.eql(5)
      expect(vector.norm([-3, -4])).to.eql(5)
    });
  });

  describe('Unit: normalize', () => {
    it('should return the a vector of unit norm', () => {
      expect(vector.norm(vector.normalize([0, 5]))).to.eql(1)
    });

    it('should recover the initial vector after scaling a normalized vector by the norm', () => {
      const initialVector = [3, 4];
      const norm = 5
      expect(vector.scale(norm, vector.normalize(initialVector))).to.almost.eql(initialVector)
    });
  });
})
