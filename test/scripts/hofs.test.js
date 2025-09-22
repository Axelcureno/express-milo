import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { debounce, throttle, memoize } from '../../express/code/scripts/utils/hofs.js';

describe('Higher-Order Functions', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      const callback = sinon.spy();
      const debouncedFn = debounce(callback, 100);

      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      expect(callback.called).to.be.false;

      clock.tick(100);
      expect(callback.calledOnce).to.be.true;
      expect(callback.calledWith('arg3')).to.be.true;
    });

    it('should support leading option', () => {
      const callback = sinon.spy();
      const debouncedFn = debounce(callback, 100, { leading: true });

      debouncedFn('arg1');
      expect(callback.calledOnce).to.be.true;
      expect(callback.calledWith('arg1')).to.be.true;

      debouncedFn('arg2');
      expect(callback.calledOnce).to.be.true; // Still only called once

      clock.tick(100);
      expect(callback.calledOnce).to.be.true; // Still only called once
    });

    it('should handle multiple rapid calls', () => {
      const callback = sinon.spy();
      const debouncedFn = debounce(callback, 50);

      debouncedFn('call1');
      clock.tick(25);
      debouncedFn('call2');
      clock.tick(25);
      debouncedFn('call3');

      expect(callback.called).to.be.false;

      clock.tick(50);
      expect(callback.calledOnce).to.be.true;
      expect(callback.calledWith('call3')).to.be.true;
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const callback = sinon.spy();
      const throttledFn = throttle(callback, 100);

      throttledFn('arg1');
      expect(callback.calledOnce).to.be.true;

      throttledFn('arg2');
      throttledFn('arg3');
      expect(callback.calledOnce).to.be.true; // Still only called once

      clock.tick(100);
      expect(callback.calledOnce).to.be.true; // Still only called once
    });

    it('should support trailing option', () => {
      const callback = sinon.spy();
      const throttledFn = throttle(callback, 100, { trailing: true });

      throttledFn('arg1');
      expect(callback.calledOnce).to.be.true;

      throttledFn('arg2');
      throttledFn('arg3');
      expect(callback.calledOnce).to.be.true;

      clock.tick(100);
      expect(callback.calledTwice).to.be.true;
      expect(callback.calledWith('arg3')).to.be.true;
    });

    it('should handle multiple calls with delay', () => {
      const callback = sinon.spy();
      const throttledFn = throttle(callback, 50);

      throttledFn('call1');
      expect(callback.calledOnce).to.be.true;

      clock.tick(60);
      throttledFn('call2');
      expect(callback.calledTwice).to.be.true;
    });
  });

  describe('memoize', () => {
    it('should memoize function results', () => {
      const expensiveFn = sinon.spy((x) => x * 2);
      const memoizedFn = memoize(expensiveFn, { ttl: 1000 });

      const result1 = memoizedFn(5);
      const result2 = memoizedFn(5);

      expect(result1).to.equal(10);
      expect(result2).to.equal(10);
      expect(expensiveFn.calledOnce).to.be.true;
    });

    it('should use custom key function', () => {
      const expensiveFn = sinon.spy((a, b) => a + b);
      const memoizedFn = memoize(expensiveFn, {
        key: (a, b) => `${a}-${b}`,
        ttl: 1000,
      });

      memoizedFn(1, 2);
      memoizedFn(1, 2);

      expect(expensiveFn.calledOnce).to.be.true;
    });

    it('should handle TTL expiration', () => {
      const expensiveFn = sinon.spy((x) => x * 2);
      const memoizedFn = memoize(expensiveFn, { ttl: 100 });

      memoizedFn(5);
      expect(expensiveFn.calledOnce).to.be.true;

      clock.tick(150);
      memoizedFn(5);
      expect(expensiveFn.calledTwice).to.be.true;
    });

    it('should handle async functions', async () => {
      const asyncFn = sinon.spy(async (x) => x * 2);
      const memoizedFn = memoize(asyncFn, { ttl: 1000 });

      const result1 = await memoizedFn(5);
      const result2 = await memoizedFn(5);

      expect(result1).to.equal(10);
      expect(result2).to.equal(10);
      expect(asyncFn.calledOnce).to.be.true;
    });

    it('should validate input parameters', () => {
      expect(() => memoize('not a function')).to.throw('cb must be a function');
      expect(() => memoize(() => {}, { ttl: 0 })).to.throw('ttl must be greater than 0');
      expect(() => memoize(() => {}, { ttl: -1 })).to.throw('ttl must be greater than 0');
    });

    it('should work without TTL', () => {
      const expensiveFn = sinon.spy((x) => x * 2);
      const memoizedFn = memoize(expensiveFn);

      memoizedFn(5);
      memoizedFn(5);

      expect(expensiveFn.calledOnce).to.be.true;
    });
  });
});
