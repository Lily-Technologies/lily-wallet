import React from 'react';
import styled from 'styled-components';

import { requireOnchain } from 'src/hocs';

import { Table, TableBody } from 'src/components/Table';
import { SettingsTable } from 'src/components';

import { LilyOnchainAccount } from '@lily/types';

import UtxoRow from './UtxoRow';

interface Props {
  currentAccount: LilyOnchainAccount;
}

const UtxosView = ({ currentAccount }: Props) => {
  const { availableUtxos } = currentAccount;
  console.log('availableUtxos: ', availableUtxos);
  return (
    <Padding>
      <SettingsTable.HeaderSection>
        <SettingsTable.HeaderTitle>UTXOs Information</SettingsTable.HeaderTitle>
        <SettingsTable.HeaderSubtitle>
          These are the unspent transaction outputs (UTXOs) associated with your account.
        </SettingsTable.HeaderSubtitle>
      </SettingsTable.HeaderSection>
      <Table>
        <TableBody>
          {currentAccount.availableUtxos.map((utxo) => (
            <UtxoRow key={utxo.txid} utxo={utxo} />
          ))}
        </TableBody>
      </Table>
    </Padding>
  );
};

const Padding = styled.div`
  padding: 0 1.5em;
`;

export default requireOnchain(UtxosView);
