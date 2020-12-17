import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { Network } from 'bitcoinjs-lib';

import { PageWrapper, PageTitle, Header, HeaderLeft, Button, Modal, Input } from '../../components';

import Tabs from './Tabs';
import ConfigurationSettings from './ConfigurationSettings';
import License from './License';
import About from './About';

import {
  green600, green800, darkGray, white, gray100, green500,
  gray500,
  gray200,
  gray300,
  gray700
} from '../../utils/colors';
import { mobile } from '../../utils/media';

import { LilyConfig, NodeConfig } from '../../types';

interface Props {
  config: LilyConfig,
  nodeConfig: NodeConfig,
  currentBitcoinNetwork: Network
}

const Settings = ({ config, nodeConfig, currentBitcoinNetwork }: Props) => {
  const [currentTab, setCurrentTab] = useState('config');
  const [downloadConfigModalIsOpen, setDownloadConfigModalIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Settings</PageTitle>
          </HeaderLeft>
        </Header>
        <Wrapper>
          <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
          {currentTab === 'config' && <ConfigurationSettings config={config} nodeConfig={nodeConfig} currentBitcoinNetwork={currentBitcoinNetwork} />}
          {currentTab === 'license' && <License config={config} nodeConfig={nodeConfig} currentBitcoinNetwork={currentBitcoinNetwork} />}
          {currentTab === 'about' && <About config={config} />}
        </Wrapper>
      </Fragment>
    </PageWrapper >
  )
};

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  overflow: hidden;
  padding: 1.5rem;
`;

const SettingsTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${gray200};
`;

const TabItem = styled.div<{ active: boolean }>`
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  border-bottom: 2px solid ${p => p.active ? green500 : 'none'};
  margin-left: 2rem;
  cursor: pointer;
  color: ${p => p.active ? green500 : gray500};
  font-weight: 600;

  &:nth-child(1) {
    margin-left: 0;
  }

  &:hover {
    border-bottom: 2px solid ${p => p.active ? 'none' : gray300};
    color: ${p => p.active ? 'inherit' : gray700};
  }
`;

const ModalContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ValueWrapper = styled.div`
  background: ${gray100};
  padding: 1.5em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  border-top: solid 11px ${green800} !important;
  border: 1px solid ${darkGray};
`;

const SettingsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15em, 1fr));
  grid-gap: 5em;
  margin: 3.125em 0;
  justify-content: space-between;
  padding: 1.5em;
  background: ${white};
  border: 1px solid ${darkGray};
  align-items: center;

  ${mobile(css`
  grid-gap: 2em;
  `)};
`;

const SettingsSectionLeft = styled.div`

`;

const SettingsSectionRight = styled.div`
  display: flex;
  justify-content: flex-end;
`;


const SettingsHeader = styled.div`
  display: flex;
  font-size: 18px;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 4em 0 0;
  font-weight: 400;
  color: ${darkGray};
`;


const SettingsSubheader = styled.div`
  display: flex;
  font-size: .9em;
  color: ${darkGray};
  margin: 8px 0;
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  
  &:hover {
    cursor: pointer;
  }
`;

const PasswordWrapper = styled.div`
  padding: 1.5em;
  display: flex;
  flex-direction: column;
`;

const PasswordText = styled.h3`
  font-weight: 400;
`;

const SaveWalletButton = styled.div`
  ${Button};
  flex: 1;
`;

const WordContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1.25em;
`;


export default Settings