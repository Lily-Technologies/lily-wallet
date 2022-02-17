import React from 'react';
import moment from 'moment';
import { satoshisToBitcoins } from 'unchained-bitcoin';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { LightningEvent } from '@lily/types';

import { getFriendlyType } from 'src/pages/Lightning/utils';

interface Props {
  event: LightningEvent;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LightningDetailsSlideover = ({ event, setOpen }: Props) => {
  return (
    <>
      <div className='px-4 py-6 sm:px-6 bg-green-600'>
        <div className='flex items-start justify-between space-x-3'>
          <div className='space-y-1 truncate'>
            <Dialog.Title className='text-lg font-medium text-white'>{event.title}</Dialog.Title>
            <p className='text-sm text-green-300 truncate'>{getFriendlyType(event.type)}</p>
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
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Date</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
              {moment.unix(Number(event.creationDate)).format('MMMM DD, YYYY')} at{' '}
              {moment.unix(Number(event.creationDate)).format('h:mma')}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Value</dt>
            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
              {Number(event.valueSat).toLocaleString()} sats
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
};

export default LightningDetailsSlideover;
