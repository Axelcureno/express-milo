import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { mockRes } from '../blocks/test-utilities.js';
import { fetchPlanOnePlans, getCurrency } from '../../express/code/scripts/utils/pricing.js';

// Prevent app bootstrap during tests
window.isTestEnv = true;

const imports = await Promise.all([import('../../express/code/scripts/utils.js'), import('../../express/code/scripts/scripts.js')]);
const [{ getLibs }] = imports;

const originalFetch = window.fetch;

describe('Pricing offer format for segmentation link', () => {
  afterEach(() => {
    window.fetch = originalFetch;
    sessionStorage.removeItem('visitorCountry');
  });
  it('handles US IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });
    window.fetch = sinon.stub();
    window.fetch.onFirstCall().returns(mockRes({
      payload: {
        country: 'US',
        state: 'CA',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    }));
    window.fetch.onSecondCall().returns(mockRes({
      payload: {
        data: {
          find: () => {},
        },
      },
    }));
    const res = await fetchPlanOnePlans('https://commerce-stg.adobe.com/store/segmentation?cli=cc_express&pa=PA-55&ot=trial&us');
    expect(res.country).to.equal('us');
    expect(res.language).to.equal('en');
  });
});

describe('Pricing offer format for DE segmentation link', () => {
  afterEach(() => {
    window.fetch = originalFetch;
    sessionStorage.removeItem('visitorCountry');
  });
  it('handles DE IP', async () => {
    await import(`${getLibs()}/utils/utils.js`).then((mod) => {
      const conf = { locales: { '': { ietf: 'de-DE', tk: 'hah7vzn.css' } } };
      mod.setConfig(conf);
    });
    window.fetch = sinon.stub();
    window.fetch.onFirstCall().returns(mockRes({
      payload: {
        country: 'DE',
        state: 'BE',
        'Accept-Language': 'de-DE,en;q=0.9',
      },
    }));
    window.fetch.onSecondCall().returns(mockRes({
      payload: {
        data: {
          find: () => {},
        },
      },
    }));
    const res = await fetchPlanOnePlans('https://commerce-stg.adobe.com/store/segmentation?cli=cc_express&co=us&lang=en&pa=PA-55&ot=trial&svar=express_M2M');
    expect(res.country).to.equal('de');
    expect(res.language).to.equal('de');
  });
});

describe('getCurrency', () => {
  it('should return correct currency for known countries', () => {
    expect(getCurrency('us')).to.equal('USD');
    expect(getCurrency('gb')).to.equal('GBP');
    expect(getCurrency('uk')).to.equal('GBP');
    expect(getCurrency('de')).to.equal('EUR');
    expect(getCurrency('fr')).to.equal('EUR');
    expect(getCurrency('ca')).to.equal('CAD');
    expect(getCurrency('au')).to.equal('AUD');
    expect(getCurrency('jp')).to.equal('JPY');
  });

  it('should return undefined for unknown countries', () => {
    expect(getCurrency('unknown')).to.be.undefined;
    expect(getCurrency('xyz')).to.be.undefined;
    expect(getCurrency('')).to.be.undefined;
  });

  it('should handle case variations', () => {
    expect(getCurrency('us')).to.equal('USD');
    expect(getCurrency('de')).to.equal('EUR');
    expect(getCurrency('gb')).to.equal('GBP');
  });

  it('should handle special cases', () => {
    expect(getCurrency('cr')).to.equal('USD'); // Costa Rica uses USD
    expect(getCurrency('ec')).to.equal('USD'); // Ecuador uses USD
    expect(getCurrency('gt')).to.equal('USD'); // Guatemala uses USD
  });
});
