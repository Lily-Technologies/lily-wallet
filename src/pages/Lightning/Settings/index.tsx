import React, { useState } from 'react';
import styled from 'styled-components';
import { Network } from 'bitcoinjs-lib';

import GeneralView from './GeneralView';
import ChannelsView from '../Channels';
import ExportView from './ExportView';
import SettingsTabs from './SettingsTabs';

import { white } from '../../../utils/colors';
import { NodeConfigWithBlockchainInfo } from 'src/types';

interface Props {
  password: string;
  nodeConfig: NodeConfigWithBlockchainInfo;
  currentBitcoinNetwork: Network;
}

const LightningSettings = ({ password, nodeConfig }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');

  return (
    <Wrapper>
      <HeaderContainer>
        <SettingsHeader>Settings</SettingsHeader>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </HeaderContainer>
      {currentTab === 'general' && <GeneralView password={password} />}
      {currentTab === 'channels' && <ChannelsView />}
      {currentTab === 'export' && <ExportView />}
    </Wrapper>
  );
};

const HeaderContainer = styled.div`
  padding: 0em 1.5em;
`;

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const SettingsHeader = styled.div`
  background: ${white};
  padding: 1em 0;
  font-weight: 500;
  font-size: 2em;
`;

export default LightningSettings;
