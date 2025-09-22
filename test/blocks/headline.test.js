import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../express/code/blocks/headline/headline.js';

describe('Headline Block', () => {
  let mockGetMetadata;
  let mockGetIconElementDeprecated;
  let originalLana;

  beforeEach(() => {
    // Mock getMetadata
    mockGetMetadata = sinon.stub();

    // Mock getIconElementDeprecated
    mockGetIconElementDeprecated = sinon.stub();

    // Mock window.lana
    originalLana = window.lana;
    window.lana = { log: sinon.stub() };

    // Mock the dynamic import
    global.import = sinon.stub().resolves({
      getMetadata: mockGetMetadata,
    });
  });

  afterEach(() => {
    // Restore original lana
    window.lana = originalLana;

    // Clean up DOM
    document.body.innerHTML = '';
  });

  describe('init function', () => {
    it('should export a function', () => {
      expect(typeof init).to.equal('function');
    });

    it('should return the element when cfg equals heading', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      el.appendChild(heading);

      // Mock the dynamic import to return getMetadata
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      const result = await init(el);
      expect(result).to.equal(el);
    });

    it('should apply styles from configuration paragraph', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      const cfg = document.createElement('p');
      cfg.textContent = 'color: red, font-size: 24px';

      el.appendChild(heading);
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(heading.style.color).to.equal('red');
      expect(heading.style.fontSize).to.equal('24px');
      expect(cfg.parentNode).to.be.null; // Should be removed
    });

    it('should handle malformed configuration gracefully', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      const cfg = document.createElement('p');
      cfg.textContent = 'invalid:config:format';

      el.appendChild(heading);
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      // Should not throw error and should remove cfg
      expect(cfg.parentNode).to.be.null;
    });

    it('should handle missing configuration paragraph', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      el.appendChild(heading);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      // Should not throw error
      expect(el.querySelector('h1')).to.equal(heading);
    });

    it('should handle missing heading element', async () => {
      const el = document.createElement('div');
      const cfg = document.createElement('p');
      cfg.textContent = 'color: red';
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      // Should not throw error
      expect(cfg.parentNode).to.be.null;
    });

    it('should add logo when conditions are met', async () => {
      // Create main structure
      const main = document.createElement('main');
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const el = document.createElement('div');
      const heading = document.createElement('h1');

      main.appendChild(div1);
      div1.appendChild(div2);
      div2.appendChild(el);
      el.appendChild(heading);
      document.body.appendChild(main);

      // Mock getMetadata to return 'on'
      mockGetMetadata.returns('on');

      // Mock getIconElementDeprecated
      const mockLogo = document.createElement('div');
      mockLogo.className = 'adobe-express-logo';
      mockGetIconElementDeprecated.returns(mockLogo);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(mockGetIconElementDeprecated.calledWith('adobe-express-logo')).to.be.true;
      expect(mockLogo.classList.contains('express-logo')).to.be.true;
      expect(el.firstChild).to.equal(mockLogo);
    });

    it('should not add logo when marquee-inject-logo is off', async () => {
      // Create main structure
      const main = document.createElement('main');
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      const el = document.createElement('div');
      const heading = document.createElement('h1');

      main.appendChild(div1);
      div1.appendChild(div2);
      div2.appendChild(el);
      el.appendChild(heading);
      document.body.appendChild(main);

      // Mock getMetadata to return 'off'
      mockGetMetadata.returns('off');

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(mockGetIconElementDeprecated.called).to.be.false;
      expect(el.querySelector('.express-logo')).to.be.null;
    });

    it('should not add logo when element is not in main > div > div', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      el.appendChild(heading);
      document.body.appendChild(el);

      // Mock getMetadata to return 'on'
      mockGetMetadata.returns('on');

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(mockGetIconElementDeprecated.called).to.be.false;
      expect(el.querySelector('.express-logo')).to.be.null;
    });

    it('should handle different heading levels', async () => {
      const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

      for (const tagName of headings) {
        const el = document.createElement('div');
        const heading = document.createElement(tagName);
        el.appendChild(heading);

        // Mock the dynamic import
        global.import = sinon.stub().resolves({
          getMetadata: mockGetMetadata,
        });

        const result = await init(el);
        expect(result).to.equal(el);
      }
    });

    it('should handle empty configuration text', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      const cfg = document.createElement('p');
      cfg.textContent = '';

      el.appendChild(heading);
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      // Should not throw error and should remove cfg
      expect(cfg.parentNode).to.be.null;
    });

    it('should handle configuration with extra spaces', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      const cfg = document.createElement('p');
      cfg.textContent = '  color : red  ,  font-size : 24px  ';

      el.appendChild(heading);
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(heading.style.color).to.equal('red');
      expect(heading.style.fontSize).to.equal('24px');
    });

    it('should log errors to lana when exception occurs', async () => {
      const el = document.createElement('div');
      const heading = document.createElement('h1');
      const cfg = document.createElement('p');

      // Create a heading that will cause an error when trying to set style
      Object.defineProperty(heading, 'style', {
        get() {
          throw new Error('Style access error');
        },
      });

      cfg.textContent = 'color: red';
      el.appendChild(heading);
      el.appendChild(cfg);

      // Mock the dynamic import
      global.import = sinon.stub().resolves({
        getMetadata: mockGetMetadata,
      });

      await init(el);

      expect(window.lana.log.calledOnce).to.be.true;
      expect(window.lana.log.firstCall.args[0]).to.be.an('error');
    });
  });
});
