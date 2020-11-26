import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from "react-router-dom";
import { Network } from 'bitcoinjs-lib';

import GeneralView from './GeneralView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import ExportView from './ExportView';
import SettingsTabs from './SettingsTabs';

import { white } from '../../../utils/colors';

import { LilyConfig } from '../../../types';
interface Props {
  config: LilyConfig,
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string,
  currentBitcoinNetwork: Network
  match: RouteComponentProps["match"]
}

const VaultSettings = ({ config, setConfigFile, password, currentBitcoinNetwork }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');

  return (
    <Wrapper>
      <HeaderContainer>
        <SettingsHeader>Settings</SettingsHeader>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </HeaderContainer>
      {currentTab === 'general' && <GeneralView config={config} password={password} setConfigFile={setConfigFile} currentBitcoinNetwork={currentBitcoinNetwork} />}
      {currentTab === 'addresses' && <AddressesView />}
      {currentTab === 'utxos' && <UtxosView />}
      {currentTab === 'export' && <ExportView currentBitcoinNetwork={currentBitcoinNetwork} />}
    </Wrapper >
  )
}

const HeaderContainer = styled.div`
  padding: 0em 1.5em;
`;

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  overflow: hidden;
  padding: 0 0rem;
`;

const SettingsHeader = styled.div`
  background: ${white};
  padding: 1em 0;
  font-weight: 500;
  font-size: 2em;
`;

export default VaultSettings;