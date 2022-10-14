import React, { useContext, useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { LabelTag } from './LabelTag';
import { AddLabelTag } from './AddLabelTag';

import { Address, AddressLabel } from '@lily/types';
import { PlatformContext } from 'src/context';

interface Props {
  address: Address;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddressDetailsSlideover = ({ address, setOpen }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [labels, setLabels] = useState<AddressLabel[]>([]);

  useEffect(() => {
    const retrieveLabels = async () => {
      const currentLabels = await platform.getAddressLabels(address.address);
      setLabels(currentLabels);
    };
    retrieveLabels();
  }, []);

  const addLabel = async (address: string, label: string) => {
    try {
      const id = await platform.addAddressLabel(address, label);
      setLabels([...labels, { id, address, label }]);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLabel = async (id: number) => {
    try {
      await platform.deleteAddressLabel(id);
      const updatedLabels = labels.filter((label) => label.id !== id);
      setLabels(updatedLabels);
    } catch (e) {
      console.error(e);
    }
  };

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
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Address</dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.address}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
              Derivation path
            </dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.bip32derivation[0].path}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Type</dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>
              {address.isChange ? 'Change' : 'External'}
            </dd>
          </div>
          <div>
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Status</dt>
            <dd className='mt-1 text-sm text-gray-900 dark:text-slate-200 sm:col-span-2'>Used</dd>
          </div>

          <div className='relative'>
            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>Tags</dt>
            <ul role='list' className='mt-2 inline-flex leading-8 space-x-1 items-center flex-wrap'>
              {labels.map((label) => (
                <li className='inline' key={label.id}>
                  <LabelTag label={label} deleteLabel={deleteLabel} />
                </li>
              ))}

              <AddLabelTag address={address} onSave={addLabel} />
            </ul>
          </div>
        </dl>
      </div>
    </>
  );
};

export default AddressDetailsSlideover;
