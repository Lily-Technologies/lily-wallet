import React from 'react';
import styled from 'styled-components';

import UtxoRow from './UtxoRow';

import { white, green800, darkGray, gray100 } from '../../utils/colors';

import { LilyAccount } from '../../types';
interface Props {
  setViewUtxos: React.Dispatch<React.SetStateAction<boolean>>,
  currentAccount: LilyAccount
}

const UtxosView = ({ setViewUtxos, currentAccount }: Props) => {

  return (
    <ValueWrapper>
      <TotalValueHeader style={{ cursor: 'pointer' }} onClick={() => setViewUtxos(false)}>Settings - Utxos</TotalValueHeader>
      <SettingsHeadingItem>UTXOs</SettingsHeadingItem>
      <SettingsSection style={{ flexDirection: 'column' }}>
        {currentAccount.availableUtxos.map((utxo) => (
          <UtxoRow flat={true} utxo={utxo} />
        ))}
      </SettingsSection>
    </ValueWrapper>
  )
}

const ValueWrapper = styled.div`
  background: ${white};
  padding: 1.5em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border-radius: 0.385em;
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1em 0;
  justify-content: space-between;
  padding: 0.5em;
`;

const TotalValueHeader = styled.div`
  font-size: 36px;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${darkGray};
`;

export default UtxosView;