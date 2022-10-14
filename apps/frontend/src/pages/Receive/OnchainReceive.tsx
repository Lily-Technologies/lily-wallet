import React, { useContext, useState } from 'react';
import { QRCode } from 'react-qr-svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import { ClipboardCheckIcon, DuplicateIcon, TagIcon } from '@heroicons/react/outline';

import { Select, Input } from 'src/components';
import { TagsSection } from 'src/pages/Vault/Settings/Addresses/TagsSection';

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
  const [copied, setCopied] = useState(false);
  const { unusedAddresses } = currentAccount;

  const onCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  const getNewAddress = () => {
    setCopied(false);
    if (unusedAddressIndex < 9) {
      setUnusedAddressIndex(unusedAddressIndex + 1);
    } else {
      setUnusedAddressIndex(0);
    }
  };

  return (
    <div className='bg-white dark:bg-gray-800 rounded-md shadow dark:highlight-white/10'>
      <div className='py-6 px-4 sm:py-8 sm:px-6 ' data-cy='send-form'>
        <div className='grid grid-cols-4 gap-6'>
          <div className='col-span-4'>
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
          <div className='col-span-4'>
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
          <div className='col-span-4 row-span-4'>
            <div className='flex justify-between mb-1'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-200'>
                Scan QR code
              </label>
            </div>
            <div className='flex flex-col bg-gray-50 dark:bg-gray-700 px-3 py-4 border border-gray-200 dark:border-gray-900 rounded-md items-center'>
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
          <div className='col-span-4'>
            <TagsSection address={unusedAddresses[unusedAddressIndex]} />
          </div>
        </div>
      </div>
      <div className='text-right py-4 px-5 mt-2 border bg-gray-50 dark:bg-gray-700 dark:border-gray-900 rounded-bl-md rounded-br-md'>
        <button
          className='bg-white mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2  focus:ring-sky-500'
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
          onCopy={() => onCopy()}
        >
          <button className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2  focus:ring-green-500'>
            Copy address
            {copied ? (
              <ClipboardCheckIcon className='ml-1.5 h-4 w-4' />
            ) : (
              <DuplicateIcon className='ml-1.5 h-4 w-4' />
            )}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default requireOnchain(OnchainReceive);
