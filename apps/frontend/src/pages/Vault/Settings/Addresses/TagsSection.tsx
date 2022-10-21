import { useContext, useEffect, useState } from 'react';

import { LabelTag } from './LabelTag';
import { AddLabelTag } from './AddLabelTag';

import { PlatformContext } from 'src/context';

import { Address, AddressLabel } from '@lily/types';

interface Props {
  addresses: string[];
}

export const TagsSection = ({ addresses }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [labels, setLabels] = useState<AddressLabel[]>([]);

  const setResponseLabel = (newLabel: AddressLabel[]) => {
    setLabels([...labels, ...newLabel]);
  };

  useEffect(() => {
    const retrieveLabels = async () => {
      addresses.forEach(async (address) => {
        const currentLabels = await platform.getAddressLabels(address);
        setResponseLabel(currentLabels);
      });
    };
    retrieveLabels();
  }, [addresses]);

  const addLabel = async (address: string, label: string) => {
    try {
      const id = await platform.addAddressLabel(address, label);
      setLabels([...labels, { id, address, label }]);
    } catch (e) {
      console.error(e);
    }
  };

  const addLabels = (addresses: string[], label: string) => {
    addresses.forEach((address) => {
      addLabel(address, label);
    });
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
      <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
        Tags
      </dt>
      <ul role='list' className='mt-2 inline-flex leading-8 space-x-1 items-center flex-wrap'>
        {labels.map((label, index) => (
          <li className='inline' key={`${label.id}:${index}`}>
            <LabelTag label={label} deleteLabel={deleteLabel} />
          </li>
        ))}

        <AddLabelTag addresses={addresses} onSave={addLabels} />
      </ul>
    </div>
  );
};
