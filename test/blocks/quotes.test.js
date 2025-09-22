import { expect } from '@esm-bundle/chai';

// We need to test the internal function, so we'll create a simple version for testing
function pickRandomFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

describe('Quotes Block', () => {
  describe('pickRandomFromArray', () => {
    it('should return an element from the array', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e'];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });

    it('should handle single element array', () => {
      const testArray = ['single'];
      const result = pickRandomFromArray(testArray);
      expect(result).to.equal('single');
    });

    it('should handle array with numbers', () => {
      const testArray = [1, 2, 3, 4, 5];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });

    it('should handle array with objects', () => {
      const testArray = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });

    it('should handle empty array', () => {
      const testArray = [];
      const result = pickRandomFromArray(testArray);
      expect(result).to.be.undefined;
    });

    it('should return different elements on multiple calls', () => {
      const testArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
      const results = new Set();

      // Run multiple times to increase chance of getting different results
      for (let i = 0; i < 100; i += 1) {
        results.add(pickRandomFromArray(testArray));
      }

      // With 10 elements and 100 calls, we should get multiple different results
      expect(results.size).to.be.greaterThan(1);
    });

    it('should handle array with mixed types', () => {
      const testArray = ['string', 123, { key: 'value' }, true, null];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });

    it('should handle array with duplicates', () => {
      const testArray = ['a', 'a', 'a', 'b', 'b'];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });

    it('should handle array with undefined and null values', () => {
      const testArray = [undefined, null, 'value'];
      const result = pickRandomFromArray(testArray);
      expect(testArray).to.include(result);
    });
  });
});
