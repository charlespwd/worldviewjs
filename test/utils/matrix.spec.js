import { matrixMultiply, matrixAdd, matrixSubtract, R } from '../../src/utils/matrix'
import { expect } from 'chai'

describe('Module: Matrix', () => {
  describe('Unit: R', () => {
    it('should give the correct rotation matrix', () => {
      expect(R(0)).to.eql([
        [1, -0],
        [0,  1],
      ])

      expect(R(90)).to.be.approxEqual([
        [0, -1],
        [1,  0],
      ])

      expect(R(-90)).to.be.approxEqual([
        [0,  1],
        [-1, 0],
      ])
    });
  });

  describe('Unit: matrixAdd', () => {
    it('should return the correct result', () => {
      expect(matrixAdd([
        [0, 0],
        [0, 0],
      ], [
        [1, 2],
        [3, 4],
      ])).to.be.approxEqual([
        [1, 2],
        [3, 4],
      ])
    });
  });

  describe('Unit: matrixSubtract', () => {
    it('should return the correct result', () => {
      expect(matrixSubtract([
        [0, 0],
        [0, 0],
      ], [
        [1, 2],
        [3, 4],
      ])).to.be.approxEqual([
        [-1, -2],
        [-3, -4],
      ])
    });

    it('should return the correct result bis', () => {
      expect(matrixSubtract([
        [1, -0],
        [0,  1],
      ], [
        [0, -1],
        [1,  0],
      ])).to.be.approxEqual([
        [1,  1],
        [-1, 1],
      ])
    });

    it('should subtract correctly', () => {
      expect(matrixSubtract(
        [ [ 1, -0 ], [ 0, 1 ] ],
        [ [ 6.123233995736766e-17, -1 ], [ 1, 6.123233995736766e-17 ] ]
      )).to.be.approxEqual([
        [ 1, 1 ],
        [ -1, 1],
      ])
    });
  });

  describe('Unit: matrixMultiply', () => {
    it('should return the correct result', () => {
      expect(matrixMultiply(R(90), [0, 1])).to.be.approxEqual([1, 0])
    });
  });
});
