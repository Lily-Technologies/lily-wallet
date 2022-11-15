import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ExternalLinkIcon } from '@heroicons/react/outline';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { getLicenseBannerMessage, licenseTxId } from 'src/utils/license';

import { OnChainConfig, VaultConfig } from '@lily/types';

interface Props {
  config: OnChainConfig;
}

export const AlertBar = ({ config }: Props) => {
  const { nodeConfig, currentBitcoinNetwork } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const history = useHistory();

  const [showBuyButton, setShowBuyButton] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');

  useEffect(() => {
    async function checkLicenseTxConfirmed() {
      if ((config as VaultConfig).license) {
        let licenseTxConfirmed = false;
        if (nodeConfig) {
          try {
            const txId = licenseTxId((config as VaultConfig).license);
            if (txId) {
              licenseTxConfirmed = await platform.isConfirmedTransaction(txId);
            }
          } catch (e) {
            licenseTxConfirmed = false;
            console.log('AlertBar: Error retrieving license transaction');
          }
          const { message, promptBuy } = getLicenseBannerMessage(
            config as VaultConfig,
            licenseTxConfirmed,
            nodeConfig
          );

          setShowBuyButton(promptBuy);
          setBuyMessage(message);
        }
      }
    }
    checkLicenseTxConfirmed();
  }, [config, nodeConfig, platform]);

  if (buyMessage && !!(config as VaultConfig).license) {
    return (
      <div className='relative bg-yellow-100 z-10 rounded-2xl py-6 my-6 shadow border border-yellow-600/20'>
        <div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap'>
            <h3 className='font-medium text-yellow-800 truncate'>
              Thank you for using Lily Wallet!
            </h3>
            <p className='font-base text-yellow-800 truncate'>{buyMessage}</p>
            <div className='mt-4'>
              <div className='-mx-2 -my-1.5 flex space-x-2'>
                {showBuyButton ? (
                  <button
                    onClick={() => {
                      setCurrentAccountId(config.id);
                      history.push(`/vault/${config.id}/purchase`);
                    }}
                    className='cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50'
                  >
                    Purchase a license
                  </button>
                ) : null}

                <a
                  href='https://docs.lily-wallet.com/license'
                  target='_blank'
                  type='button'
                  className='flex items-center flex-nowrap rounded-md bg-yellow-100 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50'
                >
                  What is this?
                  <ExternalLinkIcon className='ml-1 w-3- h-3' />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
