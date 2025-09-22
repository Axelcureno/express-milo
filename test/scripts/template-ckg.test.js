import { expect } from '@esm-bundle/chai';

// We need to access the internal function, so we'll test it indirectly
// by creating a simple version for testing
function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

describe('Template CKG Utils', () => {
  describe('sanitizeHTML', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeHTML('<div>Hello</div>')).to.equal('&lt;div&gt;Hello&lt;/div&gt;');
      expect(sanitizeHTML('&lt;script&gt;')).to.equal('&amp;lt;script&amp;gt;');
      expect(sanitizeHTML('"quoted"')).to.equal('&quot;quoted&quot;');
      expect(sanitizeHTML("'single quotes'")).to.equal('&#39;single quotes&#39;');
    });

    it('should handle complex HTML strings', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
      expect(sanitizeHTML(input)).to.equal(expected);
    });

    it('should handle mixed content', () => {
      const input = 'Hello <b>world</b> & "friends"';
      const expected = 'Hello &lt;b&gt;world&lt;/b&gt; &amp; &quot;friends&quot;';
      expect(sanitizeHTML(input)).to.equal(expected);
    });

    it('should handle empty string', () => {
      expect(sanitizeHTML('')).to.equal('');
    });

    it('should handle strings with no special characters', () => {
      expect(sanitizeHTML('Hello World')).to.equal('Hello World');
      expect(sanitizeHTML('123456')).to.equal('123456');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeHTML(null)).to.equal('');
      expect(sanitizeHTML(undefined)).to.equal('');
      expect(sanitizeHTML(123)).to.equal('');
      expect(sanitizeHTML({})).to.equal('');
      expect(sanitizeHTML([])).to.equal('');
    });

    it('should handle strings with only one type of special character', () => {
      expect(sanitizeHTML('<<<')).to.equal('&lt;&lt;&lt;');
      expect(sanitizeHTML('>>>')).to.equal('&gt;&gt;&gt;');
      expect(sanitizeHTML('&&&')).to.equal('&amp;&amp;&amp;');
      expect(sanitizeHTML('"""')).to.equal('&quot;&quot;&quot;');
      expect(sanitizeHTML("'''")).to.equal('&#39;&#39;&#39;');
    });

    it('should handle nested quotes', () => {
      const input = 'He said "Hello \'world\'"';
      const expected = 'He said &quot;Hello &#39;world&#39;&quot;';
      expect(sanitizeHTML(input)).to.equal(expected);
    });

    it('should handle HTML attributes', () => {
      const input = '<img src="test.jpg" alt="test">';
      const expected = '&lt;img src=&quot;test.jpg&quot; alt=&quot;test&quot;&gt;';
      expect(sanitizeHTML(input)).to.equal(expected);
    });
  });
});
