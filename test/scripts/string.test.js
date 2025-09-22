import { expect } from '@esm-bundle/chai';
import { titleCase } from '../../express/code/scripts/utils/string.js';

describe('String Utils', () => {
  describe('titleCase', () => {
    it('should convert string to title case', () => {
      expect(titleCase('hello world')).to.equal('Hello World');
      expect(titleCase('this is a test')).to.equal('This Is A Test');
      expect(titleCase('javascript programming')).to.equal('Javascript Programming');
    });

    it('should handle single words', () => {
      expect(titleCase('hello')).to.equal('Hello');
      expect(titleCase('world')).to.equal('World');
      expect(titleCase('test')).to.equal('Test');
    });

    it('should handle empty and invalid inputs', () => {
      expect(titleCase('')).to.equal('');
      expect(titleCase(null)).to.equal('');
      expect(titleCase(undefined)).to.equal('');
      expect(titleCase(123)).to.equal('');
    });

    it('should handle mixed case input', () => {
      expect(titleCase('hELLo WoRLd')).to.equal('Hello World');
      expect(titleCase('MiXeD cAsE')).to.equal('Mixed Case');
    });

    it('should handle special characters', () => {
      expect(titleCase('hello-world')).to.equal('Hello-world');
      expect(titleCase('test_case')).to.equal('Test_case');
      expect(titleCase('hello@world')).to.equal('Hello@world');
    });

    it('should handle numbers', () => {
      expect(titleCase('test 123')).to.equal('Test 123');
      expect(titleCase('123 test')).to.equal('123 Test');
    });

    it('should handle multiple spaces', () => {
      expect(titleCase('hello   world')).to.equal('Hello   World');
      expect(titleCase('  test  ')).to.equal('  Test  ');
    });
  });
});
