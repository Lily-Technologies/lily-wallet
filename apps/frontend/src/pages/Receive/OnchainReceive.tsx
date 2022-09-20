import React, { useContext, useState } from 'react';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Select, Input } from 'src/components';

import { black } from 'src/utils/colors';

import { requireOnchain } from 'src/hocs';
import { LilyOnchainAccount } from '@lily/types';
import { AccountMapContext } from 'src/context';

interface Props {
  currentAccount: LilyOnchainAccount;
}

export const OnchainReceive = ({ currentAccount }: Props) => {
  const { accountMap, setCurrentAccountId } = useContext(AccountMapContext);
  const [unusedAddressIndex, setUnusedAddressIndex] = useState(0);
  const { unusedAddresses } = currentAccount;

  const getNewAddress = () => {
    if (unusedAddressIndex < 9) {
      setUnusedAddressIndex(unusedAddressIndex + 1);
    } else {
      setUnusedAddressIndex(0);
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-2xl shadow dark:highlight-white/10'>
      <div className='py-6 px-4 sm:py-8 sm:px-6 ' data-cy='send-form'>
        <div className='grid grid-cols-4 gap-6 xl:grid-rows-3'>
          <div className='col-span-4 xl:col-span-2'>
            <Select
              label='To this account'
              initialSelection={{
                label: currentAccount.config.name,
                onClick: () => setCurrentAccountId(currentAccount.config.id)
              }}
              options={Object.values(accountMap).map((item) => {
                return {
                  label: item.name,
                  onClick: () => {
                    setCurrentAccountId(item.config.id);
                  }
                };
              })}
            />
          </div>
          <div className='col-span-4 xl:col-span-2 row-span-4 order-3 xl:order-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1'>
              Scan QR code
            </label>
            <div className='flex flex-col bg-gray-50 dark:bg-gray-700 px-3 py-4 border border-gray-200 dark:border-gray-900 rounded-2xl items-center'>
              <QRCode
                className='bg-white dark:bg-gray-50'
                bgColor='transparent'
                fgColor={black}
                level='Q'
                style={{ width: 192 }}
                value={
                  unusedAddresses[unusedAddressIndex]
                    ? unusedAddresses[unusedAddressIndex].address
                    : 'Loading...'
                }
              />
            </div>
          </div>
          <div className='col-span-4 xl:col-span-2 order-2 xl:order-3'>
            <Input
              readOnly={true}
              type='text'
              onChange={() => {}}
              label='Recieve address'
              value={
                unusedAddresses[unusedAddressIndex]
                  ? unusedAddresses[unusedAddressIndex].address
                  : 'Loading...'
              }
            />
          </div>
        </div>
      </div>
      <div className='text-right py-4 px-5 mt-2 border bg-gray-50 dark:bg-gray-700 dark:border-gray-900 rounded-bl-2xl rounded-br-2xl'>
        <button
          className='bg-white mr-3 py-2 px-4 border border-gray-300 rounded-2xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-sky-500'
          onClick={() => getNewAddress()}
        >
          New address
        </button>
        <CopyToClipboard
          text={
            unusedAddresses[unusedAddressIndex]
              ? unusedAddresses[unusedAddressIndex].address
              : 'Loading...'
          }
        >
          <button className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'>
            Copy Address
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default requireOnchain(OnchainReceive);
