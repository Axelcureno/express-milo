import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import useInputAutocomplete from '../../express/code/scripts/autocomplete-api-v3.js';

describe('Autocomplete API v3', () => {
  let mockUpdateUI;
  let mockGetConfig;
  let mockFetch;
  let originalFetch;

  beforeEach(() => {
    // Mock fetch
    originalFetch = window.fetch;
    mockFetch = sinon.stub();
    window.fetch = mockFetch;

    // Set up default mock response for fetch
    mockFetch.resolves({
      json: () => Promise.resolve({ queryResults: [{ items: [] }] }),
    });

    // Mock updateUI function
    mockUpdateUI = sinon.spy();

    // Mock getConfig function
    mockGetConfig = sinon.stub().returns({
      locale: { ietf: 'en-US' },
    });
  });

  afterEach(() => {
    window.fetch = originalFetch;
    sinon.restore();
  });

  describe('useInputAutocomplete', () => {
    it('should return an object with inputHandler function', () => {
      const result = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      expect(result).to.be.an('object');
      expect(result).to.have.property('inputHandler');
      expect(result.inputHandler).to.be.a('function');
    });

    it('should handle input events', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query' },
      };

      // Should not throw when called
      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle empty input', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: '' },
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle short queries (less than 4 characters)', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'abc' }, // 3 characters
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle queries ending with space', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query ' }, // ends with space
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle long queries (4+ characters)', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEvent = {
        target: { value: 'test query' }, // 10 characters
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should work with custom options', () => {
      const customOptions = {
        throttleDelay: 100,
        debounceDelay: 200,
        limit: 10,
      };

      const result = useInputAutocomplete(mockUpdateUI, mockGetConfig, customOptions);

      expect(result).to.be.an('object');
      expect(result).to.have.property('inputHandler');
      expect(result.inputHandler).to.be.a('function');
    });

    it('should work with default options', () => {
      const result = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      expect(result).to.be.an('object');
      expect(result).to.have.property('inputHandler');
      expect(result.inputHandler).to.be.a('function');
    });

    it('should handle special characters in input', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const specialChars = ['!@#$%^&*()', 'test-query', 'test_query', 'test.query'];

      specialChars.forEach((value) => {
        const mockEvent = { target: { value } };
        expect(() => inputHandler(mockEvent)).to.not.throw();
      });
    });

    it('should handle very long queries', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const longQuery = 'a'.repeat(1000);
      const mockEvent = {
        target: { value: longQuery },
      };

      expect(() => inputHandler(mockEvent)).to.not.throw();
    });

    it('should handle null and undefined input values', () => {
      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);

      const mockEventNull = { target: { value: null } };
      const mockEventUndefined = { target: { value: undefined } };

      expect(() => inputHandler(mockEventNull)).to.not.throw();
      expect(() => inputHandler(mockEventUndefined)).to.not.throw();
    });
  });

  describe('API Integration', () => {
    it('should handle successful API response', async () => {
      const mockResponse = {
        queryResults: [{
          items: [
            { title: 'Test Template 1' },
            { title: 'Test Template 2' },
          ],
        }],
      };

      mockFetch.resolves({
        json: () => Promise.resolve(mockResponse),
      });

      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);
      const mockEvent = { target: { value: 'test query' } };

      inputHandler(mockEvent);

      // Wait for async operations
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });

      expect(mockFetch.called).to.be.true;
    });

    it('should handle API error gracefully', async () => {
      mockFetch.rejects(new Error('API Error'));

      const { inputHandler } = useInputAutocomplete(mockUpdateUI, mockGetConfig);
      const mockEvent = { target: { value: 'test query' } };

      // Should not throw even if API fails
      expect(() => inputHandler(mockEvent)).to.not.throw();
    });
  });
});
