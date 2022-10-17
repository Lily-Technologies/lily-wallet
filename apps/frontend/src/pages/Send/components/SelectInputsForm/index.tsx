import { useContext, useEffect, useState } from 'react';

import { Unit } from 'src/components';

import { UtxoInputSelectRow } from './UtxoInputSelectRow';
import { SearchToolbar } from './SearchToolbar';

import { PlatformContext } from 'src/context';
import { LilyOnchainAccount, UTXO } from '@lily/types';

export type SortOptions = 'asc' | 'desc' | null;

interface Props {
  currentAccount: LilyOnchainAccount;
  onSave: (utxos: UTXO[]) => void;
  cancel: () => void;
  requiredSendAmount: number;
}

async function filter(arr, callback) {
  const fail = Symbol();
  return (
    await Promise.all(arr.map(async (item) => ((await callback(item)) ? item : fail)))
  ).filter((i) => i !== fail);
}

export const SelectInputsForm = ({ currentAccount, onSave, cancel, requiredSendAmount }: Props) => {
  const { availableUtxos } = currentAccount;
  const [selectedInputs, setSelectedInputs] = useState<UTXO[]>([]);
  const [showTags, setShowTags] = useState(false);
  const [sort, setSort] = useState<SortOptions>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUtxos, setFilteredUtxos] = useState(availableUtxos);
  const { platform } = useContext(PlatformContext);

  useEffect(() => {
    const filterUtxos = async () => {
      const currentFilteredUtxos = await filter([...availableUtxos], async (utxo) => {
        const retrievedLabels = await platform.getAddressLabels(utxo.address.address);

        const normalizedSearchQuery = searchQuery.toLowerCase();

        const labelMatch = retrievedLabels.some((label) =>
          label.label.toLowerCase().includes(normalizedSearchQuery)
        );
        const addressMatch = utxo.address.address.includes(normalizedSearchQuery);
        const txIdMatch = utxo.txid.includes(normalizedSearchQuery);

        return labelMatch || addressMatch || txIdMatch;
      });

      setFilteredUtxos(currentFilteredUtxos);
    };
    filterUtxos();
  }, [searchQuery]);

  const handleChange = (currentUtxo: UTXO) => {
    if (selectedInputs.includes(currentUtxo)) {
      const updatedInputs = selectedInputs.filter((input) => input !== currentUtxo);
      setSelectedInputs(updatedInputs);
    } else {
      const updatedInputs = [...selectedInputs, currentUtxo];
      setSelectedInputs(updatedInputs);
    }
  };

  const toggleSort = () => {
    if (sort === 'asc') {
      setSort('desc');
    } else if (sort === 'desc') {
      setSort(null);
    } else {
      setSort('asc');
    }
  };

  const selectedInputTotal = selectedInputs.reduce((accum, input) => accum + input.value, 0);
  const remaining = requiredSendAmount - selectedInputTotal;

  return (
    <>
      <div className='space-y-1 bg-white px-5 py-4 sm:px-6  dark:bg-slate-800'>
        <h2 className='text-lg font-medium text-gray-900 dark:text-slate-100' id='slide-over-title'>
          Select inputs
        </h2>
        <p className='text-sm text-gray-500 dark:text-slate-400'>
          Choose which inputs you want to use in this transaction
        </p>
      </div>
      <SearchToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showTags={showTags}
        setShowTags={setShowTags}
        toggleSort={toggleSort}
        sort={sort}
      />
      <div className='bg-gray-200 dark:bg-slate-900 overflow-y-auto flex-grow'>
        <ul className='overflow-auto space-y-4 py-4 px-5'>
          {[...filteredUtxos]
            .sort((a, b) => {
              if (sort === 'asc') {
                return a.value - b.value;
              } else if (sort === 'desc') {
                return b.value - a.value;
              }
              return 0;
            })
            .map((utxo) => {
              const id = `${utxo.txid}:${utxo.vout}`;
              const isSelected = selectedInputs.includes(utxo);

              return (
                <UtxoInputSelectRow
                  key={id}
                  id={id}
                  isSelected={isSelected}
                  utxo={utxo}
                  handleChange={handleChange}
                  showTags={showTags}
                />
              );
            })}
        </ul>
      </div>
      <div className='flex justify-between align-center bg-white px-4 py-3 sm:px-6 border-t border-gray-700/20 dark:border-slate-500/20 dark:bg-slate-800'>
        <div className='flex flex-col w-52 text-right'>
          <span className=''>
            <Unit className='dark:text-slate-100' value={selectedInputTotal} />{' '}
            <span className='text-gray-500 text-sm'>selected</span>
          </span>
          {remaining > 0 ? (
            <span>
              <Unit className='dark:text-slate-100' value={requiredSendAmount} />{' '}
              <span className='text-gray-500 text-sm'>required</span>
            </span>
          ) : (
            <span>
              <Unit className='dark:text-slate-100' value={Math.abs(remaining)} />{' '}
              <span className='text-gray-500 text-sm'>change</span>
              <span className='text-transparent select-none text-xs'>x</span>
            </span>
          )}
          {/* <span>
            {remaining > 0 ? (
              <>
                <Unit className='text-yellow-600' value={remaining} />{' '}
                <span className='text-yellow-600 text-sm leading-tight'>remain</span>
                <span className='text-transparent select-none'>x</span>
              </>
            ) : (
              <span className='font-medium text-green-500'>Ready to send</span>
            )}
          </span> */}
        </div>
        <div className='text-right flex items-center'>
          <button
            onClick={() => cancel()}
            className='rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-blue-gray-900 shadow-sm hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selectedInputs)}
            className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-800 dark:bg-slate-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-900 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2'
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
