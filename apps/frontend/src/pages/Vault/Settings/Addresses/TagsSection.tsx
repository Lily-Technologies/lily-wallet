import { useContext, useEffect, useState } from 'react';

import { LabelTag } from './LabelTag';
import { AddLabelTag } from './AddLabelTag';

import { PlatformContext } from 'src/context';

import { Address, AddressLabel } from '@lily/types';

interface Props {
  address: Address;
}

export const TagsSection = ({ address }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [labels, setLabels] = useState<AddressLabel[]>([]);

  useEffect(() => {
    const retrieveLabels = async () => {
      const currentLabels = await platform.getAddressLabels(address.address);
      setLabels(currentLabels);
    };
    retrieveLabels();
  }, [address]);

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
  );
};
