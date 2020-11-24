import React, { useState, useContext, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { useHistory, Switch, Link, Route, useRouteMatch, RouteComponentProps } from "react-router-dom";
import { Network } from 'bitcoinjs-lib';

import GeneralView from './GeneralView';
import AddressesView from './AddressesView';
import UtxosView from './UtxosView';
import ExportView from './ExportView';
import SettingsTabs from './SettingsTabs';

import { AccountMapContext } from '../../../AccountMapContext';

import { MnemonicWordsDisplayer, Modal, Input, StyledIcon, Button, Breadcrumbs } from '../../../components';

import { black, white, red, red100, red500, red600, green500, green800, gray200, gray300, gray500, gray700, gray900 } from '../../../utils/colors';
import { mobile } from '../../../utils/media';
import { createColdCardBlob, downloadFile, formatFilename, saveConfig, getMultisigDeriationPathForNetwork } from '../../../utils/files';

import { LilyConfig, CaravanConfig } from '../../../types';
interface Props {
  config: LilyConfig,
  setConfigFile: React.Dispatch<React.SetStateAction<LilyConfig>>,
  password: string,
  currentBitcoinNetwork: Network
  match: RouteComponentProps["match"]
}

const VaultSettings = ({ config, setConfigFile, password, currentBitcoinNetwork, match }: Props) => {
  const [currentTab, setCurrentTab] = useState('general');
  const { url } = useRouteMatch();



  const breadcrumbs = [
    { text: 'Settings', link: url }
  ];

  return (
    <Wrapper>
      <HeaderContainer>
        <Breadcrumbs
          homeLink={match.url.substring(0, match.url.lastIndexOf('/'))}
          items={breadcrumbs} />
        <SettingsHeader>Settings</SettingsHeader>
        <SettingsTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </HeaderContainer>
      {currentTab === 'general' && <GeneralView config={config} password={password} setConfigFile={setConfigFile} />}
      {currentTab === 'addresses' && <AddressesView />}
      {currentTab === 'utxos' && <UtxosView />}
      {currentTab === 'export' && <ExportView currentBitcoinNetwork={currentBitcoinNetwork} />}
    </Wrapper >
  )
}

const HeaderContainer = styled.div`
  padding: 0.5em 1.5em;
`;

const Wrapper = styled.div`
  background: ${white};
  border-radius: 0.385em;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06);
  overflow: hidden;
  padding: 0 0rem;
`;

const SettingsSectionLeft = styled.div`
  grid-column: span 2;

  ${mobile(css`
    grid-column: span 1;
  `)};
`;

const SettingsSectionRight = styled.div``;

const SettingsSubheader = styled.div`
  display: flex;
  font-size: 0.875em;
  color: ${gray500};
  margin: 8px 0;
`;

const SettingsItemHeader = styled.div`
  display: flex;
  font-size: 1.125em;
`;

const SettingsHeadingItem = styled.h3`
  font-size: 1.5em;
  margin: 64px 0 0;
  font-weight: 400;
  color: ${gray900};
`;

const ViewAddressesButton = styled.div`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

const BoxLink = styled(Link)`
  border: 1px solid ${green800};
  padding: 1.5em;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
`;

const SettingsHeader = styled.div`
  font-size: 2.25em;
  background: ${white};
  padding: 0.25em 0;
  font-weight: 600;
`;

const XpubWellWrapper = styled.div`
  border: 1px solid ${gray500};
  background: ${gray300};
  padding: 1.5em;
  color: ${green800};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  word-break: break-all;
`;

export default VaultSettings;