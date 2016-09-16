import * as math from '../../src/utils/math';
import { expect } from 'chai';

describe('Module: math', () => {
  describe('Unit: bounded', () => {
    it('should give me a number bounded by limits', () => {
      expect(math.bounded(1, 2, 3)).to.eql(2);
      expect(math.bounded(1, 0, 2)).to.eql(1);
      expect(math.bounded(1, 4, 3)).to.eql(3);
    });

    it('should assume -Infinity and +Infinity when limits are not defined', () => {
      expect(math.bounded(undefined, 2, 3)).to.eql(2);
      expect(math.bounded(undefined, 3, 2)).to.eql(2);

      expect(math.bounded(3, 2, undefined)).to.eql(3);
      expect(math.bounded(2, 3, undefined)).to.eql(3);

      expect(math.bounded(undefined, 2, undefined)).to.eql(2);
      expect(math.bounded(undefined, 3, undefined)).to.eql(3);
    });
  });
});
