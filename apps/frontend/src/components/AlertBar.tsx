import React, { useContext, useState, useEffect } from 'react';
import { blockExplorerTransactionURL } from 'unchained-bitcoin';
import { useHistory } from 'react-router-dom';
import { ExclamationIcon } from '@heroicons/react/outline';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { getLicenseBannerMessage, licenseTxId } from 'src/utils/license';
import { getUnchainedNetworkFromBjslibNetwork } from 'src/utils/files';

import { OnChainConfig, VaultConfig } from '@lily/types';

interface Props {
  accountConfig: OnChainConfig;
}

export const AlertBar = ({ accountConfig }: Props) => {
  const { config, nodeConfig, currentBitcoinNetwork } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const history = useHistory();

  const [showBuyButton, setShowBuyButton] = useState(false);
  const [buyMessage, setBuyMessage] = useState('');

  useEffect(() => {
    async function checkLicenseTxConfirmed() {
      if ((accountConfig as VaultConfig).license) {
        let licenseTxConfirmed = false;
        if (nodeConfig) {
          try {
            const txId = licenseTxId((accountConfig as VaultConfig).license);
            if (txId) {
              licenseTxConfirmed = await platform.isConfirmedTransaction(txId);
            }
          } catch (e) {
            licenseTxConfirmed = false;
            console.log('AlertBar: Error retrieving license transaction');
          }
          const { message, promptBuy } = getLicenseBannerMessage(
            accountConfig as VaultConfig,
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

  if (buyMessage && !!(accountConfig as VaultConfig).license) {
    return (
      <div className='bg-yellow-100 z-10 rounded-2xl py-6 my-6 shadow border border-yellow-600/20'>
        <div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap'>
            <div className='w-full sm:w-0 flex-1 flex items-center'>
              <span className='flex p-2 rounded-lg bg-yellow-300'>
                <ExclamationIcon className='h-6 w-6 text-yellow-800' aria-hidden='true' />
              </span>
              <p className='ml-3 font-medium text-yellow-800 truncate'>
                {/* TODO: change later */}
                <span className='md:hidden'>Upgrade your account!</span>
                <span className='hidden md:inline'>{buyMessage}</span>
              </p>
            </div>
            <div className='mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto'>
              {showBuyButton ? (
                <a
                  onClick={() => {
                    setCurrentAccountId(accountConfig.id);
                    history.push(`/vault/${accountConfig.id}/purchase`);
                  }}
                  className='cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50'
                >
                  Upgrade
                </a>
              ) : (
                <a
                  href={blockExplorerTransactionURL(
                    licenseTxId((accountConfig as VaultConfig).license)!,
                    getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
                  )}
                  target='_blank'
                  className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50'
                >
                  View Transaction
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
