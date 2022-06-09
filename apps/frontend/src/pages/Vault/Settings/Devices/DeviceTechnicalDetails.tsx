import React, { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';

import { ExtendedPublicKey } from '@lily/types';

interface Props {
  extendedPublicKey: ExtendedPublicKey;
  isHidden: boolean;
}

const DeviceTechnicalDetails = ({ extendedPublicKey, isHidden }: Props) => {
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  return (
    <Transition
      show={!isHidden}
      enter='transition ease-out duration-100'
      enterFrom='transform opacity-0 scale-95'
      enterTo='transform opacity-100 scale-100'
      leave='transition ease-in duration-75'
      leaveFrom='transform opacity-100 scale-100'
      leaveTo='transform opacity-0 scale-95'
    >
      <div className='pt-5 pb-5 sm:px-0 sm:pt-0'>
        <div className='flex items-center justify-between'>
          <h3 className='font-medium text-gray-900'>Technical information</h3>
          <button
            type='button'
            className='ml-6 rounded-md bg-white text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
          >
            {showTechnicalDetails ? 'Hide' : 'View'}
          </button>
        </div>
        <div className='overflow-hidden'>
          <Transition
            show={showTechnicalDetails}
            as={Fragment}
            enter='transform transition-all duration-300 ease-in-out'
            enterFrom='transform opacity-0 -translate-y-full'
            enterTo='transform opacity-100 scale-100 translate-y-0'
            leave='transition ease-in duration-200'
            leaveFrom='transform opacity-100 scale-100 translate-y-0'
            leaveTo='transform opacity-0 scale-95 -translate-y-full'
          >
            <div className='mt-2 divide-y divide-gray-200 border-t border-b border-gray-200'>
              <div className='flex flex-col py-5'>
                <dt className='text-sm font-medium text-gray-500 sm:flex-shrink-0'>
                  Extended Public Key (xpub)
                </dt>
                <dd className='mt-1 text-sm text-gray-900'>
                  <p className='break-all font-medium'>{extendedPublicKey.xpub}</p>
                </dd>
              </div>
              <div className='flex justify-between font-medium py-5'>
                <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                  Derivation path
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {extendedPublicKey.bip32Path}
                </dd>
              </div>
              <div className='flex justify-between font-medium py-5'>
                <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                  Fingerprint
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  {extendedPublicKey.parentFingerprint}
                </dd>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  );
};

export default DeviceTechnicalDetails;
