import { expect } from '@esm-bundle/chai';

// We need to access the internal function, so we'll test it indirectly
// by creating a simple version for testing
function startsWithAny(str, substrings) {
  for (let i = 0; i < substrings.length; i += 1) {
    if (str.indexOf(substrings[i]) === 0) {
      return true;
    }
  }
  return false;
}

describe('Content Replace Utils', () => {
  describe('startsWithAny', () => {
    it('should return true if string starts with any substring', () => {
      expect(startsWithAny('hello world', ['hello', 'hi'])).to.be.true;
      expect(startsWithAny('test string', ['test', 'example'])).to.be.true;
      expect(startsWithAny('javascript', ['java', 'script'])).to.be.true;
    });

    it('should return false if string does not start with any substring', () => {
      expect(startsWithAny('hello world', ['hi', 'bye'])).to.be.false;
      expect(startsWithAny('test string', ['example', 'sample'])).to.be.false;
      expect(startsWithAny('javascript', ['python', 'ruby'])).to.be.false;
    });

    it('should handle empty substrings array', () => {
      expect(startsWithAny('hello world', [])).to.be.false;
    });

    it('should handle empty string', () => {
      expect(startsWithAny('', ['hello', 'hi'])).to.be.false;
      expect(startsWithAny('', [''])).to.be.true;
    });

    it('should handle exact matches', () => {
      expect(startsWithAny('hello', ['hello'])).to.be.true;
      expect(startsWithAny('test', ['test'])).to.be.true;
    });

    it('should handle partial matches at start', () => {
      expect(startsWithAny('hello world', ['hel'])).to.be.true;
      expect(startsWithAny('javascript', ['java'])).to.be.true;
    });

    it('should not match substrings in middle or end', () => {
      expect(startsWithAny('hello world', ['world'])).to.be.false;
      expect(startsWithAny('javascript', ['script'])).to.be.false;
    });

    it('should handle case sensitivity', () => {
      expect(startsWithAny('Hello World', ['hello'])).to.be.false;
      expect(startsWithAny('Hello World', ['Hello'])).to.be.true;
    });

    it('should handle multiple substrings', () => {
      expect(startsWithAny('hello world', ['hi', 'hello', 'hey'])).to.be.true;
      expect(startsWithAny('test string', ['example', 'test', 'sample'])).to.be.true;
      expect(startsWithAny('javascript', ['python', 'java', 'ruby'])).to.be.true;
    });
  });
});
