import { expect } from '@esm-bundle/chai';
import isDarkOverlayReadable from '../../express/code/scripts/utils/color-tools.js';

describe('Color Tools', () => {
  describe('isDarkOverlayReadable', () => {
    it('should return true for light colors', () => {
      expect(isDarkOverlayReadable('#FFFFFF')).to.be.true; // White
      expect(isDarkOverlayReadable('#FFFF00')).to.be.true; // Yellow
      expect(isDarkOverlayReadable('#00FF00')).to.be.true; // Green
      expect(isDarkOverlayReadable('#FF0000')).to.be.true; // Red
    });

    it('should return false for dark colors', () => {
      expect(isDarkOverlayReadable('#000000')).to.be.false; // Black
      expect(isDarkOverlayReadable('#000080')).to.be.false; // Navy
      expect(isDarkOverlayReadable('#800000')).to.be.false; // Maroon
      expect(isDarkOverlayReadable('#008000')).to.be.false; // Dark Green
    });

    it('should handle RGB format', () => {
      expect(isDarkOverlayReadable('rgb(255, 255, 255)')).to.be.true; // White
      expect(isDarkOverlayReadable('rgb(0, 0, 0)')).to.be.false; // Black
      expect(isDarkOverlayReadable('rgb(128, 128, 128)')).to.be.false; // Gray
    });

    it('should handle RGBA format', () => {
      expect(isDarkOverlayReadable('rgba(255, 255, 255, 1)')).to.be.true; // White
      expect(isDarkOverlayReadable('rgba(0, 0, 0, 0.5)')).to.be.false; // Black with alpha
      expect(isDarkOverlayReadable('rgba(200, 200, 200, 0.8)')).to.be.true; // Light gray
    });

    it('should handle 3-digit hex colors', () => {
      expect(isDarkOverlayReadable('#FFF')).to.be.true; // White
      expect(isDarkOverlayReadable('#000')).to.be.false; // Black
      expect(isDarkOverlayReadable('#F00')).to.be.true; // Red
    });

    it('should handle 6-digit hex colors', () => {
      expect(isDarkOverlayReadable('#FFFFFF')).to.be.true; // White
      expect(isDarkOverlayReadable('#000000')).to.be.false; // Black
      expect(isDarkOverlayReadable('#FF0000')).to.be.true; // Red
    });

    it('should handle edge cases', () => {
      expect(isDarkOverlayReadable('#808080')).to.be.false; // Medium gray
      expect(isDarkOverlayReadable('#C0C0C0')).to.be.true; // Silver
      expect(isDarkOverlayReadable('#FFA500')).to.be.true; // Orange
    });

    it('should handle invalid input gracefully', () => {
      // The function should not throw on invalid input
      expect(() => isDarkOverlayReadable('invalid')).to.not.throw();
      expect(() => isDarkOverlayReadable('')).to.not.throw();
      expect(() => isDarkOverlayReadable(null)).to.not.throw();
      expect(() => isDarkOverlayReadable(undefined)).to.not.throw();
    });
  });
});
