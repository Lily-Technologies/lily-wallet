import React, { useContext } from 'react';

import { LabelTag } from './LabelTag';
import { AddLabelTag } from './AddLabelTag';

import { AccountMapContext } from 'src/context';

import { Address, AddressTag } from '@lily/types';

interface Props {
  addresses: Address[];
}

export const TagsSection = ({ addresses }: Props) => {
  const { addAddressTag, deleteAddressTag, currentAccount } = useContext(AccountMapContext);

  // TODO: sometimes addresses will have overlapping labels
  // TODO: need to consolodate them and send multiple deleteLabel calls

  const labelMap = addresses.reduce<{ [key: string]: AddressTag[] }>((accum, address) => {
    for (const tag of address.tags) {
      const updatedList = [...(accum[tag.label] || []), tag];
      accum[tag.label] = updatedList;
    }
    return accum;
  }, {});

  const addLabels = (addresses: Address[], label: string) => {
    addresses.forEach((address) => {
      addAddressTag(currentAccount.config.id, address.address, label);
    });
  };

  const deleteLabel = async (tag: AddressTag) => {
    labelMap[tag.label].map((currentTag) => {
      deleteAddressTag(currentAccount.config.id, currentTag);
    });
  };

  return (
    <div className='relative'>
      <dt className='text-sm font-medium text-gray-500 dark:text-slate-400 sm:w-40 sm:flex-shrink-0'>
        Tags
      </dt>
      <ul role='list' className='mt-2 inline-flex leading-8 space-x-1 items-center flex-wrap'>
        {Object.keys(labelMap).map((label) => (
          <li className='inline' key={`${label}`}>
            <LabelTag label={labelMap[label][0]} deleteLabel={deleteLabel} />
          </li>
        ))}

        <AddLabelTag addresses={addresses} onSave={addLabels} />
      </ul>
    </div>
  );
};
