import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
// eslint-disable-next-line import/no-named-as-default
import AssetDecoder, { decodeWithTimeout } from '../../express/code/scripts/utils/assetDecoder.js';

describe('Asset Decoder', () => {
  describe('isSupported', () => {
    it('should return true for image files', () => {
      const imageFile = { type: 'image/jpeg' };
      const pngFile = { type: 'image/png' };
      const gifFile = { type: 'image/gif' };
      const webpFile = { type: 'image/webp' };

      expect(AssetDecoder.isSupported(imageFile)).to.be.true;
      expect(AssetDecoder.isSupported(pngFile)).to.be.true;
      expect(AssetDecoder.isSupported(gifFile)).to.be.true;
      expect(AssetDecoder.isSupported(webpFile)).to.be.true;
    });

    it('should return true for video files', () => {
      const videoFile = { type: 'video/mp4' };
      const webmFile = { type: 'video/webm' };
      const aviFile = { type: 'video/avi' };
      const movFile = { type: 'video/quicktime' };

      expect(AssetDecoder.isSupported(videoFile)).to.be.true;
      expect(AssetDecoder.isSupported(webmFile)).to.be.true;
      expect(AssetDecoder.isSupported(aviFile)).to.be.true;
      expect(AssetDecoder.isSupported(movFile)).to.be.true;
    });

    it('should return false for unsupported files', () => {
      const textFile = { type: 'text/plain' };
      const pdfFile = { type: 'application/pdf' };
      const audioFile = { type: 'audio/mp3' };
      const unknownFile = { type: 'unknown/type' };

      expect(AssetDecoder.isSupported(textFile)).to.be.false;
      expect(AssetDecoder.isSupported(pdfFile)).to.be.false;
      expect(AssetDecoder.isSupported(audioFile)).to.be.false;
      expect(AssetDecoder.isSupported(unknownFile)).to.be.false;
    });

    it('should handle case insensitive types', () => {
      const upperCaseFile = { type: 'IMAGE/JPEG' };
      const mixedCaseFile = { type: 'Video/Mp4' };

      expect(AssetDecoder.isSupported(upperCaseFile)).to.be.true;
      expect(AssetDecoder.isSupported(mixedCaseFile)).to.be.true;
    });

    it('should handle empty or invalid type', () => {
      const emptyTypeFile = { type: '' };
      const noTypeFile = {};

      expect(AssetDecoder.isSupported(emptyTypeFile)).to.be.false;
      expect(AssetDecoder.isSupported(noTypeFile)).to.be.false;
    });
  });

  describe('decodeWithTimeout', () => {
    it('should resolve if promise completes before timeout', async () => {
      const fastPromise = Promise.resolve('success');
      const result = await decodeWithTimeout(fastPromise, 1000, 'Timeout message');

      expect(result).to.equal('success');
    });

    it('should reject if promise times out', async () => {
      const slowPromise = new Promise((resolve) => {
        setTimeout(() => resolve('too late'), 2000);
      });

      try {
        await decodeWithTimeout(slowPromise, 100, 'Operation timed out');
        expect.fail('Should have thrown timeout error');
      } catch (error) {
        expect(error.message).to.equal('Operation timed out');
      }
    });

    it('should use custom timeout message', async () => {
      const slowPromise = new Promise((resolve) => {
        setTimeout(() => resolve('too late'), 2000);
      });

      try {
        await decodeWithTimeout(slowPromise, 100, 'Custom timeout message');
        expect.fail('Should have thrown timeout error');
      } catch (error) {
        expect(error.message).to.equal('Custom timeout message');
      }
    });

    it('should handle promise rejection', async () => {
      const rejectedPromise = Promise.reject(new Error('Promise failed'));

      try {
        await decodeWithTimeout(rejectedPromise, 1000, 'Timeout message');
        expect.fail('Should have thrown promise error');
      } catch (error) {
        expect(error.message).to.equal('Promise failed');
      }
    });

    it('should clean up timeout on success', async () => {
      const clearTimeoutSpy = sinon.spy(window, 'clearTimeout');
      const fastPromise = Promise.resolve('success');

      await decodeWithTimeout(fastPromise, 1000, 'Timeout message');

      expect(clearTimeoutSpy.called).to.be.true;
      clearTimeoutSpy.restore();
    });

    it('should clean up timeout on rejection', async () => {
      const clearTimeoutSpy = sinon.spy(window, 'clearTimeout');
      const rejectedPromise = Promise.reject(new Error('Promise failed'));

      try {
        await decodeWithTimeout(rejectedPromise, 1000, 'Timeout message');
      } catch (error) {
        // Expected to throw
      }

      expect(clearTimeoutSpy.called).to.be.true;
      clearTimeoutSpy.restore();
    });
  });
});
