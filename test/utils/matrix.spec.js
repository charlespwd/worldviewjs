import { product, add, sub, R } from '../../src/utils/matrix'
import { expect } from 'chai'

describe('Module: Matrix', () => {
  describe('Unit: R', () => {
    it('should give the correct rotation matrix', () => {
      expect(R(0)).to.eql([
        [1, -0],
        [0,  1],
      ])

      expect(R(90)).to.be.almost.eql([
        [0, -1],
        [1,  0],
      ])

      expect(R(-90)).to.be.almost.eql([
        [0,  1],
        [-1, 0],
      ])
    });
  });

  describe('Unit: add', () => {
    it('should return the correct result', () => {
      expect(add([
        [0, 0],
        [0, 0],
      ], [
        [1, 2],
        [3, 4],
      ])).to.be.almost.eql([
        [1, 2],
        [3, 4],
      ])
    });
  });

  describe('Unit: sub', () => {
    it('should return the correct result', () => {
      expect(sub([
        [0, 0],
        [0, 0],
      ], [
        [1, 2],
        [3, 4],
      ])).to.be.almost.eql([
        [-1, -2],
        [-3, -4],
      ])
    });

    it('should return the correct result bis', () => {
      expect(sub([
        [1, -0],
        [0,  1],
      ], [
        [0, -1],
        [1,  0],
      ])).to.be.almost.eql([
        [1,  1],
        [-1, 1],
      ])
    });

    it('should subtract correctly', () => {
      expect(sub(
        [ [ 1, -0 ], [ 0, 1 ] ],
        [ [ 6.123233995736766e-17, -1 ], [ 1, 6.123233995736766e-17 ] ]
      )).to.be.almost.eql([
        [ 1, 1 ],
        [ -1, 1],
      ])
    });
  });

  describe('Unit: product', () => {
    it('should perform matrix/vector products', () => {
      expect(product(R(90), [1, 0])).to.be.almost.eql([0, 1])
    });

    it('should perform matrix/matrix products', () => {
      expect(product(R(0), R(0))).to.be.almost.eql(R(0))
      expect(product(R(0), R(90))).to.be.almost.eql(R(90))
      expect(product(R(90), R(0))).to.be.almost.eql(R(90))
    });

    it('should throw if arguments do not make sense', () => {
      expect(() => product(R(90), undefined)).to.throw
      expect(() => product(undefined, R(90))).to.throw
      expect(() => product(R(90), 10)).to.throw
    });
  });
});
