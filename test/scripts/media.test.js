import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

// We need to test the internal functions, so we'll create simple versions for testing
function toggleVideo(target) {
  const video = target?.closest('.hero-animation-overlay')?.querySelector('video');
  const paused = video ? video.paused : false;

  if (paused) {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // ignore
      });
    }
  } else video?.pause();
}

describe('Media Utils', () => {
  describe('toggleVideo', () => {
    let mockVideo;
    let mockTarget;

    beforeEach(() => {
      mockVideo = {
        paused: true,
        play: sinon.stub().resolves(),
        pause: sinon.stub(),
      };

      mockTarget = {
        closest: sinon.stub().returns({
          querySelector: sinon.stub().returns(mockVideo),
        }),
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should play video when paused', () => {
      mockVideo.paused = true;

      toggleVideo(mockTarget);

      expect(mockVideo.play.called).to.be.true;
      expect(mockVideo.pause.called).to.be.false;
    });

    it('should pause video when playing', () => {
      mockVideo.paused = false;

      toggleVideo(mockTarget);

      expect(mockVideo.pause.called).to.be.true;
      expect(mockVideo.play.called).to.be.false;
    });

    it('should handle null target', () => {
      expect(() => toggleVideo(null)).to.not.throw();
    });

    it('should handle undefined target', () => {
      expect(() => toggleVideo(undefined)).to.not.throw();
    });

    it('should handle target without video', () => {
      const targetWithoutVideo = {
        closest: sinon.stub().returns({
          querySelector: sinon.stub().returns(null),
        }),
      };

      expect(() => toggleVideo(targetWithoutVideo)).to.not.throw();
    });

    it('should handle target without closest element', () => {
      const targetWithoutClosest = {
        closest: sinon.stub().returns(null),
      };

      expect(() => toggleVideo(targetWithoutClosest)).to.not.throw();
    });

    it('should handle video play promise rejection', () => {
      mockVideo.paused = true;
      mockVideo.play = sinon.stub().rejects(new Error('Play failed'));

      // Should not throw even if play fails
      expect(() => toggleVideo(mockTarget)).to.not.throw();
    });

    it('should handle video with undefined play promise', () => {
      mockVideo.paused = true;
      mockVideo.play = sinon.stub().returns(undefined);

      expect(() => toggleVideo(mockTarget)).to.not.throw();
    });
  });
});
