import React, { Ref } from 'react';
import { ExclamationIcon, ExternalLinkIcon, BeakerIcon } from '@heroicons/react/outline';

interface Props {}

const NoDevicesEmptyState = React.forwardRef<HTMLButtonElement>((props, ref) => {
  console.log('refyy: ', ref);
  return (
    <div className='flex items-center justify-center py-12'>
      <div className='flex flex-col items-center justify-center text-center'>
        <h3 className='text-lg font-medium text-slate-900 dark:text-slate-300'>
          No devices detected
        </h3>
        <ExclamationIcon className='text-slate-600 dark:text-slate-400 my-4 h-12 w-12' />
        <p className='text-base font-medium text-slate-900 dark:text-slate-300'>
          Please make sure your device is connected and unlocked.
        </p>

        <button
          onClick={() => (ref as React.RefObject<HTMLButtonElement>)?.current?.click()}
          className='mt-6 w-max text-sm px-2 text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 flex items-center rounded-md focus:ring-1 focus:ring-green-600 dark:focus:ring-green-500 outline-none'
        >
          <BeakerIcon className='mr-2 w-4 h-4' />I want to add devices using a different method
        </button>

        <a
          href='https://lily-wallet.com/support'
          target='_blank'
          className='mt-2 w-max text-sm px-2 text-yellow-600 hover:text-yellow-700 dark:text-yellow-500 dark:hover:text-yellow-400 flex items-center rounded-md focus:ring-1 focus:ring-yellow-600 dark:focus:ring-yellow-500 outline-none'
        >
          I am stuck and need assistance
          <ExternalLinkIcon className='ml-2 w-4 h-4' />
        </a>
      </div>
    </div>
  );
});

export default NoDevicesEmptyState;
