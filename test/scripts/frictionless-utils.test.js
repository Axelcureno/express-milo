import { expect } from '@esm-bundle/chai';
import { selectElementByTagPrefix, fadeIn, fadeOut, createDocConfig } from '../../express/code/scripts/utils/frictionless-utils.js';

describe('Frictionless Utils - Easy Win Functions', () => {
  describe('selectElementByTagPrefix', () => {
    beforeEach(() => {
      // Clear body and add test elements
      document.body.innerHTML = '';
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should find element by tag prefix', () => {
      const div1 = document.createElement('div');
      div1.className = 'test-div';
      const div2 = document.createElement('div');
      div2.className = 'another-div';
      const span = document.createElement('span');
      span.className = 'test-span';

      document.body.appendChild(div1);
      document.body.appendChild(div2);
      document.body.appendChild(span);

      expect(selectElementByTagPrefix('div')).to.equal(div1);
      expect(selectElementByTagPrefix('span')).to.equal(span);
    });

    it('should be case insensitive', () => {
      const div = document.createElement('div');
      document.body.appendChild(div);

      expect(selectElementByTagPrefix('DIV')).to.equal(div);
      expect(selectElementByTagPrefix('Div')).to.equal(div);
    });

    it('should return undefined if no element found', () => {
      expect(selectElementByTagPrefix('nonexistent')).to.be.undefined;
    });

    it('should work with single element', () => {
      const p = document.createElement('p');
      document.body.appendChild(p);

      expect(selectElementByTagPrefix('p')).to.equal(p);
    });
  });

  describe('fadeIn', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      element.classList.add('hidden', 'transparent');
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should remove hidden class immediately', () => {
      fadeIn(element);
      expect(element.classList.contains('hidden')).to.be.false;
    });

    it('should remove transparent class after timeout', (done) => {
      fadeIn(element);

      setTimeout(() => {
        expect(element.classList.contains('transparent')).to.be.false;
        done();
      }, 20);
    });

    it('should work with element that has no classes', () => {
      const emptyElement = document.createElement('div');
      fadeIn(emptyElement);
      expect(emptyElement.classList.contains('hidden')).to.be.false;
    });
  });

  describe('fadeOut', () => {
    let element;

    beforeEach(() => {
      element = document.createElement('div');
      document.body.appendChild(element);
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should add transparent class immediately', () => {
      fadeOut(element);
      expect(element.classList.contains('transparent')).to.be.true;
    });

    it('should add hidden class after timeout', (done) => {
      fadeOut(element);

      setTimeout(() => {
        expect(element.classList.contains('hidden')).to.be.true;
        done();
      }, 250);
    });

    it('should work with element that has existing classes', () => {
      element.classList.add('existing-class');
      fadeOut(element);
      expect(element.classList.contains('transparent')).to.be.true;
      expect(element.classList.contains('existing-class')).to.be.true;
    });
  });

  describe('createDocConfig', () => {
    it('should create image config by default', () => {
      const data = 'base64data';
      const config = createDocConfig(data);

      expect(config).to.deep.equal({
        asset: {
          data,
          dataType: 'base64',
          type: 'image',
          name: data.name,
        },
      });
    });

    it('should create video config when type is video', () => {
      const data = 'blobdata';
      const config = createDocConfig(data, 'video');

      expect(config).to.deep.equal({
        asset: {
          data,
          dataType: 'blob',
          type: 'video',
          name: data.name,
        },
      });
    });

    it('should handle different data types', () => {
      const imageData = 'imagebase64';
      const videoData = 'videoblob';

      const imageConfig = createDocConfig(imageData, 'image');
      const videoConfig = createDocConfig(videoData, 'video');

      expect(imageConfig.asset.dataType).to.equal('base64');
      expect(videoConfig.asset.dataType).to.equal('blob');
    });

    it('should handle empty data', () => {
      const config = createDocConfig('');

      expect(config.asset.data).to.equal('');
      expect(config.asset.dataType).to.equal('base64');
    });
  });
});
