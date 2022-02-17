/* global cy */

import { Lightning, Multisig } from '../../../src/__tests__/fixtures';
import { CloseStatusUpdate, OpenStatusUpdate } from '@lily-technologies/lnrpc';
import { DecoratedOpenStatusUpdate } from '@lily/types';

describe('Lightning - General', () => {
  beforeEach(() => {
    cy.login();
  });

  it('can open a new channel', () => {
    cy.window().then((win) => {
      let openChannelSender;
      win.ipcRenderer.on
        .withArgs('/open-channel')
        .callsFake((args, args1) => {
          setTimeout(() => {
            const openChannelResponse = {
              pendingChanId: null, // Buffer
              psbtFund: {
                fundingAddress: 'bc1qc4cmn6jmj5vv4xgwxuvyze2hl5fn8qzx4lma8pvk3y8ckfprxntqmvjlzk',
                fundingAmount: 3000000,
                psbt: null // Buffer
              },
              alias: 'Satoshi',
              color: '#000000'
            } as DecoratedOpenStatusUpdate;
            openChannelSender = args1;
            args1(undefined, openChannelResponse);
          }, 25);
        })
        .as('/open-channel');

      win.ipcRenderer.send
        .withArgs('/open-channel-finalize')
        .callsFake((args, args1) => {
          setTimeout(() => {
            const openChannelResponse = {
              // should be some other data here too
              chanPending: {
                txid: 'abc123'
              }
            } as OpenStatusUpdate;
            openChannelSender(undefined, openChannelResponse);
          }, 25);
        })
        .as('/open-channel-finalize');

      win.ipcRenderer.invoke
        .withArgs('/enumerate')
        .returns(
          Multisig.config.extendedPublicKeys.map((xpub) => ({
            type: xpub.device.type,
            model: xpub.device.model,
            fingerprint: xpub.device.fingerprint,
            path: '/path/to/device',
            needs_pin_sent: false,
            needs_passphrase_sent: false
          }))
        )
        .as('Enumerate');

      win.ipcRenderer.invoke
        .withArgs('/sign')
        .onFirstCall() // 9130C3D6
        .returns({
          psbt: 'cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEBAwQBAAAAAQVpUiECRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiughA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1IQPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHFOuIgYCRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiugckTDD1jAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA0NxfoWkAzUozzgIgrDs1LLuLvYRvWuLYdBXct7EJWw1HE9g0ckwAACAAAAAgAAAAIACAACAAQAAAAoAAAAiBgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHBw07PVrMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAAAAA'
        })
        .onSecondCall() // 34ECF56B
        .returns({
          psbt: 'cHNidP8BAH0CAAAAAQ2TStnBH5u/iTk5xv98qxWZadGS0i/97tIIxeDwfBcoAQAAAAD/////AtNDAAAAAAAAFgAUp2dcS0+/hi7LgyO6yFoeqwnbLMZFJpsBAAAAACIAIMyktQU7EaEHB8Qu6aykDKLllXjZQm0GNjN5TDyn6DOYAAAAAAABAP18AQIAAAAAAQFptos1cfAZXh7lgoG0gQbrQv7RSJQjQfjRwZfMhvNXjgEAAAAA/////wJAQg8AAAAAABYAFEiPunaIZQ0xQrV+hXLRCG004H7nrGubAQAAAAAiACCRBaErtE0tb5gzvt79B86RMuE9wTUH6b5Ipou4c+fzLwQARzBEAiB566e0uYa+6NnqgQf0cxkmVjb99CTqOSK/1Ij7uXfreAIgeKlJDGZ5yCDHX3bRCVtuoVVD9YSvlnPJXJ/qe0a304sBSDBFAiEA76lo/eVDlEXEzd/gvjfAlPGUJijf2ou/Jxm0+tL+79QCIDdhJxKAwStadf6FCo4eXjviLpeDiUwMKUo83FOaToS5AWlSIQI8iTmwMm72ofNVf8/CKDuPAYKRLBoRUbmBnpXHU9EW6yECW9CchUma+N0T1WJh9waL1m26imDKYS7xcsfiOnrgUg4hAqkUV2RC5cMEAMbKUhK/KSqSJPDA+kB3XZ+w1R9SR/PhU64AAAAAIgICRpMbbXGpvXkhEbR3nSAvq7kfmedih+hs+oDLjurSiuhHMEQCICE8CH/F7s5FnOf83xj+yJex/aOyy2dolfC+1cDnWGCZAiA0AZZcDlhEoWIvAAfOiDFEs5dWAX21WDqSgTEzJfDwiQEiAgPLcoiNPJiJpZBmLOChzVXwG2h2LHyezoE7/0tH2nOoHEcwRAIgSpgH4HVOlS8WtVWZ5n+p1hSVxHl5S4vIQIW+O0725o4CIHJUEohJwX9MdDWS0V5y2OUa50FyT2msq4GdeTOk01/fAQEDBAEAAAABBWlSIQJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6CEDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUhA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcU64iBgJGkxttcam9eSERtHedIC+ruR+Z52KH6Gz6gMuO6tKK6ByRMMPWMAAAgAAAAIAAAACAAgAAgAEAAAAKAAAAIgYDQ3F+haQDNSjPOAiCsOzUsu4u9hG9a4th0Fdy3sQlbDUcT2DRyTAAAIAAAACAAAAAgAIAAIABAAAACgAAACIGA8tyiI08mImlkGYs4KHNVfAbaHYsfJ7OgTv/S0fac6gcHDTs9WswAACAAAAAgAAAAIACAACAAQAAAAoAAAAAAAA='
        })
        .as('sign response');
    });

    cy.intercept('POST', 'https://blockstream.info/api/tx', (req) => {
      req.reply('abc123');
    });

    cy.get('[data-cy=nav-item]').contains(Lightning.config.name).click();
    cy.get('[data-cy=settings]').click();
    cy.contains('Channels').click();
    cy.contains('Open new channel').click();

    cy.get('[data-cy=lightning-address]').within(() => {
      cy.get("input[type='text']").type(
        '03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a@104.196.249.140:9735'
      );
    });

    cy.get('[data-cy=channel-amount').within(() => {
      cy.get("input[type='text']").type('3000000');
    });

    cy.get('[data-cy=funding-account').within(() => {
      cy.get('button').click();
      cy.contains(Multisig.config.name).click();
    });

    cy.contains('Create funding transaction').click();

    cy.contains(Multisig.config.extendedPublicKeys[0].parentFingerprint).click();

    cy.contains(Multisig.config.extendedPublicKeys[1].parentFingerprint).click();

    cy.contains('Broadcast Transaction').click();

    cy.contains('New channel opened').should('exist');
  });

  it('can close an existing channel', () => {
    cy.window().then((win) => {
      win.ipcRenderer.on
        .withArgs('/close-channel')
        .callsFake((args, args1) => {
          setTimeout(() => {
            const closeChannelResponse = {
              chanClose: {
                closingTxid: 'dafafdf',
                success: true
              }
            } as CloseStatusUpdate;
            args1(undefined, closeChannelResponse);
          }, 25);
        })
        .as('/close-channel');
    });

    cy.get('[data-cy=nav-item]').contains(Lightning.config.name).click();
    cy.get('[data-cy=settings]').click();
    cy.contains('Channels').click();
    cy.contains(Lightning.channels[0].alias).click();

    cy.contains('Close channel').click();

    cy.get('[data-cy=funding-account').within(() => {
      cy.get('button').click();
      cy.contains(Multisig.config.name).click();
    });

    cy.contains('Close channel').click();
  });

  it('shows an error if closing existing channel fails', () => {
    cy.window().then((win) => {
      win.ipcRenderer.on
        .withArgs('/close-channel')
        .callsFake((args, args1) => {
          setTimeout(() => {
            const closeChannelResponse = {
              chanClose: {
                closingTxid: 'dafafdf',
                success: false
              }
            } as CloseStatusUpdate;
            args1(undefined, closeChannelResponse);
          }, 25);
        })
        .as('/close-channel');
    });

    cy.get('[data-cy=nav-item]').contains(Lightning.config.name).click();
    cy.get('[data-cy=settings]').click();
    cy.contains('Channels').click();
    cy.contains(Lightning.channels[0].alias).click();

    cy.contains('Close channel').click();

    cy.get('[data-cy=funding-account').within(() => {
      cy.get('button').click();
      cy.contains(Multisig.config.name).click();
    });

    cy.contains('Close channel').click();
  });
});
