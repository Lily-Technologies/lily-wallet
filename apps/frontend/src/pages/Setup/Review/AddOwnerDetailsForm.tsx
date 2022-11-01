import React, { useState } from 'react';

import { Input } from 'src/components';
import { ExtendedPublicKey } from '@lily/types';

import { clone } from 'src/utils/files';

interface Props {
  extendedPublicKey: ExtendedPublicKey;
  onSave: (extendedPublicKey: ExtendedPublicKey) => void;
  onCancel: () => void;
}

const AddOwnerDetailsForm = ({ extendedPublicKey, onSave, onCancel }: Props) => {
  const [keyOwnerName, setKeyOwnerName] = useState(extendedPublicKey.device.owner?.name || '');
  const [keyOwnerEmail, setKeyOwnerEmail] = useState(extendedPublicKey.device.owner?.email || '');

  const saveExtendedPublicKey = (name: string, email: string) => {
    const clonedExtendedPublicKey = clone(extendedPublicKey);
    clonedExtendedPublicKey.device.owner = {
      name: name,
      email: email
    };
    onSave(clonedExtendedPublicKey);
  };

  return (
    <>
      <div className='w-full grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-8'>
        <div className='flex flex-col'>
          <Input
            label='Device owner name'
            type='text'
            value={keyOwnerName}
            onChange={setKeyOwnerName}
            placeholder='Satoshi Nakamoto'
          />
        </div>
        <div className='flex flex-col'>
          <Input
            label='Device owner email'
            type='email'
            value={keyOwnerEmail}
            onChange={setKeyOwnerEmail}
            placeholder='satoshi@bitcoin.com'
          />
        </div>
      </div>
      <div className='w-full flex justify-end mt-6'>
        <button
          onClick={() => onCancel()}
          className='flex items-center justify-center bg-white dark:bg-gray-700 py-2 px-2.5 border shadow-sm border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Cancel
        </button>
        <button
          onClick={() => saveExtendedPublicKey(keyOwnerName, keyOwnerEmail)}
          className='flex ml-4 items-center justify-center bg-green-600 dark:bg-green-600 shadow-smpy-2 px-2.5 border border-green-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
        >
          Save details
        </button>
      </div>
    </>
  );
};

export default AddOwnerDetailsForm;
