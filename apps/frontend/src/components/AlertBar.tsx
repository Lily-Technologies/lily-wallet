import React, { useContext, useRef, useEffect } from 'react';
import { blockExplorerTransactionURL } from 'unchained-bitcoin';
import { useHistory } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/outline';

import { AccountMapContext, ConfigContext, PlatformContext } from 'src/context';

import { getLicenseBannerMessage, licenseTxId } from 'src/utils/license';
import { getUnchainedNetworkFromBjslibNetwork } from 'src/utils/files';

import { VaultConfig } from '@lily/types';

export const AlertBar = React.memo(() => {
  const { config, nodeConfig, currentBitcoinNetwork } = useContext(ConfigContext);
  const { platform } = useContext(PlatformContext);
  const { setCurrentAccountId } = useContext(AccountMapContext);
  const history = useHistory();

  let licenseBannerMessage = useRef({ message: '', promptBuy: false });
  let licenseBannerAccount = useRef({} as VaultConfig);

  useEffect(() => {
    async function checkLicenseTxConfirmed() {
      let licenseTxConfirmed = false;
      if (nodeConfig) {
        config.vaults.forEach(async (vault) => {
          try {
            const txId = licenseTxId(vault.license);
            if (txId) {
              licenseTxConfirmed = await platform.isConfirmedTransaction(txId);
            }
          } catch (e) {
            licenseTxConfirmed = false;
            console.log('AlertBar: Error retriving license transaction');
          }
          licenseBannerMessage.current = getLicenseBannerMessage(
            vault,
            licenseTxConfirmed,
            nodeConfig
          );
          licenseBannerAccount.current = vault;
        });
      }
    }
    checkLicenseTxConfirmed();
  }, [config, nodeConfig, platform]);

  if (licenseBannerMessage.current.message) {
    return (
      <div className='bg-green-600 z-10 md:ml-64'>
        <div className='max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between flex-wrap'>
            <div className='w-full sm:w-0 flex-1 flex items-center'>
              <span className='flex p-2 rounded-lg bg-green-800'>
                <BellIcon className='h-6 w-6 text-white' aria-hidden='true' />
              </span>
              <p className='ml-3 font-medium text-white truncate'>
                {/* TODO: change later */}
                <span className='md:hidden'>Upgrade your account!</span>
                <span className='hidden md:inline'>{licenseBannerMessage.current.message}</span>
              </p>
            </div>
            <div className='mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto'>
              {licenseBannerMessage.current.promptBuy ? (
                <a
                  onClick={() => {
                    setCurrentAccountId(licenseBannerAccount.current.id);
                    history.push(`/vault/${licenseBannerAccount.current.id}/purchase`);
                  }}
                  className='cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50'
                >
                  Upgrade
                </a>
              ) : (
                <a
                  href={blockExplorerTransactionURL(
                    licenseTxId(licenseBannerAccount.current.license) as string,
                    getUnchainedNetworkFromBjslibNetwork(currentBitcoinNetwork)
                  )}
                  target='_blank'
                  className='flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-white hover:bg-green-50'
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
});
