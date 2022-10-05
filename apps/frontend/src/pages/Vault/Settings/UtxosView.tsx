import React from 'react';

import { requireOnchain } from 'src/hocs';

import { SettingsTable } from 'src/components';

import { LilyOnchainAccount } from '@lily/types';

import UtxoRow from './UtxoRow';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const UtxosView = ({ currentAccount }: Props) => {
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
        <div className='py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8'>
          <div className='overflow-hidden sm:rounded-lg'>
            <table className='border-collapse w-full'>
              <tbody className='divide-y dark:divide-slate-400/10'>
                {availableUtxos.map((utxo) => (
                  <UtxoRow key={utxo.txid} utxo={utxo} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default requireOnchain(UtxosView);
