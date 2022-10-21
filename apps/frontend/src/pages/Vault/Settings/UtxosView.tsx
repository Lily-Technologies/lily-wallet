import React, { useState } from 'react';

import { requireOnchain } from 'src/hocs';

import { SettingsTable } from 'src/components';
import { SearchToolbar } from 'src/pages/Send/components/SelectInputsForm/SearchToolbar';

import { LilyOnchainAccount } from '@lily/types';

import UtxoRow from './UtxoRow';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const UtxosView = ({ currentAccount }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showTags, setShowTags] = useState(false);
  const { availableUtxos } = currentAccount;

  return (
    <>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>UTXOs Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the unspent transaction outputs (UTXOs) associated with your account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <div className='-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <SearchToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setShowTags={setShowTags}
          showTags={showTags}
        />
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8 bg-gray-50 dark:bg-slate-900 border border-slate-600/20 mb-8'>
          <div className='overflow-hidden sm:rounded-lg'>
            <ul className='space-y-4 py-4'>
              {availableUtxos.map((utxo) => (
                <UtxoRow
                  key={utxo.txid}
                  utxo={utxo}
                  searchQuery={searchQuery}
                  showTags={showTags}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default requireOnchain(UtxosView);
