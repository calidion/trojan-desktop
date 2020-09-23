import { expect } from 'chai';
import { SpectronClient } from 'spectron';

import commonSetup from './common-setup';

describe('angular-electron App', function () {
  commonSetup.apply(this);

  let browser: any;
  let client: SpectronClient;

  beforeEach(function () {
    client = this.app.client;
    browser = client as any;
  });

  it('should display title !', async function () {
    const text = await browser.getText('app-home h1');
    console.log(text);
    expect(text).to.include("Trojan代理客户端");
  });

  it('creates initial windows', async function () {
    const count = await client.getWindowCount();
    expect(count).to.equal(1);
  });

});
