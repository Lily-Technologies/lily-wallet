import { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';

import DeviceDetailsHeader from './DeviceDetailsHeader';
import DeviceTechnicalDetails from './DeviceTechnicalDetails';
import OwnerInformation from './OwnerInformation';

import { ExtendedPublicKey } from '@lily/types';

interface Props {
  extendedPublicKey: ExtendedPublicKey;
  closeModal: () => void;
  hideActionButtons?: boolean;
  onSave: (extendedPublicKey: ExtendedPublicKey) => void;
}

const DeviceDetails = ({ extendedPublicKey, closeModal, hideActionButtons, onSave }: Props) => {
  const [showEditOwnerForm, setShowEditOwnerForm] = useState(false);
  const [showOwnerInfo, setShowOwnerInfo] = useState(true);
  // localExtendedPublicKey is needed b/c this component is usually rendered via a map that
  // won't get updated until it re-renders, causing a discrepency in the UI and underlying value saved.
  const [localExtendedPublicKey, setLocalExtendedPublicKey] = useState(extendedPublicKey);

  const saveAndCloseForm = (extendedPublicKey: ExtendedPublicKey) => {
    onSave(extendedPublicKey);
    setLocalExtendedPublicKey(extendedPublicKey);
    setShowEditOwnerForm(false);
  };

  return (
    <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl first:not:divide-y divide-gray-200 dark:divide-slate-600 dark:bg-gray-800'>
      <div className='px-4 py-4 sm:px-6 bg-yellow-400 border-0'>
        <div className='flex items-start justify-end'>
          <div className='ml-3 flex h-7 items-center'>
            <button
              type='button'
              className='rounded-md bg-yellow-400 text-white hover:text-gray-100 focus:ring-2 focus:ring-green-500 cursor-pointer'
              onClick={() => closeModal()}
            >
              <span className='sr-only'>Close panel</span>
              <XIcon className='h-6 w-6 cursor-pointer' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
      <DeviceDetailsHeader
        extendedPublicKey={extendedPublicKey}
        hideActionButtons={hideActionButtons || showEditOwnerForm}
      />
      {/* Main */}
      <div className='divide-y divide-gray-200'>
        <div className='px-4 pt-5 pb-5 sm:px-0 sm:pt-0'>
          <dl className='space-y-8 px-4 sm:space-y-8 sm:px-6'>
            <OwnerInformation
              extendedPublicKey={localExtendedPublicKey}
              showEditOwnerForm={showEditOwnerForm}
              setShowEditOwnerForm={setShowEditOwnerForm}
              showOwnerInfo={showOwnerInfo}
              setShowOwnerInfo={setShowOwnerInfo}
              onSave={saveAndCloseForm}
            />
            <DeviceTechnicalDetails
              extendedPublicKey={extendedPublicKey}
              isHidden={!showOwnerInfo}
            />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetails;
