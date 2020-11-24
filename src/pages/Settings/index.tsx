import React, { useState, Fragment } from 'react';
import styled, { css } from 'styled-components';
import { AES } from 'crypto-js';
import { Network } from 'bitcoinjs-lib';

import { PageWrapper, PageTitle, Header, HeaderLeft, HeaderRight, Button, Modal, Input } from '../../components';

import {
  green600, green800, darkGray, white, gray100, darkOffWhite, lightGray, gray, green500,
  gray500,
  gray200,
  gray300,
  gray700
} from '../../utils/colors';
import { downloadFile, formatFilename } from '../../utils/files';
import { mobile } from '../../utils/media';

import { LilyConfig } from '../../types';

const Settings = ({ config, currentBitcoinNetwork }: { config: LilyConfig, currentBitcoinNetwork: Network }) => {
  const [downloadConfigModalIsOpen, setDownloadConfigModalIsOpen] = useState(false);
  const [password, setPassword] = useState('');

  const downloadCurrentConfig = (password: string) => {
    const encryptedConfigObject = AES.encrypt(JSON.stringify(config), password).toString();
    downloadFile(encryptedConfigObject, formatFilename('lily_wallet_config', currentBitcoinNetwork, 'txt'));
  }

  return (
    <PageWrapper>
      <Fragment>
        <Header>
          <HeaderLeft>
            <PageTitle>Settings</PageTitle>
          </HeaderLeft>
        </Header>
        <ValueWrapper>
          <SettingsTabs>
            <TabItem active={true}>
              Configuration
            </TabItem>
            <TabItem active={false}>
              Mobile App
            </TabItem>
            <TabItem active={false}>
              Backups
            </TabItem>
            <TabItem active={false}>
              License
            </TabItem>
          </SettingsTabs>
          <SettingsHeadingItem style={{ marginTop: '0.5em' }}>Data and Backups</SettingsHeadingItem>
          <SettingsSection>
            <SettingsSectionLeft>
              <SettingsHeader>Export Current Configuration</SettingsHeader>
              <SettingsSubheader>Download your current vault configuration. This allows you to import your current configuration on a different machine running Lily.</SettingsSubheader>
            </SettingsSectionLeft>
            <SettingsSectionRight>
              <ViewAddressesButton
                onClick={() => setDownloadConfigModalIsOpen(true)}>
                Download Current Config
              </ViewAddressesButton>
            </SettingsSectionRight>
          </SettingsSection>
        </ValueWrapper>
        <Modal
          isOpen={downloadConfigModalIsOpen}
          onRequestClose={() => setDownloadConfigModalIsOpen(false)}>
          <ModalContentContainer>
            <PasswordWrapper>
              <PasswordText>Almost done, just set a password to encrypt your setup file:</PasswordText>
              <Input
                label="Password"
                placeholder="password"
                value={password}
                onChange={setPassword}
                type="password" />
            </PasswordWrapper>
            <WordContainer>
              <SaveWalletButton background={green600} color={white} onClick={() => downloadCurrentConfig(password)}>
                Download Encrypted Configuration File
              </SaveWalletButton>
            </WordContainer>
          </ModalContentContainer>
        </Modal>
      </Fragment>
    </PageWrapper >
  )
};

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

const PasswordInput = styled.input`
  position: relative;
  border: 1px solid ${darkOffWhite};
  background: ${lightGray};
  padding: .75em;
  text-align: center;
  color: ${darkGray};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1em;
  border-radius: 4px;
  font-size: 1.5em;
  z-index: 1;
  flex: 1;
  font-family: 'Montserrat', sans-serif;

  ::placeholder {
    color: ${gray};
  }

  :active, :focused {
    outline: 0;
    border: none;
  }
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