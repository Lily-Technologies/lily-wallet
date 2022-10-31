import React from 'react';
import { Transition } from '@headlessui/react';

import AddOwnerDetailsForm from 'src/pages/Setup/Review/AddOwnerDetailsForm';

import { ExtendedPublicKey } from '@lily/types';

interface Props {
  extendedPublicKey: ExtendedPublicKey;
  showEditOwnerForm: boolean;
  setShowEditOwnerForm: (show: boolean) => void;
  showOwnerInfo: boolean;
  setShowOwnerInfo: (show: boolean) => void;
  onSave: (extendedPublicKey: ExtendedPublicKey) => void;
}

const OwnerInformation = ({
  extendedPublicKey,
  showEditOwnerForm,
  setShowEditOwnerForm,
  showOwnerInfo,
  setShowOwnerInfo,
  onSave
}: Props) => {
  return (
    <div className='mt-6'>
      <Transition
        show={showEditOwnerForm}
        enter='transform transition-all duration-100 ease-in-out'
        enterFrom='translate-x-1/4 opacity-0'
        enterTo='translate-x-0 opacity-100'
        leave='transform transition-all duration-100 ease-in-out'
        leaveFrom='translate-x-0 opacity-100'
        leaveTo='translate-x-1/4 opacity-0'
        afterLeave={() => setShowOwnerInfo(true)}
      >
        <AddOwnerDetailsForm
          onSave={onSave}
          onCancel={() => setShowEditOwnerForm(false)}
          extendedPublicKey={extendedPublicKey}
        />
      </Transition>
      <Transition
        show={showOwnerInfo}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-50'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
        afterLeave={() => setShowEditOwnerForm(true)}
      >
        <>
          <h3 className='font-medium text-gray-900 dark:text-slate-200'>Owner information</h3>
          <ul role='list' className='mt-2'>
            <li className='flex items-center justify-between py-3'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 p-1 bg-gray-100 dark:bg-slate-700 dark:text-slate-400 rounded-full'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  stroke-width='2'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
                <div className='ml-4 truncate'>
                  <p className='text-sm font-medium text-gray-900 dark:text-slate-300'>
                    {extendedPublicKey.device.owner?.name || 'Not set'}
                  </p>
                  <p className='text-sm text-gray-500 dark:text-slate-400'>
                    {extendedPublicKey.device.owner?.email}
                  </p>
                </div>
              </div>
              <button
                type='button'
                className='ml-6 py-1 px-2 rounded-md bg-white dark:bg-slate-800 text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                onClick={() => setShowOwnerInfo(false)}
              >
                Edit<span className='sr-only'>{extendedPublicKey.device.owner?.name}</span>
              </button>
            </li>
          </ul>
        </>
      </Transition>
    </div>
  );
};

export default OwnerInformation;
