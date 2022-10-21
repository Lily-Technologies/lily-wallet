import React, { useContext, useEffect, useState } from 'react';

import { Unit } from 'src/components';

import { LabelTag } from 'src/pages/Vault/Settings/Addresses/LabelTag';

import { PlatformContext } from 'src/context';

import { UTXO, AddressLabel } from '@lily/types';
interface Props {
  utxo: UTXO;
  searchQuery: string;
  showTags: boolean;
}

const UtxoRow = ({ utxo, searchQuery, showTags }: Props) => {
  const { platform } = useContext(PlatformContext);
  const [labels, setLabels] = useState<AddressLabel[]>([]);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const retrieveLabels = async () => {
      const currentLabels = await platform.getAddressLabels(utxo.address.address);
      setLabels(currentLabels);
    };
    retrieveLabels();
  }, []);

  useEffect(() => {
    const labelMatch = labels.some((label) => label.label.toLowerCase().includes(searchQuery));
    const addressMatch = utxo.address.address.includes(searchQuery);

    const visible = labelMatch || addressMatch;

    setHidden(!visible);
  }, [searchQuery, labels]);

  if (hidden) {
    return null;
  }

  return (
    <li className='border-gray-800/15 active:bg-gray-50 hover:border-gray-900/20 bg-white dark:bg-slate-800 dark:border-slate-800 dark:hover:bg-slate-700 select-none shadow flex items-center justify-between w-full p-4 border dark:highlight-white/10 rounded-2xl group'>
      <div>
        <span className='font-medium dark:text-slate-200 group-hover:text-gray-600 dark:group-hover:text-slate-200'>
          <Unit value={utxo.value} />
        </span>
      </div>
      <div className='flex flex-col text-right'>
        <span className='group-hover:text-gray-600 dark:group-hover:text-slate-400 text-sm dark:text-slate-400'>
          {utxo.txid}:{utxo.vout}
        </span>
        {showTags ? (
          <ul
            role='list'
            className='mt-2 inline-flex leading-8 space-x-1 items-center justify-end flex-wrap'
          >
            {labels.length ? (
              labels.map((label) => (
                <li className='inline' key={label.id}>
                  <LabelTag label={label} />
                </li>
              ))
            ) : (
              <span className='text-gray-600 text-sm dark:text-slate-400 italic'>No tags</span>
            )}
          </ul>
        ) : null}
      </div>
    </li>
  );
};

export default UtxoRow;
