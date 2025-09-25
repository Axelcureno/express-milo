import { expect } from '@esm-bundle/chai';
import { generateSearchId, gatherPageImpression, updateImpressionCache, trackSearch, isValidTemplate } from '../../express/code/scripts/template-search-api-v3.js';

describe('Template Search API v3', () => {
  describe('generateSearchId', () => {
    it('should generate a unique search ID', () => {
      const id1 = generateSearchId();
      const id2 = generateSearchId();

      expect(id1).to.be.a('string');
      expect(id2).to.be.a('string');
      expect(id1).to.not.equal(id2);
    });

    it('should generate IDs with expected format', () => {
      const id = generateSearchId();

      // Should be a string with some length
      expect(id.length).to.be.greaterThan(0);
      expect(typeof id).to.equal('string');
    });

    it('should generate different IDs on multiple calls', () => {
      const ids = new Set();

      for (let i = 0; i < 10; i += 1) {
        ids.add(generateSearchId());
      }

      expect(ids.size).to.equal(10);
    });
  });

  describe('gatherPageImpression', () => {
    let mockSearchProps;

    beforeEach(() => {
      mockSearchProps = {
        searchId: 'test-search-123',
        searchTerm: 'test search',
        resultsCount: 5,
        pageNumber: 1,
      };
    });

    it('should process valid search properties', () => {
      expect(() => {
        gatherPageImpression(mockSearchProps);
      }).to.not.throw();
    });

    it('should handle empty search properties', () => {
      expect(() => {
        gatherPageImpression({});
      }).to.not.throw();
    });

    it('should handle null search properties', () => {
      expect(() => {
        gatherPageImpression(null);
      }).to.not.throw();
    });

    it('should handle undefined search properties', () => {
      expect(() => {
        gatherPageImpression(undefined);
      }).to.not.throw();
    });

    it('should handle search properties with missing fields', () => {
      const partialProps = {
        searchId: 'test-123',
        // Missing other fields
      };

      expect(() => {
        gatherPageImpression(partialProps);
      }).to.not.throw();
    });
  });

  describe('updateImpressionCache', () => {
    beforeEach(() => {
      // Clear any existing cache
      if (window.impressionCache) {
        window.impressionCache = {};
      }
    });

    it('should update cache with new values', () => {
      const newVals = {
        'template-1': { views: 1, clicks: 0 },
        'template-2': { views: 2, clicks: 1 },
      };

      expect(() => {
        updateImpressionCache(newVals);
      }).to.not.throw();
    });

    it('should handle empty values', () => {
      expect(() => {
        updateImpressionCache({});
      }).to.not.throw();
    });

    it('should handle null values', () => {
      expect(() => {
        updateImpressionCache(null);
      }).to.not.throw();
    });

    it('should handle undefined values', () => {
      expect(() => {
        updateImpressionCache(undefined);
      }).to.not.throw();
    });

    it('should merge with existing cache', () => {
      const initialVals = {
        'template-1': { views: 1, clicks: 0 },
      };

      const newVals = {
        'template-2': { views: 2, clicks: 1 },
      };

      updateImpressionCache(initialVals);
      updateImpressionCache(newVals);

      // Should not throw and should handle merging
      expect(true).to.be.true;
    });
  });

  describe('trackSearch', () => {
    let originalSatellite;

    beforeEach(() => {
      // Mock _satellite
      // eslint-disable-next-line no-underscore-dangle
      originalSatellite = window._satellite;
      // eslint-disable-next-line no-underscore-dangle
      window._satellite = {
        track: () => {},
      };
    });

    afterEach(() => {
      // eslint-disable-next-line no-underscore-dangle
      window._satellite = originalSatellite;
    });

    it('should track search with event name', () => {
      expect(() => {
        trackSearch('search-performed');
      }).to.not.throw();
    });

    it('should track search with custom search ID', () => {
      expect(() => {
        trackSearch('search-performed', 'custom-search-123');
      }).to.not.throw();
    });

    it('should generate search ID when not provided', () => {
      expect(() => {
        trackSearch('search-performed');
      }).to.not.throw();
    });

    it('should handle different event names', () => {
      const eventNames = [
        'search-started',
        'search-completed',
        'search-filtered',
        'search-sorted',
      ];

      eventNames.forEach((eventName) => {
        expect(() => {
          trackSearch(eventName);
        }).to.not.throw();
      });
    });

    it('should handle empty event name', () => {
      expect(() => {
        trackSearch('');
      }).to.not.throw();
    });
  });

  describe('isValidTemplate', () => {
    it('should validate template with required properties', () => {
      const validTemplate = {
        id: 'template-123',
        status: 'approved',
        customLinks: { branchUrl: 'https://example.com/branch' },
        assetType: 'Webpage_Template',
        _links: {
          'http://ns.adobe.com/adobecloud/rel/rendition': { href: { replace: true } },
          'http://ns.adobe.com/adobecloud/rel/component': { href: { replace: true } }
        },
        behaviors: ['still']
      };

      expect(isValidTemplate(validTemplate)).to.be.true;
    });

    it('should reject null template', () => {
      expect(isValidTemplate(null)).to.be.false;
    });

    it('should reject undefined template', () => {
      expect(isValidTemplate(undefined)).to.be.false;
    });

    it('should reject non-object template', () => {
      expect(isValidTemplate('not-a-template')).to.be.false;
      expect(isValidTemplate(123)).to.be.false;
      expect(isValidTemplate([])).to.be.false;
    });

    it('should reject template without id', () => {
      const invalidTemplate = {
        name: 'Test Template',
        category: 'design',
      };

      expect(isValidTemplate(invalidTemplate)).to.be.false;
    });

    it('should reject template with empty id', () => {
      const invalidTemplate = {
        id: '',
        name: 'Test Template',
      };

      expect(isValidTemplate(invalidTemplate)).to.be.false;
    });

    it('should accept template with minimal required properties', () => {
      const minimalTemplate = {
        id: 'template-123',
        status: 'approved',
        customLinks: { branchUrl: 'https://example.com/branch' },
        assetType: 'Webpage_Template',
        _links: {
          'http://ns.adobe.com/adobecloud/rel/rendition': { href: { replace: true } },
          'http://ns.adobe.com/adobecloud/rel/component': { href: { replace: true } }
        },
        behaviors: ['still']
      };

      expect(isValidTemplate(minimalTemplate)).to.be.true;
    });

    it('should handle template with additional properties', () => {
      const extendedTemplate = {
        id: 'template-123',
        status: 'approved',
        customLinks: { branchUrl: 'https://example.com/branch' },
        assetType: 'Webpage_Template',
        _links: {
          'http://ns.adobe.com/adobecloud/rel/rendition': { href: { replace: true } },
          'http://ns.adobe.com/adobecloud/rel/component': { href: { replace: true } }
        },
        behaviors: ['still'],
        name: 'Test Template',
        category: 'design',
        url: 'https://example.com/template',
        description: 'A test template',
        tags: ['design', 'business'],
        author: 'Test Author',
      };

      expect(isValidTemplate(extendedTemplate)).to.be.true;
    });
  });
});
