import { expect } from '@esm-bundle/chai';

import handleTooltip, { adjustElementPosition, getTooltipMatch } from '../../express/code/scripts/widgets/tooltip.js';

// Initialize libs/config similar to pricing tests so dynamic imports in handleTooltip work
const imports = await Promise.all([
  import('../../express/code/scripts/utils.js'),
  import('../../express/code/scripts/scripts.js'),
]);
const [{ getLibs }] = imports;

// Configure locales to satisfy getConfig() calls from libs utils
await import(`${getLibs()}/utils/utils.js`).then((mod) => {
  const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
  mod.setConfig(conf);
});

// Match pricing-cards tooltip token pattern: [[tooltip]]...[[/tooltip]]
const TOOLTIP_PATTERN = /\[\[([^]+)\]\]([^]+)\[\[\/([^]+)\]\]/g;

describe('Tooltip widget parsing', () => {
  let originalBodyHTML;

  beforeEach(() => {
    originalBodyHTML = document.body.innerHTML;
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = originalBodyHTML;
  });

  it('renders tooltip and removes token from the page', async () => {
    const tooltipContent = 'If you cancel more than 14 days after your paid subscription begins, your payment is non-refundable, and your service will continue until the end of that month’s billing period.';
    document.body.innerHTML = `
      <main>
        <section>
          <p>
            No annual commitment, billed monthly. Cancel anytime1, no fee.
            [[tooltip]]${tooltipContent} [[/tooltip]]
          </p>
        </section>
      </main>
    `;

    const paragraphs = document.querySelectorAll('p');
    await handleTooltip(paragraphs, TOOLTIP_PATTERN);

    // Token markers should be removed from the page
    expect(document.body.textContent).to.not.include('[[tooltip]]');
    expect(document.body.textContent).to.not.include('[[/tooltip]]');

    // Tooltip DOM should be constructed
    const tooltipContainer = document.querySelector('.tooltip');
    expect(tooltipContainer).to.exist;
    const button = tooltipContainer.querySelector('button');
    const popup = tooltipContainer.querySelector('.tooltip-text');
    expect(button).to.exist;
    expect(popup).to.exist;
    expect(popup.textContent.trim()).to.equal(tooltipContent.trim());
    expect(button.getAttribute('aria-label').trim()).to.equal(tooltipContent.trim());
  });
});

describe('Tooltip Utility Functions', () => {
  describe('adjustElementPosition', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should handle no tooltip elements', () => {
      // Should not throw error when no elements exist
      expect(() => adjustElementPosition()).to.not.throw();
    });

    it('should add overflow-right class when element overflows right', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-text';
      tooltip.style.position = 'absolute';
      tooltip.style.left = '1000px'; // Force overflow
      document.body.appendChild(tooltip);

      // Mock getBoundingClientRect to simulate overflow
      const originalGetBoundingClientRect = tooltip.getBoundingClientRect;
      tooltip.getBoundingClientRect = () => ({
        right: 1200, // Overflows window width
        left: 1000,
      });

      adjustElementPosition();

      expect(tooltip.classList.contains('overflow-right')).to.be.true;
      expect(tooltip.classList.contains('overflow-left')).to.be.false;

      // Restore original method
      tooltip.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('should add overflow-left class when element overflows left', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip-text';
      tooltip.style.position = 'absolute';
      tooltip.style.left = '-100px'; // Force left overflow
      document.body.appendChild(tooltip);

      // Mock getBoundingClientRect to simulate left overflow
      const originalGetBoundingClientRect = tooltip.getBoundingClientRect;
      tooltip.getBoundingClientRect = () => ({
        right: 200,
        left: -100, // Overflows left
      });

      adjustElementPosition();

      expect(tooltip.classList.contains('overflow-left')).to.be.true;
      expect(tooltip.classList.contains('overflow-right')).to.be.false;

      // Restore original method
      tooltip.getBoundingClientRect = originalGetBoundingClientRect;
    });

    it('should handle multiple tooltip elements', () => {
      const tooltip1 = document.createElement('div');
      tooltip1.className = 'tooltip-text';
      const tooltip2 = document.createElement('div');
      tooltip2.className = 'tooltip-text';

      document.body.appendChild(tooltip1);
      document.body.appendChild(tooltip2);

      // Should not throw error with multiple elements
      expect(() => adjustElementPosition()).to.not.throw();
    });
  });

  describe('getTooltipMatch', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should find tooltip match in elements array', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('span'),
        document.createElement('p'),
      ];

      elements[1].textContent = 'tooltip content';
      elements[1].setAttribute('data-tooltip', 'true');

      const result = getTooltipMatch(elements, 'tooltip');
      expect(result).to.equal(elements[1]);
    });

    it('should work with single element', () => {
      const element = document.createElement('div');
      element.textContent = 'test tooltip';
      element.setAttribute('data-tooltip', 'true');

      const result = getTooltipMatch(element, 'tooltip');
      expect(result).to.equal(element);
    });

    it('should work with document', () => {
      const tooltip = document.createElement('div');
      tooltip.textContent = 'document tooltip';
      tooltip.setAttribute('data-tooltip', 'true');
      document.body.appendChild(tooltip);

      const result = getTooltipMatch(document, 'tooltip');
      expect(result).to.equal(tooltip);
    });

    it('should return undefined when no match found', () => {
      const elements = [
        document.createElement('div'),
        document.createElement('span'),
      ];

      const result = getTooltipMatch(elements, 'nonexistent');
      expect(result).to.be.undefined;
    });

    it('should handle empty elements array', () => {
      const result = getTooltipMatch([], 'tooltip');
      expect(result).to.be.undefined;
    });
  });
});
