import React from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { TagsSection } from './TagsSection';

import { Address } from '@lily/types';

interface Props {
  address: Address;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressDetailsSlideover = ({ address, setOpen }: Props) => {
  return (
    <>
      <div className='px-4 py-6 sm:px-6 bg-green-600'>
        <div className='flex items-start justify-between space-x-3'>
          <div className='space-y-1 truncate'>
            <Dialog.Title className='text-lg font-medium text-white'>Address details</Dialog.Title>
            <p className='text-sm text-green-300 truncate'>{address.address}</p>
          </div>
          <div className='h-7 flex items-center'>
            <button
              type='button'
              className='text-white hover:text-gray-200'
              onClick={() => setOpen(false)}
            >
              <span className='sr-only'>Close panel</span>
              <XIcon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <div className='px-4 pt-5 pb-5 sm:px-0 sm:pt-6'>
        <dl className='space-y-8 px-4 sm:px-6 sm:space-y-6'>
          <div>
            <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
              Address
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.address}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
              Derivation path
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.bip32derivation[0].path}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
              Type
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.isChange ? 'Change' : 'External'}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
              Status
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>Used</dd>
          </div>

          <TagsSection address={address.address} />
        </dl>
      </div>
    </>
  );
};

export default AddressDetailsSlideover;
