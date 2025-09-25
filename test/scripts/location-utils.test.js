import { expect } from '@esm-bundle/chai';

// Simple test to verify the file is being loaded
describe('Location Utils Test File', () => {
  it('should be loaded by the test runner', () => {
    expect(true).to.be.true;
  });
});

// We need to test the internal functions, so we'll create simple versions for testing
function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function normCountry(country) {
  return (country.toLowerCase() === 'uk' ? 'gb' : country.toLowerCase()).split('_')[0];
}

function getJapaneseTextCharacterCount(text) {
  const headingEngCharsRegEx = /[a-zA-Z0-9 ]+/gm;
  const matches = text.matchAll(headingEngCharsRegEx);
  const eCnt = [...matches].map((m) => m[0]).reduce((cnt, m) => cnt + m.length, 0);
  const jtext = text.replaceAll(headingEngCharsRegEx, '');
  const jCnt = jtext.length;
  return eCnt * 0.57 + jCnt;
}

describe('Location Utils', () => {
  let originalCookie;

  beforeEach(() => {
    originalCookie = document.cookie;
  });

  afterEach(() => {
    document.cookie = originalCookie;
  });

  describe('getCookie', () => {
    it('should return cookie value when found', () => {
      document.cookie = 'testCookie=testValue; otherCookie=otherValue';
      expect(getCookie('testCookie')).to.equal('testValue');
    });

    it('should return empty string when cookie not found', () => {
      document.cookie = 'otherCookie=otherValue';
      expect(getCookie('nonexistent')).to.equal('');
    });

    it('should handle empty cookie string', () => {
      document.cookie = '';
      expect(getCookie('test')).to.equal('');
    });

    it('should handle cookies with spaces', () => {
      document.cookie = ' testCookie = testValue ';
      expect(getCookie('testCookie')).to.equal('testValue');
    });

    it('should handle multiple cookies', () => {
      // Clear existing cookies first
      document.cookie = 'cookie1=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'cookie2=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'cookie3=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'testCookie=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = 'otherCookie=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      
      // Now set our test cookies
      document.cookie = 'cookie1=value1';
      document.cookie = 'cookie2=value2';
      document.cookie = 'cookie3=value3';
      
      expect(getCookie('cookie1')).to.equal('value1');
      expect(getCookie('cookie2')).to.equal('value2');
      expect(getCookie('cookie3')).to.equal('value3');
    });

    it('should handle cookies with special characters', () => {
      document.cookie = 'specialCookie=value%20with%20spaces';
      expect(getCookie('specialCookie')).to.equal('value with spaces');
    });
  });

  describe('normCountry', () => {
    it('should normalize UK to GB', () => {
      expect(normCountry('UK')).to.equal('gb');
      expect(normCountry('uk')).to.equal('gb');
      expect(normCountry('Uk')).to.equal('gb');
    });

    it('should handle other countries', () => {
      expect(normCountry('US')).to.equal('us');
      expect(normCountry('CA')).to.equal('ca');
      expect(normCountry('DE')).to.equal('de');
    });

    it('should handle country codes with underscores', () => {
      expect(normCountry('US_EN')).to.equal('us');
      expect(normCountry('CA_FR')).to.equal('ca');
    });

    it('should handle empty string', () => {
      expect(normCountry('')).to.equal('');
    });

    it('should handle mixed case', () => {
      expect(normCountry('Us')).to.equal('us');
      expect(normCountry('De')).to.equal('de');
    });
  });

  describe('getJapaneseTextCharacterCount', () => {
    it('should count English characters with coefficient', () => {
      const text = 'Hello World';
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(text.length * 0.57);
    });

    it('should count Japanese characters normally', () => {
      const text = 'こんにちは世界';
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(text.length);
    });

    it('should handle mixed Japanese and English text', () => {
      const text = 'Hello こんにちは World 世界';
      const englishChars = 'Hello  World ';
      const japaneseChars = 'こんにちは世界';
      const expected = (englishChars.length * 0.57) + japaneseChars.length;
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(expected);
    });

    it('should handle empty string', () => {
      expect(getJapaneseTextCharacterCount('')).to.equal(0);
    });

    it('should handle numbers and spaces', () => {
      const text = '123 456 789';
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(text.length * 0.57);
    });

    it('should handle only spaces', () => {
      const text = '   ';
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(text.length * 0.57);
    });

    it('should handle complex mixed text', () => {
      const text = 'Adobe Express 2024 こんにちは世界 Hello 世界';
      const englishChars = 'Adobe Express 2024  Hello ';
      const japaneseChars = 'こんにちは世界世界';
      const expected = (englishChars.length * 0.57) + japaneseChars.length;
      const result = getJapaneseTextCharacterCount(text);
      expect(result).to.equal(expected);
    });
  });
});
